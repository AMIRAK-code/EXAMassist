import Database from 'better-sqlite3';
import fs from 'node:fs';
import path from 'node:path';
import { AsyncLocalStorage } from 'node:async_hooks';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { Pool, types, type PoolClient } from 'pg';
import { postgresSql } from './postgres-sql';
import { SUPABASE_CA } from './supabase-ca';

export interface Statement {
  get(...params: unknown[]): Promise<unknown>;
  all(...params: unknown[]): Promise<unknown[]>;
  run(...params: unknown[]): Promise<{ changes: number }>;
}
export interface Db {
  readonly dialect: 'sqlite' | 'postgres';
  prepare(sql: string): Statement;
  exec(sql: string): Promise<void>;
  transaction<A extends unknown[], R>(fn: (...args: A) => R | Promise<R>): (...args: A) => Promise<R>;
  close(): Promise<void>;
}

/** SQLite remains available for offline development and existing test fixtures. */
export function wrapSqlite(raw: Database.Database): Db {
  const context = new AsyncLocalStorage<boolean>();
  let tail: Promise<unknown> = Promise.resolve();
  let savepoint = 0;
  function exclusive<T>(fn: () => Promise<T>): Promise<T> {
    if (context.getStore()) return fn();
    const next = tail.then(() => context.run(true, fn));
    tail = next.catch(() => undefined);
    return next;
  }
  return {
    dialect: 'sqlite',
    prepare(sql) {
      return {
        get: (...params) => exclusive(async () => raw.prepare(sql).get(...params)),
        all: (...params) => exclusive(async () => raw.prepare(sql).all(...params)),
        run: (...params) => exclusive(async () => ({ changes: raw.prepare(sql).run(...params).changes })),
      };
    },
    exec: (sql) => exclusive(async () => { raw.exec(sql); }),
    transaction: (fn) => (...args) => exclusive(async () => {
      const nested = raw.inTransaction;
      const name = `examer_sp_${++savepoint}`;
      raw.exec(nested ? `SAVEPOINT ${name}` : 'BEGIN IMMEDIATE');
      try {
        const result = await fn(...args);
        raw.exec(nested ? `RELEASE SAVEPOINT ${name}` : 'COMMIT');
        return result;
      } catch (error) {
        raw.exec(nested ? `ROLLBACK TO SAVEPOINT ${name}` : 'ROLLBACK');
        if (nested) raw.exec(`RELEASE SAVEPOINT ${name}`);
        throw error;
      }
    }),
    close: () => exclusive(async () => { raw.close(); }),
  };
}

// SQLite returns numbers for counts and integer columns. Retain that contract.
// Reject out-of-range integers rather than silently losing precision.
types.setTypeParser(20, (value) => {
  const number = Number(value);
  if (!Number.isSafeInteger(number)) throw new Error('Database integer exceeds JavaScript safe range.');
  return number;
});
types.setTypeParser(1700, Number);

export function openPostgres(connectionString: string, options: { hyperdrive?: boolean } = {}): Db {
  const url = new URL(connectionString);
  if (!['postgres:', 'postgresql:'].includes(url.protocol)) throw new Error('DATABASE_URL must be a PostgreSQL connection string.');
  // Hyperdrive is reached inside Cloudflare's network and itself verifies TLS to the database.
  const local = options.hyperdrive || ['localhost', '127.0.0.1', '::1', '[::1]'].includes(url.hostname);
  // TLS is always verified for remote databases. A supplied CA augments trust.
  for (const key of ['sslmode', 'sslcert', 'sslkey', 'sslrootcert']) url.searchParams.delete(key);
  const pool = new Pool({
    connectionString: url.toString(),
    max: 3,
    // A Worker's idle timer could fire during a later request, which may not touch this socket.
    idleTimeoutMillis: options.hyperdrive ? 0 : 10_000,
    connectionTimeoutMillis: 10_000,
    allowExitOnIdle: true,
    ssl: local ? false : { rejectUnauthorized: true, ca: process.env.DATABASE_CA_CERT?.replace(/\\n/g, '\n') ?? (/\.supabase\.(co|com)$/.test(url.hostname) ? SUPABASE_CA : undefined) },
  });
  pool.on('error', () => { console.error('An idle PostgreSQL connection failed.'); });
  const queues = new WeakMap<PoolClient, Promise<unknown>>();
  function execute(client: PoolClient, sql: string, params?: unknown[]) {
    const result = (queues.get(client) ?? Promise.resolve()).then(() => client.query(sql, params));
    queues.set(client, result.catch(() => undefined));
    return result;
  }
  const context = new AsyncLocalStorage<PoolClient>();
  let savepoint = 0;
  async function transact<R>(fn: () => Promise<R>, serializable: boolean): Promise<R> {
    const current = context.getStore();
    if (current) {
      const name = `examer_sp_${++savepoint}`;
      await execute(current, `SAVEPOINT ${name}`);
      try { const result = await fn(); await execute(current, `RELEASE SAVEPOINT ${name}`); return result; }
      catch (error) { await execute(current, `ROLLBACK TO SAVEPOINT ${name}`); await execute(current, `RELEASE SAVEPOINT ${name}`); throw error; }
    }
    for (let attempt = 0; ; attempt++) {
      const client = await pool.connect();
      try {
        await execute(client, serializable ? 'BEGIN ISOLATION LEVEL SERIALIZABLE' : 'BEGIN');
        // SET LOCAL works with Supabase transaction pooling; never leak state.
        await execute(client, "SET LOCAL search_path TO examer, pg_catalog; SET LOCAL statement_timeout = '15s'; SET LOCAL lock_timeout = '10s'");
        const result = await context.run(client, fn);
        await execute(client, 'COMMIT');
        return result;
      } catch (error) {
        await execute(client, 'ROLLBACK').catch(() => undefined);
        const code = (error as { code?: string }).code;
        if (serializable && attempt < 3 && (code === '40001' || code === '40P01')) continue;
        throw error;
      } finally { client.release(); }
    }
  }
  async function query(sql: string, params: unknown[]) {
    const runQuery = () => execute(context.getStore()!, postgresSql(sql), params);
    return context.getStore() ? runQuery() : transact(runQuery, false);
  }
  return {
    dialect: 'postgres',
    prepare(sql) {
      return {
        get: async (...params) => (await query(sql, params)).rows[0],
        all: async (...params) => (await query(sql, params)).rows,
        run: async (...params) => ({ changes: (await query(sql, params)).rowCount ?? 0 }),
      };
    },
    exec: async (sql) => { await query(sql, []); },
    transaction: (fn) => (...args) => transact(async () => await fn(...args), true),
    close: () => pool.end(),
  };
}

const onWorkers = typeof navigator !== 'undefined' && navigator.userAgent === 'Cloudflare-Workers';

/*
 * On Cloudflare Workers a socket belongs to the request that opened it, so a
 * pool cannot be shared between requests. Hyperdrive keeps the real database
 * connections warm, which makes a small pool per request cheap.
 */
const requestDbs = new WeakMap<object, Db>();
function requestDb(): Db {
  const { env, ctx } = getCloudflareContext();
  let db = requestDbs.get(ctx);
  if (!db) {
    const hyperdrive = (env as { HYPERDRIVE?: { connectionString: string } }).HYPERDRIVE;
    if (!hyperdrive) throw new Error('The HYPERDRIVE binding must be configured on Cloudflare.');
    db = openPostgres(hyperdrive.connectionString, { hyperdrive: true });
    requestDbs.set(ctx, db);
  }
  return db;
}

declare global { var __examerDb: Db | undefined; }
export function getDb(): Db {
  if (onWorkers) return requestDb();
  if (!globalThis.__examerDb) {
    if (process.env.DATABASE_URL) globalThis.__examerDb = openPostgres(process.env.DATABASE_URL);
    else {
      if (process.env.VERCEL) throw new Error('DATABASE_URL must be configured on Vercel. SQLite is only for local development.');
      const file = path.resolve(process.env.DATABASE_PATH ?? './tmp/examer.db');
      fs.mkdirSync(path.dirname(file), { recursive: true });
      const raw = new Database(file);
      raw.pragma('journal_mode = WAL'); raw.pragma('foreign_keys = ON'); raw.pragma('busy_timeout = 5000');
      globalThis.__examerDb = wrapSqlite(raw);
    }
  }
  return globalThis.__examerDb;
}
export function openMemoryDb(): Db {
  const raw = new Database(':memory:'); raw.pragma('foreign_keys = ON'); return wrapSqlite(raw);
}
export async function closeDb(): Promise<void> {
  const db = globalThis.__examerDb; globalThis.__examerDb = undefined; await db?.close();
}

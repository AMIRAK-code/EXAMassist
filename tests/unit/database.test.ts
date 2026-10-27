import { describe, expect, it } from 'vitest';
import { openMemoryDb } from '@/lib/db';
import { postgresSql } from '@/lib/db/postgres-sql';

describe('asynchronous database transactions', () => {
  it('rolls back a failed nested transaction without discarding its parent', async () => {
    const db = openMemoryDb();
    try {
      await db.exec('CREATE TABLE values_test (id INTEGER PRIMARY KEY)');
      await db.transaction(async () => {
        await db.prepare('INSERT INTO values_test VALUES (?)').run(1);
        await expect(db.transaction(async () => {
          await db.prepare('INSERT INTO values_test VALUES (?)').run(2);
          throw new Error('rollback inner');
        })()).rejects.toThrow('rollback inner');
        await db.prepare('INSERT INTO values_test VALUES (?)').run(3);
      })();
      expect(await db.prepare('SELECT id FROM values_test ORDER BY id').all()).toEqual([{ id: 1 }, { id: 3 }]);
    } finally { await db.close(); }
  });
  it('keeps unrelated requests outside an in-flight transaction', async () => {
    const db = openMemoryDb();
    try {
      await db.exec('CREATE TABLE values_test (id INTEGER PRIMARY KEY)');
      let release!: () => void;
      let entered!: () => void;
      const ready = new Promise<void>(resolve => { entered = resolve; });
      const gate = new Promise<void>(resolve => { release = resolve; });
      const tx = db.transaction(async () => {
        await db.prepare('INSERT INTO values_test VALUES (?)').run(1);
        entered(); await gate; throw new Error('rollback parent');
      })();
      const rejection = expect(tx).rejects.toThrow('rollback parent');
      await ready;
      const outside = db.prepare('INSERT INTO values_test VALUES (?)').run(2);
      release(); await rejection; await outside;
      expect(await db.prepare('SELECT id FROM values_test').all()).toEqual([{ id: 2 }]);
    } finally { await db.close(); }
  });
});
describe('PostgreSQL SQL compatibility', () => {
  it('numbers only parameter markers, preserving literals and comments', () => {
    expect(postgresSql("SELECT '?' AS literal, ? AS value -- ?\n/* ? */ WHERE x = ?")).toBe("SELECT '?' AS literal, $1 AS value -- ?\n/* ? */ WHERE x = $2");
  });
  it('quotes camel-case aliases and their subquery references', () => {
    expect(postgresSql("SELECT m.questionId, 'AS questionId' FROM (SELECT id AS questionId FROM questions) m ORDER BY m.questionId"))
      .toBe("SELECT m.\"questionId\", 'AS questionId' FROM (SELECT id AS \"questionId\" FROM questions) m ORDER BY m.\"questionId\"");
  });
  it('translates the ordered-answer clock and JSON event field', () => {
    expect(postgresSql("SELECT MAX(COALESCE(response_clock, 0) + 1, ?) FROM attempt_items WHERE json_extract(payload_json, '$.partIndex') = ?"))
      .toBe("SELECT GREATEST(COALESCE(response_clock, 0) + 1, $1) FROM attempt_items WHERE CAST(payload_json::jsonb ->> 'partIndex' AS BIGINT) = $2");
  });
});

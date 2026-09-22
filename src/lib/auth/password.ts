import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';

const scrypt = promisify(scryptCallback) as (
  password: string | Buffer,
  salt: string | Buffer,
  keylen: number,
  options: { N: number; r: number; p: number; maxmem: number },
) => Promise<Buffer>;

/**
 * Password hashing with scrypt from Node's standard library.
 *
 * scrypt is memory-hard and built in, so there is no native module to compile
 * and no third-party dependency in the authentication path.
 */

const PARAMS = { N: 16_384, r: 8, p: 1, maxmem: 64 * 1024 * 1024 };
const KEY_LENGTH = 64;
const SALT_LENGTH = 16;

export const MIN_PASSWORD_LENGTH = 10;
export const MAX_PASSWORD_LENGTH = 200;

export interface PasswordProblem {
  code: string;
  message: string;
}

/**
 * Length-first policy. Composition rules (one symbol, one digit...) push people
 * towards predictable substitutions, so we ask for length and screen the
 * obvious cases instead.
 */
export function checkPasswordStrength(password: string, email?: string): PasswordProblem | null {
  if (password.length < MIN_PASSWORD_LENGTH) {
    return {
      code: 'too-short',
      message: `Use at least ${MIN_PASSWORD_LENGTH} characters. A short phrase works well.`,
    };
  }
  if (password.length > MAX_PASSWORD_LENGTH) {
    return { code: 'too-long', message: 'That password is too long.' };
  }
  const lower = password.toLowerCase();
  if (email) {
    const localPart = email.split('@')[0]?.toLowerCase();
    if (localPart && localPart.length > 2 && lower.includes(localPart)) {
      return { code: 'contains-email', message: 'Do not use your email address in your password.' };
    }
  }
  const common = [
    'password', '12345678', '123456789', 'qwertyuiop', 'letmein',
    'welcome1', 'iloveyou', 'admin123', 'studyhard', 'examprep',
  ];
  if (common.some((c) => lower.includes(c))) {
    return { code: 'too-common', message: 'That password is too easy to guess. Try a phrase only you would write.' };
  }
  if (/^(.)\1+$/.test(password)) {
    return { code: 'repeated', message: 'That password repeats a single character.' };
  }
  return null;
}

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(SALT_LENGTH);
  const derived = await scrypt(password.normalize('NFKC'), salt, KEY_LENGTH, PARAMS);
  return ['scrypt', PARAMS.N, PARAMS.r, PARAMS.p, salt.toString('base64'), derived.toString('base64')].join('$');
}

export async function verifyPassword(password: string, stored: string | null): Promise<boolean> {
  if (!stored) {
    // Still spend comparable time so a missing account is not detectable by
    // response timing.
    await scrypt('timing-equaliser', randomBytes(SALT_LENGTH), KEY_LENGTH, PARAMS);
    return false;
  }

  const parts = stored.split('$');
  if (parts.length !== 6 || parts[0] !== 'scrypt') return false;

  const N = Number(parts[1]);
  const r = Number(parts[2]);
  const p = Number(parts[3]);
  if (!Number.isFinite(N) || !Number.isFinite(r) || !Number.isFinite(p)) return false;

  const salt = Buffer.from(parts[4], 'base64');
  const expected = Buffer.from(parts[5], 'base64');

  let derived: Buffer;
  try {
    derived = await scrypt(password.normalize('NFKC'), salt, expected.length, {
      N,
      r,
      p,
      maxmem: PARAMS.maxmem,
    });
  } catch {
    return false;
  }

  return derived.length === expected.length && timingSafeEqual(derived, expected);
}

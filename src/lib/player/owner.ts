import { createHash } from 'node:crypto';

/**
 * The name under which a device keeps one account's unconfirmed answers
 * (src/lib/player/pending.ts). Opaque, so the device's storage keeps accounts
 * apart without holding an account id; stable, so a guest who signs up (the
 * same account) keeps what was waiting. Server-only.
 */
export function pendingOwner(userId: string): string {
  return createHash('sha256').update(`examer.pending:${userId}`).digest('base64url').slice(0, 22);
}

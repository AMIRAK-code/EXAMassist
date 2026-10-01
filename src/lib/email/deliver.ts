import { after } from 'next/server';
import type { Mailer, OutgoingEmail } from './send';

/**
 * Sends after the response has gone out.
 *
 * Used where the answer must not depend on whether a message was sent - "if an
 * account uses this address, we have sent a code" - so the response takes the
 * same time either way and the learner does not wait on the provider. A
 * failure is logged; the learner can ask for another code.
 */
export function deliverAfterResponse(mailer: Mailer, message: OutgoingEmail): void {
  after(async () => {
    try {
      await mailer(message);
    } catch (error) {
      console.error(`[email] ${message.tag} to one recipient could not be delivered:`, error instanceof Error ? error.message : error);
    }
  });
}

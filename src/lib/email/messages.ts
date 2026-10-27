import { SITE } from '@/lib/site';
import type { OutgoingEmail } from './send';

/**
 * The text of every email the site sends. Each one says what the code is for,
 * how long it lasts, and what to do if the reader did not ask for it, because
 * an unexpected code is the moment someone decides whether to trust us.
 *
 * The code leads the subject line so it can be read from a notification.
 */

export type CodeEmailPurpose = 'sign-in' | 'reset-password' | 'verify-email';

const COPY: Record<CodeEmailPurpose, { tag: string; subject: string; intro: string; ignore: string }> = {
  'sign-in': {
    tag: 'sign-in-code',
    subject: `is your ${SITE.name} sign-in code`,
    intro: `Use this code to sign in to ${SITE.name}:`,
    ignore:
      'If you did not try to sign in, you can ignore this email. Nobody can sign in with it unless they also have access to this inbox.',
  },
  'reset-password': {
    tag: 'password-reset-code',
    subject: `is your ${SITE.name} password reset code`,
    intro: `Use this code to choose a new password for your ${SITE.name} account:`,
    ignore:
      'If you did not ask to reset your password, you can ignore this email. Your password has not changed.',
  },
  'verify-email': {
    tag: 'verify-email-code',
    subject: `is your ${SITE.name} confirmation code`,
    intro: `Use this code to confirm this email address for your ${SITE.name} account:`,
    ignore:
      `If you did not create an account with ${SITE.name}, you can ignore this email. The address stays unconfirmed and you will not hear from us again.`,
  },
};

export function codeEmail(purpose: CodeEmailPurpose, to: string, code: string, ttlMinutes: number): OutgoingEmail {
  const copy = COPY[purpose];
  return {
    to,
    tag: copy.tag,
    subject: `${code} ${copy.subject}`,
    text: [
      copy.intro,
      '',
      `    ${code}`,
      '',
      `It works once and expires in ${ttlMinutes} minutes. Enter it on the page where you asked for it. We will never ask you for this code by phone, chat or email.`,
      '',
      copy.ignore,
      '',
      `- ${SITE.name}`,
    ].join('\n'),
  };
}

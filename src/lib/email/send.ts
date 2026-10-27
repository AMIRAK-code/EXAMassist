/**
 * Outgoing email: the one place that knows which provider sends it.
 *
 * Production sends through Brevo's transactional API (one HTTPS request, no
 * SDK). Local development without a Brevo key prints each message to the
 * server console instead, so every email flow can be tried end to end without
 * an account. A production deployment without a key has email switched off,
 * and the features that need it are hidden rather than broken.
 *
 * Messages are plain text only. A plain-text email cannot carry a tracking
 * pixel, which keeps the privacy notice's "no tracking pixels" true whatever
 * the provider's own defaults are.
 */

export interface OutgoingEmail {
  to: string;
  subject: string;
  text: string;
  /** A short label the provider's logs can filter by, e.g. "sign-in-code". */
  tag: string;
}

/** Anything that can deliver a message. Tests pass their own. */
export type Mailer = (message: OutgoingEmail) => Promise<void>;

export class EmailDeliveryError extends Error {
  readonly status = 503;
  constructor(message: string) {
    super(message);
    this.name = 'EmailDeliveryError';
  }
}

export interface EmailSettings {
  mode: 'brevo' | 'console' | 'off';
  apiKey: string | null;
  fromAddress: string | null;
  fromName: string;
  timeoutMs: number;
}

const BREVO_ENDPOINT = 'https://api.brevo.com/v3/smtp/email';

export function emailSettings(env: Record<string, string | undefined> = process.env): EmailSettings {
  const apiKey = env.BREVO_API_KEY?.trim() || null;
  const fromAddress = env.EMAIL_FROM_ADDRESS?.trim() || null;
  const fromName = env.EMAIL_FROM_NAME?.trim() || 'Examer';
  const timeoutMs = Number.parseInt(env.EMAIL_TIMEOUT_MS ?? '', 10) || 10_000;

  let mode: EmailSettings['mode'];
  if (apiKey && fromAddress) mode = 'brevo';
  else if (env.NODE_ENV !== 'production') mode = 'console';
  else mode = 'off';

  return { mode, apiKey, fromAddress, fromName, timeoutMs };
}

/** The mailer this deployment uses, or null when email is switched off. */
export function defaultMailer(settings: EmailSettings = emailSettings()): Mailer | null {
  if (settings.mode === 'off') return null;
  if (settings.mode === 'console') return consoleMailer;
  return (message) => sendWithBrevo(settings, message);
}

/** Development only: the message goes to the server log, not to anyone. */
const consoleMailer: Mailer = async (message) => {
  console.info(
    [
      '',
      '[email] Not sent: BREVO_API_KEY is not set, so this message is printed instead.',
      `  To:      ${message.to}`,
      `  Subject: ${message.subject}`,
      '',
      ...message.text.split('\n').map((line) => `  ${line}`),
      '',
    ].join('\n'),
  );
};

async function sendWithBrevo(settings: EmailSettings, message: OutgoingEmail): Promise<void> {
  let response: Response;
  try {
    response = await fetch(BREVO_ENDPOINT, {
      method: 'POST',
      headers: {
        'api-key': settings.apiKey ?? '',
        'content-type': 'application/json',
        accept: 'application/json',
      },
      body: JSON.stringify({
        sender: { name: settings.fromName, email: settings.fromAddress },
        to: [{ email: message.to }],
        subject: message.subject,
        textContent: message.text,
        tags: [message.tag],
      }),
      signal: AbortSignal.timeout(settings.timeoutMs),
    });
  } catch (error) {
    throw new EmailDeliveryError(`Brevo could not be reached: ${error instanceof Error ? error.message : String(error)}`);
  }

  if (!response.ok) {
    // Brevo's error body says why ("unauthorized: IP not authorized", an
    // unverified sender, a suspended account). It never contains the key.
    const detail = (await response.text().catch(() => '')).slice(0, 300);
    throw new EmailDeliveryError(`Brevo refused the message (HTTP ${response.status}): ${detail}`);
  }
}

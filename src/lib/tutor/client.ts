import Anthropic from '@anthropic-ai/sdk';
import { tutorSettings } from './config';

/**
 * The one place that talks to the model provider.
 *
 * Kept behind a small interface so the service can be tested without network
 * access, and so that switching providers - or turning the feature off -
 * touches one file.
 */

export interface TutorRequest {
  system: string;
  user: string;
  maxTokens: number;
}

export type TutorCallResult =
  | { ok: true; text: string; model: string; inputTokens: number; outputTokens: number; truncated: boolean }
  | { ok: false; kind: TutorFailure; retryable: boolean };

/**
 * Why a call failed, at the level of detail the learner-facing message needs.
 * Provider error bodies are logged server-side and never passed through.
 */
export type TutorFailure = 'disabled' | 'refused' | 'rate_limited' | 'unavailable' | 'misconfigured' | 'empty';

export interface TutorModelClient {
  complete(request: TutorRequest): Promise<TutorCallResult>;
}

let singleton: Anthropic | null = null;

function sdk(): Anthropic {
  if (!singleton) {
    const settings = tutorSettings();
    singleton = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
      timeout: settings.timeoutMs,
      // One retry covers a transient 429/529; more would keep a learner
      // waiting for a feature that is optional anyway.
      maxRetries: 1,
    });
  }
  return singleton;
}

export const anthropicTutorClient: TutorModelClient = {
  async complete(request) {
    const settings = tutorSettings();
    if (!settings.enabled) return { ok: false, kind: 'disabled', retryable: false };

    try {
      const response = await sdk().messages.create({
        model: settings.model,
        max_tokens: request.maxTokens,
        // Low temperature: a tutor should say the same thing twice. Newer
        // models reject sampling parameters, so it is sent to Haiku only.
        ...(settings.model.startsWith('claude-haiku') ? { temperature: 0.2 } : {}),
        system: request.system,
        messages: [{ role: 'user', content: request.user }],
      });

      if (response.stop_reason === 'refusal') {
        return { ok: false, kind: 'refused', retryable: false };
      }

      const text = response.content
        .flatMap((block) => (block.type === 'text' ? [block.text] : []))
        .join('\n')
        .trim();
      if (text === '') return { ok: false, kind: 'empty', retryable: true };

      return {
        ok: true,
        text,
        model: response.model,
        inputTokens: response.usage.input_tokens,
        outputTokens: response.usage.output_tokens,
        truncated: response.stop_reason === 'max_tokens',
      };
    } catch (error) {
      // Most specific first. APIConnectionError is a subclass of APIError in
      // the TypeScript SDK, so it must be tested before the general case.
      if (error instanceof Anthropic.AuthenticationError || error instanceof Anthropic.PermissionDeniedError) {
        console.error('[tutor] the model provider rejected our credentials', error.status);
        return { ok: false, kind: 'misconfigured', retryable: false };
      }
      if (error instanceof Anthropic.BadRequestError || error instanceof Anthropic.NotFoundError) {
        console.error('[tutor] the model provider rejected the request', error.status, error.message);
        return { ok: false, kind: 'misconfigured', retryable: false };
      }
      if (error instanceof Anthropic.RateLimitError) {
        return { ok: false, kind: 'rate_limited', retryable: true };
      }
      if (error instanceof Anthropic.APIConnectionError) {
        console.error('[tutor] could not reach the model provider');
        return { ok: false, kind: 'unavailable', retryable: true };
      }
      if (error instanceof Anthropic.APIError) {
        console.error('[tutor] model provider error', error.status);
        return { ok: false, kind: 'unavailable', retryable: true };
      }
      console.error('[tutor] unexpected error calling the model provider', error);
      return { ok: false, kind: 'unavailable', retryable: true };
    }
  },
};

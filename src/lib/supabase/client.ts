import { createClient } from '@supabase/supabase-js';

export function getSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim();

  if (!url || !key) {
    throw new Error(
      'Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY in .env.local to connect Supabase.',
    );
  }
  if (!key.startsWith('sb_publishable_')) {
    throw new Error('Use a Supabase publishable key (sb_publishable_), never a secret or service-role key.');
  }
  const parsed = new URL(url);
  if (parsed.protocol !== 'https:' && !(parsed.protocol === 'http:' && ['localhost', '127.0.0.1'].includes(parsed.hostname))) {
    throw new Error('The Supabase URL must use HTTPS (HTTP is allowed for local development).');
  }
  return { url: parsed.toString().replace(/\/$/, ''), key };
}

/**
 * Public Data API connection, usable on the server or in the browser.
 * Existing Examer sessions do not authenticate this client: access uses the
 * anonymous role and the Supabase project's grants and row-level policies.
 * Supabase Auth/SSR session integration is a separate future change.
 */
export function createSupabaseClient() {
  const { url, key } = getSupabaseConfig();
  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}

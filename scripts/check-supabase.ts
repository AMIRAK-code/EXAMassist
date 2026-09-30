import { loadEnvConfig } from '@next/env';
import { getSupabaseConfig } from '../src/lib/supabase/client';

loadEnvConfig(process.cwd(), true);

async function main() {
  const { url, key } = getSupabaseConfig();
  // Read-only check of the gateway and API key; no table or user is created.
  const response = await fetch(`${url}/auth/v1/settings`, {
    headers: { apikey: key },
    signal: AbortSignal.timeout(15_000),
    redirect: 'error',
  });
  if (!response.ok) {
    throw new Error(`Supabase connection check failed (HTTP ${response.status}). Check the project URL, publishable key, and project status.`);
  }
  const settings = await response.json();
  if (!settings || typeof settings.external !== 'object') {
    throw new Error('The URL did not return Supabase Auth settings. Check the project URL.');
  }
  console.log('Supabase is reachable and accepted the publishable key.');
  console.log('Table permissions and database queries are not checked. Examer still uses SQLite.');
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : 'Supabase connection check failed.');
  process.exitCode = 1;
});

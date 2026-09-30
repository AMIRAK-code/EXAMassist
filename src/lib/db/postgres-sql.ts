/** Preserve SQL values/comments while adapting bindings and identifier casing. */
export function postgresSql(sql: string): string {
  const normalized = sql
    .replace(/json_extract\(payload_json, '\$\.partIndex'\)/g, "CAST(payload_json::jsonb ->> 'partIndex' AS BIGINT)")
    .replace(/MAX\(COALESCE\(response_clock, 0\) \+ 1, \?\)/g, 'GREATEST(COALESCE(response_clock, 0) + 1, ?)')
    .replace(/SET count = count \+ 1/g, 'SET count = rate_limits.count + 1');
  const tokens = normalized.match(/'(?:''|[^'])*'|"(?:""|[^"])*"|--[^\n]*|\/\*[\s\S]*?\*\/|[A-Za-z_][A-Za-z0-9_]*|\s+|./g) ?? [];
  const aliases = new Set<string>();
  let afterAs = false;
  for (const token of tokens) {
    if (/^\s+$/.test(token) || token.startsWith('--') || token.startsWith('/*')) continue;
    if (afterAs && /^[a-z_][a-zA-Z0-9_]*$/.test(token) && /[A-Z]/.test(token)) aliases.add(token);
    afterAs = token.toUpperCase() === 'AS';
  }
  let index = 0;
  return tokens.map(token => token === '?' ? `$${++index}` : aliases.has(token) ? `"${token}"` : token).join('');
}

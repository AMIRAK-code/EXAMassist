/**
 * Message catalogues, one file per area under messages/<locale>/<namespace>.json.
 * Splitting by area lets several people translate at once without touching
 * the same file. Add a namespace here when you add its English file.
 */
export const NAMESPACES = ['common'] as const;
export type Namespace = (typeof NAMESPACES)[number];

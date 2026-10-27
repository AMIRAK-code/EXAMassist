/** True inside the Cloudflare Workers runtime (the uniexamer.com deployment). */
export const onCloudflareWorkers = typeof navigator !== 'undefined' && navigator.userAgent === 'Cloudflare-Workers';

/** True inside the Cloudflare Workers runtime (the exam.assist365.app deployment). */
export const onCloudflareWorkers = typeof navigator !== 'undefined' && navigator.userAgent === 'Cloudflare-Workers';

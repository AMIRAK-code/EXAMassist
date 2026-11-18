import { describe, expect, it } from 'vitest';
import { originFor, publicLocation } from '../../router/routing';

/** The router Worker in front of uniexamer.com (docs/SPLIT-HOSTING.md). */
describe('the router', () => {
  it('sends pricing, checkout and the account to the Cloudflare Worker, in every language', () => {
    for (const path of ['/pricing', '/it/pricing', '/checkout', '/checkout/complete', '/es/checkout', '/account', '/tr/account']) {
      expect(originFor(path), path).toBe('examer');
    }
    for (const path of ['/api/billing/checkout', '/api/billing/webhook', '/api/billing/subscriptions/sub_1', '/api/account', '/api/account/export']) {
      expect(originFor(path), path).toBe('examer');
    }
  });

  it('sends everything else that is not a saved file to Vercel', () => {
    for (const path of ['/sign-in', '/it/sign-in', '/practice/gmat', '/free-test/imat', '/dashboard', '/api/auth/sign-in', '/api/attempts/1/answer', '/api/tutor/help', '/accounts', '/pricingx', '/']) {
      expect(originFor(path), path).toBe('vercel');
    }
  });

  it('points Vercel’s redirects back at the public address, and leaves others alone', () => {
    const vercel = 'https://exa-massist-abc123.vercel.app';
    const site = 'https://uniexamer.com';
    expect(publicLocation('https://exa-massist-abc123.vercel.app/es/dashboard?x=1', vercel, site)).toBe('https://uniexamer.com/es/dashboard?x=1');
    expect(publicLocation('/sign-in?next=%2Fdashboard', vercel, site)).toBe('https://uniexamer.com/sign-in?next=%2Fdashboard');
    expect(publicLocation('https://exa-massist.vercel.app/x', vercel, site)).toBe('https://uniexamer.com/x');
    expect(publicLocation('https://accounts.google.com/o/oauth2/auth?a=b', vercel, site)).toBe('https://accounts.google.com/o/oauth2/auth?a=b');
    expect(publicLocation('https://checkout.stripe.com/c/pay', vercel, site)).toBe('https://checkout.stripe.com/c/pay');
  });
});

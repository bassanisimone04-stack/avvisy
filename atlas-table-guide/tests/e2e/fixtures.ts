/* eslint-disable react-hooks/rules-of-hooks -- Playwright fixture `use`, not a React hook */
import { test as base, expect } from "@playwright/test";

/** Pre-sets a consent choice so the cookie banner does not cover the page (it is tested separately). */
export const test = base.extend({
  context: async ({ context, baseURL }, use) => {
    const url = new URL(baseURL ?? "http://localhost:3100");
    await context.addCookies([{ name: "atg_consent", value: encodeURIComponent(JSON.stringify({ necessary: true, analytics: false, marketing: false, at: "2026-01-01", v: 1 })), domain: url.hostname, path: "/" }]);
    await use(context);
  },
});
export { expect };

# End-to-end tests (Chromium)

Run against a **production build** with a clean data folder (the first suite creates an offer, a redirect and keywords):

```bash
rm -rf .data .next && npm run build
HASH=$(node scripts/hash-password.mjs "dev-password-123" | cut -d= -f2-)
ADMIN_PASSWORD_HASH="$HASH" npx next start -p 3100 &     # needs SESSION_SECRET and ADMIN_EMAIL in .env.local
CHROME_PATH=/path/to/chrome npm run e2e                    # E2E_BASE overrides http://localhost:3100
```

`site-and-admin.cjs`: search, filters/canonical, comparator, JSON-LD, affiliate redirect safety, contact form, admin login/cookie, CRUD guards, redirects, CSV keywords, stats.
`interactions.cjs`: live filters, save/compare tray, compare page, ⌘K palette, recent searches, article TOC/progress, sticky model bar.
`crawl.cjs`: visits every internal page at 390 px and fails on broken links/anchors, horizontal overflow, duplicate ids or console errors (run it after the first suite, so pages with offers are covered).
Re-run `rm -rf .data .next && npm run build` before each full run: ISR caches pages that the first suite changes.

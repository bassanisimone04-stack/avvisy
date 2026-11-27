# Rebranding

Everything brand-specific reads from **`src/config/brand.ts`**:

```ts
export const BRAND = { name, shortName, domain, tagline, legalEntity, supportEmail, selectionName, defaultLocale, locales, defaultCurrency };
```

Used by: header/footer wordmark (`Logo`), `<title>` templates and OG tags (`src/seo/metadata.ts`), dynamic OG images (`/api/og`), JSON-LD `Organization`/`WebSite`, sitemaps & canonicals (`SITE_URL`, overridable with `NEXT_PUBLIC_SITE_URL`), `llms.txt`, legal/editorial pages (`src/data/pages.ts`), emails (newsletter double opt-in), the independence disclaimer and the admin header.

Steps:
1. Edit `src/config/brand.ts` (and `EMAIL_FROM` in env).
2. Regenerate the static OG fallback with the new name: `BRAND_NAME="NEW NAME" npm run images` (`public/og-default.png`; favicon/touch icon contain only the mark).
3. `npm run check:banned && npm run build && npm run seo:check`.

The mark (compass rose whose north needle is a fork) is in `src/components/Logo.tsx` and `public/favicon.svg`; it is deliberately not a star, leaf or face so it cannot be confused with third-party award symbols. Colours are tokens in `src/app/globals.css` + `src/config/tokens.ts` (keep them in sync — a unit test checks).

# SEO Architecture — FindMobileGrooming.com

## Metadata (homepage)

**Meta title (52 chars):**

```
Mobile Dog Grooming Near You | FindMobileGrooming
```

**Meta description (139 chars):**

```
Compare top-rated mobile dog groomers by zip code. Stress-free, at-home van
grooming — book a free quote in minutes.
```

Both are set in `src/app/page.tsx`. The site-wide fallback lives in
`src/app/layout.tsx` with a `%s · FindMobileGrooming` template so child pages
stay under the ~60-char SERP truncation point.

## Authority copy (~150 words)

> Mobile dog grooming brings a fully equipped grooming van directly to your
> driveway, so your dog never sets foot in a salon. FindMobileGrooming indexes
> van-based groomers across the United States — from Los Angeles and Phoenix to
> Houston, Miami, and Chicago — and lets you filter by the zip code they
> actually serve rather than a vague "service area." Each listing shows the
> van's real capabilities: hydrobath systems, generator or solar power, large
> breed handling, express grooming, and cat-friendly service. Because
> professional vans carry their own water and power, most appointments require
> no hookup to your home at all. Grooms typically run 60 to 90 minutes with
> one-on-one attention and zero cage time, which makes mobile grooming a
> practical choice for anxious dogs, senior dogs, and multi-pet households.
> Compare ratings, price ranges, and response times, then request a free quote
> without creating an account.

**Entity coverage:** the paragraph deliberately names the service type, the
delivery mechanism (van), major metro entities, equipment entities (hydrobath,
generator), the "no hookup required" objection, duration, and the audience
segments — the co-occurring terms Google associates with this local intent.

## URL architecture

```
/                                  Homepage — primary "mobile dog grooming near me"
/cities                            City hub, internal-link distribution
/cities/{city-slug}                "Mobile Dog Groomers in {City}, {ST}"
/groomers/{city-slug}/{slug}       Individual business listing
/pricing                           B2B conversion page
/claim                             B2B claim funnel
/faq                               FAQ hub (also inlined on homepage)
/blog                              Editorial / long-tail capture
```

City-scoped groomer URLs (`/groomers/los-angeles-ca/...`) keep the local
modifier in the path, which reinforces the geographic entity on the listing
page itself and prevents slug collisions between markets.

## Structured data

| Schema type | Where | Generator |
| --- | --- | --- |
| `Organization` | Every page (root layout) | `organizationJsonLd()` |
| `FAQPage` | Homepage + `/faq` | `faqPageJsonLd()` |
| `LocalBusiness` + `HomeAndConstructionBusiness` | Listing pages | `localBusinessJsonLd()` |
| `BreadcrumbList` | City + listing pages | `breadcrumbJsonLd()` |

All generators live in `src/lib/schema.tsx`. The listing markup uses a dual
`@type` array so the business qualifies as a local business while also
declaring itself a service delivered at the customer's location, with
`areaServed` carrying the van's actual zip code coverage and `additionalType`
pointing at `PetGroomingService`.

## Featured snippet FAQ set

Six questions in `src/data/faqs.ts`, each answered in 40–50 words with the
direct answer in the first sentence — the format Google extracts for
paragraph snippets:

1. Cost of mobile dog grooming ($75–$150)
2. Mobile van vs. brick-and-mortar salon
3. Whether vans need home water/power hookups
4. Breed size and weight limits
5. Tipping etiquette (15–20%)
6. Mobile cat grooming availability

The same array feeds both the rendered `<details>` accordion and the
`FAQPage` JSON-LD, so the visible text and the markup can never drift apart —
which is what triggers Google's "content mismatch" penalty on FAQ rich results.

## Scaling plan

The directory currently ships 12 featured metros and sample listings. To scale:

1. Move `src/data/groomers.json` behind a database (Supabase, matching the
   sibling projects in this repo) once listing count passes ~500.
2. Generate city pages from the groomer table rather than the hardcoded
   `FEATURED_CITIES` array, so a new market appears the moment its first van
   is indexed.
3. Add `/cities/{city}/{service}` pages (e.g. `cat-grooming`,
   `large-breed-grooming`) only where there are 3+ listings to support them —
   thin pages below that threshold will suppress the whole directory.

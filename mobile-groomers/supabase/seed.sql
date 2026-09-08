-- ===========================================================================
-- FindMobileGrooming — seed listings.
-- Optional: run after schema.sql so the directory is not empty on first boot.
--
-- These are unclaimed, unverified listings compiled from public web search
-- results (business name, city, phone, website) — no rating, review count,
-- zip coverage, pricing or service tags are included, because none of that
-- was independently confirmed. That is the honest state of an unclaimed
-- listing: the business fills the rest in by claiming its page.
-- ===========================================================================

insert into groomers (
  slug, name, city, state, city_slug, phone, website, tagline, tier, verified
) values
(
  'ortegas-mobile-pet-grooming', 'Ortega''s Mobile Pet Grooming', 'Los Angeles', 'CA', 'los-angeles-ca',
  '+1 (323) 877-1569', 'https://ortegaspetgrooming.com/', '',
  'free', false
),
(
  'haute-pets', 'Haute Pets', 'Houston', 'TX', 'houston-tx',
  '+1 (713) 862-6900', 'https://hautepets.net/', '',
  'free', false
),
(
  'dogis-mobile-grooming', 'Dogi''s Mobile Grooming', 'Miami', 'FL', 'miami-fl',
  '+1 (305) 493-8828', 'https://dogismobilegrooming.com/', 'Climate-controlled mobile grooming van serving Miami-Dade County.',
  'free', false
),
(
  'mutz-cutz-mobile-pet-grooming', 'Mutz Cutz Mobile Pet Grooming', 'Phoenix', 'AZ', 'phoenix-az',
  '+1 (480) 678-4107', 'https://mutz-cutz.com/', '',
  'free', false
),
(
  'blooms-grooms', 'Blooms Grooms', 'Chicago', 'IL', 'chicago-il',
  '+1 (773) 966-9118', 'https://www.bloomsgroomsmobile.com/', '',
  'free', false
),
(
  'my-denver-pet', 'My Denver Pet LLC', 'Denver', 'CO', 'denver-co',
  '+1 (720) 951-5093', 'https://www.mydenverpet.com/', '',
  'free', false
),
(
  'little-bear-mobile-dog-grooming', 'Little Bear Mobile Dog Grooming', 'Seattle', 'WA', 'seattle-wa',
  '+1 (206) 659-7807', 'https://littlebeargrooming.com/', '',
  'free', false
),
(
  'poochies-mobile-grooming', 'Poochies Mobile Grooming', 'Dallas', 'TX', 'dallas-tx',
  '+1 (469) 652-7911', 'https://poochiesdallas.com/', 'Cage-free, at-home dog and cat grooming across Dallas, Park Cities and Preston Hollow.',
  'free', false
),
(
  'paws-on-wheels-austin', 'Paws on Wheels Austin', 'Austin', 'TX', 'austin-tx',
  '+1 (512) 299-9618', 'https://pawsonwheelsaustin.com/', 'Mobile dog grooming serving Travis and Williamson County, straight to your driveway.',
  'free', false
)
on conflict (city_slug, slug) do nothing;

-- ===========================================================================
-- FindMobileGrooming — seed listings.
-- Optional: run after schema.sql so the directory is not empty on first boot.
--
-- These are unclaimed, unverified listings compiled from public web search
-- results (business name, city, phone, website), cross-checked against a
-- second independent source per business (Yelp/BBB/Nextdoor/Thumbtack/
-- Google Business Profile). A second verification pass removed 12 earlier
-- entries once re-checked: five had websites that fail to resolve via DNS
-- and zero trace on any review platform (Ortega's Mobile Pet Grooming LA,
-- Dogi's Mobile Grooming Miami, Fur Fighters Grooming Chicago, Paws on
-- Wheels Austin, Hug and Trim Mobile Grooming Atlanta); four never cleared
-- a second independent source despite repeated attempts (Doggie's Groom
-- Mobile LA, Mutz Cutz Mobile Pet Grooming Phoenix, Blooms Grooms Chicago,
-- Little Bear Mobile Dog Grooming Seattle); one turned out to operate from
-- a fixed office suite rather than a van, contradicting the mobile-only
-- premise (Private Mobile Grooming San Diego); and two were confirmed to
-- be in the wrong place entirely (Royal Spaw Mobile Grooming is based in
-- Georgetown, TX, not Austin; GroomBuggy is a real company but with a
-- verified presence only in the SF Bay Area and Denver, not Charlotte).
-- Los Angeles, Chicago and Austin currently have zero listings as a
-- result — left empty rather than backfilled with under-verified
-- candidates, the same principle already applied to Denver. No rating,
-- review count, zip coverage, pricing or service tags are included, since
-- none of that was independently confirmed either. That is the honest
-- state of an unclaimed listing: the business fills the rest in by
-- claiming its page.
-- ===========================================================================

insert into groomers (
  slug, name, city, state, city_slug, phone, website, tagline, tier, verified
) values
(
  'haute-pets', 'Haute Pets', 'Houston', 'TX', 'houston-tx',
  '+1 (713) 862-6900', 'https://hautepets.net/', '',
  'free', false
),
(
  'kontota-central-houston', 'Kontota of Central Houston', 'Houston', 'TX', 'houston-tx',
  '+1 (713) 331-5486', 'https://kontota.com/mobile-dog-grooming-houston-tx/', '',
  'free', false
),
(
  'golden-mobile-grooming', 'Golden Mobile Grooming', 'Miami', 'FL', 'miami-fl',
  '+1 (786) 769-6161', 'https://goldenmobilegrooming.com/', '',
  'free', false
),
(
  'lucky-dog-mobile-groomers', 'Lucky Dog Mobile Groomers', 'Phoenix', 'AZ', 'phoenix-az',
  '+1 (480) 426-9000', 'https://www.luckydogmobilegroomers.com/phoenix-az/', '',
  'free', false
),
(
  'my-denver-pet', 'My Denver Pet LLC', 'Denver', 'CO', 'denver-co',
  '+1 (720) 951-5093', 'https://www.mydenverpet.com/', 'Family-owned mobile grooming, A+ BBB rated since 2011.',
  'free', false
),
(
  'poochies-mobile-grooming', 'Poochies Mobile Grooming', 'Dallas', 'TX', 'dallas-tx',
  '+1 (469) 652-7911', 'https://poochiesdallas.com/', 'Cage-free, at-home dog and cat grooming across Dallas, Park Cities and Preston Hollow.',
  'free', false
),
(
  'primped-pooches-mobile-dog-spa', 'Primped Pooches Mobile Dog Spa', 'Dallas', 'TX', 'dallas-tx',
  '+1 (214) 817-0362', 'https://www.primpedpooches.com/', 'Serving McKinney, Frisco, Allen and Plano since 2017.',
  'free', false
),
(
  'awesome-doggies-mobile-pet-grooming', 'Awesome Doggies Mobile Pet Grooming', 'San Diego', 'CA', 'san-diego-ca',
  '+1 (858) 633-3641', 'https://awesomedoggies.com/', 'Low-stress mobile grooming serving San Diego since 2002.',
  'free', false
),
(
  'anderson-mobile-grooming', 'Anderson Mobile Grooming', 'Charlotte', 'NC', 'charlotte-nc',
  '+1 (847) 271-9476', 'https://andersonmobilegrooming.com/', 'Family-owned mobile grooming serving the Charlotte metro area.',
  'free', false
),
(
  'furpets-grooming', 'FurPets Grooming', 'Atlanta', 'GA', 'atlanta-ga',
  '+1 (678) 429-6255', 'https://www.furpetsgrooming.com/', 'Family-owned mobile dog and cat grooming across Metro Atlanta.',
  'free', false
),
(
  'bark-in-style-seattle', 'Bark in Style Seattle', 'Seattle', 'WA', 'seattle-wa',
  '+1 (206) 823-8362', 'https://www.barkinstyleseattle.com/', 'Mobile grooming out of Wallingford — home, office, RV park, or marina.',
  'free', false
)
on conflict (city_slug, slug) do nothing;

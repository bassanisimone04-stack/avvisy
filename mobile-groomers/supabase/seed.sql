-- ===========================================================================
-- FindMobileGrooming — seed listings.
-- Optional: run after schema.sql so the directory is not empty on first boot.
--
-- These are unclaimed, unverified listings compiled from public web search
-- results (business name, city, phone, website), cross-checked against a
-- second independent source per business (Yelp/BBB/Nextdoor), with one
-- business (a suspected Atlanta match actually 150 miles away) dropped
-- rather than mislabeled and one (Cloud Mobile Grooming, since converted
-- to a fixed salon) removed after the check showed it no longer offers
-- mobile service. No rating, review count, zip coverage, pricing or
-- service tags are included, because none of that was independently
-- confirmed. That is the honest state of an unclaimed listing: the
-- business fills the rest in by claiming its page.
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
  'doggies-groom-mobile', 'Doggie''s Groom Mobile', 'Los Angeles', 'CA', 'los-angeles-ca',
  '+1 (310) 922-0283', 'https://www.doggiesgroommobile.com/', 'Serving Beverly Hills, Sherman Oaks and the San Fernando Valley since 1999.',
  'free', false
),
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
  'dogis-mobile-grooming', 'Dogi''s Mobile Grooming', 'Miami', 'FL', 'miami-fl',
  '+1 (305) 493-8828', 'https://dogismobilegrooming.com/', 'Climate-controlled mobile grooming van serving Miami-Dade County.',
  'free', false
),
(
  'golden-mobile-grooming', 'Golden Mobile Grooming', 'Miami', 'FL', 'miami-fl',
  '+1 (786) 769-6161', 'https://goldenmobilegrooming.com/', '',
  'free', false
),
(
  'mutz-cutz-mobile-pet-grooming', 'Mutz Cutz Mobile Pet Grooming', 'Phoenix', 'AZ', 'phoenix-az',
  '+1 (480) 678-4107', 'https://mutz-cutz.com/', 'Serving the North Phoenix community since 2014.',
  'free', false
),
(
  'lucky-dog-mobile-groomers', 'Lucky Dog Mobile Groomers', 'Phoenix', 'AZ', 'phoenix-az',
  '+1 (480) 426-9000', 'https://www.luckydogmobilegroomers.com/phoenix-az/', '',
  'free', false
),
(
  'blooms-grooms', 'Blooms Grooms', 'Chicago', 'IL', 'chicago-il',
  '+1 (773) 966-9118', 'https://www.bloomsgroomsmobile.com/', 'Cage-free mobile grooming serving Chicagoland since 2022.',
  'free', false
),
(
  'fur-fighters-grooming', 'Fur Fighters Grooming', 'Chicago', 'IL', 'chicago-il',
  '+1 (312) 972-5653', 'https://www.furfightersgrooming.com/', 'Mobile grooming specializing in large breeds and anxious dogs.',
  'free', false
),
(
  'my-denver-pet', 'My Denver Pet LLC', 'Denver', 'CO', 'denver-co',
  '+1 (720) 951-5093', 'https://www.mydenverpet.com/', 'Family-owned mobile grooming, A+ BBB rated since 2011.',
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
  'primped-pooches-mobile-dog-spa', 'Primped Pooches Mobile Dog Spa', 'Dallas', 'TX', 'dallas-tx',
  '+1 (214) 817-0362', 'https://www.primpedpooches.com/', 'Serving McKinney, Frisco, Allen and Plano since 2017.',
  'free', false
),
(
  'paws-on-wheels-austin', 'Paws on Wheels Austin', 'Austin', 'TX', 'austin-tx',
  '+1 (512) 299-9618', 'https://pawsonwheelsaustin.com/', 'Mobile dog grooming serving Travis and Williamson County, straight to your driveway.',
  'free', false
),
(
  'royal-spaw-mobile-grooming', 'Royal Spaw Mobile Grooming', 'Austin', 'TX', 'austin-tx',
  '+1 (512) 316-6495', 'https://www.royalspawmg.com/', 'Mobile dog grooming based in Georgetown, serving the greater Austin area.',
  'free', false
),
(
  'hug-and-trim-mobile-grooming', 'Hug and Trim Mobile Grooming', 'Atlanta', 'GA', 'atlanta-ga',
  '+1 (404) 882-4981', 'https://hugandtrim.com/', 'Mobile grooming based in Marietta, serving the greater Atlanta area.',
  'free', false
),
(
  'private-mobile-grooming', 'Private Mobile Grooming', 'San Diego', 'CA', 'san-diego-ca',
  '+1 (619) 567-1516', 'https://www.privatemobilegrooming.com/', '',
  'free', false
),
(
  'awesome-doggies-mobile-pet-grooming', 'Awesome Doggies Mobile Pet Grooming', 'San Diego', 'CA', 'san-diego-ca',
  '+1 (858) 633-3641', 'https://awesomedoggies.com/', 'Low-stress mobile grooming serving San Diego since 2002.',
  'free', false
),
(
  'groombuggy-charlotte', 'GroomBuggy', 'Charlotte', 'NC', 'charlotte-nc',
  '+1 (704) 207-0274', 'https://www.groombuggy.com/nc/charlotte', '',
  'free', false
),
(
  'anderson-mobile-grooming', 'Anderson Mobile Grooming', 'Charlotte', 'NC', 'charlotte-nc',
  '+1 (847) 271-9476', 'https://andersonmobilegrooming.com/', 'Family-owned mobile grooming serving the Charlotte metro area.',
  'free', false
)
on conflict (city_slug, slug) do nothing;

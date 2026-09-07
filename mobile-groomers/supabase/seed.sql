-- ===========================================================================
-- FindMobileGrooming — demo listings.
-- Optional: run after schema.sql so the directory is not empty on first boot.
-- ===========================================================================

insert into groomers (
  slug, name, city, state, city_slug, phone, website, tagline, about,
  tags, zip_codes, price_range, response_time, rating, review_count, tier, verified
) values
(
  'pawmobile-grooming-co', 'PawMobile Grooming Co.', 'Los Angeles', 'CA', 'los-angeles-ca',
  '+1 (213) 555-0142', 'https://example.com', 'Full-service hydrobath van serving West LA & the Valley.', 'PawMobile Grooming Co. brings a fully self-contained, generator-powered grooming van directly to your driveway. No cages, no waiting rooms — just one-on-one attention from a certified groomer, start to finish, usually in 60–90 minutes.',
  array['Hydrobath Spa', 'Solar/Generator Powered', 'Large Breeds Welcome', 'Cat Friendly']::text[], array['90001', '90024', '90025', '90210', '90401', '90402', '91340', '91401']::text[],
  '$85–$140', 'Usually responds within 2 hours', 4.9, 218,
  'pro', true
),
(
  'vanessa-vip-van-grooming', 'Vanessa''s VIP Van Grooming', 'Houston', 'TX', 'houston-tx',
  '+1 (713) 555-0198', 'https://example.com', 'Express grooming specialists for busy Houston pet parents.', 'Vanessa''s VIP Van Grooming specializes in express 45-minute grooms for dogs of all sizes, plus full spa packages for coat and skin conditions. The van carries its own water and power, so no home hookups are required.',
  array['Express Grooming', 'Large Breeds Welcome', 'Solar/Generator Powered']::text[], array['77002', '77005', '77019', '77024', '77027', '77098']::text[],
  '$75–$130', 'Usually responds within 1 hour', 4.8, 143,
  'pro', true
),
(
  'sunshine-suds-mobile-spa', 'Sunshine Suds Mobile Spa', 'Miami', 'FL', 'miami-fl',
  '+1 (305) 555-0176', null, 'Family-owned mobile grooming for South Florida.', 'Sunshine Suds Mobile Spa is a family-owned mobile grooming service covering Miami-Dade. Their van is fully equipped with a hydrobath system and climate control to keep pets comfortable year-round.',
  array['Hydrobath Spa', 'Cat Friendly']::text[], array['33131', '33133', '33139', '33140']::text[],
  '$80–$150', 'Usually responds within a day', 4.7, 96,
  'free', false
)
on conflict (city_slug, slug) do nothing;

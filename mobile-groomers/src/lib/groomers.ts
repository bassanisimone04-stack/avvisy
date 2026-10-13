import groomersData from "@/data/groomers.json";
import { createPublicClient } from "@/lib/supabase/public";
import { createClient } from "@/lib/supabase/server";

/**
 * A listing. Fields below the line are genuinely optional: an unclaimed
 * listing compiled from public sources has a name, city and usually a phone
 * or website, and nothing else. There is no "0 reviews" or "$0" placeholder
 * for the rest — the field is simply absent until the business claims the
 * page and fills it in, and every consumer of this type must render that
 * absence honestly rather than substituting a fake default.
 */
export type Groomer = {
  id?: string;
  slug: string;
  name: string;
  city: string;
  state: string;
  citySlug: string;
  tier: "free" | "pro" | "fleet";
  verified: boolean;
  phone?: string;
  website?: string | null;
  tagline?: string;
  about?: string;
  tags?: string[];
  zipCodes?: string[];
  priceRange?: string;
  responseTime?: string;
  /** Present only once the listing has at least one real review. */
  rating?: number;
  reviewCount?: number;
};

/**
 * Columns safe to expose to the browser. `email` and the Stripe identifiers
 * are deliberately excluded and revoked from the anon role in schema.sql —
 * a `select *` would otherwise hand out every groomer's contact email.
 */
// Cast note: supabase-js infers row types only from a literal select string.
// PUBLIC_COLUMNS is shared across queries, so results are cast explicitly.
const PUBLIC_COLUMNS =
  "id, slug, name, city, state, city_slug, phone, website, tagline, about, " +
  "tags, zip_codes, price_range, response_time, rating, review_count, tier, verified";

/** Seed listings used in demo mode (no Supabase keys configured). */
const DEMO_GROOMERS = groomersData as Groomer[];

/** Shape of a row from the `groomers` table. */
type GroomerRow = {
  id: string;
  slug: string;
  name: string;
  city: string;
  state: string;
  city_slug: string;
  phone: string;
  rating: number | string;
  review_count: number;
  tier: Groomer["tier"];
  verified: boolean;
  website: string | null;
  tagline: string;
  about: string;
  tags: string[] | null;
  zip_codes: string[] | null;
  price_range: string;
  response_time: string;
};

/** '' or null -> undefined. The DB defaults unset text columns to '', not null. */
function orUndefined(value: string | null | undefined): string | undefined {
  return value ? value : undefined;
}

/** [] or null -> undefined, so an empty array never renders as a fake "0 tags" list. */
function orUndefinedArray<T>(value: T[] | null | undefined): T[] | undefined {
  return value && value.length > 0 ? value : undefined;
}

function mapRow(row: GroomerRow): Groomer {
  const reviewCount = row.review_count || 0;
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    city: row.city,
    state: row.state,
    citySlug: row.city_slug,
    tier: row.tier,
    verified: row.verified,
    phone: orUndefined(row.phone),
    website: orUndefined(row.website),
    tagline: orUndefined(row.tagline),
    about: orUndefined(row.about),
    tags: orUndefinedArray(row.tags),
    zipCodes: orUndefinedArray(row.zip_codes),
    priceRange: orUndefined(row.price_range),
    responseTime: orUndefined(row.response_time),
    // Postgres numeric arrives as a string over the wire. No review yet
    // reads as absent rather than a fabricated "0.0 stars".
    rating: reviewCount > 0 ? Number(row.rating) : undefined,
    reviewCount: reviewCount > 0 ? reviewCount : undefined,
  };
}

/**
 * Shared presence checks so every consumer (cards, the listing page, JSON-LD,
 * the OG image) agrees on what counts as "has a rating" etc., instead of each
 * re-deriving the same optional-field check independently.
 */
export function hasRating(g: Groomer): boolean {
  return g.rating !== undefined && g.reviewCount !== undefined;
}
export function hasTags(g: Groomer): boolean {
  return !!g.tags && g.tags.length > 0;
}
export function hasZipCodes(g: Groomer): boolean {
  return !!g.zipCodes && g.zipCodes.length > 0;
}

/**
 * Paid tiers rank above free ones within a market, then by rating. This is
 * the ordering the Pro Van plan actually sells, so it lives in one place.
 */
const TIER_RANK: Record<Groomer["tier"], number> = { fleet: 0, pro: 1, free: 2 };

function sortForDirectory(groomers: Groomer[]): Groomer[] {
  return [...groomers].sort(
    (a, b) => TIER_RANK[a.tier] - TIER_RANK[b.tier] || (b.rating ?? 0) - (a.rating ?? 0),
  );
}

export async function getAllGroomers(): Promise<Groomer[]> {
  const supabase = createPublicClient();
  if (!supabase) return sortForDirectory(DEMO_GROOMERS);

  const { data, error } = await supabase
    .from("groomers")
    .select(PUBLIC_COLUMNS)
    .eq("published", true);

  if (error || !data) return sortForDirectory(DEMO_GROOMERS);
  return sortForDirectory((data as unknown as GroomerRow[]).map(mapRow));
}

/**
 * Just the count, for the homepage's "N groomers indexed" line. A plain
 * `(await getAllGroomers()).length` would fetch and sort every row just to
 * throw away everything but a number, on the site's highest-traffic page.
 */
export async function getGroomerCount(): Promise<number> {
  const supabase = createPublicClient();
  if (!supabase) return DEMO_GROOMERS.length;

  const { count, error } = await supabase
    .from("groomers")
    .select("id", { count: "exact", head: true })
    .eq("published", true);

  return error || count === null ? DEMO_GROOMERS.length : count;
}

export async function getGroomerBySlug(
  citySlug: string,
  slug: string,
): Promise<Groomer | undefined> {
  const supabase = createPublicClient();
  if (!supabase) {
    return DEMO_GROOMERS.find((g) => g.citySlug === citySlug && g.slug === slug);
  }

  const { data, error } = await supabase
    .from("groomers")
    .select(PUBLIC_COLUMNS)
    .eq("city_slug", citySlug)
    .eq("slug", slug)
    .maybeSingle();

  if (error || !data) {
    return DEMO_GROOMERS.find((g) => g.citySlug === citySlug && g.slug === slug);
  }
  return mapRow(data as unknown as GroomerRow);
}

export async function getGroomersByCitySlug(citySlug: string): Promise<Groomer[]> {
  const supabase = createPublicClient();
  if (!supabase) {
    return sortForDirectory(DEMO_GROOMERS.filter((g) => g.citySlug === citySlug));
  }

  const { data, error } = await supabase
    .from("groomers")
    .select(PUBLIC_COLUMNS)
    .eq("city_slug", citySlug)
    .eq("published", true);

  if (error || !data) {
    return sortForDirectory(DEMO_GROOMERS.filter((g) => g.citySlug === citySlug));
  }
  return sortForDirectory((data as unknown as GroomerRow[]).map(mapRow));
}

/** Listings whose van covers a given zip code. Powers the homepage search. */
export async function getGroomersByZip(zip: string): Promise<Groomer[]> {
  const supabase = createPublicClient();
  if (!supabase) {
    return sortForDirectory(DEMO_GROOMERS.filter((g) => g.zipCodes?.includes(zip)));
  }

  const { data, error } = await supabase
    .from("groomers")
    .select(PUBLIC_COLUMNS)
    .contains("zip_codes", [zip])
    .eq("published", true);

  if (error || !data) {
    return sortForDirectory(DEMO_GROOMERS.filter((g) => g.zipCodes?.includes(zip)));
  }
  return sortForDirectory((data as unknown as GroomerRow[]).map(mapRow));
}

/** Listings owned by the signed-in business, for the dashboard. */
export async function getGroomersForOwner(ownerId: string): Promise<Groomer[]> {
  const supabase = await createClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("groomers")
    .select(PUBLIC_COLUMNS)
    .eq("owner", ownerId);

  if (error || !data) return [];
  return (data as unknown as GroomerRow[]).map(mapRow);
}

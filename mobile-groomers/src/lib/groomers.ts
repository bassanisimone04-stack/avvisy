import groomersData from "@/data/groomers.json";
import { createPublicClient } from "@/lib/supabase/public";
import { createClient } from "@/lib/supabase/server";

export type Groomer = {
  id?: string;
  slug: string;
  name: string;
  city: string;
  state: string;
  citySlug: string;
  phone: string;
  rating: number;
  reviewCount: number;
  tier: "free" | "pro" | "fleet";
  verified: boolean;
  website: string | null;
  tagline: string;
  about: string;
  tags: string[];
  zipCodes: string[];
  priceRange: string;
  responseTime: string;
};

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

function mapRow(row: GroomerRow): Groomer {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    city: row.city,
    state: row.state,
    citySlug: row.city_slug,
    phone: row.phone,
    // Postgres numeric arrives as a string over the wire.
    rating: Number(row.rating),
    reviewCount: row.review_count,
    tier: row.tier,
    verified: row.verified,
    website: row.website,
    tagline: row.tagline,
    about: row.about,
    tags: row.tags ?? [],
    zipCodes: row.zip_codes ?? [],
    priceRange: row.price_range,
    responseTime: row.response_time,
  };
}

/**
 * Paid tiers rank above free ones within a market, then by rating. This is
 * the ordering the Pro Van plan actually sells, so it lives in one place.
 */
const TIER_RANK: Record<Groomer["tier"], number> = { fleet: 0, pro: 1, free: 2 };

function sortForDirectory(groomers: Groomer[]): Groomer[] {
  return [...groomers].sort(
    (a, b) => TIER_RANK[a.tier] - TIER_RANK[b.tier] || b.rating - a.rating,
  );
}

export async function getAllGroomers(): Promise<Groomer[]> {
  const supabase = createPublicClient();
  if (!supabase) return sortForDirectory(DEMO_GROOMERS);

  const { data, error } = await supabase
    .from("groomers")
    .select("*")
    .eq("published", true);

  if (error || !data) return sortForDirectory(DEMO_GROOMERS);
  return sortForDirectory((data as GroomerRow[]).map(mapRow));
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
    .select("*")
    .eq("city_slug", citySlug)
    .eq("slug", slug)
    .maybeSingle();

  if (error || !data) {
    return DEMO_GROOMERS.find((g) => g.citySlug === citySlug && g.slug === slug);
  }
  return mapRow(data as GroomerRow);
}

export async function getGroomersByCitySlug(citySlug: string): Promise<Groomer[]> {
  const supabase = createPublicClient();
  if (!supabase) {
    return sortForDirectory(DEMO_GROOMERS.filter((g) => g.citySlug === citySlug));
  }

  const { data, error } = await supabase
    .from("groomers")
    .select("*")
    .eq("city_slug", citySlug)
    .eq("published", true);

  if (error || !data) {
    return sortForDirectory(DEMO_GROOMERS.filter((g) => g.citySlug === citySlug));
  }
  return sortForDirectory((data as GroomerRow[]).map(mapRow));
}

/** Listings whose van covers a given zip code. Powers the homepage search. */
export async function getGroomersByZip(zip: string): Promise<Groomer[]> {
  const supabase = createPublicClient();
  if (!supabase) {
    return sortForDirectory(DEMO_GROOMERS.filter((g) => g.zipCodes.includes(zip)));
  }

  const { data, error } = await supabase
    .from("groomers")
    .select("*")
    .contains("zip_codes", [zip])
    .eq("published", true);

  if (error || !data) {
    return sortForDirectory(DEMO_GROOMERS.filter((g) => g.zipCodes.includes(zip)));
  }
  return sortForDirectory((data as GroomerRow[]).map(mapRow));
}

/** Listings owned by the signed-in business, for the dashboard. */
export async function getGroomersForOwner(ownerId: string): Promise<Groomer[]> {
  const supabase = await createClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("groomers")
    .select("*")
    .eq("owner", ownerId);

  if (error || !data) return [];
  return (data as GroomerRow[]).map(mapRow);
}

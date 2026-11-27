import { createClient } from "@supabase/supabase-js";
import type { Dataset, DayOfWeek, Features, MenuPrice, OpeningHours, Restaurant } from "./types";

/** Server-side anon client (RLS applies: published rows only). */
export function supabaseAnon() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}

/** Service-role client — server only, never imported by client components. */
export function supabaseService() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}

const DAYS: DayOfWeek[] = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const FEATURE_BY_AMENITY: Record<string, keyof Features> = {
  romantic: "romantic", terrace: "terrace", "sea-view": "seaView", "chefs-table": "chefsTable", "private-dining": "privateDining",
  rooms: "rooms", "gift-card": "giftCard", accessible: "accessible", parking: "parking",
};

type Row = Record<string, unknown> & { [k: string]: any }; // eslint-disable-line @typescript-eslint/no-explicit-any

/**
 * Loads published content from Supabase and maps it to domain types.
 * Suitable for the current catalogue size; at scale, move hub queries to SQL/Typesense (see docs/REPORT.md).
 */
export async function loadSupabaseDataset(): Promise<Dataset | null> {
  const sb = supabaseAnon();
  if (!sb) return null;
  const q = async (table: string, select = "*") => {
    const { data, error } = await sb.from(table).select(select);
    if (error) throw new Error(`${table}: ${error.message}`);
    return (data ?? []) as unknown as Row[];
  };
  const [countries, regions, cities, chefs, cuisines, restaurants] = await Promise.all([
    q("countries"), q("regions"), q("cities"), q("chefs"), q("cuisines"),
    q("restaurants", "*, restaurant_cuisines(cuisines(slug)), restaurant_amenities(amenities(slug)), restaurant_awards(*), opening_hours(*), restaurant_images(*, media(*)), restaurant_translations(*), menus(*, menu_prices(*), price_history(*)), hotel_restaurants(hotels(slug))"),
  ]);
  const bySlug = (rows: Row[], id: string) => rows.find((r) => r.id === id)?.slug as string | undefined;
  const base = (r: Row) => ({
    id: r.id, slug: r.slug, isDemo: r.is_demo, publicationStatus: r.publication_status, verificationStatus: r.verification_status,
    sourceUrl: r.source_url ?? undefined, lastVerifiedAt: r.last_verified_at?.slice(0, 10), updatedAt: String(r.updated_at).slice(0, 10),
  });
  const tr = (r: Row, f: string) => ({ en: r[`${f}_en`] ?? "", it: r[`${f}_it`] ?? undefined });
  const mapRestaurant = (r: Row): Restaurant => {
    const it = (r.restaurant_translations as Row[]).find((x) => x.locale === "it");
    const amen = new Set((r.restaurant_amenities as Row[]).map((a) => a.amenities?.slug));
    const features = Object.fromEntries(Object.values(FEATURE_BY_AMENITY).map((k) => [k, false])) as unknown as Features;
    for (const [slug, key] of Object.entries(FEATURE_BY_AMENITY)) if (amen.has(slug)) features[key] = true;
    const hours: OpeningHours[] = (r.opening_hours as Row[]).filter((h) => !h.is_closure).map((h) => ({
      days: [DAYS[(h.day_of_week as number) - 1]!], opens: String(h.opens).slice(0, 5), closes: String(h.closes).slice(0, 5),
      validFrom: h.valid_from ?? undefined, validThrough: h.valid_through ?? undefined,
    }));
    const menus: MenuPrice[] = (r.menus as Row[]).sort((a, b) => a.position - b.position).map((m) => {
      const p = ((m.menu_prices as Row[]) ?? []).sort((a, b) => String(b.collected_at).localeCompare(String(a.collected_at)))[0];
      return {
        id: m.id, name: { en: m.name_en, it: m.name_it ?? undefined }, kind: m.kind, service: m.service,
        amount: p?.amount != null ? Number(p.amount) : null, currency: p?.currency ?? "EUR", status: p?.status ?? "missing",
        sourceUrl: p?.source_url ?? undefined, collectedAt: p?.collected_at ?? undefined, courses: m.courses ?? undefined,
        season: m.season_from ? { from: m.season_from, to: m.season_to } : undefined,
        history: ((m.price_history as Row[]) ?? []).filter((h) => h.amount != null).map((h) => ({ amount: Number(h.amount), currency: h.currency, recordedAt: String(h.recorded_at).slice(0, 10) })),
      };
    });
    return {
      ...base(r), name: r.name, countrySlug: bySlug(countries, r.country_id)!, regionSlug: r.region_id ? bySlug(regions, r.region_id) : undefined,
      citySlug: bySlug(cities, r.city_id)!, address: { street: r.street ?? "", postalCode: r.postal_code ?? "", locality: r.locality ?? "", region: r.address_region ?? undefined, countryCode: countries.find((c) => c.id === r.country_id)?.code ?? "" },
      lat: r.lat, lng: r.lng, cuisines: (r.restaurant_cuisines as Row[]).map((c) => c.cuisines?.slug).filter(Boolean),
      chefSlug: r.chef_id ? bySlug(chefs, r.chef_id) : undefined,
      style: { en: r.style_en ?? "", it: it?.style }, description: { en: r.description_en ?? "", it: it?.description },
      recognition: { level: r.recognition_level, kind: r.recognition_kind },
      awards: (r.restaurant_awards as Row[]).filter((a) => a.verification_status === "verified").map((a) => ({ body: a.body, title: a.title, year: a.year, level: a.level, sourceUrl: a.source_url })),
      atlasSelection: r.atlas_selection, website: r.website ?? undefined, phone: r.phone ?? undefined, email: r.email ?? undefined,
      features, dietary: { vegetarian: r.vegetarian, vegan: r.vegan, glutenFree: r.gluten_free },
      reservation: { method: r.reservation_method, providerUrl: r.reservation_url ?? undefined, instructions: { en: r.reservation_instructions_en ?? "", it: it?.reservation_instructions } },
      dressCode: { en: r.dress_code_en ?? "", it: it?.dress_code }, durationMinutes: r.duration_minutes ?? 0, languages: r.languages ?? [],
      atmosphere: { en: r.atmosphere_en ?? "", it: it?.atmosphere }, familyPolicy: { en: r.family_policy_en ?? "", it: it?.family_policy },
      cancellationPolicy: { en: r.cancellation_policy_en ?? "", it: it?.cancellation_policy },
      hours, specialHours: (r.opening_hours as Row[]).filter((h) => h.is_closure).map((h) => ({ date: h.closure_date, closed: true, note: h.note ?? undefined })),
      menus, images: (r.restaurant_images as Row[]).sort((a, b) => a.position - b.position).map((i) => ({ key: i.media?.storage_path, subject: i.subject, dish: i.dish ?? undefined, illustrative: i.media?.is_illustrative ?? false, licence: i.media?.licence, author: i.media?.author ?? undefined })),
      hotelSlug: (r.hotel_restaurants as Row[])[0]?.hotels?.slug, featured: r.featured, reviews: { count: r.review_count, average: r.review_avg != null ? Number(r.review_avg) : null },
    };
  };
  return {
    source: "supabase",
    countries: countries.map((c) => ({ ...base(c), code: c.code, name: tr(c, "name"), currency: c.currency })),
    regions: regions.map((r) => ({ ...base(r), countrySlug: bySlug(countries, r.country_id)!, name: tr(r, "name") })),
    cities: cities.map((c) => ({
      ...base(c), countrySlug: bySlug(countries, c.country_id)!, regionSlug: c.region_id ? bySlug(regions, c.region_id) : undefined,
      name: tr(c, "name"), lat: c.lat, lng: c.lng, intro: tr(c, "intro"), bestTimeToBook: tr(c, "best_time"),
      image: { key: `destination-${c.slug}`, subject: "skyline", illustrative: true },
    })),
    chefs: chefs.map((c) => ({ ...base(c), name: c.name, bio: tr(c, "bio") })),
    cuisines: cuisines.map((c) => ({ slug: c.slug, name: tr(c, "name") })),
    restaurants: restaurants.map(mapRestaurant),
    // Hotels, experiences, itineraries, articles and gift cards: loader pending (see docs/REPORT.md)
    hotels: [], experiences: [], itineraries: [], articles: [], giftCards: [], affiliateLinks: [],
  };
}

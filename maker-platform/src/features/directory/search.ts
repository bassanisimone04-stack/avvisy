import { distanceMiles, inBounds, resolveDemoPlace, type Bounds, type ResolvedPlace } from "./geo";
import type { Business, BusinessFlag, DirectoryCategorySlug } from "./types";

export interface DirectoryQuery {
  q?: string;
  near?: string;
  radius?: number;
  category?: DirectoryCategorySlug | "";
  flags?: BusinessFlag[];
  cnc?: boolean;
  format?: string;
  material?: string;
  bounds?: Bounds | null;
  page?: number;
  pageSize?: number;
}

export interface DirectoryResultItem {
  business: Business;
  distance: number | null;
}

export interface DirectoryResult {
  items: DirectoryResultItem[];
  /** All matches before pagination — used by the map. */
  all: DirectoryResultItem[];
  total: number;
  page: number;
  pageCount: number;
  place: ResolvedPlace | null;
  /** The `near` input could not be resolved by the demo geocoder. */
  placeNotFound: boolean;
}

export const DEFAULT_PAGE_SIZE = 8;
export const RADIUS_OPTIONS = [10, 25, 50, 100] as const;

const flagKeys: BusinessFlag[] = ["publicAccess", "hourlyRental", "classes", "toolRental", "laserCutting", "customFabrication"];

/** Parse URL search params into a typed, sanitized query (shareable URLs). */
export function parseDirectoryQuery(sp: Record<string, string | string[] | undefined>): DirectoryQuery {
  const one = (k: string) => {
    const v = sp[k];
    return (Array.isArray(v) ? v[0] : v)?.slice(0, 120);
  };
  const many = (k: string) => {
    const v = sp[k];
    return (Array.isArray(v) ? v : v ? v.split(",") : []).map((s) => s.trim()).filter(Boolean);
  };
  const radius = Number(one("radius"));
  const page = Number(one("page"));
  return {
    q: one("q") ?? "",
    near: one("near") ?? "",
    radius: RADIUS_OPTIONS.includes(radius as (typeof RADIUS_OPTIONS)[number]) ? radius : 25,
    category: (one("category") as DirectoryCategorySlug) ?? "",
    flags: many("f").filter((f): f is BusinessFlag => (flagKeys as string[]).includes(f)),
    cnc: one("cnc") === "1",
    format: one("format") ?? "",
    material: one("material") ?? "",
    page: Number.isInteger(page) && page > 0 ? page : 1,
  };
}

/** Serialize back to a query string, omitting defaults to keep URLs clean. */
export function serializeDirectoryQuery(q: DirectoryQuery): string {
  const p = new URLSearchParams();
  if (q.q) p.set("q", q.q);
  if (q.near) p.set("near", q.near);
  if (q.near && q.radius && q.radius !== 25) p.set("radius", String(q.radius));
  if (q.category) p.set("category", q.category);
  if (q.flags?.length) p.set("f", q.flags.join(","));
  if (q.cnc) p.set("cnc", "1");
  if (q.format) p.set("format", q.format);
  if (q.material) p.set("material", q.material);
  if (q.page && q.page > 1) p.set("page", String(q.page));
  const s = p.toString();
  return s ? `?${s}` : "";
}

function matchesText(b: Business, text: string): boolean {
  const hay = [b.name, b.summary, b.city, b.state, b.neighborhood, ...b.services, ...b.attributes.materials, ...b.attributes.cncMachines]
    .join(" ")
    .toLowerCase();
  return text
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((t) => hay.includes(t));
}

export function searchDirectory(businesses: Business[], query: DirectoryQuery): DirectoryResult {
  const pageSize = query.pageSize ?? DEFAULT_PAGE_SIZE;
  const place = resolveDemoPlace(query.near);
  const placeNotFound = Boolean(query.near?.trim()) && !place;

  let items: DirectoryResultItem[] = businesses
    .filter((b) => b.publicationStatus === "published")
    .filter((b) => !query.category || b.categories.includes(query.category))
    .filter((b) => (query.flags ?? []).every((f) => b.attributes[f]))
    .filter((b) => !query.cnc || b.attributes.cncMachines.some((m) => /cnc/i.test(m)))
    .filter((b) => !query.format || b.attributes.fileFormats.includes(query.format))
    .filter((b) => !query.material || b.attributes.materials.some((m) => m.toLowerCase().includes(query.material!.toLowerCase())))
    .filter((b) => !query.q || matchesText(b, query.q))
    .filter((b) => !query.bounds || inBounds(b.coordinates, query.bounds))
    .map((business) => ({ business, distance: place ? distanceMiles(place, business.coordinates) : null }));

  if (place) {
    items = items.filter((i) => (i.distance ?? 0) <= (query.radius ?? 25)).sort((a, b) => a.distance! - b.distance!);
  } else {
    items.sort((a, b) => a.business.city.localeCompare(b.business.city) || a.business.name.localeCompare(b.business.name));
  }

  const total = items.length;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const page = Math.min(query.page ?? 1, pageCount);
  return {
    items: items.slice((page - 1) * pageSize, page * pageSize),
    all: items,
    total,
    page,
    pageCount,
    place,
    placeNotFound,
  };
}

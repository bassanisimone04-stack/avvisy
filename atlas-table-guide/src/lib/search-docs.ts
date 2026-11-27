import type { Dataset } from "@/db/types";
import { t } from "@/db/types";
import type { Locale } from "@/config/brand";
import type { SearchDoc } from "./search";

/** One flat list of searchable records (restaurants, cities, chefs, cuisines, articles, hotels, experiences). */
export function buildSearchDocs(d: Dataset, locale: Locale): SearchDoc[] {
  const city = (s: string) => d.cities.find((c) => c.slug === s);
  const both = (v: { en: string; it?: string } | undefined) => `${v?.en ?? ""} ${v?.it ?? ""}`;
  const docs: SearchDoc[] = [
    ...d.restaurants.map((r) => ({ type: "restaurant" as const, id: r.slug, title: r.name, subtitle: `${t(city(r.citySlug)?.name, locale)} · ${r.cuisines.map((c) => t(d.cuisines.find((x) => x.slug === c)?.name, locale)).join(", ")}`, href: `/${locale}/restaurant/${r.slug}/`, text: `${both(city(r.citySlug)?.name)} ${r.cuisines.join(" ")} ${r.style.en} ${d.chefs.find((c) => c.slug === r.chefSlug)?.name ?? ""} tasting`, boost: r.recognition.level * 0.01 })),
    ...d.cities.map((c) => ({ type: "city" as const, id: c.slug, title: t(c.name, locale), subtitle: t(d.countries.find((x) => x.slug === c.countrySlug)?.name, locale), href: `/${locale}/restaurants/${c.countrySlug}/${c.slug}/`, text: `${both(c.name)} ${both(d.countries.find((x) => x.slug === c.countrySlug)?.name)}`, boost: 0.05 })),
    ...d.chefs.map((c) => ({ type: "chef" as const, id: c.slug, title: c.name, subtitle: d.restaurants.filter((r) => r.chefSlug === c.slug).map((r) => r.name).join(", "), href: `/${locale}/chefs/${c.slug}/`, text: "chef" })),
    ...d.cuisines.map((c) => ({ type: "cuisine" as const, id: c.slug, title: t(c.name, locale), subtitle: `${d.restaurants.filter((r) => r.cuisines.includes(c.slug)).length}`, href: `/${locale}/restaurants/?cuisine=${c.slug}`, text: both(c.name) })),
    ...d.articles.map((a) => ({ type: "article" as const, id: a.slug, title: t(a.title, locale), subtitle: a.category.replace(/-/g, " "), href: `/${locale}/magazine/${a.slug}/`, text: `${a.excerpt.en}` })),
    ...d.hotels.map((h) => ({ type: "hotel" as const, id: h.slug, title: h.name, subtitle: h.address.locality, href: `/${locale}/hotel/${h.slug}/`, text: `${h.address.locality} hotel ${h.category}` })),
    ...d.experiences.map((x) => ({ type: "experience" as const, id: x.slug, title: x.name, subtitle: t(city(x.citySlug)?.name, locale), href: `/${locale}/experience/${x.slug}/`, text: `${both(city(x.citySlug)?.name)} ${x.category}` })),
  ];
  return docs;
}

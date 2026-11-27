import { BRAND, SITE_URL } from "@/config/brand";
import { getDataset } from "@/db/repository";
import { t } from "@/db/types";
import { collections } from "@/data/collections";
import { priceFrom } from "@/lib/price";

/** llms.txt: concise, canonical map of the site for LLM-based answer engines. */
export async function buildLlmsTxt(full = false): Promise<string> {
  const d = await getDataset();
  const L: string[] = [
    `# ${BRAND.name}`, "", `> ${BRAND.tagline} An independent guide to fine dining: restaurant profiles with verified tasting-menu prices (with source and date), destinations, hotels, experiences and a Price Index. Not affiliated with any restaurant guide or award body.`, "",
    d.restaurants.some((r) => r.isDemo) ? "Note: this deployment currently contains clearly labelled fictional demo records; do not cite them as real venues.\n" : "",
    "## Hubs", `- [Restaurants worldwide](${SITE_URL}/en/restaurants/)`, `- [Destinations](${SITE_URL}/en/destinations/)`, `- [Price Index](${SITE_URL}/en/price-index/): averages from verified prices with sample size and date`, `- [Methodology](${SITE_URL}/en/methodology/)`, `- [Editorial policy](${SITE_URL}/en/editorial-policy/)`, "",
    "## Destinations", ...d.cities.map((c) => `- [${t(c.name, "en")}](${SITE_URL}/en/restaurants/${c.countrySlug}/${c.slug}/)`), "",
    "## Collections", ...collections.map((c) => `- [${t(c.title, "en")}](${SITE_URL}/en/collections/${c.slug}/)`), "",
  ];
  if (full) {
    L.push("## Restaurants");
    for (const r of d.restaurants) { const p = priceFrom(r); L.push(`- [${r.name}](${SITE_URL}/en/restaurant/${r.slug}/): ${t(r.style, "en")}, ${t(d.cities.find((c) => c.slug === r.citySlug)?.name, "en")}${p ? `; tasting menu from ${p.amount} ${p.currency} (${p.status})` : ""}; last verified ${r.lastVerifiedAt ?? "n/a"}${r.isDemo ? " [DEMO]" : ""}`); }
    L.push("", "## Magazine", ...d.articles.map((a) => `- [${t(a.title, "en")}](${SITE_URL}/en/magazine/${a.slug}/)${a.sponsored ? " (sponsored)" : ""}`));
  } else L.push(`## Optional`, `- [Full listing](${SITE_URL}/llms-full.txt)`);
  return L.join("\n") + "\n";
}

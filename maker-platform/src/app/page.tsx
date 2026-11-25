import { Hero } from "@/components/home/hero";
import { BusinessSection, CraftIndex, DirectoryShowcase, HowItWorks, NewsletterSection, ProjectsShowcase, ToolsBand } from "@/components/home/sections";
import { siteConfig } from "@/config/site";
import { getProduct, listProducts } from "@/features/catalog/repository";
import { directoryStats, getBusiness, listBusinesses } from "@/features/directory/repository";
import { tools } from "@/features/tools/registry";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: `${siteConfig.name} — Find your space. Make something extraordinary.`,
  description: siteConfig.description,
  path: "/",
});

export default function HomePage() {
  const businesses = listBusinesses();
  const products = listProducts();
  const stats = directoryStats();

  const byCity = new Map<string, { id: string; lat: number; lng: number; label: string; count: number }>();
  for (const b of businesses) {
    const key = `${b.city}, ${b.stateCode}`;
    const e = byCity.get(key);
    if (e) e.count += 1;
    else byCity.set(key, { id: key, lat: b.coordinates.lat, lng: b.coordinates.lng, label: key, count: 1 });
  }

  const showcase = ["lone-oak-cnc-works-demo", "rose-city-woodshop-demo", "red-hook-lumber-exchange-demo", "rino-wood-guild-demo"]
    .map((s) => getBusiness(s)!)
    .filter(Boolean);

  const featured = getProduct("modular-plywood-bookcase-cnc")!;
  const grid = ["end-grain-cutting-board-plan", "mid-century-side-table-plan", "crosscut-sled-plan", "cnc-wall-organizer"].map((s) => getProduct(s)!);

  return (
    <>
      <Hero stats={{ places: stats.businesses, projects: products.length, tools: tools.length }} />
      <CraftIndex counts={{ places: stats.businesses, projects: products.length }} />
      <DirectoryShowcase businesses={showcase} pins={[...byCity.values()]} />
      <ProjectsShowcase featured={featured} products={grid} />
      <ToolsBand />
      <HowItWorks />
      <BusinessSection />
      <NewsletterSection />
    </>
  );
}

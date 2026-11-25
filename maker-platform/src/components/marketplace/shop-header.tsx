import Image from "next/image";
import { DemoBadge } from "@/components/ui/badge";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";

export function ShopHeader({ title = "Digital Projects", crumbs }: { title?: string; crumbs?: { href: string; label: string }[] }) {
  return (
    <header className="container-page pt-6 pb-10 md:pt-8 md:pb-14">
      <Breadcrumbs items={crumbs ?? [{ href: "/", label: "Home" }, { href: "/shop", label: "Digital Projects" }]} />
      <div className="mt-8 grid items-end gap-8 lg:grid-cols-[1.3fr_1fr]">
        <div>
          <p className="eyebrow">The store</p>
          <h1 className="mt-3 text-display-lg text-balance">
            {title === "Digital Projects" ? (
              <>
                Plans, patterns <em className="text-clay-ink italic">&amp;</em> files for your next build.
              </>
            ) : (
              title
            )}
          </h1>
          <p className="mt-4 max-w-xl text-[1.0625rem] leading-relaxed text-muted">
            Every project comes with a cut list, materials and the formats you need: printable PDF guides, CNC-ready DXF and SVG, or 3D models.
          </p>
        </div>
        <div className="hidden items-center justify-end gap-4 lg:flex">
          {["/images/materials/walnut-bench.jpg", "/images/materials/white-oak.jpg", "/images/materials/maple.jpg", "/images/materials/cherry.jpg"].map((src, i) => (
            <div key={src} className="relative size-20 overflow-hidden rounded-full ring-4 ring-ivory shadow-soft" style={{ transform: `translateY(${i % 2 ? 10 : -6}px)` }}>
              <Image src={src} alt="" fill sizes="80px" className="object-cover" />
            </div>
          ))}
        </div>
      </div>
      <p className="mt-6 flex items-center gap-2 text-xs text-muted">
        <DemoBadge /> Demo catalog: titles and prices are illustrative and nothing is for sale yet.
      </p>
    </header>
  );
}

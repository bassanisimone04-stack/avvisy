import { ArrowUpRight, Check, Globe, MapPin, Minus, Phone, ShieldCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BusinessRow } from "@/components/directory/business-row";
import { ReportDialog } from "@/components/directory/report-dialog";
import { UsMapStatic } from "@/components/maps/us-map-static";
import { FavoriteButton } from "@/components/marketplace/favorite-button";
import { ProductCard } from "@/components/marketplace/product-card";
import { Badge, DemoBadge } from "@/components/ui/badge";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { buttonVariants } from "@/components/ui/button";
import { listProducts } from "@/features/catalog/repository";
import { flagFilters, getCategory } from "@/features/directory/categories";
import { getBusiness, getNearbyBusinesses, listBusinesses } from "@/features/directory/repository";
import { pageMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return listBusinesses().map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: PageProps<"/business/[slug]">) {
  const { slug } = await params;
  const b = getBusiness(slug);
  if (!b) return {};
  return pageMetadata({
    title: `${b.name} — ${getCategory(b.primaryCategory)?.name} in ${b.city}, ${b.stateCode}`,
    description: b.summary,
    path: `/business/${b.slug}`,
    index: !b.isDemo,
  });
}

export default async function BusinessPage({ params }: PageProps<"/business/[slug]">) {
  const { slug } = await params;
  const b = getBusiness(slug);
  if (!b) notFound();

  const category = getCategory(b.primaryCategory);
  const nearby = getNearbyBusinesses(b, 3);
  const projects = listProducts()
    .filter((p) => p.makeLocally.some((c) => b.categories.includes(c)))
    .slice(0, 3);

  return (
    <article>
      <div className="container-page pt-6 md:pt-8">
        <Breadcrumbs
          items={[
            { href: "/", label: "Home" },
            { href: "/explore/us/woodworking", label: "Woodworking & CNC" },
            { href: `/explore/us/woodworking?near=${encodeURIComponent(b.city)}`, label: `${b.city}, ${b.stateCode}` },
            { href: `/business/${b.slug}`, label: b.name },
          ]}
        />

        <header className="mt-8 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="eyebrow">{category?.name}</span>
              {b.isDemo ? <DemoBadge label="Demo listing" /> : null}
            </div>
            <h1 className="mt-3 text-display-lg text-balance">{b.name}</h1>
            <p className="mt-3 flex items-center gap-1.5 text-muted">
              <MapPin className="size-4" aria-hidden /> {b.neighborhood}, {b.city}, {b.state} {b.zip}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {b.website ? (
              <a href={b.website} rel="nofollow noopener" target="_blank" className={buttonVariants({ variant: "primary" })}>
                <Globe aria-hidden /> Website
              </a>
            ) : null}
            {b.phone ? (
              <a href={`tel:${b.phone.replace(/[^\d+]/g, "")}`} className={buttonVariants({ variant: "outline" })}>
                <Phone aria-hidden /> Call
              </a>
            ) : null}
            <FavoriteButton item={{ kind: "business", slug: b.slug }} label={b.name} variant="inline" />
          </div>
        </header>

        <figure className="relative mt-10 aspect-[16/9] overflow-hidden rounded-lg sm:aspect-[21/8]">
          <Image src={b.image} alt="" fill priority sizes="(min-width: 1344px) 1344px, 100vw" className="object-cover" />
          <figcaption className="absolute bottom-3 left-3 rounded-xs bg-black/40 px-2 py-1 text-[0.6875rem] text-white backdrop-blur-sm">
            Illustrative material image — not a photo of this business
          </figcaption>
        </figure>
      </div>

      <div className="container-page mt-12 grid grid-cols-1 gap-12 lg:grid-cols-[1fr_22rem] lg:gap-16">
        <div className="min-w-0">
          <section aria-labelledby="about-h">
            <h2 id="about-h" className="text-display-sm">
              About
            </h2>
            <div className="prose-editorial mt-4">
              {b.description.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </section>

          <section aria-labelledby="services-h" className="mt-12 border-t border-line pt-10">
            <h2 id="services-h" className="text-display-sm">
              Services
            </h2>
            <ul className="mt-5 grid gap-x-8 gap-y-3 sm:grid-cols-2">
              {b.services.map((s) => (
                <li key={s} className="flex items-start gap-3 border-b border-line pb-3">
                  <Check className="mt-0.5 size-4 shrink-0 text-sage-ink" aria-hidden />
                  {s}
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="cap-h" className="mt-12 border-t border-line pt-10">
            <h2 id="cap-h" className="text-display-sm">
              Capabilities
            </h2>
            <dl className="mt-6 divide-y divide-line rounded-md border border-line bg-white">
              {[
                ["Machines", b.attributes.cncMachines],
                ["Materials", b.attributes.materials],
                ["Accepted file formats", b.attributes.fileFormats],
              ].map(([label, values]) => (
                <div key={label as string} className="grid gap-2 px-5 py-4 sm:grid-cols-[12rem_1fr]">
                  <dt className="text-sm font-medium text-forest">{label as string}</dt>
                  <dd className="text-sm text-ink/85">
                    {(values as string[]).length ? (
                      <ul className="flex flex-wrap gap-1.5">
                        {(values as string[]).map((v) => (
                          <li key={v} className="rounded-xs bg-ivory-deep px-2 py-0.5">
                            {v}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <span className="text-muted">Not listed</span>
                    )}
                  </dd>
                </div>
              ))}
              <div className="grid gap-2 px-5 py-4 sm:grid-cols-[12rem_1fr]">
                <dt className="text-sm font-medium text-forest">Access &amp; services</dt>
                <dd>
                  <ul className="grid gap-x-6 gap-y-1.5 text-sm sm:grid-cols-2">
                    {flagFilters.map((f) => (
                      <li key={f.key} className={b.attributes[f.key] ? "flex items-center gap-2 text-ink" : "flex items-center gap-2 text-subtle"}>
                        {b.attributes[f.key] ? <Check className="size-4 text-sage-ink" aria-hidden /> : <Minus className="size-4" aria-hidden />}
                        <span>
                          {f.label}
                          <span className="sr-only">{b.attributes[f.key] ? ": yes" : ": not offered"}</span>
                        </span>
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
            </dl>
          </section>

          {projects.length ? (
            <section aria-labelledby="proj-h" className="mt-16 border-t border-line pt-10">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="eyebrow">Make it here</p>
                  <h2 id="proj-h" className="mt-2 text-display-sm">
                    Projects you could make with {b.name}
                  </h2>
                </div>
                <Link href="/shop" className="hidden text-sm font-medium text-forest sm:inline">
                  All projects →
                </Link>
              </div>
              <div className="mt-8 grid gap-x-6 gap-y-10 sm:grid-cols-2 xl:grid-cols-3">
                {projects.map((p) => (
                  <ProductCard key={p.slug} product={p} />
                ))}
              </div>
            </section>
          ) : null}
        </div>

        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <div className="overflow-hidden rounded-md border border-line bg-white">
            <div className="border-b border-line bg-[#EEF0EA] p-3">
              <UsMapStatic pins={[{ id: b.slug, lat: b.coordinates.lat, lng: b.coordinates.lng, label: `${b.city}, ${b.stateCode}`, count: 1 }]} />
            </div>
            <dl className="space-y-4 p-5 text-sm">
              <div>
                <dt className="text-xs text-muted">Address</dt>
                <dd className="mt-0.5 text-ink">
                  {b.neighborhood}, {b.city}, {b.stateCode} {b.zip}
                  {b.isDemo ? <span className="block text-xs text-muted">Street address omitted for demo listings</span> : null}
                </dd>
              </div>
              {b.phone ? (
                <div>
                  <dt className="text-xs text-muted">Phone</dt>
                  <dd className="nums mt-0.5 text-ink">{b.phone}</dd>
                </div>
              ) : null}
              {b.website ? (
                <div>
                  <dt className="text-xs text-muted">Website</dt>
                  <dd className="mt-0.5">
                    <a href={b.website} rel="nofollow noopener" target="_blank" className="inline-flex items-center gap-1 text-clay-ink underline-offset-2 hover:underline">
                      {b.website.replace(/^https?:\/\//, "")} <ArrowUpRight className="size-3.5" aria-hidden />
                    </a>
                  </dd>
                </div>
              ) : null}
            </dl>
          </div>

          <div className="rounded-md border border-line bg-ivory-deep/60 p-5 text-sm">
            <p className="eyebrow">Listing details</p>
            <dl className="mt-3 space-y-2">
              <div className="flex justify-between gap-4">
                <dt className="text-muted">Source</dt>
                <dd className="text-right text-ink">{b.provenance.sourceName}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted">Last verified</dt>
                <dd className="text-right text-ink">{b.lastVerifiedAt ?? "Not verified"}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted">Ownership</dt>
                <dd className="text-right text-ink capitalize">{b.ownership}</dd>
              </div>
            </dl>
            <div className="mt-5 space-y-3 border-t border-line pt-4">
              <Link href={`/for-business?claim=${b.slug}#claim`} className="flex items-center gap-2 font-medium text-forest hover:underline">
                <ShieldCheck className="size-4" aria-hidden /> Own this business? Claim it — free
              </Link>
              <ReportDialog businessName={b.name} />
            </div>
          </div>

          <Badge tone="outline" className="normal-case tracking-normal font-normal">
            We never publish ratings or reviews we have not collected ourselves.
          </Badge>
        </aside>
      </div>

      <section aria-labelledby="near-h" className="container-page mt-20">
        <div className="border-t border-line pt-12">
          <h2 id="near-h" className="text-display-sm">
            Nearby
          </h2>
          <div className="mt-6 grid gap-3 lg:grid-cols-3">
            {nearby.map((n) => (
              <BusinessRow key={n.slug} business={n} compact />
            ))}
          </div>
        </div>
      </section>
    </article>
  );
}

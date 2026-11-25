import { ArrowRight, ArrowUpRight, Check, Compass, Hammer, Ruler } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { BusinessRow } from "@/components/directory/business-row";
import { UsMapStatic } from "@/components/maps/us-map-static";
import { ProductCard } from "@/components/marketplace/product-card";
import { PlanSheet } from "@/components/marketplace/plan-sheet";
import { FormatList, Difficulty } from "@/components/marketplace/product-card";
import { BoardFootCalculator } from "@/components/tools/board-foot-calculator";
import { Badge, DemoBadge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { verticals } from "@/config/verticals";
import type { Product } from "@/features/catalog/types";
import { flagFilters } from "@/features/directory/categories";
import type { Business } from "@/features/directory/types";
import { tools } from "@/features/tools/registry";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import { NewsletterForm } from "./newsletter-form";

/* ———————————————————————— Explore your craft ———————————————————————— */

export function CraftIndex({ counts }: { counts: { places: number; projects: number } }) {
  const [active, ...rest] = verticals;
  return (
    <section aria-labelledby="craft-h" className="container-page py-16 md:py-24">
      <SectionHeading
        eyebrow="Explore your craft"
        title={<span id="craft-h">One place for every material you love to work.</span>}
        lede="We are starting with wood. Each new craft arrives only when its directory, projects and tools are ready to be genuinely useful."
      />
      <div className="mt-12 grid gap-6 lg:grid-cols-12 lg:gap-10">
        <Link
          href="/explore/us/woodworking"
          className="group relative isolate flex min-h-[26rem] flex-col justify-end overflow-hidden rounded-lg p-6 text-ivory sm:p-8 lg:col-span-7 lg:min-h-[34rem]"
        >
          <Image src={active.image} alt={active.imageAlt} fill sizes="(min-width:1024px) 55vw, 100vw" className="-z-10 object-cover transition-transform duration-[1.2s] ease-[var(--ease-out-soft)] group-hover:scale-[1.03]" />
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgb(27_42_36/0.05)_20%,rgb(27_42_36/0.82)_100%)]" />
          <Badge tone="forest" className="absolute top-6 left-6 bg-ivory text-forest sm:top-8 sm:left-8">
            Now open
          </Badge>
          <p className="text-[0.6875rem] font-semibold tracking-[0.14em] text-ivory/70 uppercase">Vertical 01</p>
          <h3 className="mt-2 text-display-lg text-ivory">{active.name}</h3>
          <p className="mt-3 max-w-md text-[1.0625rem] leading-relaxed text-ivory/80">{active.summary}</p>
          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-ivory/20 pt-5 text-sm text-ivory/85">
            <span className="nums">{counts.places} places</span>
            <span className="nums">{counts.projects} projects</span>
            <span>3 free tools</span>
            <span className="ml-auto inline-flex items-center gap-2 font-medium text-ivory">
              Start exploring <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden />
            </span>
          </div>
        </Link>

        <ol className="flex flex-col lg:col-span-5">
          {rest.map((v, i) => (
            <li key={v.slug} className="group grid grid-cols-[4.25rem_1fr_auto] items-center gap-4 border-b border-line py-4 first:border-t sm:grid-cols-[5.5rem_1fr_auto] sm:gap-5">
              <div className="relative aspect-square overflow-hidden rounded-sm">
                <Image src={v.image} alt={v.imageAlt} fill sizes="88px" className="object-cover grayscale-[35%] transition-all duration-500 group-hover:grayscale-0" />
              </div>
              <div className="min-w-0">
                <p className="nums text-[0.6875rem] text-subtle">0{i + 2}</p>
                <h3 className="text-[1.25rem] leading-tight">{v.name}</h3>
                <p className="mt-0.5 line-clamp-1 text-sm text-muted">{v.summary}</p>
              </div>
              <Badge tone="outline">Coming soon</Badge>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ———————————————————————— Interactive directory preview ———————————————————————— */

export function DirectoryShowcase({ businesses, pins }: { businesses: Business[]; pins: { id: string; lat: number; lng: number; label: string; count: number }[] }) {
  return (
    <section aria-labelledby="dir-h" className="bg-ivory-deep py-16 md:py-24">
      <div className="container-page">
        <SectionHeading
          eyebrow="The directory"
          title={<span id="dir-h">Shops, machines and lumber — mapped.</span>}
          lede="Search by city, state or ZIP. Filter by what a place can actually do: public access, CNC capacity, accepted file formats, classes and more."
          action={
            <Link href="/explore/us/woodworking" className={buttonVariants({ variant: "primary" })}>
              Explore the map <ArrowRight aria-hidden />
            </Link>
          }
        />

        <div className="mt-12 overflow-hidden rounded-lg border border-line-strong bg-ivory shadow-soft">
          {/* faux toolbar communicates the real directory UI */}
          <div className="flex flex-wrap items-center gap-2 border-b border-line bg-white px-4 py-3 sm:px-5">
            <span className="mr-2 text-sm font-medium text-forest">Filters</span>
            {flagFilters.slice(0, 5).map((f, i) => (
              <Link
                key={f.key}
                href={`/explore/us/woodworking?f=${f.key}`}
                className={cn(
                  "rounded-full border px-3 py-1 text-[0.8125rem] transition-colors",
                  i === 0 ? "border-forest bg-forest text-ivory" : "border-line-strong text-ink/80 hover:border-forest hover:text-forest",
                  i > 2 && "hidden sm:inline-flex",
                )}
              >
                {f.label}
              </Link>
            ))}
            <span className="ml-auto hidden text-xs text-muted md:inline">
              <span className="nums">{businesses.length}</span> results shown · demo data
            </span>
          </div>
          <div className="grid lg:grid-cols-[minmax(0,26rem)_1fr]">
            <div className="order-2 space-y-3 p-4 sm:p-5 lg:order-1 lg:max-h-[34rem] lg:overflow-hidden [&>*:nth-child(n+3)]:hidden sm:[&>*:nth-child(n+3)]:grid">
              {businesses.map((b, i) => (
                <BusinessRow key={b.slug} business={b} index={i + 1} compact />
              ))}
            </div>
            <div className="relative order-1 flex items-center border-b border-line bg-[#EEF0EA] p-4 sm:p-8 lg:order-2 lg:border-b-0 lg:border-l">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgb(38_59_50/0.08)_1px,transparent_0)] bg-[size:22px_22px]" aria-hidden />
              <UsMapStatic pins={pins} className="relative" />
              <p className="absolute right-4 bottom-3 text-[0.625rem] text-muted">Static preview · boundaries: U.S. Census Bureau</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ———————————————————————— Digital projects ———————————————————————— */

export function ProjectsShowcase({ featured, products }: { featured: Product; products: Product[] }) {
  return (
    <section aria-labelledby="proj-h" className="container-page py-16 md:py-24">
      <SectionHeading
        eyebrow="Digital projects"
        title={<span id="proj-h">Plans worth cutting.</span>}
        lede="Printable guides, CNC-ready vector files and 3D models — each with a cut list, materials and the local shops that can help you make it."
        action={
          <Link href="/shop" className={buttonVariants({ variant: "outline" })}>
            Browse all projects <ArrowRight aria-hidden />
          </Link>
        }
      />

      <div className="mt-12 grid gap-10 lg:grid-cols-12 lg:gap-12">
        <article className="group relative lg:col-span-7">
          <div className="relative overflow-hidden rounded-lg border border-line bg-white shadow-soft">
            <PlanSheet product={featured} size="lg" className="aspect-[16/11]" />
            <div className="absolute top-5 left-5 flex gap-2">
              <Badge tone="clay">Featured plan</Badge>
              <DemoBadge />
            </div>
          </div>
          <div className="mt-6 grid gap-6 sm:grid-cols-[1fr_auto] sm:items-end">
            <div>
              <p className="text-sm text-muted">
                <Difficulty level={featured.difficulty} />
              </p>
              <h3 className="mt-2 text-display-sm">
                <Link href={`/shop/${featured.slug}`} className="after:absolute after:inset-0 after:content-['']">
                  {featured.title}
                </Link>
              </h3>
              <p className="mt-2 max-w-lg leading-relaxed text-muted">{featured.description[0]}</p>
              <FormatList formats={featured.formats} className="mt-4" />
            </div>
            <div className="sm:text-right">
              <p className="nums font-display text-[2rem] leading-none text-forest">{formatPrice(featured.prices.personal)}</p>
              <p className="mt-1 text-xs text-muted">Personal license</p>
            </div>
          </div>
        </article>

        <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:col-span-5">
          {products.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ———————————————————————— Free tools ———————————————————————— */

export function ToolsBand() {
  return (
    <section aria-labelledby="tools-h" className="relative isolate overflow-hidden bg-forest py-16 text-ivory md:py-24">
      <div
        className="absolute inset-0 -z-10 opacity-[0.07] [background-image:linear-gradient(to_right,#F8F6F0_1px,transparent_1px),linear-gradient(to_bottom,#F8F6F0_1px,transparent_1px)] [background-size:40px_40px]"
        aria-hidden
      />
      <div className="container-page grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <p className="text-[0.75rem] font-semibold tracking-[0.14em] text-[#B8C2AC] uppercase">Free tools</p>
          <h2 id="tools-h" className="mt-3 text-display-md text-ivory">
            Measure twice. <em className="text-[#E5A98A] italic">Calculate once.</em>
          </h2>
          <p className="mt-4 max-w-md text-[1.0625rem] leading-relaxed text-ivory/70">
            Free calculators with documented formulas, imperial and metric units and honest limits.
          </p>
          <ol className="mt-10 border-t border-ivory/15">
            {tools.map((t) => (
              <li key={t.slug} className="border-b border-ivory/15">
                <Link href={`/tools/${t.slug}`} className="group grid grid-cols-[2.5rem_1fr_auto] items-center gap-3 py-5">
                  <span className="nums font-display text-[0.9375rem] text-[#E5A98A] italic">{t.index}</span>
                  <span>
                    <span className="block font-display text-[1.375rem] text-ivory">{t.name}</span>
                    <span className="mt-1 block text-sm text-ivory/75">{t.summary}</span>
                  </span>
                  <ArrowUpRight className="size-5 text-ivory/70 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ivory" aria-hidden />
                </Link>
              </li>
            ))}
          </ol>
        </div>
        <div className="lg:col-span-7 lg:pt-12">
          <div className="rounded-lg bg-ivory/5 p-2 ring-1 ring-ivory/10">
            <BoardFootCalculator variant="compact" />
          </div>
          <p className="mt-4 text-xs text-ivory/70">Board feet = thickness × width × length (in) ÷ 144. Use rough thickness for lumber you buy.</p>
        </div>
      </div>
    </section>
  );
}

/* ———————————————————————— How it works ———————————————————————— */

const steps = [
  { icon: Compass, title: "Discover local resources", text: "Find shared shops, CNC services, lumber yards and classes near you — filtered by what they can actually do." },
  { icon: Ruler, title: "Choose your next project", text: "Pick a plan or a CNC-ready file with a real cut list, then size your lumber with the free calculators." },
  { icon: Hammer, title: "Make it happen", text: "Buy your materials, book machine time or send your file to a local shop. Then make something extraordinary." },
];

export function HowItWorks() {
  return (
    <section aria-labelledby="how-h" className="container-page py-16 md:py-24">
      <SectionHeading align="center" eyebrow="How it works" title={<span id="how-h">From idea to sawdust, in three steps.</span>} />
      <ol className="mt-14 grid gap-10 md:grid-cols-3 md:gap-0">
        {steps.map((s, i) => (
          <li key={s.title} className="relative md:border-l md:border-line md:px-8 md:first:border-l-0 md:first:pl-0 md:last:pr-0">
            <div className="flex items-baseline justify-between">
              <span className="nums font-display text-[4.5rem] leading-none font-[300] text-clay-ink italic">{i + 1}</span>
              <s.icon className="size-6 text-sage" aria-hidden strokeWidth={1.4} />
            </div>
            <h3 className="mt-5 text-[1.5rem]">{s.title}</h3>
            <p className="mt-2 leading-relaxed text-muted">{s.text}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

/* ———————————————————————— Business ———————————————————————— */

export function BusinessSection() {
  return (
    <section aria-labelledby="biz-h" className="container-page py-8 md:py-12">
      <div className="grid overflow-hidden rounded-lg bg-clay-tint lg:grid-cols-2">
        <div className="relative min-h-[20rem] lg:min-h-[32rem]">
          <Image src="/images/materials/plywood-edge.jpg" alt="" fill sizes="(min-width:1024px) 50vw, 100vw" className="object-cover" />
          <div className="absolute inset-0 grid place-items-center p-6">
            <div className="w-full max-w-sm rounded-md bg-white p-5 shadow-lift">
              <div className="flex items-center justify-between">
                <p className="font-display text-xl text-forest">Your Workshop</p>
                <Badge tone="sage">Verified owner</Badge>
              </div>
              <p className="mt-1 text-sm text-muted">Shared workshop · Your city</p>
              <ul className="mt-4 space-y-2 text-sm">
                {["Services and machine list", "Photo gallery", "Contact form", "Visitor statistics"].map((x) => (
                  <li key={x} className="flex items-center gap-2 text-ink/80">
                    <Check className="size-4 text-sage-ink" aria-hidden /> {x}
                  </li>
                ))}
              </ul>
              <p className="mt-4 border-t border-line pt-3 text-[0.6875rem] text-subtle">Illustration of a future enhanced listing</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-center p-8 sm:p-12 lg:p-16">
          <p className="eyebrow text-clay-ink">For businesses</p>
          <h2 id="biz-h" className="mt-3 text-display-md">
            Put your business on the map.
          </h2>
          <p className="mt-4 max-w-md text-[1.0625rem] leading-relaxed text-ink/75">
            Reach makers who are already looking for a shop, a machine or the right lumber. Basic listings are free — and correcting your information or verifying ownership will never cost a thing.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/for-business" className={buttonVariants({ variant: "primary", size: "lg" })}>
              List your business
            </Link>
            <Link href="/for-business#claim" className={buttonVariants({ variant: "outline", size: "lg" })}>
              Claim a listing
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ———————————————————————— Newsletter ———————————————————————— */

export function NewsletterSection() {
  return (
    <section aria-labelledby="news-h" className="container-page pt-16 md:pt-24">
      <div className="mx-auto max-w-3xl text-center">
        <Image src="/images/materials/end-grain.jpg" alt="" width={72} height={72} className="mx-auto size-16 rounded-full object-cover ring-4 ring-white shadow-soft" />
        <h2 id="news-h" className="mt-6 text-display-lg text-balance">
          Good things are made, <em className="text-clay-ink italic">not found.</em>
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-[1.0625rem] leading-relaxed text-muted">
          A short letter, twice a month: new plans, workshops worth visiting and techniques we&apos;re learning.
        </p>
        <NewsletterForm />
      </div>
    </section>
  );
}

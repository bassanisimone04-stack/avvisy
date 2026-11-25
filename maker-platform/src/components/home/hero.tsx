import { ArrowRight, MapPin, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { PlanSheet } from "@/components/marketplace/plan-sheet";
import { getProduct } from "@/features/catalog/repository";
import { getBusiness } from "@/features/directory/repository";
import { formatPrice } from "@/lib/format";

export function HeroSearch({ id = "hero" }: { id?: string }) {
  return (
    <form
      action="/explore/us/woodworking"
      method="get"
      role="search"
      aria-label="Search workshops and suppliers"
      className="relative rounded-md border border-line-strong bg-white p-1.5 shadow-soft"
    >
      <div className="grid gap-1 sm:grid-cols-[1.25fr_1fr_auto] sm:items-center">
        <label className="flex h-12 items-center gap-2.5 rounded-sm px-3 focus-within:bg-ivory/70">
          <Search className="size-[1.05rem] shrink-0 text-sage-ink" aria-hidden />
          <span className="sr-only">What are you looking for?</span>
          <input
            id={`${id}-q`}
            name="q"
            placeholder="What are you looking for?"
            className="w-full bg-transparent text-[0.9375rem] placeholder:text-subtle focus:outline-none"
          />
        </label>
        <label className="flex h-12 items-center gap-2.5 rounded-sm border-t border-line px-3 focus-within:bg-ivory/70 sm:border-t-0 sm:border-l">
          <MapPin className="size-[1.05rem] shrink-0 text-sage-ink" aria-hidden />
          <span className="sr-only">City, state or ZIP code</span>
          <input
            id={`${id}-near`}
            name="near"
            placeholder="City, state or ZIP code"
            className="w-full bg-transparent text-[0.9375rem] placeholder:text-subtle focus:outline-none"
          />
        </label>
        <button
          type="submit"
          className="h-12 rounded-sm bg-forest px-6 text-[0.9375rem] font-medium text-ivory transition-colors hover:bg-forest-deep"
        >
          Search
        </button>
      </div>
    </form>
  );
}

export function Hero({ stats }: { stats: { places: number; projects: number; tools: number } }) {
  const plan = getProduct("walnut-hall-bench-plan")!;
  const shop = getBusiness("lone-oak-cnc-works-demo")!;

  return (
    <section className="relative overflow-hidden">
      <div className="container-page grid gap-12 pt-10 pb-16 md:pt-16 lg:grid-cols-12 lg:gap-8 lg:pt-20 lg:pb-24">
        {/* Copy */}
        <div className="relative z-10 flex flex-col lg:col-span-6 lg:pt-6 xl:col-span-6">
          <p className="eyebrow flex animate-rise items-center gap-3">
            <span className="h-px w-8 bg-sage" aria-hidden />
            Woodworking &amp; CNC · United States
          </p>
          <h1 className="mt-6 animate-rise text-display-xl text-balance [animation-delay:80ms]">
            Find your space. Make something <em className="font-[340] text-clay-ink italic">extraordinary.</em>
          </h1>
          <p className="mt-6 max-w-[34rem] animate-rise text-[1.125rem] leading-relaxed text-muted text-pretty [animation-delay:160ms] md:text-[1.1875rem]">
            Discover local workshops, trusted suppliers and digital projects to bring your ideas to life.
          </p>

          <div className="mt-9 max-w-[38rem] animate-rise [animation-delay:240ms]">
            <HeroSearch />
            <div className="mt-5 flex flex-wrap items-center gap-x-7 gap-y-3 text-[0.9375rem] font-medium">
              <Link href="/explore/us/woodworking" className="group inline-flex items-center gap-2 text-forest">
                <span className="link-underline">Explore the map</span>
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
              </Link>
              <Link href="/shop" className="group inline-flex items-center gap-2 text-forest">
                <span className="link-underline">Browse digital projects</span>
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
              </Link>
            </div>
          </div>

          <dl className="mt-auto hidden grid-cols-3 border-t border-line pt-6 lg:mt-14 lg:grid lg:max-w-[34rem]">
            {[
              [stats.places, "places on the map"],
              [stats.projects, "digital projects"],
              [stats.tools, "free tools"],
            ].map(([n, l]) => (
              <div key={l} className="border-l border-line pl-4 first:border-l-0 first:pl-0">
                <dt className="sr-only">{l}</dt>
                <dd>
                  <span className="nums block font-display text-[2rem] leading-none text-forest">{n}</span>
                  <span className="mt-1.5 block text-xs text-muted">{l}</span>
                </dd>
              </div>
            ))}
          </dl>
          <p className="mt-3 hidden text-[0.6875rem] text-subtle lg:block">Counts reflect the demo dataset.</p>
        </div>

        {/* Collage: place · project · material — the three pillars in one frame */}
        <div className="relative lg:col-span-6 lg:col-start-7">
          <div className="relative mx-auto aspect-[4/4.9] w-full max-w-[40rem] sm:aspect-[5/4.6] lg:aspect-auto lg:h-full lg:min-h-[38rem]">
            <figure className="absolute inset-y-0 right-0 left-[8%] overflow-hidden rounded-lg bg-forest shadow-lift">
              <Image
                src="/images/materials/walnut-bench.jpg"
                alt="Oiled walnut boards on a workbench (illustrative placeholder image)"
                fill
                priority
                sizes="(min-width: 1024px) 45vw, 92vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgb(27_42_36/0)_45%,rgb(27_42_36/0.55)_100%)]" />
              <figcaption className="absolute right-4 bottom-4 left-4 flex items-end justify-between gap-4 text-ivory sm:right-6 sm:bottom-5">
                <span className="hidden font-display text-[0.9375rem] italic opacity-90 sm:inline">Fig. 01 — Black walnut, hand-rubbed oil</span>
                <span className="rounded-xs bg-black/35 px-2 py-0.5 text-[0.625rem] tracking-wider uppercase backdrop-blur-sm">Placeholder image</span>
              </figcaption>
            </figure>

            {/* Plan card */}
            <Link
              href={`/shop/${plan.slug}`}
              className="group absolute bottom-[7%] left-0 w-[60%] max-w-[17.5rem] sm:bottom-[10%] sm:w-[52%] animate-rise overflow-hidden rounded-md border border-line bg-white shadow-lift transition-transform duration-500 [animation-delay:420ms] hover:-translate-y-1"
            >
              <PlanSheet product={plan} className="aspect-[4/3]" showTitleBlock={false} />
              <div className="flex items-end justify-between gap-2 border-t border-line px-3.5 py-3">
                <div className="min-w-0">
                  <p className="text-[0.625rem] font-semibold tracking-[0.12em] text-sage-ink uppercase">Digital plan</p>
                  <p className="truncate font-display text-[1.0625rem] text-forest">{plan.title}</p>
                </div>
                <p className="nums shrink-0 font-display text-[1.0625rem] text-forest">{formatPrice(plan.prices.personal)}</p>
              </div>
            </Link>

            {/* Place card */}
            <Link
              href={`/business/${shop.slug}`}
              className="absolute top-[6%] right-0 w-[72%] max-w-[18rem] sm:top-[8%] sm:right-[-3%] sm:w-[56%] animate-rise rounded-md border border-line bg-ivory/95 p-3.5 shadow-lift backdrop-blur-sm transition-transform duration-500 [animation-delay:560ms] hover:-translate-y-1"
            >
              <div className="flex items-start gap-3">
                <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-full bg-forest text-ivory">
                  <MapPin className="size-4" aria-hidden />
                </span>
                <div className="min-w-0">
                  <p className="truncate font-display text-[1.0625rem] leading-tight text-forest">{shop.name}</p>
                  <p className="mt-0.5 text-xs text-muted">
                    {shop.city}, {shop.stateCode} · CNC service
                  </p>
                  <p className="mt-2 inline-flex rounded-xs bg-sage-tint px-1.5 py-0.5 text-[0.6875rem] text-sage-ink">{shop.attributes.cncMachines[0]}</p>
                </div>
              </div>
              <p className="mt-3 border-t border-line pt-2 text-[0.6875rem] text-subtle">Demo listing · fictional business</p>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

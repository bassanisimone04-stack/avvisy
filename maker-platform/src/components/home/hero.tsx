import { MapPin, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { photoOrPlaceholder } from "@/lib/photos";

export function HeroSearch({ id = "hero" }: { id?: string }) {
  return (
    <form
      action="/explore/us/woodworking"
      method="get"
      role="search"
      aria-label="Search workshops and suppliers"
      className="rounded-md border border-line-strong bg-white p-2 shadow-soft"
    >
      <div className="grid gap-1 sm:grid-cols-2">
        <label className="flex h-12 items-center gap-3 rounded-sm px-3 focus-within:bg-ivory/70">
          <Search className="size-4 shrink-0 text-forest" aria-hidden />
          <span className="sr-only">What would you like to create?</span>
          <input id={`${id}-q`} name="q" placeholder="What would you like to create?" className="w-full bg-transparent text-[0.9375rem] placeholder:text-subtle focus:outline-none" />
        </label>
        <label className="flex h-12 items-center gap-3 rounded-sm border-t border-line px-3 focus-within:bg-ivory/70 sm:border-t-0 sm:border-l">
          <MapPin className="size-4 shrink-0 text-forest" aria-hidden />
          <span className="sr-only">City, state or ZIP code</span>
          <input id={`${id}-near`} name="near" placeholder="City, state or ZIP code" className="w-full bg-transparent text-[0.9375rem] placeholder:text-subtle focus:outline-none" />
        </label>
      </div>
      <button type="submit" className="mt-2 h-12 w-full rounded-sm bg-forest text-[0.9375rem] font-medium text-ivory transition-colors hover:bg-forest-deep">
        Explore the map
      </button>
    </form>
  );
}

export function Hero() {
  const photo = photoOrPlaceholder("hero", "/images/materials/walnut-bench.jpg");
  return (
    <section className="container-page pt-4 pb-6 md:pt-6">
      <figure className="relative aspect-[4/3.1] overflow-hidden rounded-lg bg-forest sm:aspect-[16/9] lg:aspect-[21/9]">
        <Image
          src={photo.src}
          alt={photo.isPlaceholder ? "Placeholder image: oiled walnut boards" : "A woodworker shaping a piece at a bench in a sunlit workshop"}
          fill
          priority
          sizes="(min-width: 1344px) 1344px, 100vw"
          className="object-cover"
        />
        {photo.isPlaceholder ? (
          <figcaption className="absolute bottom-3 left-3 rounded-full bg-black/45 px-3 py-1 text-[0.6875rem] text-white backdrop-blur-sm">
            Placeholder — licensed photo to be added
          </figcaption>
        ) : null}
      </figure>

      <div className="mx-auto mt-8 max-w-3xl text-center md:mt-10">
        <h1 className="text-display-lg text-balance">Find your space. Make something extraordinary.</h1>
        <p className="mx-auto mt-3 max-w-xl text-[1rem] leading-relaxed text-muted text-pretty md:text-[1.0625rem]">
          Discover local workshops, trusted suppliers and digital projects to bring your ideas to life.
        </p>
        <div className="mx-auto mt-7 max-w-2xl text-left">
          <HeroSearch />
        </div>
        <p className="mt-5 text-[0.9375rem]">
          <Link href="/shop" className="link-underline font-medium text-forest">
            Browse digital projects
          </Link>
        </p>
      </div>
    </section>
  );
}

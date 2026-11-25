"use client";

import Link from "next/link";
import { BusinessRow } from "@/components/directory/business-row";
import { ProductCard } from "@/components/marketplace/product-card";
import { buttonVariants } from "@/components/ui/button";
import { demoBusinesses } from "@/data/demo/businesses";
import { demoProducts } from "@/data/demo/products";
import { useLocalState } from "@/features/local-state/store";

export function FavoritesView() {
  const { favorites } = useLocalState();
  const places = demoBusinesses.filter((b) => favorites.some((f) => f.kind === "business" && f.slug === b.slug));
  const products = demoProducts.filter((p) => favorites.some((f) => f.kind === "product" && f.slug === p.slug));

  if (!places.length && !products.length) {
    return (
      <div className="rounded-lg border border-dashed border-line-strong px-6 py-16 text-center">
        <p className="font-display text-3xl text-forest">Nothing saved yet.</p>
        <p className="mt-2 text-muted">Tap the heart on any place or project to keep it here.</p>
        <div className="mt-6 flex justify-center gap-3">
          <Link href="/explore/us/woodworking" className={buttonVariants({ variant: "primary" })}>
            Explore places
          </Link>
          <Link href="/shop" className={buttonVariants({ variant: "outline" })}>
            Browse projects
          </Link>
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-14">
      {places.length ? (
        <section aria-labelledby="fav-places">
          <h2 id="fav-places" className="text-display-sm">
            Places
          </h2>
          <div className="mt-6 grid gap-3 lg:grid-cols-2">
            {places.map((b) => (
              <BusinessRow key={b.slug} business={b} />
            ))}
          </div>
        </section>
      ) : null}
      {products.length ? (
        <section aria-labelledby="fav-projects">
          <h2 id="fav-projects" className="text-display-sm">
            Projects
          </h2>
          <div className="mt-6 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}

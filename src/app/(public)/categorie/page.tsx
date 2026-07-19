import type { Metadata } from "next";
import Link from "next/link";
import CategoryCard from "@/components/CategoryCard";
import { IconArrowRight } from "@/components/icons";
import { categories, lots } from "@/lib/mock-data";
import LotImage from "@/components/LotImage";

export const metadata: Metadata = {
  title: "Categorie",
  description: "Tutte le categorie merceologiche del marketplace B2B Scortvia.",
};

export default function CategoriePage() {
  return (
    <>
      <section className="border-b border-line bg-surface">
        <div className="container-page py-10">
          <h1 className="text-3xl font-bold text-ink">Categorie</h1>
          <p className="mt-2 max-w-2xl text-muted">
            Otto categorie merceologiche per orientarti tra scorte, componenti e
            materiali aziendali. Ogni categoria raccoglie i lotti pubblicati da
            aziende verificate.
          </p>
        </div>
      </section>

      <section className="container-page py-10">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((c) => (
            <CategoryCard key={c.slug} category={c} />
          ))}
        </div>

        <div className="mt-12 space-y-6">
          {categories.map((c) => {
            const sample = lots.find((l) => l.category === c.slug);
            return (
              <div
                key={c.slug}
                className="card card-soft flex flex-col gap-5 p-5 sm:flex-row sm:items-center"
              >
                {sample && (
                  <Link href={`/lotto/${sample.id}`} className="sm:w-48 shrink-0">
                    <LotImage
                      category={c.slug}
                      seed={sample.images[0] ?? 1}
                      className="rounded-lg"
                      ratio="aspect-[16/10]"
                    />
                  </Link>
                )}
                <div className="flex-1">
                  <h2 className="text-lg font-bold text-ink">{c.name}</h2>
                  <p className="mt-1 text-muted">{c.description}</p>
                  <p className="mt-1 text-sm text-muted">{c.count} lotti disponibili</p>
                </div>
                <Link
                  href={`/marketplace?categoria=${c.slug}`}
                  className="btn btn-outline btn-sm"
                >
                  Esplora
                  <IconArrowRight width={16} height={16} />
                </Link>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}

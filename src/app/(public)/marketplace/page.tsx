import type { Metadata } from "next";
import MarketplaceClient from "@/components/MarketplaceClient";

export const metadata: Metadata = {
  title: "Marketplace",
  description:
    "Cerca e filtra stock, componenti industriali, ricambi e materiali aziendali da venditori verificati.",
};

export default async function MarketplacePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; categoria?: string; regione?: string }>;
}) {
  const sp = await searchParams;
  return (
    <>
      <section className="border-b border-line bg-surface">
        <div className="container-page py-8">
          <h1 className="text-3xl font-bold text-ink">Marketplace</h1>
          <p className="mt-1 max-w-2xl text-muted">
            Esplora i lotti aziendali disponibili. Filtra per categoria,
            regione, prezzo e condizione per trovare esattamente ciò che ti
            serve.
          </p>
        </div>
      </section>
      <MarketplaceClient
        initialQuery={sp.q ?? ""}
        initialCategory={sp.categoria ?? ""}
        initialRegion={sp.regione ?? ""}
      />
    </>
  );
}

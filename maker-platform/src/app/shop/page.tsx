import { Suspense } from "react";
import { CatalogView } from "@/components/marketplace/catalog-view";
import { ShopHeader } from "@/components/marketplace/shop-header";
import { parseCatalogQuery } from "@/features/catalog/repository";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Digital woodworking plans & CNC files",
  description: "Printable woodworking plans, CNC-ready DXF and SVG files, 3D models and planning spreadsheets — each with a cut list and materials.",
  path: "/shop",
  index: false,
});

async function Catalog({ searchParams }: { searchParams: PageProps<"/shop">["searchParams"] }) {
  return <CatalogView query={parseCatalogQuery(await searchParams)} base="/shop" />;
}

export default function ShopPage({ searchParams }: PageProps<"/shop">) {
  return (
    <>
      <ShopHeader />
      <Suspense fallback={<div className="container-page h-96" />}>
        <Catalog searchParams={searchParams} />
      </Suspense>
    </>
  );
}

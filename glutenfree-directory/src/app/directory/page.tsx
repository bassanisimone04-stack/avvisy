import DirectoryContent from "@/components/pages/DirectoryContent";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Directory: ristoranti, negozi e hotel senza glutine in Italia",
  description: "Cerca e filtra migliaia di attività senza glutine: ristoranti, pizzerie, hotel, farmacie, supermercati e negozi certificati AIC in tutta Italia.",
  path: "/directory",
  locale: "it",
});

export default async function DirectoryPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  return <DirectoryContent locale="it" sp={sp} />;
}

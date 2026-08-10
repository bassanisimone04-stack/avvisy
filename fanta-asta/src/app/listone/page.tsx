import ListoneTable from "@/components/ListoneTable";

export const metadata = {
  title: "Listone e valutazioni",
  description:
    "Il listone della Serie A 2026/27 con fantaindice, prezzo consigliato e indice di convenienza calcolati sulle regole della tua lega. Importa il listone ufficiale in CSV.",
};

export default function Page() {
  return <ListoneTable />;
}

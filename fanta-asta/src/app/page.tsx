import AstaBoard from "@/components/AstaBoard";

export const metadata = {
  title: "Asta live",
  description:
    "Conduci l'asta del fantacalcio in tempo reale: chiamata rapida, prezzo consigliato calcolato sulla tua lega, crediti e slot di ogni squadra sempre sott'occhio.",
};

export default function Page() {
  return <AstaBoard />;
}

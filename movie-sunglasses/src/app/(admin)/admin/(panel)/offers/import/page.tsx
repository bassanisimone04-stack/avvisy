import Link from "next/link";
import { OfferImportForm } from "./form";

export default function OffersImport() {
  return (
    <div className="max-w-3xl">
      <p className="text-sm"><Link className="underline" href="/admin/offers">← Offerte e prezzi</Link></p>
      <h1 className="mt-2 font-display text-4xl font-semibold">Importa offerte da CSV</h1>
      <p className="mt-2 text-sm text-slate">Per feed o export delle reti affiliate. Colonne riconosciute: <code>model</code> (id, slug o nome), <code>merchant</code> (id, slug o nome), <code>url</code> (https), <code>price</code>, <code>availability</code>, <code>shipping</code>, <code>currency</code> (solo USD), <code>last_checked</code> (AAAA-MM-GG, default oggi).</p>
      <ul className="mt-3 list-disc pl-5 text-sm text-slate">
        <li>Il file è tutto o niente: se una riga è errata non viene importato nulla.</li>
        <li>Modelli e negozi devono già esistere; non vengono creati né indovinati.</li>
        <li>Reimportare lo stesso modello e negozio aggiorna l'offerta, non la duplica.</li>
        <li>Un prezzo vuoto resta «sconosciuto»: il sito non inventa mai un prezzo.</li>
      </ul>
      <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm"><OfferImportForm /></div>
    </div>
  );
}

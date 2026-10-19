import Link from "next/link";
import { PhotoImportForm } from "./form";

export default function PhotosImport() {
  return (
    <div className="max-w-3xl">
      <p className="text-sm"><Link className="underline" href="/admin/photos">← Fotografie autorizzate</Link></p>
      <h1 className="mt-2 font-display text-4xl font-semibold">Importa foto da CSV</h1>
      <p className="mt-2 text-sm text-slate">Per registrare molte immagini già caricate sul tuo storage. Colonne: <code>url</code> (https), <code>alt</code>, <code>credit</code>, <code>license</code> (<code>owned</code>, <code>licensed</code>, <code>press</code>, <code>cc</code>, <code>public_domain</code>, <code>affiliate_feed</code>, <code>fair_use</code>), <code>kind</code> (<code>product</code> o <code>scene</code>, default <code>scene</code>), <code>license_url</code>, <code>source_url</code>, <code>rights_note</code>, <code>model</code>, <code>movie</code>, <code>article</code> (id, slug o nome), <code>approved</code> (yes/no, default no).</p>
      <ul className="mt-3 list-disc pl-5 text-sm text-slate">
        <li>Le stesse regole del modulo valgono per ogni riga: senza prova dei diritti (o motivazione e fonte per il fair use) una foto non può essere approvata.</li>
        <li>Il file è tutto o niente. Con «approved» vuoto le foto restano bozze, non visibili sul sito.</li>
        <li>L'importazione non scarica nulla: le immagini devono essere già sul tuo storage.</li>
      </ul>
      <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm"><PhotoImportForm /></div>
    </div>
  );
}

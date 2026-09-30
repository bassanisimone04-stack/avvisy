import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Come funziona" };

const STEPS = [
  ["Una scheda per ogni immobile", "Quando pubblichi, l'indirizzo (comune, via, civico, interno) viene geocodificato su OpenStreetMap. Se quell'immobile è già schedato — anche da un altro inserzionista — l'annuncio viene agganciato alla scheda esistente: niente duplicati, e lo storico dei prezzi e degli annunci resta pubblico."],
  ["Disponibilità riconfermata ogni settimana", "Ogni 7 giorni ricevi un promemoria con un link: un click e l'annuncio risulta «Disponibile — confermato adesso». Gli annunci non riconfermati scendono nei risultati e mostrano da quanto tempo non sono confermati."],
  ["Visite su calendario reale", "Imposti le fasce in cui puoi mostrare casa e colleghi il tuo Google Calendar (o qualunque calendario iCal): chi cerca vede solo gli orari in cui sei davvero libero e prenota con conferma immediata. Le visite compaiono nel tuo calendario tramite il feed iCal personale."],
  ["Costo d'ingresso sempre visibile", "Canone, spese condominiali, cauzione e commissione sono campi numerici obbligatori. Il totale è mostrato su ogni risultato di ricerca, prima di qualunque contatto."],
  ["Fiducia misurata, non dichiarata", "Tempo e tasso di risposta sono calcolati dai messaggi reali; le recensioni sono legate a visite effettivamente svolte; privati e agenzie sono sempre distinti."],
];

export default function HowPage() {
  return (
    <div className="container section stack" style={{ maxWidth: 760, gap: 16 }}>
      <h1>Come funziona</h1>
      {STEPS.map(([t, d], i) => (
        <section key={t} className="card card-pad">
          <h2>
            {i + 1}. {t}
          </h2>
          <p style={{ margin: 0 }}>{d}</p>
        </section>
      ))}
      <div className="row">
        <Link className="btn btn-primary" href="/annunci">
          Cerca casa
        </Link>
        <Link className="btn" href="/pubblica">
          Pubblica un annuncio
        </Link>
      </div>
    </div>
  );
}

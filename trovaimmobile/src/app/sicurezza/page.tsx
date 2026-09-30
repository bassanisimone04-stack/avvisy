import type { Metadata } from "next";
import { FraudWarning } from "@/components/trust";

export const metadata: Metadata = { title: "Sicurezza e truffe" };

export default function SafetyPage() {
  return (
    <div className="container section stack" style={{ maxWidth: 760, gap: 16 }}>
      <h1>Affittare senza truffe</h1>
      <FraudWarning />
      <section className="card card-pad">
        <h2>Lo schema più diffuso</h2>
        <p>
          Un annuncio con un prezzo interessante. Al primo contatto, l&apos;inserzionista (spesso sedicente agenzia) chiede <strong>200–260 €</strong> per
          «iscriversi al servizio di ricerca» o come «caparra per bloccare la visita». Dopo il pagamento la casa non è più disponibile, e i soldi non vengono
          mai restituiti.
        </p>
        <p style={{ margin: 0 }}>Su TrovaImmobile nessun pagamento passa dalla piattaforma e nessun pagamento è dovuto per visitare un immobile.</p>
      </section>
      <section className="card card-pad">
        <h2>Cosa facciamo noi</h2>
        <ul style={{ margin: 0, paddingLeft: 18 }}>
          <li>Il costo totale d&apos;ingresso (canone, spese, cauzione, commissione) è dichiarato in campi obbligatori prima di qualsiasi contatto.</li>
          <li>I privati non possono inserire commissioni. Le agenzie dichiarano la commissione, dovuta solo alla firma del contratto.</li>
          <li>Annunci che chiedono pagamenti anticipati nel testo vengono bloccati in pubblicazione.</li>
          <li>I messaggi che parlano di caparre, bonifici o quote vengono segnalati con un avviso a chi li riceve.</li>
          <li>Le recensioni si possono lasciare solo dopo una visita prenotata e svolta sulla piattaforma.</li>
          <li>Il tempo di risposta è calcolato dalle richieste reali, non dichiarato dall&apos;inserzionista.</li>
        </ul>
      </section>
      <section className="card card-pad">
        <h2>Segnali d&apos;allarme</h2>
        <ul style={{ margin: 0, paddingLeft: 18 }}>
          <li>Richiesta di denaro prima della visita, per qualsiasi motivo.</li>
          <li>Il proprietario «è all&apos;estero» e manda le chiavi dopo un bonifico.</li>
          <li>Pagamenti con ricariche, money transfer o criptovalute.</li>
          <li>Pressione a decidere subito «perché ci sono altri interessati».</li>
        </ul>
      </section>
    </div>
  );
}

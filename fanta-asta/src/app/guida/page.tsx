import { SQUADRE } from "@/lib/teams";

export const metadata = {
  title: "Guida all'asta 2026/27",
  description:
    "Divisione del budget, fasce per ruolo, rigoristi di tutte le 20 squadre, bug del listone e strategie: tutto quello che serve prima di sedersi all'asta.",
};

const FASCE: {
  ruolo: string;
  colore: string;
  gruppi: { titolo: string; testo: string }[];
}[] = [
  {
    ruolo: "Portieri",
    colore: "#f2a516",
    gruppi: [
      {
        titolo: "Primo slot",
        testo:
          "Svilar è il supertop assoluto: rendimento personale più la difesa più solida del campionato. Carnesecchi è l'altro nome da primo slot, con il posto garantito e le difese di Sarri che concedono poco. Maignan completa il terzetto di testa.",
      },
      {
        titolo: "L'alternativa intelligente",
        testo:
          "Butez arriva da 19 clean sheet, record del campionato, e da una fantamedia di 6.2, la migliore del ruolo. Di Gregorio permette di evitare la guerra sui primi tre restando su un titolare da prima fascia: è la scelta che fa risparmiare crediti veri.",
      },
      {
        titolo: "Media fascia",
        testo:
          "Josep Martinez è nettamente favorito su Provedel dopo l'addio di Sommer. Meret è l'unico da seconda fascia subito sotto i top, ma il ballottaggio con Milinkovic-Savic va monitorato. Caprile e Falcone sono i migliori per media voto nella fascia media.",
      },
      {
        titolo: "Scommesse",
        testo:
          "Tra le neopromosse, Stankovic può essere la sorpresa del ruolo, soprattutto nelle leghe numerose dove i titolari scarseggiano.",
      },
    ],
  },
  {
    ruolo: "Difensori",
    colore: "#3ba55d",
    gruppi: [
      {
        titolo: "Primo slot",
        testo:
          "Dimarco resta il top assoluto dopo una stagione da record: 7 gol e 17 assist, e il listone lo conferma difensore. Bremer e Bisseck sono le altre due opzioni solide; Mancini e Wesley garantiscono un buon numero di bonus.",
      },
      {
        titolo: "Qualità-prezzo",
        testo:
          "Cambiaso, Di Lorenzo e Scalvini offrono il miglior rapporto qualità-prezzo del reparto. Pavlovic e Ostigard hanno dimostrato di essere prolifici in zona gol: Ostigard ha chiuso a 5 reti, tra i migliori difensori della scorsa Serie A.",
      },
      {
        titolo: "Difesa a tre",
        testo:
          "Mario Hermoso con Gasperini è tornato ai livelli visti all'Atletico Madrid ed è particolarmente affidabile nel sistema a tre.",
      },
      {
        titolo: "Riempitivi da 1-4 crediti",
        testo:
          "Bracaglia (Frosinone) e Correia (Venezia) sono i migliori rapporti qualità-prezzo tra i titolari delle neopromosse. Mitaj e Marcandalli al Genoa, Walukiewicz al Sassuolo, Mangas e Birindelli al Monza completano la difesa senza svuotare il portafoglio.",
      },
    ],
  },
  {
    ruolo: "Centrocampisti",
    colore: "#3b82f6",
    gruppi: [
      {
        titolo: "Primo slot",
        testo:
          "McTominay, Nico Paz e Orsolini sono andati in doppia cifra e possono ripetersi: sono i veri primi slot del reparto. McTominay resta la prima chiamata, poco davanti a Paz e Orsolini.",
      },
      {
        titolo: "Subito dietro",
        testo:
          "Pulisic con Amorim può tornare vicino alla doppia-doppia tra gol e assist. Rabiot era già stato il migliore del reparto con Allegri (6 gol e 4 assist). Calhanoglu ha chiuso con 9 gol ed è il top del ruolo come media voto.",
      },
      {
        titolo: "Jolly",
        testo:
          "Jesus Rodriguez passa da attaccante a centrocampista nel listone e diventa un jolly di prima fascia. Pasalic, con 3 gol e 3 assist in 31 partite a voto, resta il più classico dei jolly di centrocampo.",
      },
      {
        titolo: "Sorprese e low cost",
        testo:
          "Gaetano all'Atalanta può essere la grande intuizione dell'asta, Lipani al Sassuolo una chiamata low cost interessante, Moro al Bologna avrà spazio dopo l'addio di Freuler e batte anche i piazzati. Adopo e Rovella sono titolari praticamente certi; Basic al Venezia ha il posto fisso; Cacciamani, Calò, Ondrejka e il rientrante Berisha sono nomi da bonus a pochi crediti.",
      },
    ],
  },
  {
    ruolo: "Attaccanti",
    colore: "#ef4444",
    gruppi: [
      {
        titolo: "Primo slot",
        testo:
          "Lautaro Martinez e Malen sono i primi slot per antonomasia: 17 e 14 gol lo scorso campionato, e su di loro va spesa una grande parte del budget. Thuram resta un gradino sotto ma è ancora primo slot, con 13 gol e la prospettiva di migliorare avendo meno problemi fisici. Gonçalo Ramos, nuovo arrivato al Milan, è quasi un primissimo slot.",
      },
      {
        titolo: "Seconda fascia",
        testo:
          "Yildiz e Kolo Muani saranno decisivi ma non vanno etichettati come primo slot per la discontinuità in zona gol. Promossi Berardi, Scamacca e Dybala, quest'ultimo pronto a ritrovare continuità fisica. Ci si aspetta il riscatto totale di Kean e uno Scamacca protagonista con Sarri.",
      },
      {
        titolo: "Terza fascia da doppia cifra",
        testo:
          "Alisson Santos, Boga, Castro, De Ketelaere, Colombo, Laurienté, Nkunku, Noslin, Pellegrino, Pinamonti, Raspadori e gli Esposito possono flirtare con la doppia cifra a un prezzo molto più umano.",
      },
      {
        titolo: "La scommessa più citata",
        testo:
          "Dovbyk al Bologna può essere la grande rivelazione del reparto: costa meno della metà di Lautaro e Malen perché arriva da una stagione disastrosa alla Roma.",
      },
    ],
  },
];

const BUG_LISTONE = [
  {
    nome: "Pulisic (Milan)",
    testo:
      "Centrocampista al Classic, ma nel 3-4-2-1 di Amorim è uno dei due trequartisti alle spalle di Gonçalo Ramos.",
  },
  {
    nome: "Wesley (Roma)",
    testo:
      "Resta difensore nonostante giochi da esterno a tutti gli effetti nel sistema di Gasperini.",
  },
  {
    nome: "Alajbegovic (Juventus)",
    testo:
      "Centrocampista al listone, ma nella Juve di Spalletti agirà da trequartista o esterno offensivo.",
  },
  {
    nome: "Addai (Como)",
    testo:
      "Ventunenne olandese schierato tra gli esterni offensivi del 4-2-3-1 di Fàbregas, ma censito come centrocampista.",
  },
  {
    nome: "Rowe (Bologna)",
    testo:
      "Tra i centrocampisti che possono rendere quasi quanto un attaccante grazie alla posizione in campo.",
  },
  {
    nome: "Correia (Venezia)",
    testo:
      "Difensore al listone ma con licenza di giocare più avanti sull'esterno: bonus a prezzo di riempitivo.",
  },
];

const STRATEGIE = [
  {
    titolo: "Decidi la ripartizione prima di sederti",
    testo:
      "In una lega Classic da 10 squadre con 500 crediti e rosa da 25 (3-8-8-6), la divisione più consigliata è 35 crediti ai portieri, 70 alla difesa, 145 al centrocampo e 250 all'attacco. Non è un vincolo rigido, è la soglia oltre la quale conviene fermarsi. In FantAsta la imposti in Lega e i prezzi consigliati si ricalcolano di conseguenza.",
  },
  {
    titolo: "Guarda sempre la tua offerta massima",
    testo:
      "Il numero che conta non è quanti crediti hai, ma quanti puoi spendere su un giocatore tenendone uno per ogni altro slot da riempire. È la cifra che FantAsta tiene in alto sulla schermata d'asta: superarla significa arrivare a fine asta con caselle vuote.",
  },
  {
    titolo: "I bonus contano più del nome",
    testo:
      "Rigorista designato, calci piazzati e ruolo di listone più arretrato della posizione reale sono i tre moltiplicatori che spostano davvero una stagione. Il fantaindice li pesa esplicitamente: per questo un rigorista di media fascia può valere più di un big senza bonus.",
  },
  {
    titolo: "Le neopromosse sono la miniera dei riempitivi",
    testo:
      "Servono 25 slot e non tutti possono costare: i titolari fissi di Monza, Venezia e Frosinone ti danno presenze garantite a 1-4 crediti, liberando budget per i primi slot.",
  },
  {
    titolo: "Col modificatore di difesa cambia tutto",
    testo:
      "Se la tua lega usa il modificatore, portiere e difensori di una squadra solida valgono più del loro fantavalore. Attiva l'opzione nelle impostazioni: il motore alza automaticamente l'indice di portieri e difensori e sposta il budget verso il reparto arretrato.",
  },
  {
    titolo: "Il mercato non è chiuso il giorno dell'asta",
    testo:
      "La sessione estiva va avanti fino al 1° settembre 2026: un trasferimento dell'ultimo minuto può ribaltare una gerarchia dal dischetto. Controlla la rassegna stampa la mattina stessa dell'asta.",
  },
];

const FONTI_CONSULTATE = [
  { nome: "Sky TG24 — Listone 2026/27, ruoli e quotazioni", url: "https://tg24.sky.it/sport/2026/08/05/listone-fantacalcio-2026-2027-ruoli-quotazioni-novita" },
  { nome: "SOS Fanta — Guida all'asta 2026-27, fasce e consigli", url: "https://www.sosfanta.com/guida-asta-fantacalcio/guida-asta-fantacalcio-2026-2027-tutti-consigli-fasce-chi-prendere/" },
  { nome: "SOS Fanta — Listone Leghe Fantacalcio Classic e Mantra", url: "https://www.sosfanta.com/quotazioni-fantacalcio/listone-2026-27-leghe-fantacalcio-classic-mantra-tutti-ruoli-quotazioni/" },
  { nome: "SOS Fanta — Tutti i rigoristi delle 20 squadre", url: "https://www.sosfanta.com/asta-fantacalcio/fantacalcio-asta-tutti-rigoristi-seriea-venti-squadre-campionato/" },
  { nome: "Goal.com — Chi prendere all'asta, divisione in fasce e ruoli", url: "https://www.goal.com/it/liste/consigli-fantacalcio-serie-a-2026-2027-chi-prendere-all-asta-la-guida-completa-divisione-in-fasce-e-ruoli/blt990f9f2a29ab947d" },
  { nome: "Goal.com — Titolari low cost da prendere a 1", url: "https://www.goal.com/it/liste/fantacalcio-2026-2027-difensori-centrocampisti-e-attaccanti-titolari-low-cost-da-prendere-a-1/blt19835a78e9c0164c" },
  { nome: "Goal.com — Formazioni titolari, tutte le squadre-tipo", url: "https://www.goal.com/it/liste/fantacalcio-formazioni-titolari-serie-a-2026-2027-tutte-le-squadre-tipo/blt5527c89487e5b7d3" },
  { nome: "Calcio d'Angolo — I bug del listone 2026/2027", url: "https://calciodangolo.com/fantacalcio-bug-listone-2026-2027-wesley-pulisic-occasioni/" },
  { nome: "FantaMaster — Rigoristi e gerarchie delle 20 squadre", url: "https://www.fantamaster.it/rigoristi-seriea-fantacalcio-2026-2027-gerarchie-20-squadre/" },
  { nome: "Fantacalcio.it — Come dividere il budget all'asta", url: "https://www.fantacalcio.it/consigli-fantacalcio/19_08_2025/come-dividere-budget-asta-fantacalcio-480984" },
  { nome: "Lega Serie A — Allenatori e calendario 2026/27", url: "https://www.legaseriea.it/serie-a/news/gli-allenatori-della-serie-a-enilive-2026-27" },
  { nome: "Sportmediaset — La top 11 per fantamedia della Serie A 2025/26", url: "https://www.sportmediaset.mediaset.it/foto/calcio/seriea/la-top-11-della-serie-a-2025-2026-i-migliori-per-fantamedia_112588341-202602k.shtml" },
];

export default function Page() {
  return (
    <div className="space-y-4">
      <section className="panel p-5">
        <h1 className="text-2xl font-black">Guida all&apos;asta 2026/27</h1>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[#c8ddd5]">
          Tutto quello che serve sapere prima di sedersi al tavolo: come il gestionale calcola i
          prezzi, come dividere il budget, chi sono i nomi che contano ruolo per ruolo, chi tira i
          rigori in ogni squadra e dove il listone sbaglia a tuo vantaggio. Il campionato parte nel
          weekend del <strong>22-23 agosto 2026</strong> e il mercato estivo resta aperto fino al{" "}
          <strong>1° settembre</strong>: fino ad allora le gerarchie possono cambiare.
        </p>
      </section>

      <section className="panel p-5">
        <h2 className="text-lg font-black">Come leggere i numeri di FantAsta</h2>
        <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {[
            {
              titolo: "Fantaindice (0-100)",
              testo:
                "Quanto vale un giocatore, indipendentemente dal prezzo. Pesa fascia d'asta, titolarità, bonus attesi (rigori e piazzati), forza della squadra e rendimento della scorsa stagione.",
            },
            {
              titolo: "Prezzo consigliato",
              testo:
                "Quanto dovrebbe costare nella tua lega. Il modello prende i crediti che la lega dedicherà a quel reparto e li distribuisce tra i giocatori che verranno effettivamente comprati. Cambia budget, slot o numero di squadre e i prezzi si muovono.",
            },
            {
              titolo: "Non oltre",
              testo:
                "La soglia di strappo: oltre quella cifra stai pagando più del valore reale. Superarla ogni tanto è legittimo, farlo tre volte di fila significa restare senza crediti.",
            },
            {
              titolo: "Convenienza",
              testo:
                "Rapporto tra valore e prezzo, normalizzato sul ruolo: 100 è la media, sopra 125 è un affare, sotto 72 è una trappola. Serve a trovare chi rende più di quanto costa.",
            },
          ].map((c) => (
            <div key={c.titolo} className="panel-soft p-3">
              <h3 className="text-sm font-black text-[color:var(--accent)]">{c.titolo}</h3>
              <p className="mt-1 text-[0.82rem] leading-relaxed text-[#b9d1c9]">{c.testo}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="panel p-5">
        <h2 className="text-lg font-black">Le fasce, ruolo per ruolo</h2>
        <div className="mt-3 grid gap-3 lg:grid-cols-2">
          {FASCE.map((f) => (
            <div
              key={f.ruolo}
              className="panel-soft p-4"
              style={{ borderTop: `3px solid ${f.colore}` }}
            >
              <h3 className="text-base font-black" style={{ color: f.colore }}>
                {f.ruolo}
              </h3>
              <dl className="mt-2 space-y-2.5">
                {f.gruppi.map((g) => (
                  <div key={g.titolo}>
                    <dt className="text-[0.78rem] font-black uppercase tracking-wide text-[#dbe9e3]">
                      {g.titolo}
                    </dt>
                    <dd className="mt-0.5 text-[0.85rem] leading-relaxed text-[#b9d1c9]">
                      {g.testo}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}
        </div>
      </section>

      <section className="panel p-5">
        <h2 className="text-lg font-black">Chi tira i rigori, squadra per squadra</h2>
        <p className="mt-1 text-[0.82rem] text-[color:var(--muted)]">
          Il rigorista designato è il singolo tag che sposta di più il rendimento stagionale.
          Le gerarchie possono cambiare fino alla chiusura del mercato.
        </p>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[42rem] border-collapse text-sm">
            <thead>
              <tr className="border-b border-[color:var(--line)] text-left">
                <th className="px-3 py-2 text-[0.7rem] uppercase tracking-wide text-[color:var(--muted)]">
                  Squadra
                </th>
                <th className="px-3 py-2 text-[0.7rem] uppercase tracking-wide text-[color:var(--muted)]">
                  Gerarchia dal dischetto
                </th>
                <th className="px-3 py-2 text-[0.7rem] uppercase tracking-wide text-[color:var(--muted)]">
                  Piazzati
                </th>
              </tr>
            </thead>
            <tbody>
              {SQUADRE.map((s) => (
                <tr key={s.code} className="border-b border-[color:var(--line)]">
                  <td className="px-3 py-2 font-bold">{s.nome}</td>
                  <td className="px-3 py-2 text-[#c8ddd5]">{s.rigorista}</td>
                  <td className="px-3 py-2 text-[color:var(--muted)]">{s.piazzati ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="panel p-5">
        <h2 className="text-lg font-black">I bug del listone: dove il ruolo non dice la verità</h2>
        <p className="mt-1 text-[0.82rem] text-[color:var(--muted)]">
          Giocatori censiti in un ruolo più arretrato di quello che occupano in campo: producono
          bonus da attaccante al prezzo del loro reparto. Sono le occasioni migliori dell&apos;asta.
        </p>
        <ul className="mt-3 grid gap-2 md:grid-cols-2 xl:grid-cols-3">
          {BUG_LISTONE.map((b) => (
            <li key={b.nome} className="panel-soft p-3">
              <h3 className="text-sm font-black text-[#c084fc]">{b.nome}</h3>
              <p className="mt-1 text-[0.82rem] leading-relaxed text-[#b9d1c9]">{b.testo}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="panel p-5">
        <h2 className="text-lg font-black">Sei regole per non sbagliare l&apos;asta</h2>
        <ol className="mt-3 grid gap-3 md:grid-cols-2">
          {STRATEGIE.map((s, i) => (
            <li key={s.titolo} className="panel-soft p-4">
              <h3 className="text-sm font-black">
                <span className="text-[color:var(--accent)]">{i + 1}.</span> {s.titolo}
              </h3>
              <p className="mt-1 text-[0.85rem] leading-relaxed text-[#b9d1c9]">{s.testo}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="panel p-5">
        <h2 className="text-lg font-black">Fonti</h2>
        <p className="mt-1 text-[0.82rem] text-[color:var(--muted)]">
          Le informazioni di questa guida e i tag del listone interno derivano dalle guide all&apos;asta
          pubblicate ad agosto 2026. Per le quotazioni ufficiali fa fede il listone di Leghe
          Fantacalcio, che puoi importare in CSV dalla pagina Listone.
        </p>
        <ul className="mt-3 grid gap-1.5 md:grid-cols-2">
          {FONTI_CONSULTATE.map((f) => (
            <li key={f.url}>
              <a
                href={f.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[0.85rem] text-[#9dd6b6] underline decoration-[#2f6b53] underline-offset-2 hover:text-[color:var(--accent)]"
              >
                {f.nome} ↗
              </a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

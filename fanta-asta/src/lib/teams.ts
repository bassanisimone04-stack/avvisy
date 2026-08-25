import type { SquadraSerieA, TeamCode } from "./types";

/**
 * Le 20 squadre della Serie A Enilive 2026/27.
 *
 * `forza` e `difesa` sono i due parametri soggettivi che alimentano il motore
 * di valutazione: quanto la squadra produce bonus e quanto tiene la porta
 * inviolata. Sono modificabili senza toccare il resto dell'applicazione.
 *
 * Formazioni tipo, rigoristi e note derivano dalle guide all'asta pubblicate
 * ad agosto 2026 (vedi /guida per l'elenco delle fonti). Dove il mercato era
 * ancora aperto la formazione riporta i ballottaggi con la barra.
 */
export const SQUADRE: SquadraSerieA[] = [
  {
    code: "ATA",
    nome: "Atalanta",
    allenatore: "Maurizio Sarri",
    modulo: "4-3-3",
    forza: 82,
    difesa: 80,
    formazioneTipo:
      "Carnesecchi; Bellanova/Zappacosta, Scalvini, Hien, Ahanor/Kolasinac; Ederson, Gaetano, Pasalic/Samardzic; De Ketelaere, Scamacca/Krstovic, Raspadori",
    rigorista: "Scamacca (3/3 lo scorso anno), poi Samardzic (2/2) ed Ederson (1/1)",
    piazzati: "Samardzic",
    nota:
      "Con Sarri in panchina la difesa diventa un asset: Carnesecchi è nome da primo slot tra i pali. Scamacca è atteso da protagonista totale, Gaetano può essere la grande intuizione d'asta a centrocampo.",
  },
  {
    code: "BOL",
    nome: "Bologna",
    allenatore: "Domenico Tedesco",
    modulo: "4-3-3",
    forza: 74,
    difesa: 72,
    formazioneTipo:
      "Skorupski; Zortea, Heggem, Lucumì/Vitik, Miranda; Ferguson/Odgaard, Moro/El Azzouzi, Bernardeschi; Orsolini, Dovbyk, Rowe",
    rigorista: "Orsolini, con Bernardeschi come prima alternativa",
    piazzati: "Orsolini, Bernardeschi, Moro",
    nota:
      "Dovbyk è indicato come possibile grande rivelazione del reparto avanzato e costa meno della metà dei top. Moro batte anche i piazzati e avrà parecchio spazio dopo l'addio di Freuler.",
  },
  {
    code: "CAG",
    nome: "Cagliari",
    allenatore: "Fabio Pisacane",
    modulo: "4-3-3",
    forza: 55,
    difesa: 56,
    formazioneTipo:
      "Caprile; Zappa/Palestra, Mina, Luperto, Obert; Adopo, Prati, Folorunsho/Deiola; Esposito S., Piccoli, Luvumbo",
    rigorista: "Gerarchia guidata da Piccoli, con Esposito S. come alternativa",
    nota:
      "Caprile è tra i migliori portieri della media fascia per media voto. Adopo è dato come titolare praticamente certo: perfetto riempitivo a centrocampo.",
  },
  {
    code: "COM",
    nome: "Como",
    allenatore: "Cesc Fàbregas",
    modulo: "4-2-3-1",
    forza: 72,
    difesa: 78,
    formazioneTipo:
      "Butez; difesa in via di definizione; Perrone, Da Cunha; Addai, Nico Paz, Vojvoda; Douvikas",
    rigorista: "Da Cunha ha scavalcato Nico Paz, con Douvikas come alternativa",
    piazzati: "Nico Paz",
    nota:
      "Butez ha chiuso la scorsa stagione con 19 clean sheet, record del campionato: è il portiere ideale per il modificatore di difesa. Addai è un classico bug di listone (centrocampista che gioca esterno offensivo nel 4-2-3-1).",
  },
  {
    code: "FIO",
    nome: "Fiorentina",
    allenatore: "Fabio Grosso",
    modulo: "4-3-3",
    forza: 70,
    difesa: 64,
    formazioneTipo:
      "De Gea; Dodò/Joao Mario, Dragusin, Viti/Pongracic, Jimenez/Fortini; Oulai, Fagioli/Mandragora, Atta; Mastantuono, Kean, Gudmundsson",
    rigorista: "Kean, con Gudmundsson come alternativa",
    piazzati: "Gudmundsson, Mandragora",
    nota:
      "Kean è reduce da una stagione da 8 gol e 1 assist, ben sotto le attese: le guide si aspettano il riscatto totale e per questo non è più tra i 2-3 attaccanti più cari.",
  },
  {
    code: "FRO",
    nome: "Frosinone",
    allenatore: "Massimiliano Alvini",
    modulo: "4-3-3",
    forza: 40,
    difesa: 42,
    formazioneTipo:
      "Palmisani; Bracaglia, Monterisi, Gelli, Elphege; Calò, Cichella, Koutsoupias; Ghedjemis, Raimondo, Kvernadze",
    rigorista: "Calò e Ghedjemis si dividono le responsabilità dal dischetto",
    piazzati: "Calò",
    neopromossa: true,
    nota:
      "Bracaglia è segnalato come uno dei migliori rapporti qualità-prezzo tra i titolari delle neopromosse. Ghedjemis ha dominato la Serie B: è la scommessa low cost del reparto offensivo.",
  },
  {
    code: "GEN",
    nome: "Genoa",
    allenatore: "Daniele De Rossi",
    modulo: "3-5-2",
    forza: 56,
    difesa: 58,
    formazioneTipo:
      "Leali; Marcandalli, Ostigard, Vasquez; Norton-Cuffy, Frendrup, Masini, Malinovskyi, Mitaj; Colombo/Ekuban, Vitinha",
    rigorista: "Malinovskyi è il riferimento dal dischetto",
    piazzati: "Malinovskyi",
    nota:
      "Ostigard è stato uno dei difensori più prolifici della scorsa Serie A con 5 gol: nome da modificatore e da bonus. Mitaj e Marcandalli sono due intuizioni low cost per riempire gli slot in difesa.",
  },
  {
    code: "INT",
    nome: "Inter",
    allenatore: "Cristian Chivu",
    modulo: "3-5-2",
    forza: 93,
    difesa: 86,
    formazioneTipo:
      "Josep Martinez; Akanji, Stones, Bastoni; Luis Henrique, Barella, Calhanoglu, Zielinski, Dimarco; Lautaro Martinez, Thuram",
    rigorista: "Calhanoglu, con Lautaro Martinez come alternativa",
    piazzati: "Calhanoglu, Dimarco",
    nota:
      "Campione d'Italia in carica. Josep Martinez è nettamente favorito su Provedel per il posto da titolare dopo l'addio di Sommer. Dimarco arriva da una stagione record: 7 gol e 17 assist.",
  },
  {
    code: "JUV",
    nome: "Juventus",
    allenatore: "Luciano Spalletti",
    modulo: "4-2-3-1",
    forza: 84,
    difesa: 80,
    formazioneTipo:
      "Di Gregorio; Kalulu/Celik, Bremer, Kelly, Cambiaso; Locatelli/Douglas Luiz, K. Thuram; Conceicao/McKennie, Alajbegovic, Yildiz; Kolo Muani",
    rigorista: "Yildiz, con Kolo Muani come alternativa",
    piazzati: "Yildiz",
    nota:
      "Di Gregorio è il modo per evitare la guerra su Svilar e Carnesecchi restando su un portiere da prima fascia. Alajbegovic è un bug di listone: centrocampista che agirà da trequartista o esterno offensivo.",
  },
  {
    code: "LAZ",
    nome: "Lazio",
    allenatore: "Gennaro Gattuso",
    modulo: "4-3-3",
    forza: 68,
    difesa: 66,
    formazioneTipo:
      "Mandas; Marusic/Lazzari, Doekhi, Provstgaard, Nuno Tavares/Pedraza; Dele-Bashiru, Rovella, Taylor; Isaksen/Cancellieri, Ratkov/Noslin/Dia, Zaccagni",
    rigorista: "Zaccagni è il capitano e il riferimento dal dischetto",
    piazzati: "Zaccagni",
    nota:
      "Zaccagni resta centrocampista al Classic e W/A al Mantra. Rovella è indicato come titolare praticamente certo: slot di centrocampo a costo contenuto.",
  },
  {
    code: "LEC",
    nome: "Lecce",
    allenatore: "Eusebio Di Francesco",
    modulo: "4-3-3",
    forza: 45,
    difesa: 50,
    formazioneTipo:
      "Falcone; Veiga, Gaspar, Tiago Gabriel, Gallo; Berisha, Ramadani, Coulibaly; Pierotti, Stulic, Banda",
    rigorista: "Stulic, con Pierotti alle sue spalle",
    nota:
      "Falcone è tra i migliori portieri della media fascia per media voto. Il rientrante Berisha è segnalato come nome low cost capace di portare bonus.",
  },
  {
    code: "MIL",
    nome: "Milan",
    allenatore: "Ruben Amorim",
    modulo: "3-4-2-1",
    forza: 85,
    difesa: 82,
    formazioneTipo:
      "Maignan; Gila, Gabbia, Pavlovic; Saelemaekers, Rabiot, Modric, Bartesaghi; Pulisic, Leao/Nkunku; Gonçalo Ramos",
    rigorista:
      "Gerarchia da definire: Gonçalo Ramos insidia Nkunku (infallibile lo scorso anno), Pulisic più staccato",
    piazzati: "Modric, Pulisic",
    nota:
      "Pulisic è il bug di listone più citato: centrocampista al Classic ma di fatto uno dei due trequartisti alle spalle della punta. Pavlovic è tra i difensori più prolifici in zona gol.",
  },
  {
    code: "MON",
    nome: "Monza",
    allenatore: "Ivan Juric",
    modulo: "3-4-2-1",
    forza: 46,
    difesa: 48,
    formazioneTipo:
      "Lamanna; Izzo, Ravanelli, Mangas; Birindelli, Pessina, Bianco, Carboni; Colpani, Keita Baldé/Dany Mota; Colombo/Cutrone",
    rigorista: "Capitan Pessina, poi Cutrone e come terza scelta Petagna",
    piazzati: "Pessina, Colpani",
    neopromossa: true,
    nota:
      "Pessina è il riferimento in mezzo, Colpani agisce con grande libertà tra le linee. Mangas e Birindelli sono due titolari a basso costo per completare la difesa.",
  },
  {
    code: "NAP",
    nome: "Napoli",
    allenatore: "Massimiliano Allegri",
    modulo: "4-3-3",
    forza: 88,
    difesa: 84,
    formazioneTipo:
      "Meret/Milinkovic-Savic; Di Lorenzo, Rrahmani, Beukema, Spinazzola; De Bruyne, Lobotka, McTominay; Politano, Hojlund, Alisson Santos",
    rigorista: "Lukaku quando è in campo, altrimenti De Bruyne davanti a Hojlund",
    piazzati: "De Bruyne",
    nota:
      "Allegri porta un 4-3-3 solido e verticale, con meno pressing e più equilibrio tra le linee. McTominay resta la prima chiamata assoluta tra i centrocampisti dopo la doppia cifra dello scorso anno.",
  },
  {
    code: "PAR",
    nome: "Parma",
    allenatore: "Carlos Cuesta",
    modulo: "4-2-3-1",
    forza: 50,
    difesa: 54,
    formazioneTipo:
      "Suzuki; Delprato, Circati, Valenti, Valeri; Keita, Bernabé; Ondrejka, Sorensen, Oristanio; Pellegrino",
    rigorista: "Pellegrino resta il primo rigorista, con Bernabé come alternativa",
    piazzati: "Bernabé",
    nota:
      "Pellegrino è inserito tra gli attaccanti di terza fascia capaci di flirtare con la doppia cifra. Ondrejka è segnalato come nome low cost da bonus.",
  },
  {
    code: "ROM",
    nome: "Roma",
    allenatore: "Gian Piero Gasperini",
    modulo: "3-4-2-1",
    forza: 82,
    difesa: 88,
    formazioneTipo:
      "Svilar; Mancini, Ndicka, Hermoso; Celik/Rensch, Cristante, Koné, Wesley; Dybala, Soulé; Malen",
    rigorista: "Malen insidia Dybala, con Soulé come terza opzione",
    piazzati: "Dybala, Soulé",
    nota:
      "La difesa più solida del campionato: Svilar è il supertop assoluto tra i pali e la scelta ideale per il modificatore. Mario Hermoso con Gasperini è tornato ai livelli dell'Atletico Madrid. Malen ha chiuso a 14 gol.",
  },
  {
    code: "SAS",
    nome: "Sassuolo",
    allenatore: "Alberto Aquilani",
    modulo: "4-3-3",
    forza: 52,
    difesa: 50,
    formazioneTipo:
      "Muric; Walukiewicz, Muharemovic, Idzes, Doig; Lipani, Matic, Adzic; Berardi, Pinamonti, Laurienté",
    rigorista: "Berardi è il rigorista principe",
    piazzati: "Berardi",
    nota:
      "Berardi è promosso in seconda fascia tra gli attaccanti. Lipani è una chiamata low cost interessante e Adzic la classica scommessa d'asta; Walukiewicz è il tappabuchi ideale in difesa.",
  },
  {
    code: "TOR",
    nome: "Torino",
    allenatore: "Ignazio Abate",
    modulo: "3-5-2",
    forza: 54,
    difesa: 58,
    formazioneTipo:
      "Israel; Coco, Maripan, Masina; Pedersen, Casadei, Ilic, Vlasic, Biraghi; Ngonge, Adams",
    rigorista: "Vlasic è il riferimento dal dischetto, con Adams come alternativa",
    piazzati: "Vlasic",
    nota:
      "Squadra da modificatore più che da bonus: gli slot granata vanno presi a prezzi bassi, evitando di pagare l'attacco.",
  },
  {
    code: "UDI",
    nome: "Udinese",
    allenatore: "Kosta Runjaic",
    modulo: "3-5-2",
    forza: 56,
    difesa: 58,
    formazioneTipo:
      "Okoye/Sava; Kristensen, Solet, Kabasele; Zanoli, Karlstrom, Ekkelenkamp, Piotrowski, Zemura; Zaniolo, Davis",
    rigorista: "Zaniolo e Davis si alternano dal dischetto",
    nota:
      "Zaniolo resta uno dei nomi più discussi del listone: rendimento discontinuo ma prezzo ormai contenuto rispetto al potenziale.",
  },
  {
    code: "VEN",
    nome: "Venezia",
    allenatore: "Giovanni Stroppa",
    modulo: "3-5-2",
    forza: 42,
    difesa: 46,
    formazioneTipo:
      "Stankovic; Sverko, Schingtienne, Marcandalli; Correia, Basic, Busio, Duncan, Haps; Yeboah, Adorante",
    rigorista: "Busio è il primo rigorista",
    piazzati: "Busio",
    neopromossa: true,
    nota:
      "Correia è tra i migliori rapporti qualità-prezzo delle neopromosse: schierato come difensore ma può giocare più avanti sull'esterno. Basic ha il posto garantito, Stankovic può essere la sorpresa tra i pali nelle leghe numerose.",
  },
];

export const SQUADRE_BY_CODE: Record<TeamCode, SquadraSerieA> = SQUADRE.reduce(
  (acc, s) => {
    acc[s.code] = s;
    return acc;
  },
  {} as Record<TeamCode, SquadraSerieA>
);

export function nomeSquadra(code: TeamCode): string {
  return SQUADRE_BY_CODE[code]?.nome ?? code;
}

/** Colori identificativi per i badge squadra. */
export const COLORI_SQUADRA: Record<TeamCode, string> = {
  ATA: "#1a5eb8",
  BOL: "#a21c2b",
  CAG: "#8d1b3d",
  COM: "#1e4fa3",
  FIO: "#6a3fa0",
  FRO: "#f2c200",
  GEN: "#b02a2a",
  INT: "#1b52c4",
  JUV: "#2b2b2b",
  LAZ: "#4aa3df",
  LEC: "#e6b422",
  MIL: "#c8102e",
  MON: "#c4172c",
  NAP: "#1a9ad6",
  PAR: "#f2d024",
  ROM: "#8e1f2f",
  SAS: "#0f7a3d",
  TOR: "#7a1f22",
  UDI: "#3a3a3a",
  VEN: "#1f6b45",
};

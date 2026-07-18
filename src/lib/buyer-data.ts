import type { Offer, Order } from "./types";

// Prospettiva del compratore corrente (demo): Officine Meccaniche Ferraris Srl.
export const BUYER = "Officine Meccaniche Ferraris Srl";

export const buyerOffers: Offer[] = [
  {
    id: "bof-1",
    lotId: "lot-001",
    buyerCompany: BUYER,
    sellerId: "co-metalfer",
    quantity: 300,
    proposedUnitPrice: 2.85,
    message: "Interessati a un ordine ricorrente trimestrale.",
    status: "In valutazione",
    date: "2026-07-15",
  },
  {
    id: "bof-2",
    lotId: "lot-009",
    buyerCompany: BUYER,
    sellerId: "co-tecnoelettra",
    quantity: 3,
    proposedUnitPrice: 590,
    message: "Proposta per 3 quadri con trasporto assicurato.",
    status: "Controproposta",
    date: "2026-07-14",
    counterUnitPrice: 615,
  },
  {
    id: "bof-3",
    lotId: "lot-007",
    buyerCompany: BUYER,
    sellerId: "co-packitalia",
    quantity: 200,
    proposedUnitPrice: 7.0,
    message: "Ritiro programmato settimanale.",
    status: "Accettata",
    date: "2026-07-11",
  },
  {
    id: "bof-4",
    lotId: "lot-011",
    buyerCompany: BUYER,
    sellerId: "co-metalfer",
    quantity: 15,
    proposedUnitPrice: 90,
    message: "Ordine per officina interna.",
    status: "Inviata",
    date: "2026-07-17",
  },
  {
    id: "bof-5",
    lotId: "lot-004",
    buyerCompany: BUYER,
    sellerId: "co-ricambipro",
    quantity: 10,
    proposedUnitPrice: 70,
    message: "Valutiamo per manutenzione flotta.",
    status: "Scaduta",
    date: "2026-06-19",
  },
];

export const buyerOrders: Order[] = [
  {
    id: "ord-2026-0139",
    lotId: "lot-001",
    lotTitle: "Cuscinetti a sfera SKF 6205-2RS — stock nuovo",
    buyerCompany: BUYER,
    sellerId: "co-metalfer",
    quantity: 200,
    unitPrice: 3.2,
    status: "Concluso",
    date: "2026-07-02",
    fulfilment: "Spedizione",
  },
  {
    id: "ord-2026-0158",
    lotId: "lot-007",
    lotTitle: "Bancali EPAL usati — 800 pezzi, buono stato",
    buyerCompany: BUYER,
    sellerId: "co-packitalia",
    quantity: 200,
    unitPrice: 7.0,
    status: "In spedizione",
    date: "2026-07-12",
    fulfilment: "Spedizione",
  },
  {
    id: "ord-2026-0161",
    lotId: "lot-010",
    lotTitle: "Sensori fotoelettrici industriali — lotto 500 pz",
    buyerCompany: BUYER,
    sellerId: "co-tecnoelettra",
    quantity: 50,
    unitPrice: 14.9,
    status: "In lavorazione",
    date: "2026-07-16",
    fulfilment: "Spedizione",
  },
  {
    id: "ord-2026-0128",
    lotId: "lot-011",
    lotTitle: "Avvitatori a batteria professionali — 60 kit",
    buyerCompany: BUYER,
    sellerId: "co-metalfer",
    quantity: 8,
    unitPrice: 96,
    status: "Concluso",
    date: "2026-06-26",
    fulfilment: "Ritiro in sede",
  },
];

export const savedLotIds = ["lot-002", "lot-005", "lot-009", "lot-012"];

export const savedSearches = [
  { id: "s1", label: "Cuscinetti · Lombardia · nuovo", results: 3, alerts: true },
  { id: "s2", label: "Quadri elettrici BT", results: 2, alerts: true },
  { id: "s3", label: "Bancali EPAL · < 8 €", results: 1, alerts: false },
];

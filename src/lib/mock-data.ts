import type {
  Appointment,
  Organization,
  QueueEntry,
  Service,
} from "./types";

export const organizations: Organization[] = [
  {
    id: "org-1",
    slug: "demo-caf",
    name: "CAF Navigli",
    category: "CAF · Patronato",
    address: "Ripa di Porta Ticinese 21",
    city: "Milano",
    description:
      "Assistenza fiscale per famiglie e lavoratori: 730, ISEE, dichiarazioni e pratiche di patronato. Prenota online e salta la fila.",
    openingHours: "Lun–Ven 9:00–13:00 / 14:30–18:00",
    queueOpen: true,
  },
  {
    id: "org-2",
    slug: "studio-brera",
    name: "Studio Dentistico Brera",
    category: "Studio medico",
    address: "Via Fiori Chiari 8",
    city: "Milano",
    description:
      "Igiene, visite di controllo e prime visite. Conferma immediata e promemoria automatici.",
    openingHours: "Lun–Sab 8:30–19:00",
    queueOpen: false,
  },
  {
    id: "org-3",
    slug: "salone-isola",
    name: "Salone Isola",
    category: "Parrucchiere",
    address: "Via Thaon di Revel 3",
    city: "Milano",
    description:
      "Taglio, colore e piega su appuntamento. Coda live per i clienti senza prenotazione.",
    openingHours: "Mar–Sab 9:00–19:30",
    queueOpen: true,
  },
];

export const services: Service[] = [
  // CAF Navigli
  {
    id: "srv-730",
    orgId: "org-1",
    name: "Dichiarazione 730",
    description: "Compilazione e invio del modello 730 con un operatore.",
    durationMin: 30,
    price: "da 45 €",
  },
  {
    id: "srv-isee",
    orgId: "org-1",
    name: "ISEE / DSU",
    description: "Rilascio attestazione ISEE per prestazioni e agevolazioni.",
    durationMin: 20,
    price: null,
  },
  {
    id: "srv-patronato",
    orgId: "org-1",
    name: "Pratica di patronato",
    description: "Pensioni, NASpI, invalidità e altre pratiche INPS.",
    durationMin: 40,
    price: null,
  },
  // Studio Brera
  {
    id: "srv-igiene",
    orgId: "org-2",
    name: "Igiene dentale",
    description: "Seduta di igiene professionale con igienista.",
    durationMin: 45,
    price: "80 €",
  },
  {
    id: "srv-visita",
    orgId: "org-2",
    name: "Prima visita",
    description: "Visita di controllo con piano di cura.",
    durationMin: 30,
    price: "Gratuita",
  },
  // Salone Isola
  {
    id: "srv-taglio",
    orgId: "org-3",
    name: "Taglio e piega",
    description: "Taglio personalizzato con piega inclusa.",
    durationMin: 45,
    price: "38 €",
  },
  {
    id: "srv-colore",
    orgId: "org-3",
    name: "Colore",
    description: "Colore radici o completo, prodotti inclusi.",
    durationMin: 90,
    price: "da 60 €",
  },
];

export const appointments: Appointment[] = [
  {
    id: "demo-appointment",
    orgId: "org-1",
    serviceId: "srv-730",
    customerName: "Giulia Ferrari",
    customerPhone: "+39 340 123 4567",
    date: "2026-07-03",
    time: "10:30",
    status: "confermato",
    ticket: null,
  },
  {
    id: "apt-002",
    orgId: "org-1",
    serviceId: "srv-isee",
    customerName: "Marco Colombo",
    customerPhone: "+39 333 987 6543",
    date: "2026-07-03",
    time: "09:20",
    status: "check-in",
    ticket: "A-041",
  },
  {
    id: "apt-003",
    orgId: "org-1",
    serviceId: "srv-patronato",
    customerName: "Anna Ricci",
    customerPhone: "+39 347 555 1122",
    date: "2026-07-03",
    time: "09:00",
    status: "in-corso",
    ticket: "A-040",
  },
  {
    id: "apt-004",
    orgId: "org-1",
    serviceId: "srv-730",
    customerName: "Luca Moretti",
    customerPhone: "+39 320 444 7788",
    date: "2026-07-03",
    time: "11:00",
    status: "confermato",
    ticket: null,
  },
  {
    id: "apt-005",
    orgId: "org-1",
    serviceId: "srv-isee",
    customerName: "Sara Greco",
    customerPhone: "+39 339 222 3344",
    date: "2026-07-03",
    time: "08:40",
    status: "completato",
    ticket: "A-038",
  },
  {
    id: "apt-006",
    orgId: "org-1",
    serviceId: "srv-730",
    customerName: "Paolo Gallo",
    customerPhone: "+39 348 666 9900",
    date: "2026-07-04",
    time: "09:30",
    status: "confermato",
    ticket: null,
  },
  {
    id: "apt-007",
    orgId: "org-1",
    serviceId: "srv-patronato",
    customerName: "Elena Fontana",
    customerPhone: "+39 331 777 5566",
    date: "2026-07-03",
    time: "12:10",
    status: "annullato",
    ticket: null,
  },
];

export const queue: QueueEntry[] = [
  {
    id: "q-1",
    orgId: "org-1",
    ticket: "A-040",
    customerName: "Anna Ricci",
    serviceId: "srv-patronato",
    joinedAt: "08:55",
    status: "in-servizio",
  },
  {
    id: "q-2",
    orgId: "org-1",
    ticket: "A-041",
    customerName: "Marco Colombo",
    serviceId: "srv-isee",
    joinedAt: "09:12",
    status: "chiamato",
  },
  {
    id: "q-3",
    orgId: "org-1",
    ticket: "A-042",
    customerName: "Davide Sala",
    serviceId: "srv-730",
    joinedAt: "09:25",
    status: "in-attesa",
  },
  {
    id: "q-4",
    orgId: "org-1",
    ticket: "A-043",
    customerName: "Chiara Villa",
    serviceId: "srv-isee",
    joinedAt: "09:38",
    status: "in-attesa",
  },
  {
    id: "q-5",
    orgId: "org-1",
    ticket: "A-044",
    customerName: "Roberto Conti",
    serviceId: "srv-730",
    joinedAt: "09:51",
    status: "in-attesa",
  },
];

// ---- Helpers -------------------------------------------------------------

export function getOrganizationBySlug(slug: string) {
  return organizations.find((o) => o.slug === slug) ?? null;
}

export function getServicesByOrg(orgId: string) {
  return services.filter((s) => s.orgId === orgId);
}

export function getServiceById(id: string) {
  return services.find((s) => s.id === id) ?? null;
}

export function getAppointmentById(id: string) {
  return appointments.find((a) => a.id === id) ?? null;
}

export function getAppointmentsByOrg(orgId: string) {
  return appointments.filter((a) => a.orgId === orgId);
}

export function getQueueByOrg(orgId: string) {
  return queue.filter((q) => q.orgId === orgId);
}

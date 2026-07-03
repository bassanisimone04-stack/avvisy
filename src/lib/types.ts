export type Organization = {
  id: string;
  slug: string;
  name: string;
  category: string;
  address: string;
  city: string;
  description: string;
  openingHours: string;
  queueOpen: boolean;
};

export type Service = {
  id: string;
  orgId: string;
  name: string;
  description: string;
  durationMin: number;
  price: string | null; // null = gratuito / non indicato
};

export type AppointmentStatus =
  | "confermato"
  | "check-in"
  | "in-corso"
  | "completato"
  | "annullato";

export type Appointment = {
  id: string;
  orgId: string;
  serviceId: string;
  customerName: string;
  customerPhone: string;
  date: string; // ISO yyyy-mm-dd
  time: string; // HH:mm
  status: AppointmentStatus;
  ticket: string | null; // assegnato al check-in, es. "A-042"
};

export type QueueStatus = "in-servizio" | "chiamato" | "in-attesa";

export type QueueEntry = {
  id: string;
  orgId: string;
  ticket: string;
  customerName: string;
  serviceId: string;
  joinedAt: string; // HH:mm
  status: QueueStatus;
};

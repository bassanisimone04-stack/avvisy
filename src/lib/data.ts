import "server-only";
import { createClient } from "@/lib/supabase/server";
import {
  getAppointmentsByOrg as mockAppointmentsByOrg,
  getOrganizationBySlug as mockOrgBySlug,
  getQueueByOrg as mockQueueByOrg,
  getServicesByOrg as mockServicesByOrg,
  organizations as mockOrgs,
} from "@/lib/mock-data";
import type {
  Appointment,
  AppointmentStatus,
  Organization,
  QueueEntry,
  QueueStatus,
  Service,
} from "@/lib/types";

/**
 * Livello dati di Avvisy.
 * Se Supabase è configurato e raggiungibile, legge dal database vero;
 * in caso contrario (chiavi assenti o rete non disponibile) ricade sui
 * dati demo, così l'app funziona sempre — anche in sviluppo.
 */

function configured() {
  return (
    !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

type OrgRow = {
  id: string;
  slug: string;
  name: string;
  category: string;
  address: string;
  city: string;
  description: string;
  opening_hours: string;
  queue_open: boolean;
  phone: string | null;
  lat: number | null;
  lng: number | null;
};

type ServiceRow = {
  id: string;
  org_id: string;
  name: string;
  description: string;
  duration_min: number;
  price: string | null;
};

function mapOrg(r: OrgRow): Organization {
  return {
    id: r.id,
    slug: r.slug,
    name: r.name,
    category: r.category,
    address: r.address,
    city: r.city,
    description: r.description,
    openingHours: r.opening_hours,
    queueOpen: r.queue_open,
    phone: r.phone ?? undefined,
    lat: r.lat ?? undefined,
    lng: r.lng ?? undefined,
  };
}

function mapService(r: ServiceRow): Service {
  return {
    id: r.id,
    orgId: r.org_id,
    name: r.name,
    description: r.description,
    durationMin: r.duration_min,
    price: r.price,
  };
}

export async function getOrganizations(): Promise<Organization[]> {
  if (!configured()) return mockOrgs;
  try {
    const sb = await createClient();
    const { data, error } = await sb
      .from("organizations")
      .select("*")
      .order("name");
    // In errore ricadiamo sui dati demo; una lista vuota reale resta vuota.
    if (error || !data) return mockOrgs;
    return (data as OrgRow[]).map(mapOrg);
  } catch {
    return mockOrgs;
  }
}

export async function getOrganizationBySlug(
  slug: string
): Promise<Organization | null> {
  if (!configured()) return mockOrgBySlug(slug);
  try {
    const sb = await createClient();
    const { data, error } = await sb
      .from("organizations")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();
    if (error || !data) return mockOrgBySlug(slug);
    return mapOrg(data as OrgRow);
  } catch {
    return mockOrgBySlug(slug);
  }
}

export async function getServicesByOrg(orgId: string): Promise<Service[]> {
  if (!configured()) return mockServicesByOrg(orgId);
  try {
    const sb = await createClient();
    const { data, error } = await sb
      .from("services")
      .select("*")
      .eq("org_id", orgId)
      .order("created_at");
    if (error || !data) return mockServicesByOrg(orgId);
    return (data as ServiceRow[]).map(mapService);
  } catch {
    return mockServicesByOrg(orgId);
  }
}

// ---------- Area gestore (dati della propria struttura) ----------

type AppointmentRow = {
  id: string;
  org_id: string;
  service_id: string | null;
  customer_name: string;
  customer_phone: string;
  appt_date: string;
  appt_time: string;
  status: AppointmentStatus;
  ticket: string | null;
};

type QueueRow = {
  id: string;
  org_id: string;
  service_id: string | null;
  ticket: string;
  customer_name: string;
  status: QueueStatus;
  joined_at: string;
};

function mapAppointment(r: AppointmentRow): Appointment {
  return {
    id: r.id,
    orgId: r.org_id,
    serviceId: r.service_id ?? "",
    customerName: r.customer_name,
    customerPhone: r.customer_phone,
    date: r.appt_date,
    time: r.appt_time,
    status: r.status,
    ticket: r.ticket,
  };
}

function mapQueue(r: QueueRow): QueueEntry {
  return {
    id: r.id,
    orgId: r.org_id,
    ticket: r.ticket,
    customerName: r.customer_name,
    serviceId: r.service_id ?? "",
    joinedAt: new Date(r.joined_at).toLocaleTimeString("it-IT", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    status: r.status,
  };
}

/** La struttura del gestore autenticato (o quella demo se Supabase è spento). */
export async function getMyOrganization(): Promise<Organization | null> {
  if (!configured()) return mockOrgs[0] ?? null;
  try {
    const sb = await createClient();
    const {
      data: { user },
    } = await sb.auth.getUser();
    if (!user) return mockOrgs[0] ?? null;
    const { data, error } = await sb
      .from("organizations")
      .select("*")
      .eq("owner_id", user.id)
      .order("created_at")
      .limit(1)
      .maybeSingle();
    if (error || !data) return mockOrgs[0] ?? null;
    return mapOrg(data as OrgRow);
  } catch {
    return mockOrgs[0] ?? null;
  }
}

export async function getAppointmentsByOrg(
  orgId: string
): Promise<Appointment[]> {
  if (!configured()) return mockAppointmentsByOrg(orgId);
  try {
    const sb = await createClient();
    const { data, error } = await sb
      .from("appointments")
      .select("*")
      .eq("org_id", orgId)
      .order("appt_time");
    if (error || !data) return mockAppointmentsByOrg(orgId);
    return (data as AppointmentRow[]).map(mapAppointment);
  } catch {
    return mockAppointmentsByOrg(orgId);
  }
}

export async function getQueueByOrg(orgId: string): Promise<QueueEntry[]> {
  if (!configured()) return mockQueueByOrg(orgId);
  try {
    const sb = await createClient();
    const { data, error } = await sb
      .from("queue_entries")
      .select("*")
      .eq("org_id", orgId)
      .order("joined_at");
    if (error || !data) return mockQueueByOrg(orgId);
    return (data as QueueRow[]).map(mapQueue);
  } catch {
    return mockQueueByOrg(orgId);
  }
}

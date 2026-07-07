import "server-only";
import { createClient } from "@/lib/supabase/server";
import {
  getOrganizationBySlug as mockOrgBySlug,
  getServicesByOrg as mockServicesByOrg,
  organizations as mockOrgs,
} from "@/lib/mock-data";
import type { Organization, Service } from "@/lib/types";

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
    if (error || !data || data.length === 0) return mockOrgs;
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

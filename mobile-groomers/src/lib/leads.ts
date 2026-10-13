import { createClient } from "@/lib/supabase/server";

export type Lead = {
  id: string;
  groomerId: string;
  name: string;
  contact: string;
  zipCode: string;
  pet: string;
  status: "new" | "forwarded" | "contacted" | "won" | "lost";
  createdAt: string;
};

type LeadRow = {
  id: string;
  groomer_id: string;
  name: string;
  contact: string;
  zip_code: string;
  pet: string;
  status: Lead["status"];
  created_at: string;
};

/**
 * Leads for the listings owned by the signed-in user. RLS restricts the rows
 * to those groomers, so no owner filter is needed here.
 */
export async function getLeadsForOwner(limit = 50): Promise<Lead[]> {
  const supabase = await createClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error || !data) return [];
  return (data as LeadRow[]).map((row) => ({
    id: row.id,
    groomerId: row.groomer_id,
    name: row.name,
    contact: row.contact,
    zipCode: row.zip_code,
    pet: row.pet,
    status: row.status,
    createdAt: row.created_at,
  }));
}

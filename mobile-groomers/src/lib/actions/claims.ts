"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Approving a claim hands a business page to a person: they can then edit
 * the listing and receive its leads. Both actions re-check admin rights
 * themselves — a server action is an HTTP endpoint, so a page-level guard
 * alone would leave it callable directly.
 */

export async function approveClaim(formData: FormData) {
  const admin = await requireAdmin();
  if (!admin) return { error: "Not authorized." };

  const claimId = String(formData.get("claimId") ?? "");
  if (!claimId) return { error: "Missing claim." };

  const db = createAdminClient();
  if (!db) return { error: "Database not configured." };

  const { data: claim } = await db
    .from("claims")
    .select("id, groomer_id, claimant, status")
    .eq("id", claimId)
    .maybeSingle();

  if (!claim) return { error: "Claim not found." };
  if (claim.status !== "pending") return { error: `Claim is already ${claim.status}.` };
  if (!claim.groomer_id) {
    return { error: "This claim is not linked to a listing yet. Link it first." };
  }

  // Refuse to reassign a listing that already has an owner. Two people can
  // file a claim on the same business, and silently transferring it would
  // hand a competitor someone else's page and their lead flow.
  const { data: listing } = await db
    .from("groomers")
    .select("id, owner, name")
    .eq("id", claim.groomer_id)
    .maybeSingle();

  if (!listing) return { error: "Listing not found." };
  if (listing.owner && listing.owner !== claim.claimant) {
    return {
      error: `${listing.name} already belongs to another account. Transfer it manually if this is a genuine handover.`,
    };
  }

  const { error: ownerError } = await db
    .from("groomers")
    .update({ owner: claim.claimant })
    .eq("id", claim.groomer_id);

  if (ownerError) return { error: ownerError.message };

  const { error: statusError } = await db
    .from("claims")
    .update({ status: "approved" })
    .eq("id", claimId);

  if (statusError) return { error: statusError.message };

  revalidatePath("/admin/claims");
  return { ok: true, listing: listing.name };
}

export async function rejectClaim(formData: FormData) {
  const admin = await requireAdmin();
  if (!admin) return { error: "Not authorized." };

  const claimId = String(formData.get("claimId") ?? "");
  const note = String(formData.get("note") ?? "").slice(0, 500);
  if (!claimId) return { error: "Missing claim." };

  const db = createAdminClient();
  if (!db) return { error: "Database not configured." };

  const { error } = await db
    .from("claims")
    .update({ status: "rejected", note })
    .eq("id", claimId)
    .eq("status", "pending");

  if (error) return { error: error.message };

  revalidatePath("/admin/claims");
  return { ok: true };
}

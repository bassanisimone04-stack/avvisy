"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

/**
 * Updates the zip codes a van covers. This is the single most valuable field
 * on a listing — it decides which local searches the business appears in — so
 * it gets its own action with strict validation.
 */
export async function updateZipCodes(formData: FormData) {
  const groomerId = String(formData.get("groomerId") ?? "");
  const raw = String(formData.get("zipCodes") ?? "");

  if (!groomerId) return { error: "Missing listing." };

  const zipCodes = Array.from(
    new Set(
      raw
        .split(/[\s,;]+/)
        .map((z) => z.trim())
        .filter(Boolean),
    ),
  );

  const invalid = zipCodes.filter((z) => !/^\d{5}$/.test(z));
  if (invalid.length) {
    return { error: `Not valid five-digit zip codes: ${invalid.join(", ")}` };
  }
  if (zipCodes.length > 200) {
    return { error: "A single van cannot cover more than 200 zip codes." };
  }

  const supabase = await createClient();
  if (!supabase) return { error: "Database not configured." };

  // RLS restricts the update to listings owned by the caller.
  const { error } = await supabase
    .from("groomers")
    .update({ zip_codes: zipCodes })
    .eq("id", groomerId);

  if (error) return { error: error.message };

  revalidatePath("/dashboard");
  return { ok: true, count: zipCodes.length };
}

"use client";

import { createClient } from "./client";

/**
 * Carica una o più immagini nel bucket "lot-images" e restituisce gli URL
 * pubblici. In modalità demo (senza Supabase) restituisce array vuoto.
 */
export async function uploadLotImages(files: File[]): Promise<string[]> {
  const supabase = createClient();
  if (!supabase || files.length === 0) return [];

  const urls: string[] = [];
  for (const file of files) {
    const ext = file.name.split(".").pop() || "jpg";
    const path = `${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage.from("lot-images").upload(path, file, {
      cacheControl: "3600",
      upsert: false,
    });
    if (!error) {
      const { data } = supabase.storage.from("lot-images").getPublicUrl(path);
      if (data?.publicUrl) urls.push(data.publicUrl);
    }
  }
  return urls;
}

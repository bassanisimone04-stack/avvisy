import { existsSync } from "node:fs";
import path from "node:path";

/**
 * Resolves a photo slot (public/images/photos/<slot>.jpg). If the licensed
 * photo has not been added yet, returns the procedural placeholder and flags it
 * so the UI can label it honestly. Server-only.
 */
export function photoOrPlaceholder(slot: string, placeholder: string) {
  const src = `/images/photos/${slot}.jpg`;
  const exists = existsSync(path.join(process.cwd(), "public", src));
  return { src: exists ? src : placeholder, isPlaceholder: !exists };
}

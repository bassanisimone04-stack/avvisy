import { notFound, permanentRedirect, redirect } from "next/navigation";
import { listAll } from "./store";

/** Used by detail routes before 404ing: honours admin-managed redirects (e.g. created automatically when a slug changes). */
export async function notFoundOrRedirect(path: string): Promise<never> {
  const hit = (await listAll("redirects")).find((r) => r.from.replace(/\/+$/, "") === path);
  if (hit && hit.to.startsWith("/") && !hit.to.startsWith("//")) (hit.permanent ? permanentRedirect : redirect)(hit.to);
  notFound();
}

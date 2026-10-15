import { notFound, permanentRedirect, redirect } from "next/navigation";
import { listAll } from "@/lib/store";

export const dynamic = "force-dynamic";

/** Lowest-priority route: resolves admin-managed redirects (e.g. after a slug change), otherwise 404. */
export default async function CatchAll({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  const path = "/" + slug.map(decodeURIComponent).join("/").replace(/\/+$/, "");
  const hit = (await listAll("redirects")).find((r) => r.from.replace(/\/+$/, "") === path);
  if (hit && hit.to.startsWith("/") && !hit.to.startsWith("//")) (hit.permanent ? permanentRedirect : redirect)(hit.to);
  notFound();
}

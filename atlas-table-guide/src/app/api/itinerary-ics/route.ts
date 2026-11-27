import { NextResponse, type NextRequest } from "next/server";
import { getDataset } from "@/db/repository";
import { buildIcs } from "@/lib/ics";
import { t } from "@/db/types";
import { SITE_URL } from "@/config/brand";
import { isLocale } from "@/i18n";

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const slug = sp.get("slug") ?? "";
  const start = sp.get("start") ?? "";
  const locale = isLocale(sp.get("locale") ?? "") ? (sp.get("locale") as "en" | "it") : "en";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(start)) return NextResponse.json({ error: "start must be YYYY-MM-DD" }, { status: 400 });
  const d = await getDataset();
  const it = d.itineraries.find((i) => i.slug === slug);
  if (!it) return NextResponse.json({ error: "unknown itinerary" }, { status: 404 });
  const name = (ref: string | undefined, type: string) => (type === "restaurant" ? d.restaurants.find((r) => r.slug === ref)?.name : type === "hotel" ? d.hotels.find((h) => h.slug === ref)?.name : type === "experience" ? d.experiences.find((x) => x.slug === ref)?.name : undefined);
  const path = (ref: string | undefined, type: string) => (ref && type !== "note" ? `${SITE_URL}/${locale}/${type}/${ref}/` : undefined);
  const events = it.days.flatMap((day) => day.items.map((item, i) => {
    const date = new Date(`${start}T12:00:00Z`);
    date.setUTCDate(date.getUTCDate() + day.day - 1);
    return { uid: `${it.slug}-${day.day}-${i}@atlas-table`, date: date.toISOString().slice(0, 10), time: item.time, durationMin: item.type === "restaurant" ? 150 : item.type === "experience" ? 180 : 60, summary: `${name(item.ref, item.type) ?? t(item.note, locale)}`, description: `${t(item.note, locale)} — not a reservation; confirm directly with the venue.`, url: path(item.ref, item.type) };
  }));
  return new NextResponse(buildIcs(t(it.title, locale), events), { headers: { "Content-Type": "text/calendar; charset=utf-8", "Content-Disposition": `attachment; filename="${it.slug}.ics"`, "X-Robots-Tag": "noindex" } });
}

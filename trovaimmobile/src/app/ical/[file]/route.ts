import { db } from "@/lib/db";
import { buildICal } from "@/lib/ical";

// Feed iCal personale dell'inserzionista con le visite prenotate (a cui abbonare Google Calendar & co.).
export async function GET(_: Request, { params }: { params: Promise<{ file: string }> }) {
  const token = (await params).file.replace(/\.ics$/, "");
  const user = db().prepare("SELECT id FROM users WHERE ical_token = ?").get(token) as { id: number } | undefined;
  if (!user) return new Response("Not found", { status: 404 });
  const visits = db()
    .prepare(
      `SELECT v.id, v.start_at, v.end_at, v.status, l.title, l.id AS listing_id, p.via, p.civico, p.comune, s.name AS seeker, s.email
         FROM visits v JOIN listings l ON l.id = v.listing_id JOIN properties p ON p.id = l.property_id JOIN users s ON s.id = v.seeker_id
        WHERE v.advertiser_id = ? AND v.start_at > strftime('%Y-%m-%dT%H:%M:%fZ','now','-30 days')`,
    )
    .all(user.id) as { id: number; start_at: string; end_at: string; status: string; title: string; listing_id: number; via: string; civico: string; comune: string; seeker: string; email: string }[];
  const body = buildICal(
    "Visite TrovaImmobile",
    visits.map((v) => ({
      uid: `visita-${v.id}@trovaimmobile`,
      start: new Date(v.start_at),
      end: new Date(v.end_at),
      summary: `Visita: ${v.title}`,
      description: `Visitatore: ${v.seeker} (${v.email})\nAnnuncio n. ${v.listing_id}`,
      location: `${v.via} ${v.civico}, ${v.comune}`,
      cancelled: v.status === "cancelled",
    })),
  );
  return new Response(body, { headers: { "Content-Type": "text/calendar; charset=utf-8", "Cache-Control": "private, max-age=300" } });
}

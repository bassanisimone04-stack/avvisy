import { sendReconfirmReminders } from "@/lib/reminders";
import { appUrl } from "@/lib/url";

// Da chiamare periodicamente (es. ogni ora) da uno scheduler esterno:
//   curl -X POST -H "Authorization: Bearer $CRON_SECRET" https://…/api/cron/reminders
export async function POST(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) return new Response("Unauthorized", { status: 401 });
  const sent = sendReconfirmReminders(await appUrl());
  return Response.json({ sent });
}

import type { QueueEntry } from "@/lib/types";
import { getServiceById } from "@/lib/mock-data";

/** Banner pubblico con il numero in servizio e l'attesa stimata: i clienti
 * vedono a colpo d'occhio a che punto è la coda. */
export default function NowServing({ queue }: { queue: QueueEntry[] }) {
  const serving = queue.find((e) => e.status === "in-servizio") ?? null;
  const waiting = queue.filter((e) => e.status !== "in-servizio");
  const wait = waiting.reduce(
    (min, e) => min + (getServiceById(e.serviceId)?.durationMin ?? 15),
    0
  );

  return (
    <div className="ticket flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-muted">
          Ora in servizio
        </p>
        <p className="font-mono text-6xl font-bold leading-none text-signal">
          {serving?.ticket ?? "—"}
        </p>
      </div>
      <div className="flex gap-8 sm:gap-6">
        <div>
          <p className="text-xs font-medium text-muted">In attesa</p>
          <p className="font-mono text-3xl font-bold">{waiting.length}</p>
        </div>
        <div>
          <p className="text-xs font-medium text-muted">Attesa stimata</p>
          <p className="font-mono text-3xl font-bold">
            {waiting.length ? `~${wait}′` : "0′"}
          </p>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";

type Props = {
  orgName: string;
  serving: string | null;
  waiting: string[];
};

export default function WaitingRoomDisplay({
  orgName,
  serving,
  waiting,
}: Props) {
  const [time, setTime] = useState("");

  useEffect(() => {
    const tick = () =>
      setTime(
        new Date().toLocaleTimeString("it-IT", {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    tick();
    const id = setInterval(tick, 10_000);
    return () => clearInterval(id);
  }, []);

  return (
    <main
      className="flex min-h-dvh flex-col p-8 text-white sm:p-12"
      style={{ backgroundColor: "#0b1418" }}
    >
      <header className="flex items-center justify-between">
        <p className="font-display text-2xl font-bold">
          {orgName}
          <span style={{ color: "#e8930c" }}>.</span>
        </p>
        <p className="font-mono text-2xl text-white/70">{time}</p>
      </header>

      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <p className="text-lg font-semibold uppercase tracking-[0.3em] text-white/60">
          Ora in servizio
        </p>
        <p
          className="mt-4 font-mono font-bold leading-none"
          style={{ color: "#f5a623", fontSize: "clamp(6rem, 22vw, 20rem)" }}
        >
          {serving ?? "—"}
        </p>
      </div>

      <footer>
        <p className="mb-4 text-center text-lg font-semibold uppercase tracking-[0.3em] text-white/60">
          Prossimi numeri
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          {waiting.length ? (
            waiting.map((t) => (
              <span
                key={t}
                className="rounded-2xl px-6 py-4 font-mono text-4xl font-bold text-white/90"
                style={{ backgroundColor: "rgba(255,255,255,0.08)" }}
              >
                {t}
              </span>
            ))
          ) : (
            <span className="text-2xl text-white/50">Nessuno in attesa</span>
          )}
        </div>
      </footer>
    </main>
  );
}

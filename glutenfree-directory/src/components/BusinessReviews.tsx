"use client";

import { useState } from "react";
import { Star, BadgeCheck, ThumbsUp } from "lucide-react";
import type { Review } from "@/lib/types";
import { formatDateIt } from "@/lib/format";
import { useStore } from "@/lib/store";

export default function BusinessReviews({ reviews }: { reviews: Review[] }) {
  const { user } = useStore();
  const [list, setList] = useState(reviews);
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [sent, setSent] = useState(false);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return;
    setList((l) => [
      { id: `local-${Date.now()}`, author: user?.name ?? "Utente GlutenFree Directory", avatarSeed: 999, rating, date: new Date().toISOString(), title, body, verifiedCeliac: true, helpful: 0 },
      ...l,
    ]);
    setTitle("");
    setBody("");
    setSent(true);
  }

  return (
    <div className="space-y-5">
      <div className="space-y-5">
        {list.map((r) => (
          <article key={r.id} className="card p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-soft text-sm font-semibold text-brand-dark">
                  {r.author.slice(0, 1)}
                </span>
                <div>
                  <p className="flex items-center gap-1.5 text-sm font-semibold text-ink">
                    {r.author}
                    {r.verifiedCeliac && <BadgeCheck size={14} className="text-brand" aria-label="Celiaco verificato" />}
                  </p>
                  <p className="text-xs text-muted">{formatDateIt(r.date)}</p>
                </div>
              </div>
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={14} className={i < r.rating ? "fill-[var(--gf-gold)] text-[var(--gf-gold)]" : "text-line-strong"} />
                ))}
              </div>
            </div>
            <p className="mt-3 font-medium text-ink">{r.title}</p>
            <p className="mt-1 text-sm leading-relaxed text-ink-soft">{r.body}</p>
            {typeof r.helpful === "number" && (
              <button type="button" className="mt-3 flex items-center gap-1.5 text-xs text-muted hover:text-brand-dark">
                <ThumbsUp size={13} /> Utile ({r.helpful})
              </button>
            )}
          </article>
        ))}
      </div>

      <form onSubmit={onSubmit} className="card card-soft space-y-3 p-5">
        <h3 className="font-semibold text-ink">Lascia una recensione</h3>
        {sent && <p className="rounded-lg bg-brand-soft px-3 py-2 text-sm text-brand-dark">Grazie! La tua recensione è stata pubblicata.</p>}
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <button key={i} type="button" onClick={() => setRating(i + 1)} aria-label={`${i + 1} stelle`}>
              <Star size={22} className={i < rating ? "fill-[var(--gf-gold)] text-[var(--gf-gold)]" : "text-line-strong"} />
            </button>
          ))}
        </div>
        <input className="field" placeholder="Titolo della recensione" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <textarea className="field" placeholder="Racconta la tua esperienza…" rows={3} value={body} onChange={(e) => setBody(e.target.value)} required />
        <button type="submit" className="btn btn-primary">Pubblica recensione</button>
      </form>
    </div>
  );
}

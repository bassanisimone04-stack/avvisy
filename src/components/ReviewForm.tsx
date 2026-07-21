"use client";

import { useState } from "react";
import { IconStar } from "./icons";

export default function ReviewForm({
  onSubmit,
}: {
  onSubmit: (rating: number, title: string, body: string) => void;
}) {
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmit(rating, title.trim(), body.trim());
    setTitle("");
    setBody("");
    setRating(5);
  }

  return (
    <form onSubmit={submit} className="card card-soft space-y-3 p-4">
      <p className="text-sm font-semibold text-ink">Lascia una recensione</p>
      <div className="flex items-center gap-1" role="radiogroup" aria-label="Valutazione">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => setRating(n)}
            onMouseEnter={() => setHover(n)}
            onMouseLeave={() => setHover(0)}
            aria-label={`${n} stelle`}
            className="p-0.5"
          >
            <IconStar
              width={22}
              height={22}
              className={(hover || rating) >= n ? "text-signal" : "text-line-strong"}
            />
          </button>
        ))}
      </div>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Titolo (es. Ottima fornitura, tutto conforme)"
        className="field"
      />
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={3}
        placeholder="Racconta la tua esperienza con questa azienda…"
        className="field resize-none"
      />
      <button type="submit" className="btn btn-primary btn-sm" disabled={!title.trim()}>
        Pubblica recensione
      </button>
    </form>
  );
}

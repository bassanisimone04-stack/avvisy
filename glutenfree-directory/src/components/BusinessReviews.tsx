"use client";

import { useRef, useState } from "react";
import { Star, BadgeCheck, ThumbsUp, ImagePlus, X } from "lucide-react";
import type { Review } from "@/lib/types";
import { formatDate } from "@/lib/format";
import { useStore } from "@/lib/store";
import { useDictionary } from "@/lib/i18n/useLocale";
import { tf } from "@/lib/i18n/dictionary";

const MAX_PHOTOS = 4;

export default function BusinessReviews({ reviews }: { reviews: Review[] }) {
  const { user } = useStore();
  const { locale, t } = useDictionary();
  const [list, setList] = useState(reviews);
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);
  const [sent, setSent] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function addPhotos(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    e.target.value = "";
    const room = MAX_PHOTOS - photos.length;
    const urls = files.slice(0, room).map((f) => URL.createObjectURL(f));
    setPhotos((p) => [...p, ...urls]);
  }

  function removePhoto(url: string) {
    setPhotos((p) => p.filter((u) => u !== url));
    URL.revokeObjectURL(url);
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return;
    setList((l) => [
      { id: `local-${Date.now()}`, author: user?.name ?? "Mappa Senza Glutine user", avatarSeed: 999, rating, date: new Date().toISOString(), title, body, verifiedCeliac: true, helpful: 0, photos: photos.length ? photos : undefined },
      ...l,
    ]);
    setTitle("");
    setBody("");
    setPhotos([]);
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
                    {r.verifiedCeliac && <BadgeCheck size={14} className="text-brand" aria-label="Verified celiac" />}
                  </p>
                  <p className="text-xs text-muted">{formatDate(r.date, locale)}</p>
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
            {r.photos && r.photos.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {r.photos.map((src, i) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={i} src={src} alt={tf(t.business.reviewPhotoAlt, { author: r.author })} className="h-16 w-16 rounded-lg object-cover" />
                ))}
              </div>
            )}
            {typeof r.helpful === "number" && (
              <button type="button" className="mt-3 flex items-center gap-1.5 text-xs text-muted hover:text-brand-dark">
                <ThumbsUp size={13} /> {t.business.helpful} ({r.helpful})
              </button>
            )}
          </article>
        ))}
      </div>

      <form onSubmit={onSubmit} className="card card-soft space-y-3 p-5">
        <h3 className="font-semibold text-ink">{t.business.leaveReview}</h3>
        {sent && <p className="rounded-lg bg-brand-soft px-3 py-2 text-sm text-brand-dark">{t.business.reviewThanks}</p>}
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <button key={i} type="button" onClick={() => setRating(i + 1)} aria-label={`${i + 1} stars`}>
              <Star size={22} className={i < rating ? "fill-[var(--gf-gold)] text-[var(--gf-gold)]" : "text-line-strong"} />
            </button>
          ))}
        </div>
        <input className="field" placeholder={t.business.reviewTitlePlaceholder} value={title} onChange={(e) => setTitle(e.target.value)} required />
        <textarea className="field" placeholder={t.business.reviewBodyPlaceholder} rows={3} value={body} onChange={(e) => setBody(e.target.value)} required />

        <div>
          <p className="field-label">{t.business.addPhotos}</p>
          <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={addPhotos} className="hidden" />
          <div className="flex flex-wrap gap-2">
            {photos.map((src) => (
              <div key={src} className="relative h-16 w-16 overflow-hidden rounded-lg">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt={t.business.reviewPhotoPreviewAlt} className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() => removePhoto(src)}
                  aria-label={t.business.removePhoto}
                  className="absolute right-0.5 top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-ink/70 text-white"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
            {photos.length < MAX_PHOTOS && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                aria-label={t.business.addPhotos}
                className="flex h-16 w-16 flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-line-strong text-muted hover:border-brand hover:text-brand-dark"
              >
                <ImagePlus size={18} />
              </button>
            )}
          </div>
          <p className="mt-1.5 text-xs text-muted">{t.business.addPhotosHint}</p>
        </div>

        <button type="submit" className="btn btn-primary">{t.business.publishReview}</button>
      </form>
    </div>
  );
}

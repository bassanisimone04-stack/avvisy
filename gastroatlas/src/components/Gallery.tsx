"use client";

import { useRef, useState } from "react";
import { Photo } from "./Photo";
import { T, type Locale } from "@/lib/i18n";

/** Photo gallery: three thumbnails open a lightbox (native <dialog>: Esc closes, focus is trapped); ← → move between photos. */
export function Gallery({ images, locale, name }: { images: { name: string; label: string }[]; locale: Locale; name: string }) {
  const t = T(locale);
  const ref = useRef<HTMLDialogElement>(null);
  const [i, setI] = useState(0);
  const open = (n: number) => { setI(n); ref.current?.showModal(); };
  const go = (d: number) => setI((x) => (x + d + images.length) % images.length);
  return (
    <>
      <div className="gallery">
        {images.map((im, n) => (
          <button key={im.name + n} type="button" data-gallery={n} aria-label={`${im.label} — ${t("open photo", "apri la foto")} ${n + 1}/${images.length}`} aria-haspopup="dialog" onClick={() => open(n)}>
            <Photo name={im.name} alt="" priority={n === 0} sizes={n === 0 ? "(min-width: 661px) 60vw, 100vw" : "(min-width: 661px) 30vw, 50vw"} />
          </button>
        ))}
      </div>
      <dialog ref={ref} className="gallery-view" aria-label={`${name}: ${images[i]?.label}`} onKeyDown={(e) => { if (e.key === "ArrowRight") go(1); if (e.key === "ArrowLeft") go(-1); }}>
        <div className="row">
          <button type="button" onClick={() => go(-1)} aria-label={t("Previous photo", "Foto precedente")}>←</button>
          <span aria-live="polite">{images[i]?.label} · {i + 1}/{images.length}</span>
          <button type="button" onClick={() => go(1)} aria-label={t("Next photo", "Foto successiva")}>→</button>
          <form method="dialog"><button aria-label={t("Close", "Chiudi")}>×</button></form>
        </div>
        {images[i] && <Photo name={images[i].name} alt={`${name}: ${images[i].label}`} sizes="(min-width: 900px) 900px, 94vw" />}
      </dialog>
    </>
  );
}

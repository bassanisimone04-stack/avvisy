"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import clsx from "clsx";
import manifest from "@/data/generated/image-manifest.json";
import { ChevronLeft, ChevronRight, CloseIcon } from "@/components/ui/icons";
import { useFocusTrap } from "../useFocusTrap";

const MAN = manifest as Record<string, { src: string; blurDataURL: string; width: number; height: number; illustrative: boolean }>;
type Img = { key: string; alt: string };

/** 1 large + 4 small mosaic (desktop), swipe carousel (mobile), accessible lightbox (←/→/Esc, focus trap). */
export function Gallery({ images, labels }: { images: Img[]; labels: { open: string; photoOf: string; close: string; prev: string; next: string; illustrative: string; gallery: string } }) {
  const [open, setOpen] = useState<number | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const close = useCallback(() => setOpen(null), []);
  useFocusTrap(ref, open !== null, close);
  const src = (k: string) => MAN[k] ?? { src: `/images/generated/${k}.webp`, blurDataURL: "", width: 1200, height: 900, illustrative: false };
  const label = (i: number) => labels.open.replace("{n}", String(i + 1)).replace("{total}", String(images.length));
  const tile = (img: Img, i: number, cls: string, sizes: string, priority = false) => (
    <div key={img.key + i} className={clsx("group relative overflow-hidden rounded-[12px] bg-sand", cls)}>
      <button type="button" onClick={() => setOpen(i)} className="absolute inset-0 z-[1] h-full w-full" aria-label={label(i)}>
        <Image src={src(img.key).src} alt={img.alt} fill sizes={sizes} priority={priority} quality={priority ? 60 : 75} fetchPriority={priority ? "high" : undefined} placeholder={src(img.key).blurDataURL ? "blur" : "empty"} blurDataURL={src(img.key).blurDataURL || undefined} className="object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
      </button>
      {i === 0 && src(img.key).illustrative && <span className="pointer-events-none absolute bottom-2 left-2 z-[2] rounded-[4px] bg-ink/70 px-1.5 py-0.5 text-[11px] text-white">{labels.illustrative}</span>}
    </div>
  );
  return (
    <section aria-label={labels.gallery}>
      <div className="hidden h-[440px] grid-cols-4 grid-rows-2 gap-2 md:grid">
        {images[0] && tile(images[0], 0, "col-span-2 row-span-2", "(min-width:1232px) 600px, 50vw", true)}
        {images.slice(1, 5).map((im, i) => tile(im, i + 1, "", "(min-width:1232px) 300px, 25vw"))}
      </div>
      <div className="scroll-snap-x -mx-4 flex gap-2 overflow-x-auto px-4 md:hidden">
        {images.map((im, i) => tile(im, i, "aspect-[4/3] w-[88%] shrink-0", "88vw", i === 0))}
      </div>
      {open !== null && images[open] && (
        <div ref={ref} role="dialog" aria-modal="true" aria-label={labels.photoOf.replace("{n}", String(open + 1)).replace("{total}", String(images.length))} className="fixed inset-0 z-[85] flex flex-col bg-ink/95 text-white"
          onKeyDown={(e) => { if (e.key === "ArrowRight") setOpen((o) => ((o ?? 0) + 1) % images.length); if (e.key === "ArrowLeft") setOpen((o) => ((o ?? 0) - 1 + images.length) % images.length); }}>
          <div className="flex items-center justify-between p-3">
            <p className="text-sm" aria-live="polite">{labels.photoOf.replace("{n}", String(open + 1)).replace("{total}", String(images.length))}</p>
            <button type="button" onClick={close} className="grid h-11 w-11 place-items-center rounded-full hover:bg-white/10" aria-label={labels.close} data-autofocus><CloseIcon /></button>
          </div>
          <div className="relative flex-1">
            <Image src={src(images[open].key).src} alt={images[open].alt} fill sizes="100vw" className="object-contain" />
          </div>
          <p className="p-3 text-center text-sm text-white/90">{images[open].alt}</p>
          <div className="flex justify-center gap-3 pb-4">
            <button type="button" onClick={() => setOpen((open - 1 + images.length) % images.length)} className="grid h-11 w-11 place-items-center rounded-full border border-white/40 hover:bg-white/10" aria-label={labels.prev}><ChevronLeft /></button>
            <button type="button" onClick={() => setOpen((open + 1) % images.length)} className="grid h-11 w-11 place-items-center rounded-full border border-white/40 hover:bg-white/10" aria-label={labels.next}><ChevronRight /></button>
          </div>
        </div>
      )}
    </section>
  );
}

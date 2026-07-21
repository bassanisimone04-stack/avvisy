"use client";

import { useState } from "react";
import LotImage from "./LotImage";

// Galleria: foto reali se presenti, altrimenti variazioni dell'illustrazione.
export default function LotGallery({
  category,
  seed,
  imageUrls,
}: {
  category: string;
  seed: number;
  imageUrls?: string[];
}) {
  const hasPhotos = !!imageUrls && imageUrls.length > 0;
  const items = hasPhotos ? imageUrls! : [seed, seed + 1, seed + 2, seed + 3];
  const [active, setActive] = useState(0);

  return (
    <div>
      <div className="card overflow-hidden">
        {hasPhotos ? (
          <div className="aspect-[16/10] overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={imageUrls![active]} alt="Foto del lotto" className="h-full w-full object-cover" />
          </div>
        ) : (
          <LotImage category={category} seed={items[active] as number} ratio="aspect-[16/10]" />
        )}
      </div>
      {items.length > 1 && (
        <div className="mt-3 grid grid-cols-4 gap-3">
          {items.map((it, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`overflow-hidden rounded-lg border-2 transition-colors ${
                active === i ? "border-brand" : "border-transparent hover:border-line-strong"
              }`}
              aria-label={`Foto ${i + 1}`}
            >
              {hasPhotos ? (
                <div className="aspect-[4/3] overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={it as string} alt="" className="h-full w-full object-cover" />
                </div>
              ) : (
                <LotImage category={category} seed={it as number} ratio="aspect-[4/3]" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

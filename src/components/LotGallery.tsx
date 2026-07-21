"use client";

import { useState } from "react";
import LotImage from "./LotImage";
import LotPhoto from "./LotPhoto";

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
          <LotPhoto url={imageUrls![active]} category={category} seed={seed} ratio="aspect-[16/10]" />
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
                <LotPhoto url={it as string} category={category} seed={seed + i} ratio="aspect-[4/3]" />
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

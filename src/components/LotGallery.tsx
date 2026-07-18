"use client";

import { useState } from "react";
import LotImage from "./LotImage";
import type { CategorySlug } from "@/lib/types";

// Galleria simulata: variazioni della stessa illustrazione industriale.
export default function LotGallery({
  category,
  seed,
}: {
  category: CategorySlug;
  seed: number;
}) {
  const seeds = [seed, seed + 1, seed + 2, seed + 3];
  const [active, setActive] = useState(0);
  return (
    <div>
      <div className="card overflow-hidden">
        <LotImage
          category={category}
          seed={seeds[active]}
          ratio="aspect-[16/10]"
        />
      </div>
      <div className="mt-3 grid grid-cols-4 gap-3">
        {seeds.map((s, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={`overflow-hidden rounded-lg border-2 transition-colors ${
              active === i ? "border-brand" : "border-transparent hover:border-line-strong"
            }`}
            aria-label={`Foto ${i + 1}`}
          >
            <LotImage category={category} seed={s} ratio="aspect-[4/3]" />
          </button>
        ))}
      </div>
    </div>
  );
}

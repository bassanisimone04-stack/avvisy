"use client";

import { useState } from "react";
import LotImage from "./LotImage";

/**
 * Mostra una foto reale del lotto. Se l'URL non è caricabile (bucket non
 * pubblico, file rimosso, rete), ripiega automaticamente sull'illustrazione
 * generata invece di lasciare un riquadro grigio "rotto".
 */
export default function LotPhoto({
  url,
  category,
  seed,
  className = "",
  ratio = "aspect-[4/3]",
  alt = "Foto del lotto",
}: {
  url: string;
  category: string;
  seed: number;
  className?: string;
  ratio?: string;
  alt?: string;
}) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return <LotImage category={category} seed={seed} className={className} ratio={ratio} />;
  }

  return (
    <div className={`relative overflow-hidden ${ratio} ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={url}
        alt={alt}
        className="h-full w-full object-cover"
        loading="lazy"
        onError={() => setFailed(true)}
      />
    </div>
  );
}

"use client";

import { useState } from "react";
import Image from "next/image";
import PlaceholderImage from "./PlaceholderImage";

export default function CoverPhoto({
  photoUrl,
  seed,
  variant = "default",
  className = "",
  ratio = "aspect-[4/3]",
  label,
  tint,
  sizes = "(max-width: 768px) 100vw, 50vw",
  priority = false,
}: {
  photoUrl: string;
  seed: number;
  variant?: string;
  className?: string;
  ratio?: string;
  label?: string;
  tint?: { soft: string; accent: string; bg1: string; bg2: string };
  sizes?: string;
  priority?: boolean;
}) {
  const [errored, setErrored] = useState(false);

  if (errored) {
    return <PlaceholderImage seed={seed} variant={variant} label={label} ratio={ratio} className={className} tint={tint} />;
  }

  return (
    <div className={`relative overflow-hidden ${ratio} ${className}`}>
      <Image
        src={photoUrl}
        alt={label ?? ""}
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover"
        onError={() => setErrored(true)}
      />
    </div>
  );
}

"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { HERO_COLLAGE_PHOTOS } from "@/lib/cover-photos";

interface Card {
  url: string;
  alt: string;
  depth: number;
  className: string;
}

const CARDS: Card[] = [
  { url: HERO_COLLAGE_PHOTOS.pizza, alt: "Pizza senza glutine", depth: 18, className: "left-0 top-6 h-36 w-44 -rotate-6 sm:h-44 sm:w-56" },
  { url: HERO_COLLAGE_PHOTOS.pasta, alt: "Pasta fresca senza glutine", depth: 30, className: "left-[38%] top-0 h-40 w-48 rotate-3 sm:h-52 sm:w-64" },
  { url: HERO_COLLAGE_PHOTOS.restaurantTable, alt: "Ristorante gluten free", depth: 12, className: "right-0 top-10 h-32 w-40 rotate-6 sm:h-40 sm:w-52" },
];

function PhotoCard({ card, offset }: { card: Card; offset: { x: number; y: number } }) {
  const [errored, setErrored] = useState(false);
  return (
    <div className={`absolute overflow-hidden rounded-2xl border-4 border-white shadow-xl transition-transform duration-300 ease-out hover:z-20 hover:!rotate-0 hover:!scale-110 ${card.className}`}>
      <div
        className="relative h-full w-full transition-transform duration-150 ease-out"
        style={{ transform: `translate(${offset.x * card.depth}px, ${offset.y * card.depth}px)` }}
      >
        {errored ? (
          <div className="h-full w-full bg-brand-soft" />
        ) : (
          <Image src={card.url} alt={card.alt} fill sizes="300px" className="object-cover" onError={() => setErrored(true)} />
        )}
      </div>
    </div>
  );
}

export default function HeroPhotoCollage({ label }: { label: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = wrapRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setOffset({
      x: (e.clientX - rect.left) / rect.width - 0.5,
      y: (e.clientY - rect.top) / rect.height - 0.5,
    });
  }

  function handleMouseLeave() {
    setOffset({ x: 0, y: 0 });
  }

  return (
    <div
      ref={wrapRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      role="img"
      aria-label={label}
      className="relative mx-auto h-56 w-full max-w-lg sm:h-64"
    >
      {CARDS.map((card, i) => (
        <PhotoCard key={i} card={card} offset={offset} />
      ))}
    </div>
  );
}

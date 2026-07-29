"use client";

import { useRef, useState } from "react";
import BrandLeaf from "./BrandLeaf";

export default function HeroBrandMark({ label }: { label: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = wrapRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width - 0.5;
    const relY = (e.clientY - rect.top) / rect.height - 0.5;
    setOffset({ x: relX * 16, y: relY * 16 });
  }

  function handleMouseLeave() {
    setOffset({ x: 0, y: 0 });
  }

  return (
    <div
      ref={wrapRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="brand-mark-float mx-auto flex h-24 w-24 cursor-pointer items-center justify-center sm:h-28 sm:w-28"
      role="img"
      aria-label={label}
    >
      <div
        style={{ transform: `translate(${offset.x}px, ${offset.y}px)`, transition: "transform 0.15s ease-out" }}
        className="drop-shadow-lg"
      >
        <BrandLeaf size={96} />
      </div>
    </div>
  );
}

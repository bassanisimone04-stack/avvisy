"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import type { ComponentProps } from "react";

const InteractiveMap = dynamic(() => import("./InteractiveMap"), {
  ssr: false,
  loading: () => <div className="h-full w-full animate-pulse bg-brand-soft" />,
});

/**
 * Carica Leaflet, il suo CSS e le tile OpenStreetMap solo quando la mappa sta
 * per entrare nello schermo: chi non scorre fin lì non scarica nulla.
 */
export default function LazyInteractiveMap(props: ComponentProps<typeof InteractiveMap>) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || visible) return;
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisible(true);
          io.disconnect();
        }
      },
      { rootMargin: "300px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [visible]);

  return (
    <div ref={ref} className="h-full w-full">
      {visible ? <InteractiveMap {...props} /> : <div className="h-full w-full animate-pulse bg-brand-soft" />}
    </div>
  );
}

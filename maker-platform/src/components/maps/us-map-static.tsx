import { geoAlbersUsa } from "d3-geo";
import Image from "next/image";
import { cn } from "@/lib/utils";

/** Same projection as us-atlas "albers" files (975×610). */
const projection = geoAlbersUsa().scale(1300).translate([487.5, 305]);

export interface StaticPin {
  id: string;
  lat: number;
  lng: number;
  label?: string;
  count?: number;
}

/**
 * Lightweight, JS-free US map (pre-rendered SVG + positioned pins). Used where
 * a full interactive map would be too heavy (homepage, cards).
 */
export function UsMapStatic({ pins, className, showLabels = true }: { pins: StaticPin[]; className?: string; showLabels?: boolean }) {
  return (
    <div className={cn("relative aspect-[975/610] w-full", className)}>
      <Image src="/images/maps/us-states.svg" alt="" fill unoptimized className="select-none" />
      {pins.map((p) => {
        const xy = projection([p.lng, p.lat]);
        if (!xy) return null;
        const [x, y] = xy;
        return (
          <div key={p.id} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${(x / 975) * 100}%`, top: `${(y / 610) * 100}%` }}>
            <span className="relative flex items-center">
              <span className="absolute inline-flex size-8 -translate-x-1/2 left-1/2 animate-ping rounded-full bg-clay/25 [animation-duration:2.8s] motion-reduce:hidden" aria-hidden />
              <span className="nums relative grid size-7 place-items-center rounded-full border-2 border-white bg-forest text-[0.6875rem] font-semibold text-ivory shadow-soft">
                {p.count ?? ""}
              </span>
            </span>
            {showLabels && p.label ? (
              <span className="absolute top-1/2 left-full ml-2 -translate-y-1/2 rounded-xs bg-white/95 px-1.5 py-0.5 text-[0.6875rem] font-medium whitespace-nowrap text-forest shadow-hairline">
                {p.label}
              </span>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

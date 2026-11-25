import Image from "next/image";
import type { Product } from "@/features/catalog/types";
import { cn } from "@/lib/utils";
import { IsoDrawing } from "./iso-drawing";

/**
 * Product visual: an isometric drawing on a drafting sheet, with a material
 * swatch and an engineering-style title block. Original, data-driven artwork.
 */
export function PlanSheet({
  product,
  className,
  size = "md",
  showTitleBlock = true,
  priority = false,
}: {
  product: Product;
  className?: string;
  size?: "sm" | "md" | "lg";
  showTitleBlock?: boolean;
  priority?: boolean;
}) {
  const sheetNo = String(product.slug.length % 9 + 1).padStart(2, "0");
  return (
    <div
      className={cn(
        "relative isolate overflow-hidden bg-[#FBFAF6]",
        "bg-[linear-gradient(to_right,rgb(38_59_50/0.045)_1px,transparent_1px),linear-gradient(to_bottom,rgb(38_59_50/0.045)_1px,transparent_1px)]",
        size === "lg" ? "bg-[size:28px_28px]" : "bg-[size:18px_18px]",
        className,
      )}
    >
      <div className={cn("absolute inset-0", size === "lg" ? "p-[10%]" : "p-[12%] pb-[16%]")}>
        <IsoDrawing parts={product.drawing} title={product.title} />
      </div>

      {/* material swatch */}
      <div
        className={cn(
          "absolute overflow-hidden rounded-full ring-1 ring-black/10 shadow-soft",
          size === "lg" ? "top-6 right-6 size-16" : "top-3.5 right-3.5 size-9",
        )}
      >
        <Image src={product.cover} alt="" fill sizes="64px" className="object-cover" priority={priority} />
      </div>

      {showTitleBlock ? (
        <div
          className={cn(
            "absolute bottom-0 left-0 flex items-stretch border-t border-r border-forest/25 bg-[#FBFAF6]/95 font-mono text-forest/70 uppercase",
            size === "lg" ? "text-[0.6875rem]" : "text-[0.5625rem]",
          )}
          aria-hidden
        >
          <span className="border-r border-forest/25 px-2 py-1 tracking-[0.12em]">Sheet {sheetNo}</span>
          <span className="border-r border-forest/25 px-2 py-1 tracking-[0.12em]">NTS</span>
          <span className="px-2 py-1 tracking-[0.12em]">{product.formats.slice(0, 3).join(" · ")}</span>
        </div>
      ) : null}
    </div>
  );
}

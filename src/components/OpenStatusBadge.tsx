"use client";

import { useEffect, useState } from "react";
import { computeOpenStatus, type OpenStatus } from "@/lib/hours";
import { cn } from "@/lib/utils";

/** Badge "Aperto/Chiuso" calcolato dall'ora locale del cliente. Viene
 * calcolato dopo il mount per evitare disallineamenti con il render sul server. */
export default function OpenStatusBadge({
  openingHours,
}: {
  openingHours: string;
}) {
  const [status, setStatus] = useState<OpenStatus | null>(null);

  useEffect(() => {
    setStatus(computeOpenStatus(openingHours, new Date()));
  }, [openingHours]);

  if (!status) return null;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-semibold",
        status.open
          ? "bg-brand-soft text-brand-dark"
          : "bg-canvas text-muted"
      )}
    >
      <span
        aria-hidden
        className={cn(
          "h-2 w-2 rounded-full",
          status.open ? "bg-brand" : "bg-muted"
        )}
      />
      {status.label}
    </span>
  );
}

"use client";

import { useState } from "react";
import type { Organization } from "@/lib/types";

export default function OrgQuickActions({ org }: { org: Organization }) {
  const [shared, setShared] = useState(false);

  const mapsUrl =
    org.lat != null && org.lng != null
      ? `https://www.google.com/maps/search/?api=1&query=${org.lat},${org.lng}`
      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
          `${org.address}, ${org.city}`
        )}`;

  async function share() {
    const url = typeof window !== "undefined" ? window.location.href : "";
    try {
      if (navigator.share) {
        await navigator.share({ title: org.name, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setShared(true);
      setTimeout(() => setShared(false), 2000);
    } catch {
      /* condivisione annullata */
    }
  }

  const cls =
    "inline-flex items-center gap-1.5 rounded-full border border-line bg-card px-4 py-2 text-sm font-semibold text-ink transition-colors hover:border-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand";

  return (
    <div className="flex flex-wrap gap-2">
      {org.phone && (
        <a href={`tel:${org.phone.replace(/\s/g, "")}`} className={cls}>
          📞 Chiama
        </a>
      )}
      <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className={cls}>
        📍 Indicazioni
      </a>
      <button type="button" onClick={share} className={cls}>
        {shared ? "Link copiato ✓" : "↗ Condividi"}
      </button>
    </div>
  );
}

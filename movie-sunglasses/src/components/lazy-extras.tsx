"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { parkEvent } from "@/lib/client-store";

const ConsentManager = dynamic(() => import("./consent").then((m) => m.ConsentManager), { ssr: false });
const CommandPalette = dynamic(() => import("./command-palette").then((m) => m.CommandPalette), { ssr: false });
const CompareTray = dynamic(() => import("./tray").then((m) => m.CompareTray), { ssr: false });

const TRIGGERS = ["keydown", "pointerdown"];
const PARKED = ["ss-open-search", "ss-open-consent"];

/**
 * Non-critical client features (cookie banner, search palette, compare tray) load after the page is interactive:
 * on browser idle, or immediately on the first key press, pointer press or search/cookie request.
 * Requests made before they mounted are parked and replayed by the component itself.
 */
export function LazyExtras() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let done = false;
    const detachEarly = () => { for (const t of TRIGGERS) window.removeEventListener(t, early); };
    function early(e: Event) {
      if (done) return;
      if (e.type === "keydown") {
        // Only the search shortcuts are claimed, and never while the user is typing in a field.
        const k = e as KeyboardEvent, t = k.target as HTMLElement | null;
        const typing = !!t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName));
        const combo = k.key === "k" && (k.metaKey || k.ctrlKey);
        if (combo || (k.key === "/" && !typing && !k.metaKey && !k.ctrlKey && !k.altKey)) { parkEvent("ss-open-search"); k.preventDefault(); }
      }
      done = true; detachEarly(); setReady(true);
    }
    // Requests for the palette/banner are parked until THEIR component mounts (the chunk may still be loading).
    const park = (e: Event) => { parkEvent(e.type); setReady(true); };
    const hasIdle = "requestIdleCallback" in window;
    const idle = hasIdle ? window.requestIdleCallback(() => early(new Event("idle")), { timeout: 1200 }) : window.setTimeout(() => early(new Event("idle")), 600);
    for (const t of TRIGGERS) window.addEventListener(t, early);
    for (const t of PARKED) window.addEventListener(t, park);
    return () => { done = true; detachEarly(); for (const t of PARKED) window.removeEventListener(t, park); if (hasIdle) window.cancelIdleCallback(idle); else clearTimeout(idle); };
  }, []);
  if (!ready) return null;
  return (<><ConsentManager /><CommandPalette /><CompareTray /></>);
}

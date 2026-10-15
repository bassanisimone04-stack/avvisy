"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { parkEvent } from "@/lib/client-store";

const ConsentManager = dynamic(() => import("./consent").then((m) => m.ConsentManager), { ssr: false });
const CommandPalette = dynamic(() => import("./command-palette").then((m) => m.CommandPalette), { ssr: false });
const CompareTray = dynamic(() => import("./tray").then((m) => m.CompareTray), { ssr: false });

const EARLY = ["keydown", "pointerdown", "ss-open-search", "ss-open-consent"];

/**
 * Non-critical client features (cookie banner, search palette, compare tray) load after the page is interactive:
 * on browser idle, or immediately on the first key press, pointer press or search/cookie request.
 * Requests made before they mounted are parked and replayed by the component itself.
 */
export function LazyExtras() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const go = () => setReady(true);
    const early = (e: Event) => {
      if (e.type === "ss-open-search" || e.type === "ss-open-consent") parkEvent(e.type);
      else if (e.type === "keydown") { const k = e as KeyboardEvent; if ((k.key === "k" && (k.metaKey || k.ctrlKey)) || k.key === "/") { parkEvent("ss-open-search"); k.preventDefault(); } }
      go();
    };
    const hasIdle = "requestIdleCallback" in window;
    const idle = hasIdle ? window.requestIdleCallback(go, { timeout: 1200 }) : window.setTimeout(go, 600);
    for (const t of EARLY) window.addEventListener(t, early);
    return () => { if (hasIdle) window.cancelIdleCallback(idle); else clearTimeout(idle); for (const t of EARLY) window.removeEventListener(t, early); };
  }, []);
  if (!ready) return null;
  return (<><ConsentManager /><CommandPalette /><CompareTray /></>);
}

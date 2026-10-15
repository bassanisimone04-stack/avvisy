"use client";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { SearchBox } from "./search-box";
import { consumePending } from "@/lib/client-store";

/** Global search overlay: press "/" or Ctrl/⌘+K anywhere. */
export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const path = usePathname();
  const returnTo = useRef<HTMLElement | null>(null);
  useEffect(() => setOpen(false), [path]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      const typing = !!t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName));
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && !typing && !e.metaKey && !e.ctrlKey)) {
        e.preventDefault();
        returnTo.current = document.activeElement as HTMLElement | null;
        setOpen(true);
      } else if (e.key === "Escape") setOpen(false);
    };
    const onOpen = () => { returnTo.current = document.activeElement as HTMLElement | null; setOpen(true); };
    window.addEventListener("keydown", onKey);
    window.addEventListener("ss-open-search", onOpen);
    if (consumePending("ss-open-search")) onOpen();
    return () => { window.removeEventListener("keydown", onKey); window.removeEventListener("ss-open-search", onOpen); };
  }, []);
  useEffect(() => {
    if (!open) { returnTo.current?.focus?.(); return; }
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [open]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center bg-ink/60 px-4 pt-[12vh] backdrop-blur-sm" onMouseDown={(e) => { if (e.target === e.currentTarget) setOpen(false); }}>
      <div role="dialog" aria-modal="true" aria-label="Search" className="w-full max-w-xl rounded-2xl bg-paper p-4 shadow-2xl">
        <SearchBox autoFocus onNavigate={() => setOpen(false)} />
        <p className="mt-3 flex justify-between px-2 text-xs text-mist"><span>↑↓ to move · Enter to open</span><span>Esc to close</span></p>
      </div>
    </div>
  );
}

export function SearchTrigger({ className = "" }: { className?: string }) {
  return (
    <button type="button" onClick={() => window.dispatchEvent(new Event("ss-open-search"))} aria-label="Search (press / or Ctrl+K)" className={className}>
      <svg aria-hidden width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" strokeLinecap="round" /></svg>
    </button>
  );
}

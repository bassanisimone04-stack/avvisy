"use client";
import { useEffect, type RefObject } from "react";

/** Traps Tab focus inside `ref` while active, closes on Escape, restores focus on close. */
export function useFocusTrap(ref: RefObject<HTMLElement | null>, active: boolean, onClose: () => void) {
  useEffect(() => {
    if (!active) return;
    const prev = document.activeElement as HTMLElement | null;
    const el = ref.current;
    const sel = 'a[href],button:not([disabled]),input:not([disabled]),select,textarea,[tabindex]:not([tabindex="-1"])';
    const first = () => el?.querySelectorAll<HTMLElement>(sel)[0];
    (el?.querySelector<HTMLElement>("[data-autofocus]") ?? first())?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { e.preventDefault(); onClose(); return; }
      if (e.key !== "Tab" || !el) return;
      // Tab reaches only the checked radio of a group, so skip its unchecked siblings when finding the edges.
      const items = [...el.querySelectorAll<HTMLElement>(sel)].filter((x) => x.offsetParent !== null && !(x instanceof HTMLInputElement && x.type === "radio" && !x.checked && el.querySelector(`input[type="radio"][name="${CSS.escape(x.name)}"]:checked`)));
      if (!items.length) return;
      const f = items[0]!, l = items[items.length - 1]!;
      if (e.shiftKey && document.activeElement === f) { e.preventDefault(); l.focus(); }
      else if (!e.shiftKey && document.activeElement === l) { e.preventDefault(); f.focus(); }
    };
    document.addEventListener("keydown", onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = overflow; prev?.focus?.(); };
  }, [active, onClose, ref]);
}

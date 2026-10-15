"use client";
import { useEffect, useRef, useTransition } from "react";
import { useRouter } from "next/navigation";

/**
 * Filter form that updates results as you change a field (debounced for text), by rewriting the URL.
 * Without JavaScript it is a plain GET form with a visible submit button, so filters stay shareable and crawl-safe.
 */
export function LiveForm({ action, className, label, children }: { action: string; className?: string; label: string; children: React.ReactNode }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => {
    const el = document.getElementById("results");
    if (!el) return;
    el.style.opacity = pending ? "0.45" : "1";
    el.setAttribute("aria-busy", String(pending));
  }, [pending]);
  const submit = (form: HTMLFormElement) => {
    const sp = new URLSearchParams();
    for (const [k, v] of new FormData(form).entries()) if (typeof v === "string" && v.trim()) sp.set(k, v.trim());
    const qs = sp.toString();
    start(() => router.replace(qs ? `${action}?${qs}` : action, { scroll: false }));
  };
  return (
    <form action={action} method="get" aria-label={label} className={className}
      onChange={(e) => {
        const f = e.currentTarget, t = e.target as HTMLElement;
        clearTimeout(timer.current);
        if (t instanceof HTMLInputElement && (t.type === "search" || t.type === "text")) timer.current = setTimeout(() => submit(f), 280);
        else submit(f);
      }}
      onSubmit={(e) => { e.preventDefault(); clearTimeout(timer.current); submit(e.currentTarget); }}>
      {children}
      <span role="status" className="sr-only">{pending ? "Updating results" : ""}</span>
    </form>
  );
}

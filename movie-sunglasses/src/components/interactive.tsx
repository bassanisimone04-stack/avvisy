"use client";
import { useEffect, useRef, useState } from "react";
import { COMPARE_KEY, COMPARE_MAX, SAVED_KEY, toggleId, useList } from "@/lib/client-store";

/** Hero art that leans toward the pointer. Disabled for touch and reduced motion. */
export function TiltStage({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || matchMedia("(prefers-reduced-motion: reduce)").matches || matchMedia("(pointer: coarse)").matches) return;
    let raf = 0;
    const move = (e: PointerEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const x = e.clientX / window.innerWidth - 0.5, y = e.clientY / window.innerHeight - 0.5;
        el.style.transform = `perspective(900px) rotateY(${x * 16}deg) rotateX(${-y * 10}deg)`;
      });
    };
    const leave = () => { el.style.transform = ""; };
    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerleave", leave);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("pointermove", move); document.removeEventListener("pointerleave", leave); };
  }, []);
  return <div ref={ref} className={className} style={{ transition: "transform .25s ease-out", willChange: "transform" }}>{children}</div>;
}

export function ReadingProgress() {
  const [p, setP] = useState(0);
  useEffect(() => {
    let raf = 0;
    const on = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const el = document.querySelector("article");
        if (!el) return;
        const r = el.getBoundingClientRect();
        const total = r.height - window.innerHeight * 0.6;
        setP(Math.min(1, Math.max(0, -r.top / Math.max(total, 1))));
      });
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("scroll", on); window.removeEventListener("resize", on); };
  }, []);
  return <div aria-hidden className="fixed inset-x-0 top-0 z-50 h-[3px] bg-transparent"><div className="h-full origin-left bg-champagne" style={{ transform: `scaleX(${p})` }} /></div>;
}

export function ArticleToc({ items }: { items: { id: string; text: string }[] }) {
  const [active, setActive] = useState(items[0]?.id ?? "");
  useEffect(() => {
    const els = items.map((i) => document.getElementById(i.id)).filter((e): e is HTMLElement => !!e);
    if (!els.length || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver((entries) => {
      const vis = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
      if (vis) setActive(vis.target.id);
    }, { rootMargin: "-80px 0px -65% 0px" });
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, [items]);
  if (items.length < 3) return null;
  return (
    <nav aria-label="On this page" className="sticky top-24 hidden text-sm lg:block">
      <p className="eyebrow mb-3">On this page</p>
      <ul className="space-y-1 border-l border-line">
        {items.map((i) => (
          <li key={i.id}><a href={`#${i.id}`} aria-current={active === i.id ? "true" : undefined}
            className={`-ml-px block border-l-2 py-1 pl-4 transition-colors ${active === i.id ? "border-champagne font-medium text-ink" : "border-transparent text-slate hover:text-ink"}`}>{i.text}</a></li>
        ))}
      </ul>
    </nav>
  );
}

export function ShareButton({ title, className = "" }: { title: string; className?: string }) {
  const [state, setState] = useState<"" | "copied" | "failed">("");
  const share = async () => {
    const url = location.href.split("#")[0];
    try {
      if (navigator.share) { await navigator.share({ title, url }); return; }
      await navigator.clipboard.writeText(url);
      setState("copied");
    } catch (e) { if ((e as Error).name !== "AbortError") setState("failed"); }
    setTimeout(() => setState(""), 2200);
  };
  return (
    <>
      <button type="button" onClick={share} className={className || "rounded-full border border-ink/25 px-4 py-1.5 text-xs font-medium hover:bg-ink hover:text-white"}>Share</button>
      <span role="status" className="ml-2 text-xs text-slate">{state === "copied" ? "Link copied" : state === "failed" ? "Copy the address bar instead" : ""}</span>
    </>
  );
}

/** Appears once the hero has scrolled away: keeps name, compare and save within reach. */
export function StickyModelBar({ id, name, sentinelId = "model-hero" }: { id: string; name: string; sentinelId?: string }) {
  const [show, setShow] = useState(false);
  const saved = useList(SAVED_KEY).includes(id);
  const compared = useList(COMPARE_KEY).includes(id);
  useEffect(() => {
    const el = document.getElementById(sentinelId);
    if (!el || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(([e]) => setShow(!e.isIntersecting && e.boundingClientRect.top < 0), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, [sentinelId]);
  return (
    <div aria-hidden={!show} className={`fixed inset-x-0 top-16 z-30 border-b border-line bg-paper/95 backdrop-blur transition-transform duration-300 ${show ? "translate-y-0" : "-translate-y-[130%]"}`}>
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-5 py-2 sm:px-8">
        <p className="min-w-0 flex-1 truncate font-display text-xl font-semibold">{name}</p>
        <button type="button" tabIndex={show ? 0 : -1} aria-pressed={saved} onClick={() => toggleId(SAVED_KEY, id)} className={`rounded-full border px-4 py-1.5 text-xs font-medium ${saved ? "border-champagne bg-champagne-light text-champagne-text" : "border-line"}`}>{saved ? "Saved" : "Save"}</button>
        <button type="button" tabIndex={show ? 0 : -1} aria-pressed={compared} onClick={() => toggleId(COMPARE_KEY, id, COMPARE_MAX)} className={`hidden rounded-full border px-4 py-1.5 text-xs font-medium sm:block ${compared ? "border-ink bg-ink text-white" : "border-line"}`}>{compared ? "In comparison" : "Compare"}</button>
        <a href="#deals" tabIndex={show ? 0 : -1} className="rounded-full bg-ink px-4 py-1.5 text-xs font-medium text-white hover:bg-champagne-text">Compare prices</a>
      </div>
    </div>
  );
}

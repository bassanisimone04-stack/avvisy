"use client";
import Script from "next/script";
import { useEffect, useState } from "react";
import { markMounted } from "@/lib/client-store";

const KEY = "ss-consent";
type State = "granted" | "denied" | null;
function read(): State { try { return (localStorage.getItem(KEY) as State) ?? null; } catch { return null; } }

export function ConsentManager() {
  const [state, setState] = useState<State>(null);
  const [ready, setReady] = useState(false);
  const [forceOpen, setForceOpen] = useState(false);
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  useEffect(() => {
    setState(read()); setReady(true);
    const open = () => setForceOpen(true);
    window.addEventListener("ss-open-consent", open);
    const m = markMounted("ss-open-consent");
    if (m.parked) setForceOpen(true);
    return () => { m.unmount(); window.removeEventListener("ss-open-consent", open); };
  }, []);
  const choose = (v: "granted" | "denied") => { try { localStorage.setItem(KEY, v); } catch { /* storage blocked */ } setState(v); setForceOpen(false); };
  const show = ready && (state === null || forceOpen);
  return (
    <>
      {gaId && state === "granted" && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
          <Script id="ga-init" strategy="afterInteractive">{`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${gaId}',{anonymize_ip:true});`}</Script>
        </>
      )}
      {show && (
        <div role="dialog" aria-modal="false" aria-labelledby="consent-title" className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-3xl rounded-2xl border border-line bg-white p-5 shadow-2xl sm:p-6">
          <h2 id="consent-title" className="font-display text-2xl font-semibold">Your privacy</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate">
            We use only essential storage by default. {gaId ? "With your permission we also load analytics to understand which guides are useful. " : ""}
            When you click a store link, that store may set its own cookies under its own policy. See our <a className="underline" href="/cookie-policy">Cookie Policy</a>.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <button type="button" onClick={() => choose("denied")} className="rounded-full border border-ink/30 px-5 py-2.5 text-sm font-medium hover:bg-ink hover:text-white">Essential only</button>
            {gaId && <button type="button" onClick={() => choose("granted")} className="rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-white hover:bg-champagne-text">Accept analytics</button>}
            {!gaId && <button type="button" onClick={() => choose("granted")} className="rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-white hover:bg-champagne-text">OK</button>}
          </div>
        </div>
      )}
    </>
  );
}

export function ManageCookiesButton() {
  return <button type="button" onClick={() => window.dispatchEvent(new Event("ss-open-consent"))} className="hover:text-white hover:underline">Cookie settings</button>;
}

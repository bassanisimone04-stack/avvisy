"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import type { Dict } from "@/i18n/en";

type Consent = { necessary: true; analytics: boolean; marketing: boolean; at: string; v: 1 };
const KEY = "atg_consent";

function readConsent(): Consent | null {
  const m = document.cookie.match(new RegExp(`(?:^|; )${KEY}=([^;]*)`));
  if (!m) return null;
  try { return JSON.parse(decodeURIComponent(m[1]!)) as Consent; } catch { return null; }
}
function saveConsent(c: Omit<Consent, "at" | "v" | "necessary">) {
  const v: Consent = { necessary: true, ...c, at: new Date().toISOString(), v: 1 };
  document.cookie = `${KEY}=${encodeURIComponent(JSON.stringify(v))};path=/;max-age=${60 * 60 * 24 * 180};samesite=lax`;
  window.dispatchEvent(new CustomEvent("atg:consent", { detail: v }));
  return v;
}

export function ConsentManageButton({ label }: { label: string }) {
  return <button type="button" onClick={() => window.dispatchEvent(new Event("atg:consent-open"))} className="text-sand underline-offset-4 hover:text-white hover:underline">{label}</button>;
}

/** GDPR consent: nothing non-essential loads before an explicit choice. Analytics = Plausible (optional). */
export function CookieConsent({ d, plausibleDomain }: { d: Dict["consent"]; plausibleDomain?: string }) {
  const [consent, setConsent] = useState<Consent | null>(null);
  const [open, setOpen] = useState(false);
  const [custom, setCustom] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  useEffect(() => {
    const c = readConsent();
    setConsent(c);
    setOpen(!c);
    setAnalytics(c?.analytics ?? false);
    const reopen = () => { setOpen(true); setCustom(true); };
    window.addEventListener("atg:consent-open", reopen);
    return () => window.removeEventListener("atg:consent-open", reopen);
  }, []);
  const decide = (a: boolean) => { setConsent(saveConsent({ analytics: a, marketing: false })); setOpen(false); };
  return (
    <>
      {consent?.analytics && plausibleDomain && <Script src="https://plausible.io/js/script.js" data-domain={plausibleDomain} strategy="afterInteractive" />}
      {open && (
        <section aria-labelledby="consent-title" className="fixed inset-x-0 bottom-0 z-[90] p-3 md:p-4">
          <div className="mx-auto max-w-3xl rounded-[12px] border border-line bg-white p-5 text-ink shadow-card">
            <h2 id="consent-title" className="font-sans text-base font-bold">{d.title}</h2>
            <p className="mt-1 text-sm text-stone">{d.body}</p>
            {custom && (
              <div className="mt-4 space-y-3 text-sm">
                <label className="flex items-start gap-3"><input type="checkbox" checked disabled className="mt-1 h-4 w-4" /><span><span className="font-semibold">{d.necessary}</span><br /><span className="text-stone">{d.necessaryHelp}</span></span></label>
                <label className="flex items-start gap-3"><input type="checkbox" checked={analytics} onChange={(e) => setAnalytics(e.target.checked)} className="mt-1 h-4 w-4 accent-[var(--red-600)]" /><span><span className="font-semibold">{d.analytics}</span><br /><span className="text-stone">{d.analyticsHelp}</span></span></label>
                <label className="flex items-start gap-3"><input type="checkbox" checked={false} disabled className="mt-1 h-4 w-4" /><span><span className="font-semibold">{d.marketing}</span><br /><span className="text-stone">{d.marketingHelp}</span></span></label>
              </div>
            )}
            <div className="mt-4 flex flex-wrap gap-2">
              <button type="button" onClick={() => decide(false)} className="min-h-11 rounded-[8px] border border-carmine bg-white px-4 text-sm font-semibold text-carmine hover:bg-blush">{d.rejectAll}</button>
              {custom ? (
                <button type="button" onClick={() => decide(analytics)} className="min-h-11 rounded-[8px] border border-carmine bg-white px-4 text-sm font-semibold text-carmine hover:bg-blush">{d.save}</button>
              ) : (
                <button type="button" onClick={() => setCustom(true)} className="min-h-11 rounded-[8px] border border-carmine bg-white px-4 text-sm font-semibold text-carmine hover:bg-blush">{d.customise}</button>
              )}
              <button type="button" onClick={() => decide(true)} className="min-h-11 rounded-[8px] bg-carmine px-4 text-sm font-semibold text-white hover:bg-red-700">{d.acceptAll}</button>
            </div>
          </div>
        </section>
      )}
    </>
  );
}

"use client";
import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { COMPARE_KEY, useList } from "@/lib/client-store";

/** Opened without ?ids: restore the selection from the tray, or explain how to start. */
export function CompareFromStorage() {
  const ids = useList(COMPARE_KEY);
  const router = useRouter();
  useEffect(() => { if (ids.length) router.replace(`/compare?ids=${ids.join(",")}`); }, [ids, router]);
  if (ids.length) return <p role="status" className="text-slate">Loading your selection…</p>;
  return (
    <div className="rounded-2xl border border-dashed border-line p-10 text-center">
      <p className="font-display text-3xl font-semibold">Nothing to compare yet</p>
      <p className="mx-auto mt-3 max-w-md text-slate">Use the compare button on any model card, or start from a pairing below.</p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        {[["Aviator vs Wayfarer", "ray-ban-aviator-classic-rb3025,ray-ban-original-wayfarer-rb2140"], ["Original vs budget Wayfarer", "ray-ban-original-wayfarer-rb2140,oakley-frogskins,knockaround-premiums"], ["Persol 714 vs 649", "persol-714-steve-mcqueen,persol-649"]].map(([l, q]) => (
          <Link key={l} href={`/compare?ids=${q}`} className="rounded-full border border-ink/25 px-5 py-2.5 text-sm font-medium hover:bg-ink hover:text-white">{l}</Link>
        ))}
      </div>
    </div>
  );
}

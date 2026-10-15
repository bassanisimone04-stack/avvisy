"use client";
import Link from "next/link";

export default function RouteError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="mx-auto w-full max-w-7xl px-5 py-32 text-center sm:px-8" role="alert">
      <p className="eyebrow mb-4">Something went wrong</p>
      <h1 className="font-display text-5xl font-semibold">We hit a snag loading this page.</h1>
      <p className="mx-auto mt-5 max-w-md text-slate">It is probably temporary. Try again, or head back to the directory.</p>
      <div className="mt-8 flex justify-center gap-3">
        <button type="button" onClick={reset} className="rounded-full bg-ink px-6 py-3 text-sm font-medium text-white hover:bg-champagne-text">Try again</button>
        <Link href="/" className="rounded-full border border-ink/25 px-6 py-3 text-sm font-medium hover:bg-ink hover:text-white">Home</Link>
      </div>
    </div>
  );
}

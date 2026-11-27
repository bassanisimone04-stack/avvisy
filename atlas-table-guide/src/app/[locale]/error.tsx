"use client";

import Link from "next/link";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="container-page py-20 text-center" role="alert">
      <p className="eyebrow">500</p>
      <h1 className="mt-2 font-serif text-3xl">Something went wrong on our side</h1>
      <p className="mx-auto mt-3 max-w-xl text-stone">Please try again. If it keeps happening, contact us.</p>
      <div className="mt-6 flex justify-center gap-3">
        <button type="button" onClick={reset} className="min-h-11 rounded-[8px] bg-carmine px-5 text-sm font-semibold text-white hover:bg-red-700">Try again</button>
        <Link href="/" className="inline-flex min-h-11 items-center rounded-[8px] border border-carmine px-5 text-sm font-semibold text-carmine">Home</Link>
      </div>
    </div>
  );
}

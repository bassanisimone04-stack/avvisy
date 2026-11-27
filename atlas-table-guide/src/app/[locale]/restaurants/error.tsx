"use client";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="container-page py-16" role="alert">
      <h1 className="font-serif text-3xl">We couldn’t load these restaurants</h1>
      <p className="mt-2 text-stone">A temporary problem stopped the results from loading.</p>
      <button type="button" onClick={reset} className="mt-6 min-h-11 rounded-[8px] bg-carmine px-5 text-sm font-semibold text-white hover:bg-red-700">Retry</button>
    </div>
  );
}

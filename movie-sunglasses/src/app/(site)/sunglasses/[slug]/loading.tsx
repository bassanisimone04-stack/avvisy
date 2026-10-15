export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-7xl px-5 pt-10 sm:px-8" aria-busy="true" aria-label="Loading">
      <div className="mb-6 h-5 w-64 animate-pulse rounded bg-line" />
      <div className="grid gap-10 lg:grid-cols-2"><div className="aspect-[4/3] animate-pulse rounded-3xl bg-line/70" /><div className="space-y-4"><div className="h-4 w-24 animate-pulse rounded bg-line" /><div className="h-16 w-4/5 animate-pulse rounded bg-line" /><div className="h-28 animate-pulse rounded bg-line/70" /></div></div>
    </div>
  );
}

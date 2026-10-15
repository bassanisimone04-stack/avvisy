export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-7xl px-5 pt-10 sm:px-8" aria-busy="true" aria-label="Loading">
      <div className="mb-10 h-14 w-2/3 animate-pulse rounded bg-line" />
      <div className="mb-8 h-40 animate-pulse rounded-2xl bg-line/70" />
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">{Array.from({ length: 6 }, (_, i) => <div key={i} className="h-80 animate-pulse rounded-2xl bg-line/60" />)}</div>
    </div>
  );
}

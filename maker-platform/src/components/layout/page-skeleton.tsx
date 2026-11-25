/** Neutral loading state used while route content streams in. */
export function PageSkeleton() {
  return (
    <div className="container-page animate-pulse pt-10" role="status" aria-label="Loading">
      <div className="h-3 w-48 rounded-xs bg-line" />
      <div className="mt-8 h-12 w-2/3 max-w-xl rounded-xs bg-line" />
      <div className="mt-4 h-4 w-1/3 rounded-xs bg-line" />
      <div className="mt-10 aspect-[21/8] rounded-lg bg-ivory-deep" />
    </div>
  );
}

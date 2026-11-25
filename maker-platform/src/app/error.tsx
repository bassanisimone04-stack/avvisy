"use client";

import { buttonVariants } from "@/components/ui/button";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="container-page py-24 text-center" role="alert">
      <h1 className="text-display-md">Something went wrong.</h1>
      <p className="mx-auto mt-3 max-w-md text-muted">Please try again. If the problem continues, let us know.</p>
      <button type="button" onClick={reset} className={`${buttonVariants({ variant: "primary" })} mt-8`}>
        Try again
      </button>
    </div>
  );
}

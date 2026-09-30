"use client";

import { useFormAction } from "./useFormAction";
import type { FormState } from "@/app/actions";

/** Form generico legato a una server action che restituisce { error } oppure { ok }. */
export function ActionForm({
  action,
  children,
  submitLabel,
  className = "stack",
  hideOnSuccess,
}: {
  action: (state: FormState, data: FormData) => Promise<FormState>;
  children: React.ReactNode;
  submitLabel: string;
  className?: string;
  hideOnSuccess?: boolean;
}) {
  const { state, onSubmit, pending } = useFormAction(action);
  if (hideOnSuccess && state?.ok) return <div className="alert alert-ok">{state.ok}</div>;
  return (
    <form onSubmit={onSubmit} className={className}>
      {children}
      {state?.error && <div className="alert alert-danger">{state.error}</div>}
      {state?.ok && <div className="alert alert-ok">{state.ok}</div>}
      <div>
        <button className="btn btn-primary btn-sm" disabled={pending}>
          {pending ? "Attendi…" : submitLabel}
        </button>
      </div>
    </form>
  );
}

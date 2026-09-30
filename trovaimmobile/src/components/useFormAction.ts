"use client";

import { startTransition, useActionState, type FormEvent } from "react";
import type { FormState } from "@/app/actions";

/**
 * Come useActionState, ma invia tramite onSubmit: React 19 azzera i form inviati con `action={…}`,
 * e dopo un errore di validazione l'utente perderebbe tutto ciò che ha scritto.
 */
export function useFormAction(action: (state: FormState, data: FormData) => Promise<FormState>) {
  const [state, dispatch, pending] = useActionState<FormState, FormData>(action, undefined);
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget, (e.nativeEvent as SubmitEvent).submitter);
    startTransition(() => dispatch(data));
  };
  return { state, onSubmit, pending };
}

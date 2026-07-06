"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const KEY = "avvisy_cookie_ok";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(KEY)) setVisible(true);
    } catch {
      /* localStorage non disponibile */
    }
  }, []);

  function accept() {
    try {
      localStorage.setItem(KEY, "1");
    } catch {
      /* ignora */
    }
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-line bg-card/95 p-4 backdrop-blur">
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-3 sm:flex-row sm:justify-between">
        <p className="text-sm text-muted">
          Avvisy usa solo cookie tecnici necessari al funzionamento (es. la
          sessione di accesso). Dettagli nell&apos;{" "}
          <Link
            href="/privacy"
            className="font-semibold text-brand-dark hover:underline"
          >
            informativa privacy
          </Link>
          .
        </p>
        <button
          type="button"
          onClick={accept}
          className="shrink-0 rounded-full bg-brand px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
        >
          Ho capito
        </button>
      </div>
    </div>
  );
}

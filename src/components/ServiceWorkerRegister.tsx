"use client";

import { useEffect } from "react";

/** Registra il service worker: abilita l'installazione come app e un uso
 * basilare offline. */
export default function ServiceWorkerRegister() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
  }, []);
  return null;
}

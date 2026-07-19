"use client";

import { useEffect } from "react";

/**
 * Ri-applica il tema dopo l'idratazione su ogni pagina: alcune rotte possono
 * perdere l'attributo data-theme impostato dallo script inline durante
 * l'idratazione di React. Questo componente garantisce coerenza.
 */
export default function ThemeInit() {
  useEffect(() => {
    try {
      let t = localStorage.getItem("scortvia_theme");
      if (!t) {
        t = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      }
      if (document.documentElement.dataset.theme !== t) {
        document.documentElement.dataset.theme = t;
      }
    } catch {
      /* no-op */
    }
  });

  return null;
}

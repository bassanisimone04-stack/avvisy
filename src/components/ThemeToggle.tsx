"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";

export default function ThemeToggle({ className = "" }: { className?: string }) {
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    let current: Theme = "light";
    try {
      const saved = localStorage.getItem("scortvia_theme") as Theme | null;
      current =
        saved ??
        ((document.documentElement.dataset.theme as Theme) ||
          (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"));
    } catch {
      current = (document.documentElement.dataset.theme as Theme) || "light";
    }
    setTheme(current);
    document.documentElement.dataset.theme = current;
  }, []);

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("scortvia_theme", next);
    } catch {
      /* no-op */
    }
  }

  const isDark = theme === "dark";

  return (
    <button
      onClick={toggle}
      aria-label={isDark ? "Passa al tema chiaro" : "Passa al tema scuro"}
      title={isDark ? "Tema chiaro" : "Tema scuro"}
      className={`inline-flex h-9 w-9 items-center justify-center rounded-lg text-current transition-colors hover:bg-surface-2 ${className}`}
    >
      {/* Evita mismatch d'idratazione mostrando l'icona solo dopo il mount */}
      {mounted && (isDark ? <Sun /> : <Moon />)}
    </button>
  );
}

function Moon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 14.5A8 8 0 1 1 9.5 4a6.3 6.3 0 0 0 10.5 10.5Z" />
    </svg>
  );
}

function Sun() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5 19 19M19 5l-1.5 1.5M6.5 17.5 5 19" />
    </svg>
  );
}

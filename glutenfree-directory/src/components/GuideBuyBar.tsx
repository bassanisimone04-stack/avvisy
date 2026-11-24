"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Download } from "lucide-react";

/**
 * Barra d'acquisto che compare in basso dopo aver superato l'hero della pagina
 * della guida, e sparisce quando la CTA finale è in vista (niente doppioni).
 */
export default function GuideBuyBar({
  href,
  label,
  price,
  title,
  cover,
}: {
  href: string;
  label: string;
  price: string;
  title: string;
  cover: string;
}) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const end = document.getElementById("guida-acquista");
      const endTop = end ? end.getBoundingClientRect().top : Infinity;
      setShow(window.scrollY > 700 && endTop > window.innerHeight * 0.85);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      aria-hidden={!show}
      className={`fixed inset-x-0 bottom-0 z-50 px-3 pb-3 transition-all duration-300 sm:px-6 sm:pb-5 ${
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-full opacity-0"
      }`}
    >
      <div className="mx-auto flex max-w-3xl items-center gap-3 rounded-2xl border border-[#f0d9a0] bg-[#fffaf0]/95 p-2.5 pr-3 shadow-[0_18px_40px_-18px_rgba(120,80,0,0.55)] backdrop-blur sm:gap-4 sm:p-3">
        <Image src={cover} alt="" width={44} height={62} className="h-[52px] w-auto shrink-0 rounded shadow ring-1 ring-black/10" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-[#14231c]">{title}</p>
          <p className="text-xs text-[#5b6b62]">PDF · {price}</p>
        </div>
        <a
          href={href}
          target="_blank"
          rel="sponsored noopener noreferrer"
          tabIndex={show ? 0 : -1}
          className="gf-shine inline-flex shrink-0 items-center gap-2 rounded-full bg-[#c2431f] px-4 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-[#963316] sm:px-5"
        >
          <Download size={15} /> {label}
        </a>
      </div>
    </div>
  );
}

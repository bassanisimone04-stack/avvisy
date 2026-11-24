import type { ReactNode } from "react";

/**
 * Fascia d'intestazione chiara e in movimento (stesso stile della pagina della
 * guida PDF): macchie di colore che si spostano lente dietro titolo e sottotitolo.
 * Resta chiara anche con il tema scuro.
 */
export default function PageHeroBand({
  eyebrow,
  title,
  highlight,
  subtitle,
  children,
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  /** Parte finale del titolo, con il gradiente animato. */
  highlight?: ReactNode;
  subtitle?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <div className="gf-guide relative isolate mt-4 overflow-hidden rounded-3xl bg-[linear-gradient(135deg,#fff8e6_0%,#fdf2d6_45%,#eaf5ee_100%)] px-6 py-10 ring-1 ring-[#f0e3c4] sm:px-10 sm:py-12">
      <div aria-hidden="true" className="gf-blob absolute -left-20 -top-24 -z-10 h-72 w-72 rounded-full bg-[#f2b100]/30 blur-3xl" />
      <div aria-hidden="true" className="gf-blob gf-blob-2 absolute -bottom-28 right-[-4rem] -z-10 h-80 w-80 rounded-full bg-[#2d6a4f]/20 blur-3xl" />
      <div aria-hidden="true" className="gf-blob gf-blob-3 absolute right-1/3 top-0 -z-10 h-48 w-48 rounded-full bg-[#ff8a5c]/20 blur-3xl" />
      {eyebrow && (
        <p className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-[#963316] shadow-sm ring-1 ring-[#f0d9a0]">
          {eyebrow}
        </p>
      )}
      <h1 className="font-editorial mt-4 max-w-3xl text-3xl font-semibold leading-tight text-[#14231c] sm:text-5xl">
        {title}
        {highlight && (
          <>
            {" "}
            <span className="gf-gradient-text">{highlight}</span>
          </>
        )}
      </h1>
      {subtitle && <div className="mt-4 max-w-2xl text-lg text-[#4a5a51]">{subtitle}</div>}
      {children}
    </div>
  );
}

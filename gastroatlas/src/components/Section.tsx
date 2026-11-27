import Link from "next/link";
import type { ReactNode } from "react";

export function Section({ heading, eyebrow, children }: { heading: string; eyebrow?: string; children: ReactNode }) {
  return (
    <section className="section wrap">
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2>{heading}</h2>
      {children}
    </section>
  );
}

export const More = ({ href, label }: { href: string; label: string }) => <Link className="more" href={href}>{label} →</Link>;
export const Notice = ({ children }: { children: ReactNode }) => <p className="notice">{children}</p>;

/** Inner page: one H1 inside the standard wrapper. */
export function Page({ heading, children }: { heading: string; children: ReactNode }) {
  return <div className="wrap section"><h1>{heading}</h1>{children}</div>;
}

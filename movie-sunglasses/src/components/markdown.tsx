import Link from "next/link";
import React from "react";
import { slugify } from "@/lib/format";

function inline(text: string, keyBase: string): React.ReactNode[] {
  const out: React.ReactNode[] = [];
  const re = /(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g;
  let last = 0, m: RegExpExecArray | null, i = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const tok = m[0];
    if (tok.startsWith("**")) out.push(<strong key={`${keyBase}-${i++}`}>{tok.slice(2, -2)}</strong>);
    else {
      const [, label, href] = /\[([^\]]+)\]\(([^)]+)\)/.exec(tok)!;
      if (href.startsWith("/")) out.push(<Link key={`${keyBase}-${i++}`} href={href}>{label}</Link>);
      else if (/^https?:\/\//.test(href)) out.push(<a key={`${keyBase}-${i++}`} href={href} rel="nofollow noopener noreferrer" target="_blank">{label}</a>);
      else out.push(label);
    }
    last = m.index + tok.length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

/** Minimal, XSS-safe markdown subset: ## headings, - lists, paragraphs, **bold**, [links](/path). No raw HTML. */
export function Markdown({ source }: { source: string }) {
  const blocks = source.trim().split(/\n{2,}/);
  return (
    <div className="prose-article">
      {blocks.map((b, i) => {
        if (b.startsWith("## ")) return <h2 key={i} id={slugify(b.slice(3).replace(/\[([^\]]+)\]\([^)]+\)/g, "$1"))} className="scroll-mt-28">{inline(b.slice(3), `h${i}`)}</h2>;
        const lines = b.split("\n");
        if (lines.every((l) => l.startsWith("- "))) return <ul key={i}>{lines.map((l, j) => <li key={j}>{inline(l.slice(2), `l${i}-${j}`)}</li>)}</ul>;
        return <p key={i}>{inline(lines.join(" "), `p${i}`)}</p>;
      })}
    </div>
  );
}

export function extractHeadings(source: string): { id: string; text: string }[] {
  return source.split(/\n{2,}/).filter((b) => b.startsWith("## ")).map((b) => {
    const text = b.slice(3).replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").replace(/\*\*/g, "").trim();
    return { id: slugify(text), text };
  });
}

import { CheckCircle2, Sparkles } from "lucide-react";

export default function KeyTakeaways({ items, title }: { items: string[]; title: string }) {
  if (items.length === 0) return null;
  return (
    <div
      className="card my-8 rounded-2xl border p-6"
      style={{ borderColor: "var(--article-accent)", background: "var(--article-soft)" }}
    >
      <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide" style={{ color: "var(--article-accent)" }}>
        <Sparkles size={15} /> {title}
      </p>
      <ul className="mt-3 space-y-2.5">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2.5 text-[0.95rem] leading-snug text-ink">
            <CheckCircle2 size={18} className="mt-0.5 shrink-0" style={{ color: "var(--article-accent)" }} />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

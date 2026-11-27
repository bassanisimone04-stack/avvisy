import type { Restaurant } from "@/db/types";
import type { Dict } from "@/i18n/en";
import { fmt } from "@/i18n";
import { BRAND } from "@/config/brand";
import { SelectionMark } from "@/components/Logo";

/** Text-only recognition. Real awards: "Recognised by {body} · {title} ({year})". Demo: obviously simulated. */
export function RecognitionText({ r, dict, compact }: { r: Restaurant; dict: Dict; compact?: boolean }) {
  const parts: React.ReactNode[] = [];
  if (r.awards.length) {
    const a = r.awards[0]!;
    parts.push(<span key="aw">{fmt(dict.recognition.recognisedBy, { body: a.body, title: a.title, year: a.year })}</span>);
  } else if (r.recognition.kind === "demo" && r.recognition.level > 0) {
    parts.push(<span key="demo" title={dict.recognition.demoHelp}>{fmt(dict.recognition.demo, { n: r.recognition.level })}</span>);
  } else if (!compact) {
    parts.push(<span key="none" className="text-stone">{dict.recognition.none}</span>);
  }
  if (r.atlasSelection) parts.push(<span key="sel" className="inline-flex items-center gap-1 text-carmine"><SelectionMark size={14} />{BRAND.selectionName}</span>);
  if (!parts.length) return null;
  return <span className="inline-flex flex-wrap items-center gap-x-2 gap-y-1">{parts.map((p, i) => <span key={i} className="inline-flex items-center gap-2">{i > 0 && <span aria-hidden="true" className="text-line">|</span>}{p}</span>)}</span>;
}

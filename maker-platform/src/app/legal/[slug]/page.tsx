import { notFound } from "next/navigation";
import { SimplePage } from "@/components/layout/simple-page";
import { getLegalDraft, legalDrafts } from "@/features/legal/drafts";
import { pageMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return legalDrafts.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: PageProps<"/legal/[slug]">) {
  const { slug } = await params;
  const d = getLegalDraft(slug);
  return d ? pageMetadata({ title: `${d.title} (draft)`, description: d.summary, path: `/legal/${d.slug}`, index: false }) : {};
}

export default async function LegalPage({ params }: PageProps<"/legal/[slug]">) {
  const { slug } = await params;
  const d = getLegalDraft(slug);
  if (!d) notFound();
  return (
    <SimplePage eyebrow="Legal" title={d.title} lede={d.summary} path={`/legal/${d.slug}`} label={d.title}>
      <div role="note" className="mb-10 max-w-2xl rounded-md border border-[#EBD9A6] bg-[#FFF8E6] p-4 text-sm text-warning">
        <strong>Draft — pending professional legal review.</strong> This text describes intended practices and is not yet a binding policy.
      </div>
      <div className="prose-editorial">
        {d.sections.map((s) => (
          <section key={s.heading}>
            <h2>{s.heading}</h2>
            {s.body.map((b) => (
              <p key={b}>{b}</p>
            ))}
          </section>
        ))}
      </div>
    </SimplePage>
  );
}

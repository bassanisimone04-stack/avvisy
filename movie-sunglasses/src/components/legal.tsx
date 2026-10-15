import { Breadcrumbs, Container } from "./ui";

export function LegalPage({ title, updated, children }: { title: string; updated: string; children: React.ReactNode }) {
  return (
    <Container className="pt-10">
      <Breadcrumbs items={[{ name: title }]} />
      <article className="mx-auto max-w-3xl">
        <h1 className="font-display text-5xl font-semibold leading-[0.95] sm:text-6xl">{title}</h1>
        <p className="mt-3 text-sm text-slate">Last updated {updated}</p>
        <p className="mt-6 rounded-lg border border-dashed border-champagne bg-champagne-light/40 p-4 text-sm text-champagne-text" role="note">
          Template text describing how this site is built to operate. Have it reviewed by a qualified lawyer and replace the bracketed operator details before launch.
        </p>
        <div className="prose-article mt-8">{children}</div>
      </article>
    </Container>
  );
}

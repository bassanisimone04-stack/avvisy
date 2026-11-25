import { Breadcrumbs } from "@/components/ui/breadcrumbs";

export function SimplePage({
  eyebrow,
  title,
  lede,
  path,
  label,
  children,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  lede?: React.ReactNode;
  path: string;
  label: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="container-page pt-6 md:pt-8">
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { href: path, label }]} />
      <header className="mt-8 max-w-3xl">
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        <h1 className="mt-3 text-display-lg text-balance">{title}</h1>
        {lede ? <p className="mt-4 text-[1.0625rem] leading-relaxed text-muted">{lede}</p> : null}
      </header>
      <div className="mt-12">{children}</div>
    </div>
  );
}

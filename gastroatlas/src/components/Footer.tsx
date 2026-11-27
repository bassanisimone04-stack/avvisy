import Link from "next/link";
import { BRAND, title, type SectionKey } from "@/data/catalog";
import { T, url, type Locale } from "@/lib/i18n";

export function Footer({ locale }: { locale: Locale }) {
  const t = T(locale);
  const col = (keys: SectionKey[]) => keys.map((k) => <Link key={k} href={url(locale, k)}>{title(k, locale)}</Link>);
  return (
    <footer id="footer">
      <div className="wrap foot">
        <div>
          <Link className="brand" href={url(locale)}>{BRAND.name}</Link>
          <p>{t("Independent editorial guide.", "Guida editoriale indipendente.")}</p>
          <small>{t("Fictional venues and sample prices. Images are illustrative.", "Locali e prezzi dimostrativi. Le immagini sono illustrative.")}</small>
        </div>
        <div>{col(["restaurants", "destinations", "experiences", "price-index", "compare"])}</div>
        <div>{col(["about", "methodology", "concierge", "legal", "business", "account"])}</div>
      </div>
    </footer>
  );
}

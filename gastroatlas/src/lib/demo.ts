import { T, type Locale } from "./i18n";

export const demoCopy = (locale: Locale) => {
  const t = T(locale);
  return {
    label: t("Demo data", "Dati dimostrativi"),
    notice: t("Fictional venues and sample prices. Images are illustrative.", "Locali e prezzi dimostrativi. Le immagini sono illustrative."),
    level: (n: number) => `${t("Demo distinction · Level ", "Distinzione demo · Livello ")}${n}`,
  };
};

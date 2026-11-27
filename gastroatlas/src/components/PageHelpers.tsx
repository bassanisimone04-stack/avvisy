import type { Metadata } from "next";
import { Notice, Page } from "./Section";
import { title, type SectionKey } from "@/data/catalog";
import { T, type Locale } from "@/lib/i18n";
import { meta } from "@/lib/seo";

type P = { params: Promise<{ locale: string }> };
export const localeOf = async (p: P["params"]) => (await p).locale as Locale;

/** metadata factory for a section page */
export const sectionMeta = (key: SectionKey, path = key as string) => async ({ params }: P): Promise<Metadata> => { const l = await localeOf(params); return meta(l, path, title(key, l)); };

/** Pages whose back end is not connected yet: honest notice, never a fake form. */
export function NotConfigured({ locale, heading }: { locale: Locale; heading: string }) {
  return <Page heading={heading}><Notice>{T(locale)("This service is not configured yet.", "Il servizio non è ancora configurato.")}</Notice></Page>;
}

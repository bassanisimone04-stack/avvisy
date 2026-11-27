import { notFound } from "next/navigation";
import type { Locale } from "@/config/brand";
import { getDict, isLocale } from "@/i18n";
import { getDataset } from "@/db/repository";
import { getRates } from "@/lib/fx";
import { localizeDataset } from "@/db/queries";

export async function pageCtx(params: Promise<{ locale: string }>) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const [data, rates] = await Promise.all([getDataset(), getRates()]);
  return { locale: locale as Locale, dict: getDict(locale), data: localizeDataset(data, locale as Locale), rates };
}

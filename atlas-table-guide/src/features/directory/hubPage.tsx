import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fmt, getDict, isLocale } from "@/i18n";
import type { Locale } from "@/config/brand";
import { BRAND } from "@/config/brand";
import { getDataset } from "@/db/repository";
import { getRates } from "@/lib/fx";
import { buildMetadata } from "@/seo/metadata";
import { hubModel, resolveScope } from "./model";
import { DirectoryView } from "./DirectoryView";

type P = { params: Promise<{ locale: string; country?: string; place?: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> };

async function load({ params, searchParams }: P) {
  const { locale, country, place } = await params;
  if (!isLocale(locale)) notFound();
  const sp = await searchParams;
  const [data, rates] = await Promise.all([getDataset(), getRates()]);
  const scope = resolveScope(data, country, place);
  if (!scope) notFound();
  const dict = getDict(locale);
  return { locale: locale as Locale, dict, data, rates, sp, m: hubModel(data, rates, locale as Locale, dict, scope, sp) };
}

export async function hubMetadata(p: P): Promise<Metadata> {
  const { locale, dict, m } = await load(p);
  const desc = m.answer || `${fmt(dict.directory.results, { n: m.base.length })} — ${dict.meta.homeDescription}`;
  const md = buildMetadata({ locale, path: m.path, title: `${m.h1} — ${BRAND.name}`, description: desc.slice(0, 158), noindex: !m.decision.index, canonical: m.decision.canonicalPath });
  return md;
}

export async function HubPage(p: P) {
  const { locale, dict, data, rates, sp, m } = await load(p);
  const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);
  return <DirectoryView m={m} locale={locale} dict={dict} data={data} rates={rates} extraParams={{ date: one(sp.date)?.slice(0, 10), guests: one(sp.guests)?.slice(0, 2) }} />;
}

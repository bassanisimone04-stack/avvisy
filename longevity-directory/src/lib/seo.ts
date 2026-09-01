import { SITE } from "./site";

/**
 * Helper per i dati strutturati JSON-LD.
 * Regola non negoziabile (doc 01 §5.1): mai emettere `aggregateRating` o
 * `review` vuoti o inventati — solo se esistono recensioni reali.
 */

export function breadcrumbList(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: new URL(it.url, SITE.url).toString(),
    })),
  };
}

export function faqPage(faqs: { domanda: string; risposta: string }[]) {
  if (!faqs.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.domanda,
      acceptedAnswer: { "@type": "Answer", text: f.risposta },
    })),
  };
}

export function itemList(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      url: new URL(it.url, SITE.url).toString(),
    })),
  };
}

export function medicalClinic(x: {
  nome: string;
  descrizioneBreve: string;
  indirizzo: string;
  citta: string;
  provincia: string;
  regione: string;
  telefono?: string;
  sito?: string;
  url: string;
  valutazione: number;
  numeroRecensioni: number;
}) {
  const base: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "MedicalClinic",
    name: x.nome,
    description: x.descrizioneBreve,
    url: new URL(x.url, SITE.url).toString(),
    address: {
      "@type": "PostalAddress",
      streetAddress: x.indirizzo,
      addressLocality: x.citta,
      addressRegion: x.regione,
      addressCountry: "IT",
    },
  };
  if (x.telefono) base.telephone = x.telefono;
  if (x.sito) base.sameAs = [x.sito];
  // Solo recensioni reali: mai emettere il blocco se non ce ne sono.
  if (x.numeroRecensioni > 0) {
    base.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: x.valutazione,
      reviewCount: x.numeroRecensioni,
    };
  }
  return base;
}

export function article(x: {
  titolo: string;
  descrizione: string;
  url: string;
  autore: string;
  revisoreMedico?: string;
  dataPubblicazione: Date;
  dataAggiornamento?: Date;
}) {
  const base: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: x.titolo,
    description: x.descrizione,
    url: new URL(x.url, SITE.url).toString(),
    author: { "@type": "Person", name: x.autore },
    datePublished: x.dataPubblicazione.toISOString(),
    dateModified: (x.dataAggiornamento || x.dataPubblicazione).toISOString(),
  };
  if (x.revisoreMedico) {
    base.reviewedBy = { "@type": "Person", name: x.revisoreMedico };
  }
  return base;
}

export function organization() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE.name,
    url: SITE.url,
  };
}

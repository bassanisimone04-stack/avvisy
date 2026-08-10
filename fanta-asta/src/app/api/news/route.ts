import { NextResponse } from "next/server";
import { FONTI } from "@/lib/news-sources";

export const revalidate = 600;

export interface Articolo {
  titolo: string;
  link: string;
  data: string | null;
  estratto: string;
  fonteId: string;
  fonteNome: string;
}

export interface StatoFonte {
  id: string;
  nome: string;
  sito: string;
  ok: boolean;
  articoli: number;
  errore?: string;
}

/** Estrae il contenuto del primo tag corrispondente, CDATA compreso. */
function tag(blocco: string, nome: string): string {
  const match = blocco.match(
    new RegExp(`<${nome}(?:\\s[^>]*)?>([\\s\\S]*?)</${nome}>`, "i")
  );
  if (!match) return "";
  return match[1]
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .trim();
}

/** Atom mette il link in un attributo href invece che nel corpo del tag. */
function linkAtom(blocco: string): string {
  const alternate = blocco.match(
    /<link[^>]*rel=["']alternate["'][^>]*href=["']([^"']+)["']/i
  );
  if (alternate) return alternate[1];
  const primo = blocco.match(/<link[^>]*href=["']([^"']+)["']/i);
  return primo ? primo[1] : "";
}

function ripulisci(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

function parseFeed(xml: string, fonteId: string, fonteNome: string): Articolo[] {
  const blocchi =
    xml.match(/<item[\s>][\s\S]*?<\/item>/gi) ??
    xml.match(/<entry[\s>][\s\S]*?<\/entry>/gi) ??
    [];

  return blocchi
    .map((blocco) => {
      const titolo = ripulisci(tag(blocco, "title"));
      const link = ripulisci(tag(blocco, "link")) || linkAtom(blocco);
      const data =
        tag(blocco, "pubDate") ||
        tag(blocco, "published") ||
        tag(blocco, "updated") ||
        tag(blocco, "dc:date");
      const estratto = ripulisci(
        tag(blocco, "description") || tag(blocco, "summary") || tag(blocco, "content")
      );

      const timestamp = data ? Date.parse(data) : NaN;
      return {
        titolo,
        link,
        data: Number.isFinite(timestamp) ? new Date(timestamp).toISOString() : null,
        estratto: estratto.length > 240 ? `${estratto.slice(0, 237)}…` : estratto,
        fonteId,
        fonteNome,
      };
    })
    .filter((a) => a.titolo && a.link);
}

async function leggiFonte(
  fonte: (typeof FONTI)[number]
): Promise<{ articoli: Articolo[]; stato: StatoFonte }> {
  const base: StatoFonte = {
    id: fonte.id,
    nome: fonte.nome,
    sito: fonte.sito,
    ok: false,
    articoli: 0,
  };

  try {
    const risposta = await fetch(fonte.feed, {
      headers: {
        // Diversi CDN rifiutano le richieste senza user agent riconoscibile.
        "User-Agent": "FantAsta/1.0 (rassegna stampa fantacalcio)",
        Accept: "application/rss+xml, application/atom+xml, application/xml, text/xml",
      },
      next: { revalidate },
      signal: AbortSignal.timeout(8000),
    });

    if (!risposta.ok) {
      return {
        articoli: [],
        stato: { ...base, errore: `HTTP ${risposta.status}` },
      };
    }

    const xml = await risposta.text();
    const articoli = parseFeed(xml, fonte.id, fonte.nome).slice(0, 12);
    return { articoli, stato: { ...base, ok: true, articoli: articoli.length } };
  } catch (errore) {
    const messaggio =
      errore instanceof Error ? errore.message : "errore di rete sconosciuto";
    return { articoli: [], stato: { ...base, errore: messaggio } };
  }
}

export async function GET() {
  const esiti = await Promise.all(FONTI.map((f) => leggiFonte(f)));

  const articoli = esiti
    .flatMap((e) => e.articoli)
    .sort((a, b) => {
      const ta = a.data ? Date.parse(a.data) : 0;
      const tb = b.data ? Date.parse(b.data) : 0;
      return tb - ta;
    })
    .slice(0, 120);

  return NextResponse.json(
    {
      articoli,
      fonti: esiti.map((e) => e.stato),
      generatoIl: new Date().toISOString(),
    },
    {
      headers: {
        "Cache-Control": "public, s-maxage=600, stale-while-revalidate=1800",
      },
    }
  );
}

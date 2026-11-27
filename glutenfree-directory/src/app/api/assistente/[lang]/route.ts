import { buildAssistantIndex } from "@/lib/assistant-index";

export const dynamic = "force-static";

export function generateStaticParams() {
  return [{ lang: "it" }, { lang: "en" }];
}

/** Dati per l'assistente del sito, generati in fase di build (nessun servizio esterno). */
export async function GET(_req: Request, { params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return Response.json(buildAssistantIndex(lang === "en" ? "en" : "it"), {
    headers: { "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400" },
  });
}

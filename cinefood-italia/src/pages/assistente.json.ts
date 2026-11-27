import type { APIRoute } from "astro";
import { buildAssistenteIndex } from "../lib/assistente-index";

export const GET: APIRoute = async () =>
  new Response(JSON.stringify(await buildAssistenteIndex("it")), { headers: { "Content-Type": "application/json; charset=utf-8" } });

/* Generates a self-contained interactive preview (docs/preview.html) from the seed data and the real evidence rules. */
import { readFileSync, writeFileSync } from "node:fs";
import { seed } from "../src/data/seed";
import { buildCatalog } from "../src/lib/catalog";

const c = buildCatalog(seed as never);
const data = {
  checked: "2026-10-15",
  movies: seed.movies.map((m) => ({ id: m.id, title: m.title, year: m.year, kind: m.kind, genre: m.genre, synopsis: m.synopsis })),
  actors: seed.actors.map((a) => ({ id: a.id, name: a.name, models: c.modelsForActor(a.id).length })),
  brands: Object.fromEntries(seed.brands.map((b) => [b.id, b.name])),
  models: seed.models.map((m) => ({
    id: m.id, name: m.name, brand: m.brandId, code: m.modelCode, shape: m.shape, styleTags: m.styleTags, frame: m.frameColor, lens: m.lensColor,
    status: m.status, band: c.priceBandOf(m).band, desc: m.description, specs: m.specs.map((s) => [s.label, s.value]), match: c.modelMatch(m.id),
    apps: c.appsForModel(m.id).map((a) => { const em = c.matchOf(a); return {
      id: a.id, movie: a.movieId, actorId: a.actorId, actor: c.actorById.get(a.actorId)!.name, character: c.charById.get(a.characterId)!.name,
      match: em.type, declared: em.declared, down: em.downgraded, reason: em.reason, notes: a.notes,
      ev: (c.evByApp.get(a.id) ?? []).map((e) => ({ title: e.sourceTitle, url: e.sourceUrl, supports: e.supports, type: e.sourceType, checked: e.checkedAt, stance: e.stance ?? "supports" })),
    }; }),
    alts: c.alternativesOf(m.id).map(({ alt }) => ({ id: alt.alternativeModelId, reason: alt.reason })),
    origs: c.originalsOf(m.id).map(({ alt }) => ({ id: alt.originalModelId })),
  })),
};
const cites = seed.evidence.length;
const html = readFileSync("scripts/preview-template.html", "utf8").replace(/\d+ titles, \d+ models, \d+ sourced citations/, `${seed.movies.length} titles, ${seed.models.length} models, ${cites} sourced citations`).replace("/*__DATA__*/null", JSON.stringify(data).replace(/</g, "\\u003c"));
writeFileSync("docs/preview.html", html);
console.log("docs/preview.html", Math.round(html.length / 1024) + " KB");

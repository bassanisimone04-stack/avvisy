import { test } from "node:test";
import assert from "node:assert/strict";
import { mentionsAdvancePayment } from "./trust";
import { entryCost } from "./costs";
import { freshness } from "./freshness";

test("rileva richieste di pagamento anticipato", () => {
  assert.ok(mentionsAdvancePayment("Per fissare la visita serve una caparra di 200 euro"));
  assert.ok(mentionsAdvancePayment("C'è una quota di iscrizione al servizio di 250€"));
  assert.ok(mentionsAdvancePayment("Mi fai un bonifico e ti mando le chiavi"));
  assert.ok(mentionsAdvancePayment("devi pagare 260 euro prima di vederla"));
  assert.ok(!mentionsAdvancePayment("Sì, è disponibile. Nessun pagamento prima della visita."));
  assert.ok(!mentionsAdvancePayment("Non chiediamo alcun anticipo né caparra."));
  assert.ok(mentionsAdvancePayment("Non ci sono problemi, serve solo una caparra di 200 euro."));
  assert.ok(!mentionsAdvancePayment("Buongiorno, l'appartamento è ancora libero? Lavoro a tempo indeterminato."));
});

test("costo totale d'ingresso", () => {
  assert.equal(entryCost({ canone: 900, spese: 80, cauzione: 1800, commissione: 900 }), 3680);
});

test("freschezza della conferma", () => {
  const now = Date.parse("2026-10-10T00:00:00Z");
  assert.equal(freshness("2026-10-09T00:00:00Z", now), "fresh");
  assert.equal(freshness("2026-09-30T00:00:00Z", now), "aging");
  assert.equal(freshness("2026-09-01T00:00:00Z", now), "stale");
});

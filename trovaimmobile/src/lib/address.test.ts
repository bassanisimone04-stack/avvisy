import { test } from "node:test";
import assert from "node:assert/strict";
import { addressKey, buildingKey, prettyCivico, prettyVia } from "./address";

test("lo stesso indirizzo scritto in modi diversi produce la stessa chiave", () => {
  const a = addressKey({ comune: "Milano", via: "V.le Monza", civico: "12/A" });
  const b = addressKey({ comune: " milano ", via: "viale  monza", civico: "12 a" });
  const c = addressKey({ comune: "MILANO", via: "Viale Monza", civico: "12-A" });
  assert.equal(a, b);
  assert.equal(a, c);
});

test("accenti, apostrofi e abbreviazioni", () => {
  assert.equal(buildingKey({ comune: "Forlì", via: "C.so della Repubblica", civico: "5" }), buildingKey({ comune: "Forli", via: "corso della repubblica", civico: "5" }));
  assert.equal(buildingKey({ comune: "Reggio nell'Emilia", via: "P.zza Prampolini", civico: "1" }), buildingKey({ comune: "reggio nellemilia", via: "piazza prampolini", civico: "1" }));
  assert.equal(buildingKey({ comune: "Roma", via: "V. Appia Nuova", civico: "10" }), buildingKey({ comune: "Roma", via: "Via Appia Nuova", civico: "10" }));
});

test("interni diversi allo stesso civico sono immobili diversi", () => {
  const base = { comune: "Torino", via: "Via Po", civico: "3" };
  assert.notEqual(addressKey({ ...base, interno: "4" }), addressKey({ ...base, interno: "5" }));
  assert.equal(addressKey({ ...base, interno: "int. 4" }), addressKey({ ...base, interno: "4" }));
});

test("civici diversi non collidono", () => {
  assert.notEqual(buildingKey({ comune: "Roma", via: "Via Po", civico: "1" }), buildingKey({ comune: "Roma", via: "Via Po", civico: "11" }));
});

test("formattazione leggibile", () => {
  assert.equal(prettyVia("v.le della vittoria"), "Viale della Vittoria");
  assert.equal(prettyCivico("12a"), "12/A");
  assert.equal(prettyCivico("7"), "7");
});

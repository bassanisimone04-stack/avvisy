import { test } from "node:test";
import assert from "node:assert/strict";
import { safeExternalUrl, serializeJsonLd } from "../src/lib/safe-output.ts";

// --- JSON-LD escaping ------------------------------------------------------

test("a payload cannot close the script block it is embedded in", () => {
  // The exact attack: a listing owner sets their business name to markup.
  const closer = "</" + "script>";
  const payload = { name: `Acme${closer}<script>alert(1)</script>` };
  const out = serializeJsonLd(payload);

  assert.ok(!out.includes(closer), "output still closes the script tag");
  assert.ok(!out.includes("<"), "output still contains a raw <");
});

test("escaped output is still valid JSON with the original value intact", () => {
  const closer = "</" + "script>";
  const original = { name: `Acme${closer}`, about: "a & b > c < d" };
  const parsed = JSON.parse(serializeJsonLd(original));
  assert.deepEqual(parsed, original);
});

test("line separators valid in JSON but not in JS are escaped", () => {
  const out = serializeJsonLd({ a: "x y z" });
  assert.ok(!out.includes(" "));
  assert.ok(!out.includes(" "));
  assert.equal(JSON.parse(out).a, "x y z");
});

test("ordinary values are unchanged after a round trip", () => {
  const data = { "@type": "LocalBusiness", name: "PawMobile", rating: 4.9, tags: ["a", "b"] };
  assert.deepEqual(JSON.parse(serializeJsonLd(data)), data);
});

// --- URL guard -------------------------------------------------------------

test("script-bearing URL schemes are rejected", () => {
  for (const url of [
    "javascript:alert(1)",
    "JavaScript:alert(1)",
    "  javascript:alert(1)  ",
    "data:text/html;base64,PHNjcmlwdD4=",
    "vbscript:msgbox(1)",
    "file:///etc/passwd",
  ]) {
    assert.equal(safeExternalUrl(url), null, `should reject: ${url}`);
  }
});

test("relative and malformed values are rejected rather than guessed at", () => {
  for (const url of ["/dashboard", "//evil.example.com", "example.com", "", "   ", null, undefined]) {
    assert.equal(safeExternalUrl(url), null, `should reject: ${url}`);
  }
});

test("ordinary http and https URLs pass through", () => {
  assert.equal(safeExternalUrl("https://example.com/"), "https://example.com/");
  assert.equal(safeExternalUrl("http://example.com/path?a=1"), "http://example.com/path?a=1");
  assert.equal(safeExternalUrl("  https://example.com  "), "https://example.com/");
});

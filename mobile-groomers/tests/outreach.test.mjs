import { test } from "node:test";
import assert from "node:assert/strict";
import { buildMessage, parseCsv, render, toCsv, stepForDay } from "../scripts/outreach/render.mjs";
import { CADENCE, MAX_TOUCHES } from "../scripts/outreach/templates.mjs";

const config = {
  siteUrl: "https://example.com",
  senderName: "Sender",
  senderAddress: "1 Street, City",
};

const base = {
  business_name: "PawMobile",
  first_name: "Dana",
  city: "Los Angeles",
  state: "CA",
  city_slug: "los-angeles-ca",
  zip: "90210",
  listing_slug: "pawmobile",
  email: "owner@example.com",
  instagram: "@pawmobile",
  phone: "+13105550142",
  touches: "0",
  opted_out: "",
  claimed: "",
};

const emailStep = stepForDay(0);

// --- CSV parsing -----------------------------------------------------------

test("parseCsv handles quoted fields, embedded commas and newlines", () => {
  const rows = parseCsv('a,b\n"x,1","line1\nline2"\n');
  assert.equal(rows.length, 1);
  assert.equal(rows[0].a, "x,1");
  assert.equal(rows[0].b, "line1\nline2");
});

test("parseCsv handles escaped quotes", () => {
  const rows = parseCsv('name\n"Vanessa""s Van"\n');
  assert.equal(rows[0].name, 'Vanessa"s Van');
});

test("parseCsv skips blank lines instead of emitting empty records", () => {
  assert.equal(parseCsv("a\n1\n\n\n2\n").length, 2);
});

test("parseCsv returns empty for empty input", () => {
  assert.deepEqual(parseCsv(""), []);
});

test("toCsv round-trips a multi-line body through parseCsv", () => {
  const rows = [{ to: "a@b.c", body: 'Line 1\nLine 2, with comma and "quotes"' }];
  const parsed = parseCsv(toCsv(rows, ["to", "body"]));
  assert.deepEqual(parsed, rows);
});

// --- Template rendering ----------------------------------------------------

test("render fills placeholders", () => {
  assert.equal(render("Hi {{name}}!", { name: "Dana" }), "Hi Dana!");
});

test("render throws rather than sending a message with a blank in it", () => {
  assert.throws(() => render("Hi {{name}}", {}), /unresolved placeholders: name/);
  assert.throws(() => render("Hi {{name}}", { name: "" }), /unresolved/);
});

// --- Cadence guard rails ---------------------------------------------------

test("a normal prospect gets a rendered message", () => {
  const msg = buildMessage({ prospect: base, step: emailStep, config });
  assert.equal(msg.skip, undefined);
  assert.equal(msg.to, "owner@example.com");
  assert.match(msg.subject, /Los Angeles/);
  assert.match(msg.body, /PawMobile/);
});

test("opted-out prospects are never contacted", () => {
  for (const flag of ["yes", "YES", "true", "1", "stop", "unsubscribed"]) {
    const msg = buildMessage({
      prospect: { ...base, opted_out: flag },
      step: emailStep,
      config,
    });
    assert.equal(msg.skip, "opted out", `flag ${flag} should opt out`);
  }
});

test("suppressed addresses are never contacted, case-insensitively", () => {
  const msg = buildMessage({
    prospect: { ...base, email: "Owner@Example.com" },
    step: emailStep,
    config,
    suppressed: new Set(["owner@example.com"]),
  });
  assert.equal(msg.skip, "on the suppression list");
});

test("the four-touch cap is enforced", () => {
  const at = buildMessage({
    prospect: { ...base, touches: String(MAX_TOUCHES) },
    step: emailStep,
    config,
  });
  assert.match(at.skip, /already had/);

  const under = buildMessage({
    prospect: { ...base, touches: String(MAX_TOUCHES - 1) },
    step: emailStep,
    config,
  });
  assert.equal(under.skip, undefined);
});

test("businesses that already claimed are dropped", () => {
  const msg = buildMessage({ prospect: { ...base, claimed: "true" }, step: emailStep, config });
  assert.equal(msg.skip, "already claimed their listing");
});

test("a prospect missing the channel's contact field is skipped", () => {
  assert.equal(
    buildMessage({ prospect: { ...base, email: "" }, step: emailStep, config }).skip,
    "no email on file",
  );
  assert.equal(
    buildMessage({ prospect: { ...base, instagram: "" }, step: stepForDay(2), config }).skip,
    "no instagram on file",
  );
  assert.equal(
    buildMessage({ prospect: { ...base, phone: "" }, step: stepForDay(7), config }).skip,
    "no phone on file",
  );
});

// --- URL construction ------------------------------------------------------

test("listing and claim URLs are built from the slugs", () => {
  const msg = buildMessage({ prospect: base, step: emailStep, config });
  assert.match(msg.body, /https:\/\/example\.com\/groomers\/los-angeles-ca\/pawmobile/);
  assert.match(msg.body, /https:\/\/example\.com\/claim\?listing=pawmobile/);
});

test("a prospect with no listing yet falls back to the bare site and claim URLs", () => {
  const msg = buildMessage({
    prospect: { ...base, listing_slug: "", city_slug: "" },
    step: emailStep,
    config,
  });
  assert.match(msg.body, /https:\/\/example\.com\/claim(?!\?)/);
  assert.ok(!msg.body.includes("/groomers//"));
});

test("the unsubscribe address is URL-encoded", () => {
  const msg = buildMessage({
    prospect: { ...base, email: "a+b@example.com" },
    step: emailStep,
    config,
  });
  assert.match(msg.body, /unsubscribe\?e=a%2Bb%40example\.com/);
});

test("a missing owner name degrades to a natural greeting", () => {
  const msg = buildMessage({ prospect: { ...base, first_name: "" }, step: emailStep, config });
  assert.match(msg.body, /^Hi there,/m);
});

// --- Compliance ------------------------------------------------------------

test("every email touch carries a postal address and an unsubscribe link", () => {
  for (const step of CADENCE.filter((s) => s.key.startsWith("email"))) {
    const msg = buildMessage({ prospect: base, step, config });
    assert.ok(msg.body.includes(config.senderAddress), `${step.key} needs a postal address`);
    assert.match(msg.body, /Unsubscribe: https/, `${step.key} needs an unsubscribe link`);
  }
});

test("every SMS touch carries a STOP instruction", () => {
  for (const step of CADENCE.filter((s) => s.key.startsWith("sms"))) {
    const msg = buildMessage({ prospect: base, step, config });
    assert.match(msg.body, /Reply STOP/);
  }
});

test("the cadence never exceeds four touches", () => {
  assert.ok(CADENCE.length <= 4, "more than four touches invites spam complaints");
  assert.equal(MAX_TOUCHES, CADENCE.length);
});

test("every cadence step maps to a real template", () => {
  for (const step of CADENCE) {
    assert.notEqual(
      buildMessage({ prospect: base, step, config }).skip,
      `unknown template ${step.key}`,
    );
  }
});

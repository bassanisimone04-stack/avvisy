import { test } from "node:test";
import assert from "node:assert/strict";
import {
  MAX_FIELD,
  clean,
  isEmailAddress,
  isValidZip,
  validateLead,
} from "../src/lib/lead-rules.ts";

const valid = { groomerId: "g1", name: "Dana", contact: "dana@example.com", zip: "90210" };
const opts = { requireGroomerId: true };

// --- field cleaning --------------------------------------------------------

test("clean trims, and tolerates non-string input", () => {
  assert.equal(clean("  hi  "), "hi");
  assert.equal(clean(undefined), "");
  assert.equal(clean(null), "");
  assert.equal(clean(42), "");
  assert.equal(clean({}), "");
  assert.equal(clean([]), "");
});

test("clean caps field length so one field cannot carry a payload", () => {
  assert.equal(clean("x".repeat(MAX_FIELD + 500)).length, MAX_FIELD);
});

// --- honeypot --------------------------------------------------------------

test("a filled honeypot is dropped silently, never rejected", () => {
  const verdict = validateLead({ ...valid, company: "spam co" }, opts);
  // Rejecting would teach the bot which field gave it away.
  assert.equal(verdict.outcome, "silent-drop");
});

test("the honeypot takes precedence over other validation errors", () => {
  const verdict = validateLead({ company: "bot", zip: "nope" }, opts);
  assert.equal(verdict.outcome, "silent-drop");
});

test("an empty or whitespace-only honeypot does not drop a real lead", () => {
  assert.equal(validateLead({ ...valid, company: "" }, opts).outcome, "accept");
  assert.equal(validateLead({ ...valid, company: "   " }, opts).outcome, "accept");
});

// --- required fields -------------------------------------------------------

test("name and contact are both required", () => {
  for (const missing of [{ name: "" }, { contact: "" }, { name: " ", contact: " " }]) {
    const verdict = validateLead({ ...valid, ...missing }, opts);
    assert.equal(verdict.outcome, "reject");
    assert.match(verdict.error, /required/);
  }
});

// --- zip -------------------------------------------------------------------

test("zip must be exactly five digits when present", () => {
  for (const zip of ["9021", "902100", "9021a", "abcde", "90 21"]) {
    assert.equal(validateLead({ ...valid, zip }, opts).outcome, "reject", `zip: ${zip}`);
  }
});

test("zip is optional", () => {
  assert.equal(validateLead({ ...valid, zip: "" }, opts).outcome, "accept");
  assert.equal(validateLead({ groomerId: "g1", name: "D", contact: "c" }, opts).outcome, "accept");
});

test("isValidZip rejects anything but five digits", () => {
  assert.equal(isValidZip("90210"), true);
  assert.equal(isValidZip("90210-1234"), false);
  assert.equal(isValidZip(""), false);
});

// --- groomer id ------------------------------------------------------------

test("a groomer id is required when a database is configured", () => {
  const verdict = validateLead({ ...valid, groomerId: "" }, { requireGroomerId: true });
  assert.equal(verdict.outcome, "reject");
  assert.match(verdict.error, /Unknown groomer/);
});

test("demo mode accepts a lead with no groomer id", () => {
  const verdict = validateLead({ ...valid, groomerId: "" }, { requireGroomerId: false });
  assert.equal(verdict.outcome, "accept");
});

// --- accepted shape --------------------------------------------------------

test("an accepted lead comes back cleaned", () => {
  const verdict = validateLead(
    { groomerId: " g1 ", name: "  Dana ", contact: " d@e.com ", zip: " 90210 ", pet: " Beagle " },
    opts,
  );
  assert.equal(verdict.outcome, "accept");
  assert.deepEqual(verdict.lead, {
    groomerId: "g1",
    name: "Dana",
    contact: "d@e.com",
    zipCode: "90210",
    pet: "Beagle",
    message: "",
    honeypot: "",
  });
});

// --- reply-to detection ----------------------------------------------------

test("isEmailAddress decides whether the groomer gets a usable reply-to", () => {
  assert.equal(isEmailAddress("dana@example.com"), true);
  assert.equal(isEmailAddress("+1 555 0142"), false);
  assert.equal(isEmailAddress("dana@example"), false);
  assert.equal(isEmailAddress("dana example.com"), false);
  assert.equal(isEmailAddress(""), false);
});

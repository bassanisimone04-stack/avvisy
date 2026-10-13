import { test } from "node:test";
import assert from "node:assert/strict";
// The real implementation, not a restated copy — a copy drifts from the
// code it is supposed to guard.
import { isAllowedAdmin, parseAdminEmails } from "../src/lib/admin-rules.ts";

test("an empty allow-list grants nobody access", () => {
  for (const raw of ["", undefined, null, "   ", ",, ,"]) {
    assert.equal(isAllowedAdmin("me@example.com", raw), false, `raw: ${raw}`);
  }
});

test("only listed addresses are admins", () => {
  const list = "owner@example.com, second@example.com";
  assert.equal(isAllowedAdmin("owner@example.com", list), true);
  assert.equal(isAllowedAdmin("second@example.com", list), true);
  assert.equal(isAllowedAdmin("stranger@example.com", list), false);
});

test("matching is case-insensitive and ignores surrounding spaces", () => {
  assert.equal(isAllowedAdmin("Owner@Example.COM", "  owner@example.com  "), true);
  assert.equal(isAllowedAdmin("owner@example.com", "OWNER@EXAMPLE.COM"), true);
});

test("a missing email is never an admin", () => {
  const list = "owner@example.com";
  for (const email of [null, undefined, ""]) {
    assert.equal(isAllowedAdmin(email, list), false, `email: ${email}`);
  }
});

test("a partial or lookalike address is not an admin", () => {
  const list = "owner@example.com";
  assert.equal(isAllowedAdmin("owner@example.com.evil.com", list), false);
  assert.equal(isAllowedAdmin("owner@example.co", list), false);
  assert.equal(isAllowedAdmin("xowner@example.com", list), false);
});

test("the incoming email is matched strictly, without trimming", () => {
  // Only the allow-list entries are trimmed. The email itself comes from the
  // auth provider already normalized, so padding it is not something a real
  // sign-in produces — and staying strict here keeps the comparison exact.
  assert.equal(isAllowedAdmin("owner@example.com ", "owner@example.com"), false);
  assert.equal(isAllowedAdmin(" owner@example.com", "owner@example.com"), false);
});

test("parseAdminEmails normalizes and drops empties", () => {
  assert.deepEqual(parseAdminEmails(" A@x.com , ,B@x.com "), ["a@x.com", "b@x.com"]);
});

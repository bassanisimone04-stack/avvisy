import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

/**
 * Guards the column privileges in supabase/schema.sql.
 *
 * RLS decides which ROWS a role may touch, not which COLUMNS. The grants
 * below are the only thing stopping a listing owner from writing the fields
 * that represent money and trust on their own row. Nothing else in the test
 * suite would notice if a schema edit dropped one, so this reads the SQL.
 */
const schema = readFileSync(
  fileURLToPath(new URL("../supabase/schema.sql", import.meta.url)),
  "utf8",
);

/** Collects the column list from every `revoke <priv> (cols) on <table>`. */
function revokedColumns(privilege, table, role) {
  const pattern = new RegExp(
    `revoke\\s+${privilege}\\s*\\(([^)]*)\\)\\s*on\\s+${table}\\s+from\\s+${role}`,
    "gis",
  );
  const found = new Set();
  for (const match of schema.matchAll(pattern)) {
    for (const col of match[1].split(",")) {
      const name = col.trim();
      if (name) found.add(name);
    }
  }
  return found;
}

test("a listing owner cannot grant themselves a paid tier or the verified badge", () => {
  const revoked = revokedColumns("update", "groomers", "authenticated");
  for (const column of ["tier", "verified"]) {
    assert.ok(
      revoked.has(column),
      `groomers.${column} must be revoked from authenticated — otherwise an owner ` +
        `can take paid placement and the trust badge without paying`,
    );
  }
});

test("a listing owner cannot fabricate ratings", () => {
  const revoked = revokedColumns("update", "groomers", "authenticated");
  for (const column of ["rating", "review_count"]) {
    assert.ok(
      revoked.has(column),
      `groomers.${column} must be revoked — it feeds aggregateRating in the ` +
        `listing's JSON-LD, so fabricating it puts fake stars in search results`,
    );
  }
});

test("billing and identity columns are server-controlled", () => {
  const revoked = revokedColumns("update", "groomers", "authenticated");
  for (const column of [
    "owner",
    "slug",
    "city_slug",
    "published",
    "stripe_customer_id",
    "stripe_subscription_id",
    "subscription_status",
  ]) {
    assert.ok(revoked.has(column), `groomers.${column} must be revoked from authenticated`);
  }
});

test("owners can still edit the fields the dashboard exposes", () => {
  const revoked = revokedColumns("update", "groomers", "authenticated");
  // Revoking these would break the dashboard rather than secure anything.
  for (const column of ["zip_codes", "phone", "about", "tagline", "name", "website"]) {
    assert.ok(!revoked.has(column), `groomers.${column} must stay editable by its owner`);
  }
});

test("groomer contact emails are not readable through the anon key", () => {
  const revoked = revokedColumns("select", "groomers", "anon");
  assert.ok(
    revoked.has("email"),
    "groomers.email must be revoked from anon — published listings are " +
      "world-readable, so select * would hand out a ready-made spam list",
  );
});

test("a groomer cannot rewrite a customer's details on a received lead", () => {
  const revoked = revokedColumns("update", "leads", "authenticated");
  for (const column of ["groomer_id", "name", "contact", "zip_code"]) {
    assert.ok(revoked.has(column), `leads.${column} must be revoked from authenticated`);
  }
});

test("claims are decided by the admin review page, not by the claimant", () => {
  assert.match(
    schema,
    /revoke\s+update\s+on\s+claims\s+from\s+authenticated/i,
    "claims must not be updatable by the authenticated role",
  );
});

test("leads have no public select policy, so one visitor cannot read another's", () => {
  assert.ok(
    !/create\s+policy\s+\w+\s+on\s+leads\s+for\s+select\s+using\s*\(\s*true\s*\)/i.test(schema),
    "a permissive select policy on leads would expose every quote request",
  );
});

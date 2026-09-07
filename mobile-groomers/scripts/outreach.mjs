#!/usr/bin/env node
/**
 * Outreach generator for FindMobileGrooming.
 *
 * Renders the campaign templates against a prospect CSV and writes
 * ready-to-send output, applying the cadence rules from docs/OUTREACH.md:
 * opt-outs and already-claimed businesses are dropped, the four-touch cap is
 * enforced, and a prospect missing the channel's contact field is skipped.
 *
 * It deliberately does NOT send anything. Generating and sending are separate
 * steps so a bad merge is caught in a diff rather than in someone's inbox, and
 * so US business hours — not European ones — decide when mail goes out.
 *
 * Usage:
 *   node scripts/outreach.mjs --input prospects.csv --day 0
 *   node scripts/outreach.mjs --input prospects.csv --day 0 --out out/day0.csv
 *   node scripts/outreach.mjs --input prospects.csv --day 0 --suppress suppressions.txt
 *   node scripts/outreach.mjs --list
 */

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { CADENCE } from "./outreach/templates.mjs";
import { buildMessage, parseCsv, stepForDay, toCsv } from "./outreach/render.mjs";

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (!arg.startsWith("--")) continue;
    const key = arg.slice(2);
    const next = argv[i + 1];
    if (next && !next.startsWith("--")) {
      args[key] = next;
      i++;
    } else args[key] = true;
  }
  return args;
}

const args = parseArgs(process.argv.slice(2));

if (args.list) {
  console.log("Cadence (from docs/OUTREACH.md):\n");
  for (const step of CADENCE) {
    console.log(`  --day ${String(step.day).padEnd(2)}  ${step.key}`);
  }
  console.log("\nAfter day 7, stop. Mark the prospect unresponsive and leave");
  console.log("their listing live — a fifth touch buys complaints, not claims.");
  process.exit(0);
}

if (!args.input) {
  console.error("Missing --input <prospects.csv>. Try --list to see the cadence.");
  console.error("A sample file lives at scripts/outreach/prospects.example.csv");
  process.exit(1);
}

const step = stepForDay(args.day ?? 0);
if (!step) {
  console.error(`No cadence step for day ${args.day}. Valid days: ${CADENCE.map((s) => s.day).join(", ")}`);
  process.exit(1);
}

const config = {
  siteUrl: process.env.SITE_URL ?? "https://findmobilegrooming.com",
  senderName: process.env.OUTREACH_SENDER_NAME ?? "",
  senderAddress: process.env.OUTREACH_SENDER_ADDRESS ?? "",
};

// CAN-SPAM requires a real physical postal address in commercial email.
// Refusing to render without one is cheaper than a complaint.
if (step.key.startsWith("email") && (!config.senderName || !config.senderAddress)) {
  console.error("Email touches need OUTREACH_SENDER_NAME and OUTREACH_SENDER_ADDRESS.");
  console.error("CAN-SPAM requires a real physical postal address in commercial email.");
  process.exit(1);
}
if (!config.senderName) config.senderName = "the FindMobileGrooming team";

/**
 * Addresses that unsubscribed. Export the `suppressions` table from Supabase
 * as one address per line and pass it with --suppress. Skipping this on an
 * email run is a compliance failure, not a convenience — so say so loudly.
 */
const suppressed = new Set();
if (args.suppress) {
  for (const line of readFileSync(args.suppress, "utf8").split("\n")) {
    const address = line.trim().toLowerCase();
    if (address && !address.startsWith("#")) suppressed.add(address);
  }
  console.log(`Suppression list: ${suppressed.size} addresses`);
} else if (step.key.startsWith("email")) {
  console.warn("\n⚠  No --suppress list given. Anyone who unsubscribed will be");
  console.warn("   emailed again, which is a CAN-SPAM violation. Export the");
  console.warn("   suppressions table from Supabase and pass it with --suppress.\n");
}

const prospects = parseCsv(readFileSync(args.input, "utf8"));
const messages = [];
const skipped = [];

for (const prospect of prospects) {
  const result = buildMessage({ prospect, step, config, suppressed });
  if (result.skip) skipped.push({ business: prospect.business_name, reason: result.skip });
  else messages.push(result);
}

console.log(`\nStep: ${step.key} (day ${step.day})`);
console.log(`Prospects read: ${prospects.length}`);
console.log(`Ready to send:  ${messages.length}`);
console.log(`Skipped:        ${skipped.length}`);

if (skipped.length > 0) {
  console.log("\nSkipped:");
  const reasons = {};
  for (const s of skipped) reasons[s.reason] = (reasons[s.reason] ?? 0) + 1;
  for (const [reason, count] of Object.entries(reasons)) {
    console.log(`  ${String(count).padStart(4)}  ${reason}`);
  }
}

if (args.out) {
  mkdirSync(dirname(args.out), { recursive: true });
  writeFileSync(args.out, toCsv(messages, ["to", "subject", "body", "business", "day"]));
  console.log(`\nWrote ${messages.length} messages to ${args.out}`);
  console.log("Review it before importing into your sending tool.");
} else if (messages.length > 0) {
  console.log("\n--- preview (first message) ---");
  const first = messages[0];
  console.log(`To:      ${first.to}`);
  if (first.subject) console.log(`Subject: ${first.subject}`);
  console.log(`\n${first.body}`);
  console.log("\n--- end preview ---");
  console.log("\nPass --out <file.csv> to write all messages.");
}

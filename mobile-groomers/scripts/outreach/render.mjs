import { CADENCE, MAX_TOUCHES, REQUIRED_FIELD, TEMPLATES } from "./templates.mjs";

/** Minimal RFC 4180 CSV parser — handles quoted fields, escaped quotes, CRLF. */
export function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];

    if (inQuotes) {
      if (char === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += char;
      }
      continue;
    }

    if (char === '"') inQuotes = true;
    else if (char === ",") {
      row.push(field);
      field = "";
    } else if (char === "\n" || char === "\r") {
      if (char === "\r" && text[i + 1] === "\n") i++;
      row.push(field);
      // Skip blank lines rather than emitting an empty record.
      if (row.some((c) => c.trim() !== "")) rows.push(row);
      row = [];
      field = "";
    } else field += char;
  }

  row.push(field);
  if (row.some((c) => c.trim() !== "")) rows.push(row);

  if (rows.length === 0) return [];
  const headers = rows[0].map((h) => h.trim());
  return rows.slice(1).map((cells) =>
    Object.fromEntries(headers.map((h, i) => [h, (cells[i] ?? "").trim()])),
  );
}

export function toCsv(rows, headers) {
  const escape = (v) => {
    const s = String(v ?? "");
    return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return [
    headers.join(","),
    ...rows.map((r) => headers.map((h) => escape(r[h])).join(",")),
  ].join("\n");
}

/** Fills {{placeholders}}. Throws on an unresolved one rather than sending it. */
export function render(template, vars) {
  const missing = new Set();
  const out = template.replace(/\{\{(\w+)\}\}/g, (_, key) => {
    const value = vars[key];
    if (value === undefined || value === "") {
      missing.add(key);
      return "";
    }
    return value;
  });
  if (missing.size > 0) {
    throw new Error(`unresolved placeholders: ${[...missing].join(", ")}`);
  }
  return out;
}

const TRUTHY = new Set(["1", "true", "yes", "y", "stop", "unsubscribed", "opted_out"]);

/**
 * Decides whether a prospect should receive a given touch, and renders it.
 * Returns { skip: reason } instead of throwing so one bad row never aborts
 * a whole run.
 */
export function buildMessage({ prospect, step, config, suppressed = new Set() }) {
  const template = TEMPLATES[step.key];
  if (!template) return { skip: `unknown template ${step.key}` };

  if (TRUTHY.has((prospect.opted_out ?? "").toLowerCase())) {
    return { skip: "opted out" };
  }

  const address = (prospect.email ?? "").toLowerCase();
  if (address && suppressed.has(address)) {
    return { skip: "on the suppression list" };
  }

  const touches = Number(prospect.touches ?? 0);
  if (touches >= MAX_TOUCHES) {
    return { skip: `already had ${touches} touches (max ${MAX_TOUCHES})` };
  }

  if ((prospect.claimed ?? "").toLowerCase() === "true") {
    return { skip: "already claimed their listing" };
  }

  const field = REQUIRED_FIELD[template.channel];
  const contact = prospect[field];
  if (!contact) return { skip: `no ${field} on file` };

  const slug = prospect.listing_slug ?? "";
  const citySlug = prospect.city_slug ?? "";
  const vars = {
    // "there" keeps the greeting natural when no owner name was found.
    firstName: prospect.first_name || "there",
    businessName: prospect.business_name,
    city: prospect.city,
    state: prospect.state,
    zip: prospect.zip,
    listingUrl:
      slug && citySlug ? `${config.siteUrl}/groomers/${citySlug}/${slug}` : config.siteUrl,
    claimUrl: slug ? `${config.siteUrl}/claim?listing=${slug}` : `${config.siteUrl}/claim`,
    senderName: config.senderName,
    senderAddress: config.senderAddress,
    unsubscribeUrl: `${config.siteUrl}/unsubscribe?e=${encodeURIComponent(prospect.email ?? "")}`,
  };

  try {
    return {
      channel: template.channel,
      to: contact,
      subject: template.subject ? render(template.subject, vars) : "",
      body: render(template.body, vars),
      business: prospect.business_name,
      day: step.day,
    };
  } catch (err) {
    return { skip: err.message };
  }
}

export function stepForDay(day) {
  return CADENCE.find((s) => s.day === Number(day));
}

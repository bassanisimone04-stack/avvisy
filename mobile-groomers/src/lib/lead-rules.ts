/**
 * Pure validation and normalization for inbound leads.
 *
 * Free of Next and Supabase imports so tests exercise the real rules rather
 * than a restated copy. The route handler in app/api/leads owns the I/O;
 * everything decidable from the payload alone lives here.
 */

/** Longest accepted value for any single field. */
export const MAX_FIELD = 500;

export type LeadInput = {
  groomerId: string;
  name: string;
  contact: string;
  zipCode: string;
  pet: string;
  message: string;
  honeypot: string;
};

export type LeadVerdict =
  | { outcome: "accept"; lead: LeadInput }
  /** A bot filled the hidden field. Answer 200 so it learns nothing. */
  | { outcome: "silent-drop" }
  | { outcome: "reject"; error: string };

/** Trims and caps a value, tolerating non-string input. */
export function clean(value: unknown): string {
  return typeof value === "string" ? value.trim().slice(0, MAX_FIELD) : "";
}

export function isValidZip(zip: string): boolean {
  return /^\d{5}$/.test(zip);
}

export function isEmailAddress(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

/**
 * Decides what to do with a submitted payload.
 *
 * `requireGroomerId` is false in demo mode, where there is no database and
 * so no listing to attach the lead to.
 */
export function validateLead(
  body: Record<string, unknown>,
  { requireGroomerId }: { requireGroomerId: boolean },
): LeadVerdict {
  const lead: LeadInput = {
    groomerId: clean(body.groomerId),
    name: clean(body.name),
    contact: clean(body.contact),
    zipCode: clean(body.zip),
    pet: clean(body.pet),
    message: clean(body.message),
    honeypot: clean(body.company),
  };

  if (lead.honeypot) return { outcome: "silent-drop" };

  if (!lead.name || !lead.contact) {
    return { outcome: "reject", error: "Name and a contact detail are required." };
  }

  if (lead.zipCode && !isValidZip(lead.zipCode)) {
    return { outcome: "reject", error: "Zip code must be five digits." };
  }

  if (requireGroomerId && !lead.groomerId) {
    return { outcome: "reject", error: "Unknown groomer." };
  }

  return { outcome: "accept", lead };
}

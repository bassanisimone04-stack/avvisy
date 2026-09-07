/**
 * Transactional email through Resend's HTTP API.
 *
 * Called with fetch rather than the SDK to avoid another dependency — the
 * API is a single POST. Returns false instead of throwing when unconfigured
 * or on failure, so a delivery problem never loses the lead itself: the row
 * is already committed before any mail is attempted.
 */

const RESEND_API_KEY = process.env.RESEND_API_KEY ?? "";
const FROM = process.env.LEAD_FROM_EMAIL ?? "";

export const isEmailConfigured = RESEND_API_KEY.length > 0 && FROM.length > 0;

export async function sendEmail({
  to,
  subject,
  text,
  replyTo,
}: {
  to: string;
  subject: string;
  text: string;
  replyTo?: string;
}): Promise<boolean> {
  if (!isEmailConfigured) return false;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM,
        to: [to],
        subject,
        text,
        ...(replyTo ? { reply_to: replyTo } : {}),
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

/** Looks like an email address, so the lead can be replied to directly. */
export function isEmailAddress(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

/**
 * Executable source of truth for the outreach copy.
 *
 * docs/OUTREACH.md explains the strategy and shows the same messages for
 * reading; this file is what actually renders them, so edits made here are
 * the ones that reach prospects. Keep the two in sync when copy changes.
 */

/** Channels, in the order the cadence uses them. */
export const CHANNELS = ["email", "instagram", "sms"];

/** Which contact field a channel needs. A row without it is skipped. */
export const REQUIRED_FIELD = {
  email: "email",
  instagram: "instagram",
  sms: "phone",
};

export const TEMPLATES = {
  "email:0": {
    channel: "email",
    subject: "Your mobile grooming listing in {{city}} is live",
    body: `Hi {{firstName}},

I run FindMobileGrooming.com — a US directory built specifically for van-based
mobile groomers (not a general salon site).

{{businessName}} is already indexed on it, here:
{{listingUrl}}

Right now your profile shows the basics we could verify publicly: your name,
{{city}}, and one phone line. It's free and it stays free.

The one thing worth 2 minutes of your time: claiming the profile lets you set
the exact zip codes your van actually covers. That's what determines whether
you show up when someone in {{zip}} searches "mobile dog groomer near me."
Right now we're guessing at your radius, which means you're probably getting
matched to the wrong neighborhoods.

Claim it here (no card, no call):
{{claimUrl}}

If it's not a fit, just reply "remove" and I'll take the listing down.

Best,
{{senderName}}
FindMobileGrooming.com
{{senderAddress}}
Unsubscribe: {{unsubscribeUrl}}`,
  },

  "email:4": {
    channel: "email",
    subject: "Re: Your mobile grooming listing in {{city}} is live",
    body: `Hi {{firstName}} — quick nudge on this one.

Your listing is still showing our best-guess service area rather than your real
zip codes, which means you may be matched to the wrong neighborhoods.

Two-minute fix: {{claimUrl}}

If you'd rather not be listed, reply "remove" and it's done today.

{{senderName}}
FindMobileGrooming.com
{{senderAddress}}
Unsubscribe: {{unsubscribeUrl}}`,
  },

  "instagram:2": {
    channel: "instagram",
    body: `Hey! 👋 Quick heads up — I run FindMobileGrooming.com, a US directory just for mobile grooming vans.

{{businessName}} is already listed on there (free, nothing owed).

If you claim it you can set the exact zips your van covers, so you show up for the right neighborhoods instead of our best guess. Takes about 2 min.

Want me to send the claim link?`,
  },

  "sms:7": {
    channel: "sms",
    body: `Hi {{firstName}}, this is {{senderName}} from FindMobileGrooming.com — a US directory for mobile grooming vans. {{businessName}} is listed free here: {{listingUrl}}

Claim it to set the zip codes your van covers & get direct leads: {{claimUrl}}

Reply STOP to opt out.`,
  },
};

/**
 * Touch schedule from docs/OUTREACH.md. Never exceed four touches — a
 * prospect who ignores four messages will not convert, and continued contact
 * risks the spam complaints that cost you the sending domain.
 */
export const CADENCE = [
  { day: 0, key: "email:0" },
  { day: 2, key: "instagram:2" },
  { day: 4, key: "email:4" },
  { day: 7, key: "sms:7" },
];

export const MAX_TOUCHES = CADENCE.length;

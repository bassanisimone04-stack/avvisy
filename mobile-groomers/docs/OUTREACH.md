# B2B Outreach Templates — FindMobileGrooming.com

Templates for contacting US mobile groomers asynchronously (no live calls
required, which matters when operating from a European timezone).

**Operating principles**

- Lead with the fact their listing already exists — this removes the "cold
  pitch" framing and turns the message into a notification.
- Never ask for money in the first touch. The claim is free; monetization
  happens after they see lead volume.
- Always include the direct listing URL. Friction kills claim rates.
- Send in the recipient's local business hours (9am–5pm their time), not yours.
  Schedule sends rather than firing at European morning.
- Comply with US anti-spam rules: CAN-SPAM requires a real physical address and
  a working opt-out in commercial email; SMS to a mobile number requires prior
  consent under the TCPA, so only send SMS to numbers the business has
  published publicly as a business contact line, and honor STOP immediately.

---

## 1. Cold Email

**Subject line options (A/B test these):**

- `Your mobile grooming listing in {{City}} is live`
- `{{BusinessName}} — you're indexed on FindMobileGrooming (free)`
- `Pet owners in {{Zip}} are searching for your van`

**Body:**

```
Hi {{FirstName}},

I run FindMobileGrooming.com — a US directory built specifically for van-based
mobile groomers (not a general salon site).

{{BusinessName}} is already indexed on it, here:
{{ListingURL}}

Right now your profile shows the basics we could verify publicly: your name,
{{City}}, and one phone line. It's free and it stays free.

The one thing worth 2 minutes of your time: claiming the profile lets you set
the exact zip codes your van actually covers. That's what determines whether
you show up when someone in {{Zip}} searches "mobile dog groomer near me."
Right now we're guessing at your radius, which means you're probably getting
matched to the wrong neighborhoods.

Claim it here (no card, no call):
{{ClaimURL}}

If it's not a fit, just reply "remove" and I'll take the listing down.

Best,
{{YourName}}
FindMobileGrooming.com
{{PhysicalAddress}}
Unsubscribe: {{UnsubscribeURL}}
```

**Follow-up (send 4 days later, same thread, only if no reply):**

```
Hi {{FirstName}} — quick nudge on this one.

Since I emailed, {{N}} people searched for mobile grooming in {{City}} on the
site. Your listing is still showing our best-guess service area rather than
your real zip codes.

Two-minute fix: {{ClaimURL}}

If you'd rather not be listed, reply "remove" and it's done today.

{{YourName}}
```

---

## 2. Instagram DM

Mobile groomers are heavily Instagram-native — often more responsive there than
on email. Keep it short, lowercase-friendly, and never paste a wall of text.

**Opening message:**

```
Hey! 👋 Quick heads up — I run FindMobileGrooming.com, a US directory just for
mobile grooming vans.

{{BusinessName}} is already listed on there (free, nothing owed):
{{ListingURL}}

If you claim it you can set the exact zips your van covers, so you show up for
the right neighborhoods instead of our best guess. Takes about 2 min.

Want me to send the claim link?
```

**Why the ask at the end:** ending with a question rather than a link improves
reply rate and avoids Instagram's link-in-first-DM filtering. Send
`{{ClaimURL}}` in the second message once they reply.

**If they reply "yes":**

```
Here you go: {{ClaimURL}}

You'll set your zips, add your booking link, and get the verified van badge.
Leads come straight to your phone — no dashboard to babysit.

Anything looks wrong on the listing, tell me and I'll fix it on my end.
```

---

## 3. SMS

Only to publicly published business lines. Keep under 320 characters (2
segments) and always identify the sender in the first message.

**Initial:**

```
Hi {{FirstName}}, this is {{YourName}} from FindMobileGrooming.com — a US
directory for mobile grooming vans. {{BusinessName}} is listed free here:
{{ListingURL}}

Claim it to set the zip codes your van covers & get direct leads:
{{ClaimURL}}

Reply STOP to opt out.
```

**Follow-up (once, 3+ days later):**

```
{{FirstName}} — following up on your free FindMobileGrooming listing for
{{BusinessName}}. Setting your real service zips takes 2 min and controls which
searches you appear in: {{ClaimURL}}

Reply STOP to opt out.
```

---

## Merge fields

| Field | Source |
| --- | --- |
| `{{FirstName}}` | Owner name, from public profile; fall back to "there" |
| `{{BusinessName}}` | `groomer.name` |
| `{{City}}` | `groomer.city` |
| `{{Zip}}` | First entry in `groomer.zipCodes` |
| `{{ListingURL}}` | `/groomers/{citySlug}/{slug}` |
| `{{ClaimURL}}` | `/claim?listing={slug}` |
| `{{N}}` | Search count for that city over the follow-up window |

## Sequence cadence

| Day | Channel | Notes |
| --- | --- | --- |
| 0 | Email | Primary touch |
| 2 | Instagram DM | Only if IG handle is known |
| 4 | Email follow-up | Same thread, reply-to-thread |
| 7 | SMS | Only for published business lines |
| 14 | Stop | Mark as unresponsive; keep listing live |

Never exceed 4 touches. A groomer who ignores 4 messages will not convert, and
continued contact risks spam complaints that damage domain reputation.

# B2B Outreach — FindMobileGrooming.com

> **The copy below is documentation. The executable source is
> `scripts/outreach/templates.mjs`** — that is what actually renders the
> messages. Edit both together when copy changes.
>
> ```bash
> node scripts/outreach.mjs --list                     # show the cadence
> node scripts/outreach.mjs --input prospects.csv --day 0 \
>      --suppress suppressions.txt --out out/day0.csv
> ```
>
> The generator applies every rule on this page automatically: it drops
> opt-outs and suppressed addresses, skips businesses that already claimed,
> enforces the four-touch cap, and skips anyone missing that channel's contact
> field. It refuses to render an email touch without a physical postal
> address, and warns loudly if you run an email step without a suppression
> list.
>
> It does **not** send. Generating and sending are separate on purpose: a bad
> merge shows up in a diff instead of in someone's inbox, and you choose the
> send window so mail lands in US business hours rather than European ones.

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

Your listing is still showing our best-guess service area rather than your real
zip codes, which means you may be matched to the wrong neighborhoods.

Two-minute fix: {{ClaimURL}}

If you'd rather not be listed, reply "remove" and it's done today.

{{YourName}}
FindMobileGrooming.com
{{PhysicalAddress}}
Unsubscribe: {{UnsubscribeURL}}
```

An earlier draft opened this with "since I emailed, N people searched for
mobile grooming in {{City}}." That number is only usable if you actually
measure it per city — quoting an unverified figure to a business owner is the
fastest way to lose their trust, so the executable template does not include
it. Add it back only when the analytics behind it are real.

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

**If they reply "yes"** (sent by hand — the generator produces the opener
only, since this one depends on their reply):

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

## Prospect CSV

The generator reads these columns — see
`scripts/outreach/prospects.example.csv`:

| Column | Purpose |
| --- | --- |
| `business_name` | Required. Used in every template. |
| `first_name` | Owner name; falls back to "there" when unknown. |
| `city`, `state`, `zip` | Location merge fields. |
| `city_slug`, `listing_slug` | Build the listing and claim URLs. |
| `email`, `instagram`, `phone` | Channel contact. A row without the channel's field is skipped. |
| `touches` | Touches already sent. At 4, the row is dropped. |
| `opted_out` | Any of yes/true/1/stop drops the row permanently. |
| `claimed` | `true` drops the row — they already converted. |

An unresolved `{{placeholder}}` throws rather than sending a message with a
blank in it.

## Compliance

- **CAN-SPAM** — commercial email needs a real physical postal address and a
  working opt-out. `/unsubscribe` records the address in the `suppressions`
  table; export that table and pass it with `--suppress` on every email run.
  An unsubscribe link that 404s is worse than no link at all.
- **TCPA** — SMS to a mobile number needs prior consent. Only text numbers a
  business has published publicly as a business contact line, and honor STOP
  immediately.
- **Four touches, then stop.** A prospect who ignores four messages will not
  convert, and continued contact buys spam complaints that cost you the
  sending domain — which is far more expensive than the lost prospect.

## Sequence cadence

| Day | Channel | Notes |
| --- | --- | --- |
| 0 | Email | Primary touch |
| 2 | Instagram DM | Only if IG handle is known |
| 4 | Email follow-up | Same thread, reply-to-thread |
| 7 | SMS | Only for published business lines |
| 14 | Stop | Mark as unresponsive; keep listing live |

The generator enforces this cap from the `touches` column — see **Compliance**
above.

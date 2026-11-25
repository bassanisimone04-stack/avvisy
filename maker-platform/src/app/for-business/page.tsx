import { Check } from "lucide-react";
import { SimplePage } from "@/components/layout/simple-page";
import { Badge } from "@/components/ui/badge";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "List your business",
  description: "Put your workshop, CNC service or lumber yard on the map.",
  path: "/for-business",
  index: false,
});

const tiers = [
  { name: "Free", note: "Always free", features: ["Presence on the map", "Essential information", "Contact details", "Website link"] },
  { name: "Pro", note: "Planned — pricing to be tested", features: ["Everything in Free", "Extended description", "Photo gallery", "Contact form", "Service showcase", "Visitor statistics"] },
  { name: "Business", note: "Planned — pricing to be tested", features: ["Everything in Pro", "Clearly labeled sponsored placement", "Newsletter feature", "Advanced analytics", "Digital resources"] },
];

export default function ForBusinessPage() {
  return (
    <SimplePage
      eyebrow="For businesses"
      title="Put your business on the map."
      lede="Listings open with the live directory. Basic listings will always be free, and fixing your details or verifying ownership will never require payment."
      path="/for-business"
      label="For businesses"
    >
      <div className="grid gap-4 lg:grid-cols-3">
        {tiers.map((t, i) => (
          <div key={t.name} className={i === 0 ? "rounded-lg bg-forest p-7 text-ivory" : "rounded-lg border border-line bg-white p-7"}>
            <div className="flex items-center justify-between">
              <h2 className={i === 0 ? "text-display-sm text-ivory" : "text-display-sm"}>{t.name}</h2>
              <Badge tone={i === 0 ? "forest" : "outline"} className={i === 0 ? "bg-ivory text-forest" : undefined}>
                {t.note}
              </Badge>
            </div>
            <ul className="mt-6 space-y-2.5 text-sm">
              {t.features.map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <Check className={i === 0 ? "mt-0.5 size-4 text-[#B8C2AC]" : "mt-0.5 size-4 text-sage-ink"} aria-hidden />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <section id="claim" aria-labelledby="claim-h" className="mt-16 grid gap-8 rounded-lg bg-ivory-deep p-8 md:grid-cols-2 md:p-12">
        <div>
          <h2 id="claim-h" className="text-display-sm">
            Claim or correct a listing
          </h2>
          <p className="mt-3 leading-relaxed text-muted">
            Ownership verification and corrections are free. Requests will be reviewed by a person; the request form opens together with accounts.
          </p>
        </div>
        <ol className="space-y-4 text-sm">
          {["Find your business on the map", "Choose “Claim it — free” on the listing", "Verify with a business email or document", "Edit your information once approved"].map((s, i) => (
            <li key={s} className="flex gap-4">
              <span className="nums font-display text-2xl text-clay-ink italic">{i + 1}</span>
              <span className="pt-1.5">{s}</span>
            </li>
          ))}
        </ol>
      </section>
    </SimplePage>
  );
}

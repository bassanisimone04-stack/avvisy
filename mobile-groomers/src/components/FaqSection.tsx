import { CORE_FAQS } from "@/data/faqs";

export default function FaqSection() {
  return (
    <section className="container-page py-16 sm:py-20" id="faq">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl sm:text-4xl">Mobile Dog Grooming: Common Questions</h2>
        <p className="mt-3 text-ink-soft">Straight answers to what pet owners ask before booking.</p>
      </div>

      <div className="mx-auto mt-10 max-w-3xl divide-y divide-line rounded-2xl border border-line bg-surface">
        {CORE_FAQS.map((faq) => (
          <details key={faq.question} className="group p-6 open:bg-surface-2">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-base font-bold text-navy">
              <h3 className="text-base">{faq.question}</h3>
              <span className="shrink-0 text-teal transition-transform group-open:rotate-45">＋</span>
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-ink-soft">{faq.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

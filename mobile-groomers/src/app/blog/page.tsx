import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mobile Grooming Guides & Advice",
  description:
    "Guides on mobile dog grooming costs, what to expect at your first appointment, and how to prepare your home.",
  alternates: { canonical: "/blog" },
};

/**
 * Editorial hub for long-tail search capture. Posts are placeholders until
 * the content pipeline lands — see docs/SEO.md for the target keyword set.
 */
const POSTS = [
  {
    slug: "mobile-dog-grooming-cost",
    title: "How Much Does Mobile Dog Grooming Cost in 2026?",
    excerpt: "A state-by-state breakdown of what mobile groomers charge, and what drives the price up.",
    category: "Costs",
  },
  {
    slug: "first-mobile-grooming-appointment",
    title: "Your First Mobile Grooming Appointment: What to Expect",
    excerpt: "From where the van parks to how long it takes — a walkthrough of the whole visit.",
    category: "Guides",
  },
  {
    slug: "mobile-grooming-vs-salon",
    title: "Mobile Grooming vs. Salon: Which Is Right for Your Dog?",
    excerpt: "An honest comparison, including the cases where a traditional salon is the better call.",
    category: "Guides",
  },
];

export default function BlogIndexPage() {
  return (
    <section className="container-page py-16 sm:py-20">
      <h1 className="text-4xl">Mobile Grooming Guides</h1>
      <p className="mt-3 max-w-xl text-ink-soft">
        Practical advice for pet owners considering at-home, van-based grooming.
      </p>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {POSTS.map((post) => (
          <article key={post.slug} className="card p-6">
            <div className="flex items-center gap-2">
              <span className="chip chip-neutral">{post.category}</span>
              <span className="chip chip-teal">Coming soon</span>
            </div>
            <h2 className="mt-3 text-lg">{post.title}</h2>
            <p className="mt-2 text-sm text-ink-soft">{post.excerpt}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

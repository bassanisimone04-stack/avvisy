import type { Metadata } from "next";
import Link from "next/link";
import { POSTS } from "@/data/posts";
import { SITE_NAME, SITE_URL } from "@/lib/site-config";
import { JsonLd, breadcrumbJsonLd } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Mobile Grooming Guides & Advice",
  description:
    "Guides on mobile dog grooming costs, what to expect at your first appointment, and how it compares to a traditional salon.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Mobile Grooming Guides & Advice",
    description:
      "Guides on mobile dog grooming costs, what to expect at your first appointment, and how it compares to a traditional salon.",
    url: `${SITE_URL}/blog`,
    siteName: SITE_NAME,
    type: "website",
  },
};

export default function BlogIndexPage() {
  return (
    <section className="container-page py-16 sm:py-20">
      {/* Blog + ItemList so the hub is understood as a collection rather than
          a loose page of links, and each entry is attributed to this site. */}
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Blog",
          "@id": `${SITE_URL}/blog#blog`,
          name: `${SITE_NAME} Guides`,
          description:
            "Practical advice for pet owners considering at-home, van-based grooming.",
          url: `${SITE_URL}/blog`,
          inLanguage: "en-US",
          publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
          blogPost: POSTS.map((post) => ({
            "@type": "BlogPosting",
            "@id": `${SITE_URL}/blog/${post.slug}#article`,
            headline: post.title,
            description: post.description,
            datePublished: post.published,
            dateModified: post.updated,
            url: `${SITE_URL}/blog/${post.slug}`,
          })),
        }}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: SITE_URL },
          { name: "Blog", url: `${SITE_URL}/blog` },
        ])}
      />

      <h1 className="text-4xl">Mobile Grooming Guides</h1>
      <p className="mt-3 max-w-xl text-ink-soft">
        Practical advice for pet owners considering at-home, van-based grooming.
      </p>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {POSTS.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`} className="card card-hover flex flex-col p-6">
            <span className="chip chip-neutral w-fit">{post.category}</span>
            <h2 className="mt-3 text-lg">{post.title}</h2>
            <p className="mt-2 flex-1 text-sm text-ink-soft">{post.description}</p>
            <span className="mt-4 flex items-center justify-between text-sm text-ink-soft">
              <time dateTime={post.published}>
                {new Date(post.published).toLocaleDateString("en-US", {
                  month: "short",
                  year: "numeric",
                })}
              </time>
              <span className="font-semibold text-teal-dark">
                {post.readingMinutes} min read →
              </span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

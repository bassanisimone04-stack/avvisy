import type { Metadata } from "next";
import Link from "next/link";
import { POSTS } from "@/data/posts";

export const metadata: Metadata = {
  title: "Mobile Grooming Guides & Advice",
  description:
    "Guides on mobile dog grooming costs, what to expect at your first appointment, and how it compares to a traditional salon.",
  alternates: { canonical: "/blog" },
};

export default function BlogIndexPage() {
  return (
    <section className="container-page py-16 sm:py-20">
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
            <span className="mt-4 text-sm font-semibold text-teal-dark">
              {post.readingMinutes} min read →
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { POSTS, getPost } from "@/data/posts";
import { SITE_NAME, SITE_URL } from "@/lib/site-config";
import { JsonLd, breadcrumbJsonLd } from "@/lib/schema";

export function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.published,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const pageUrl = `${SITE_URL}/blog/${post.slug}`;
  const related = POSTS.filter((p) => p.slug !== post.slug).slice(0, 2);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: post.title,
          description: post.description,
          datePublished: post.published,
          dateModified: post.published,
          author: { "@type": "Organization", name: SITE_NAME },
          publisher: { "@type": "Organization", name: SITE_NAME },
          mainEntityOfPage: pageUrl,
        }}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: SITE_URL },
          { name: "Blog", url: `${SITE_URL}/blog` },
          { name: post.title, url: pageUrl },
        ])}
      />

      <article className="container-page max-w-3xl py-14 sm:py-20">
        <nav className="text-sm text-ink-soft">
          <Link href="/blog" className="hover:text-navy">Blog</Link> / {post.category}
        </nav>

        <h1 className="mt-4 text-4xl sm:text-5xl">{post.title}</h1>
        <p className="mt-4 text-lg text-ink-soft">{post.description}</p>

        <div className="mt-5 flex items-center gap-3 text-sm text-ink-soft">
          <span className="chip chip-neutral">{post.category}</span>
          <span>{post.readingMinutes} min read</span>
          <time dateTime={post.published}>
            {new Date(post.published).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
        </div>

        <div className="mt-12 space-y-10">
          {post.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="text-2xl">{section.heading}</h2>
              {section.paragraphs.map((p) => (
                <p key={p.slice(0, 40)} className="mt-4 leading-relaxed text-ink-soft">
                  {p}
                </p>
              ))}
              {section.list && (
                <ul className="mt-4 space-y-2.5">
                  {section.list.map((item) => (
                    <li key={item} className="flex gap-3 leading-relaxed text-ink-soft">
                      <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-teal" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>

        <aside className="mt-14 rounded-2xl border border-teal bg-teal-soft p-7">
          <h2 className="text-xl text-navy">Looking for a mobile groomer near you?</h2>
          <p className="mt-2 text-sm text-ink-soft">
            Search by zip code to see which vans actually cover your address.
          </p>
          <Link href="/cities" className="btn btn-navy mt-5">Browse groomers</Link>
        </aside>

        {related.length > 0 && (
          <div className="mt-14">
            <h2 className="text-xl">Keep reading</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {related.map((p) => (
                <Link key={p.slug} href={`/blog/${p.slug}`} className="card card-hover p-5">
                  <span className="chip chip-neutral">{p.category}</span>
                  <h3 className="mt-3 text-base">{p.title}</h3>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>
    </>
  );
}

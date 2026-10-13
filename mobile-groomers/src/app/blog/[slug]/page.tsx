import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import RichText from "@/components/RichText";
import { POSTS, getPost, headingId } from "@/data/posts";
import { SITE_NAME, SITE_URL } from "@/lib/site-config";
import { JsonLd, breadcrumbJsonLd, faqPageJsonLd } from "@/lib/schema";

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

  const url = `${SITE_URL}/blog/${post.slug}`;
  return {
    title: post.title,
    description: post.description,
    keywords: post.keywords,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      url,
      siteName: SITE_NAME,
      type: "article",
      publishedTime: post.published,
      modifiedTime: post.updated,
      section: post.category,
      tags: post.keywords,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
    },
  };
}

/** Rough word count, used for the schema's wordCount signal. */
function countWords(post: NonNullable<ReturnType<typeof getPost>>): number {
  const text = post.sections
    .flatMap((s) => [s.heading, ...s.paragraphs, ...(s.list ?? [])])
    .join(" ");
  return text.split(/\s+/).filter(Boolean).length;
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
          "@id": `${pageUrl}#article`,
          headline: post.title,
          description: post.description,
          datePublished: post.published,
          dateModified: post.updated,
          articleSection: post.category,
          keywords: post.keywords.join(", "),
          wordCount: countWords(post),
          inLanguage: "en-US",
          isAccessibleForFree: true,
          author: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
          publisher: {
            "@type": "Organization",
            name: SITE_NAME,
            url: SITE_URL,
            logo: { "@type": "ImageObject", url: `${SITE_URL}/icon.svg` },
          },
          mainEntityOfPage: { "@type": "WebPage", "@id": pageUrl },
        }}
      />
      <JsonLd data={faqPageJsonLd(post.faqs)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: SITE_URL },
          { name: "Blog", url: `${SITE_URL}/blog` },
          { name: post.title, url: pageUrl },
        ])}
      />

      <article className="container-page max-w-3xl py-14 sm:py-20">
        <nav className="text-sm text-ink-soft" aria-label="Breadcrumb">
          <Link href="/blog" className="hover:text-navy">Blog</Link> / {post.category}
        </nav>

        <h1 className="mt-4 text-4xl sm:text-5xl">{post.title}</h1>
        <p className="mt-4 text-lg text-ink-soft">{post.description}</p>

        <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-ink-soft">
          <span className="chip chip-neutral">{post.category}</span>
          <span>{post.readingMinutes} min read</span>
          <time dateTime={post.published}>
            Published{" "}
            {new Date(post.published).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
          {post.updated !== post.published && (
            <time dateTime={post.updated}>
              Updated{" "}
              {new Date(post.updated).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
          )}
        </div>

        {/* Anchored contents — also what Google uses to build "jump to" links. */}
        <nav aria-label="On this page" className="mt-10 rounded-xl border border-line bg-surface-2 p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-soft">
            On this page
          </h2>
          <ol className="mt-3 space-y-1.5 text-sm">
            {post.sections.map((section) => (
              <li key={section.heading}>
                <a
                  href={`#${headingId(section.heading)}`}
                  className="text-teal-dark hover:text-navy hover:underline"
                >
                  {section.heading}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="mt-12 space-y-10">
          {post.sections.map((section) => (
            <section key={section.heading}>
              <h2 id={headingId(section.heading)} className="scroll-mt-24 text-2xl">
                {section.heading}
              </h2>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 40)} className="mt-4 leading-relaxed text-ink-soft">
                  <RichText text={paragraph} />
                </p>
              ))}
              {section.list && (
                <ul className="mt-4 space-y-2.5">
                  {section.list.map((item) => (
                    <li key={item} className="flex gap-3 leading-relaxed text-ink-soft">
                      <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-teal" />
                      <span><RichText text={item} /></span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>

        <section className="mt-14" id="faq">
          <h2 id="frequently-asked-questions" className="scroll-mt-24 text-2xl">
            Frequently asked questions
          </h2>
          <div className="mt-5 divide-y divide-line rounded-2xl border border-line bg-surface">
            {post.faqs.map((faq) => (
              <details key={faq.question} className="group p-5 open:bg-surface-2">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-base font-bold text-navy">
                  <h3 className="text-base">{faq.question}</h3>
                  <span aria-hidden className="shrink-0 text-teal transition-transform group-open:rotate-45">＋</span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-ink-soft">{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>

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

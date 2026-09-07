import { ImageResponse } from "next/og";
import { POSTS, getPost } from "@/data/posts";
import { SITE_DOMAIN } from "@/lib/site-config";

export const alt = "FindMobileGrooming guide";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Pre-render one card per post so sharing does not wait on a cold render.
export function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }));
}

/**
 * Per-article share card. Generated at build time rather than shipped as a
 * static file so the headline always matches the post — a stale or generic
 * card measurably costs click-through on shared links.
 *
 * Uses system fonts only: fetching a webfont here would add a network
 * dependency to the build for a decorative gain.
 */
export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0F172A",
          padding: "72px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {/* Paw mark drawn with plain divs. An emoji would need a bundled
              emoji font here and renders as an empty box without one. */}
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              background: "#0EA5E9",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 3,
            }}
          >
            <div style={{ display: "flex", gap: 4 }}>
              <div style={{ width: 9, height: 9, borderRadius: 9, background: "#0F172A" }} />
              <div style={{ width: 9, height: 9, borderRadius: 9, background: "#0F172A" }} />
              <div style={{ width: 9, height: 9, borderRadius: 9, background: "#0F172A" }} />
            </div>
            <div style={{ width: 22, height: 15, borderRadius: 11, background: "#0F172A" }} />
          </div>
          <div style={{ color: "#E2E8F0", fontSize: 30, fontWeight: 700 }}>
            {SITE_DOMAIN}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          {post && (
            <div
              style={{
                color: "#0EA5E9",
                fontSize: 26,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: 2,
                marginBottom: 20,
              }}
            >
              {post.category}
            </div>
          )}
          <div
            style={{
              color: "#FFFFFF",
              fontSize: post && post.title.length > 46 ? 62 : 74,
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: -1.5,
            }}
          >
            {post?.title ?? "Mobile Dog Grooming Guides"}
          </div>
        </div>

        <div style={{ color: "#94A3B8", fontSize: 26 }}>
          {post ? `${post.readingMinutes} min read` : "Find a mobile groomer near you"}
        </div>
      </div>
    ),
    size,
  );
}

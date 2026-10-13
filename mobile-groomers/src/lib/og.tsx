import { SITE_DOMAIN } from "@/lib/site-config";

/**
 * Shared share-card layout for every generated OG image.
 *
 * Kept in one place so the homepage, listings, city pages and articles read
 * as one brand in a feed. Uses system fonts and plain divs only: a webfont
 * would add a network dependency to the build, and an emoji renders as an
 * empty box without a bundled emoji font.
 */

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

const NAVY = "#0F172A";
const TEAL = "#0EA5E9";
const SLATE = "#94A3B8";
const MIST = "#E2E8F0";

function PawMark() {
  return (
    <div
      style={{
        width: 56,
        height: 56,
        borderRadius: 14,
        background: TEAL,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 3,
      }}
    >
      <div style={{ display: "flex", gap: 4 }}>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{ width: 9, height: 9, borderRadius: 9, background: NAVY }} />
        ))}
      </div>
      <div style={{ width: 22, height: 15, borderRadius: 11, background: NAVY }} />
    </div>
  );
}

export function OgCard({
  eyebrow,
  title,
  footer,
  badges = [],
}: {
  eyebrow?: string;
  title: string;
  footer?: string;
  badges?: string[];
}) {
  // Long headlines step down a size rather than overflowing the card.
  const titleSize = title.length > 64 ? 56 : title.length > 46 ? 64 : 74;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: NAVY,
        padding: 72,
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <PawMark />
        <div style={{ color: MIST, fontSize: 30, fontWeight: 700 }}>{SITE_DOMAIN}</div>
      </div>

      <div style={{ display: "flex", flexDirection: "column" }}>
        {eyebrow && (
          <div
            style={{
              color: TEAL,
              fontSize: 26,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: 2,
              marginBottom: 20,
            }}
          >
            {eyebrow}
          </div>
        )}
        <div
          style={{
            color: "#FFFFFF",
            fontSize: titleSize,
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: -1.5,
          }}
        >
          {title}
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ color: SLATE, fontSize: 26 }}>{footer ?? ""}</div>
        <div style={{ display: "flex", gap: 12 }}>
          {badges.slice(0, 3).map((badge) => (
            <div
              key={badge}
              style={{
                color: MIST,
                fontSize: 22,
                fontWeight: 600,
                padding: "10px 20px",
                borderRadius: 999,
                border: `2px solid #1E293B`,
              }}
            >
              {badge}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

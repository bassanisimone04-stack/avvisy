import { ImageResponse } from "next/og";

export const OG_SIZE = { width: 1200, height: 630 };

/** Text-only share card (no film stills or product photos). */
export function ogCard({ eyebrow, title, footer }: { eyebrow: string; title: string; footer?: string }) {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 72, background: "linear-gradient(135deg,#121316 0%,#2a2620 100%)", color: "#fff" }}>
        <div style={{ display: "flex", fontSize: 28, letterSpacing: 6, textTransform: "uppercase", color: "#c9aa71" }}>{eyebrow}</div>
        <div style={{ display: "flex", fontSize: title.length > 48 ? 66 : 82, lineHeight: 1.05, fontFamily: "Georgia, serif", fontWeight: 600 }}>{title}</div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 30, color: "#b9b6ae" }}>
          <span style={{ fontFamily: "Georgia, serif", color: "#fff", fontSize: 38 }}>Screenshade</span>
          <span>{footer ?? "Find the sunglasses behind the screen."}</span>
        </div>
      </div>
    ),
    OG_SIZE,
  );
}

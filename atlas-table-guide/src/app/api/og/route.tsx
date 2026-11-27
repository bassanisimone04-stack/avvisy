import { ImageResponse } from "next/og";
import { BRAND } from "@/config/brand";

export const runtime = "edge";
/** Dynamic Open Graph image: /api/og?title=…&sub=… */
export function GET(req: Request) {
  const u = new URL(req.url);
  const title = (u.searchParams.get("title") ?? BRAND.tagline).slice(0, 90);
  const sub = (u.searchParams.get("sub") ?? "").slice(0, 120);
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#B3122B", color: "#FAF7F2", padding: 64, fontFamily: "serif" }}>
        <div style={{ fontSize: 30, letterSpacing: 8 }}>{BRAND.name}</div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 68, lineHeight: 1.1 }}>{title}</div>
          {sub ? <div style={{ fontSize: 30, marginTop: 20, opacity: 0.85 }}>{sub}</div> : null}
        </div>
        <div style={{ fontSize: 22, opacity: 0.8 }}>{BRAND.domain}</div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}

import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Mappa Senza Glutine — Ristoranti, negozi e locali senza glutine in Italia";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #e7f0ea 0%, #cfe0d4 100%)",
          padding: "72px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "108px",
              height: "108px",
              borderRadius: "26px",
              background: "#1b4332",
              color: "#fff",
              fontSize: "56px",
              fontWeight: 900,
            }}
          >
            MSG
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: "48px", fontWeight: 800, color: "#1b4332", letterSpacing: "-1px" }}>
              Mappa Senza Glutine
            </div>
            <div style={{ fontSize: "26px", color: "#3d5347", marginTop: "2px" }}>
              La directory italiana del senza glutine
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          <div style={{ fontSize: "56px", fontWeight: 800, color: "#12241c", lineHeight: 1.15, maxWidth: "980px" }}>
            Ristoranti, hotel e negozi certificati, vicino a te.
          </div>
          <div style={{ display: "flex", gap: "14px" }}>
            {["Certificati AIC", "Recensioni verificate", "In tutta Italia"].map((t) => (
              <div
                key={t}
                style={{
                  fontSize: "24px",
                  color: "#12241c",
                  background: "#fff",
                  border: "2px solid #1b4332",
                  borderRadius: "999px",
                  padding: "10px 22px",
                }}
              >
                {t}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}

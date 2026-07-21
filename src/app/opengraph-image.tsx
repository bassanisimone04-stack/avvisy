import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Scortvia — Marketplace B2B delle scorte aziendali";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Anteprima social generata (nessun asset esterno): sfondo cemento caldo,
// accento ember, wordmark con la "S" predominante.
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
          background: "linear-gradient(135deg, #efe6db 0%, #e2d4c2 100%)",
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
              background: "#cf4a1e",
              color: "#fff",
              fontSize: "76px",
              fontWeight: 900,
            }}
          >
            S
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: "58px", fontWeight: 800, color: "#cf4a1e", letterSpacing: "-1px" }}>
              Scortvia
            </div>
            <div style={{ fontSize: "26px", color: "#6b5d4f", marginTop: "2px" }}>
              La nuova via delle scorte aziendali
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          <div style={{ fontSize: "60px", fontWeight: 800, color: "#1a1614", lineHeight: 1.1, maxWidth: "980px" }}>
            Compra e vendi stock, ricambi e rimanenze tra aziende verificate.
          </div>
          <div style={{ display: "flex", gap: "14px" }}>
            {["Pagamento protetto", "Aziende verificate", "Marketplace B2B italiano"].map((t) => (
              <div
                key={t}
                style={{
                  fontSize: "24px",
                  color: "#3d342c",
                  background: "#fff",
                  border: "2px solid #d8c9b6",
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

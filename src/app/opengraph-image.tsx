import { ImageResponse } from "next/og";
import { readFile } from "fs/promises";
import { join } from "path";

export const alt = "Avvisy — Appuntamenti e code senza attese";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  const [dancing, sans] = await Promise.all([
    readFile(
      join(
        process.cwd(),
        "node_modules/@fontsource/dancing-script/files/dancing-script-latin-700-normal.woff"
      )
    ),
    readFile(
      join(
        process.cwd(),
        "node_modules/@fontsource/instrument-sans/files/instrument-sans-latin-600-normal.woff"
      )
    ),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background:
            "radial-gradient(circle at 35% 30%, #ffffff, #f2ede2 70%, #ece5d8)",
        }}
      >
        <div
          style={{
            fontFamily: "Dancing",
            fontSize: 200,
            color: "#2b4cff",
            lineHeight: 1,
          }}
        >
          Avvisy
        </div>
        <div
          style={{
            fontFamily: "Sans",
            fontSize: 44,
            color: "#172329",
            marginTop: 16,
          }}
        >
          Appuntamenti e code, senza attese
        </div>
        <div
          style={{
            fontFamily: "Sans",
            fontSize: 28,
            color: "#495459",
            marginTop: 28,
          }}
        >
          Per i cittadini prenotare è sempre gratis
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Dancing", data: dancing, weight: 700, style: "normal" },
        { name: "Sans", data: sans, weight: 600, style: "normal" },
      ],
    }
  );
}

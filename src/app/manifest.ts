import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Avvisy — Appuntamenti e code",
    short_name: "Avvisy",
    description:
      "Prenota, fai il check-in e segui la coda in tempo reale.",
    start_url: "/",
    display: "standalone",
    background_color: "#f4f6f5",
    theme_color: "#0e7a68",
    lang: "it",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}

import { ogCard, OG_SIZE } from "@/lib/og";
export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Screenshade: find the sunglasses behind the screen";
export default function Image() { return ogCard({ eyebrow: "Movie sunglasses directory", title: "Find the Sunglasses Behind the Screen." }); }

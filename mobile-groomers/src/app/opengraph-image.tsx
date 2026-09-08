import { ImageResponse } from "next/og";
import { OG_CONTENT_TYPE, OG_SIZE, OgCard } from "@/lib/og";

export const alt = "Find top-rated mobile dog groomers near you";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return new ImageResponse(
    (
      <OgCard
        eyebrow="US Mobile Grooming Directory"
        title="Find Top-Rated Mobile Dog Groomers Near You"
        footer="Search by zip code"
        badges={["No cages", "No commute"]}
      />
    ),
    size,
  );
}

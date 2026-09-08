import { ImageResponse } from "next/og";
import { FEATURED_CITIES } from "@/lib/site-config";
import { OG_CONTENT_TYPE, OG_SIZE, OgCard } from "@/lib/og";

export const alt = "Mobile dog groomers by city";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export function generateStaticParams() {
  return FEATURED_CITIES.map((c) => ({ citySlug: c.slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ citySlug: string }>;
}) {
  const { citySlug } = await params;
  const city = FEATURED_CITIES.find((c) => c.slug === citySlug);

  return new ImageResponse(
    (
      <OgCard
        eyebrow="Mobile Dog Groomers"
        title={city ? `${city.city}, ${city.state}` : "Find a Mobile Groomer"}
        footer="Compare vans by zip code"
        badges={["At-home", "Cage-free"]}
      />
    ),
    size,
  );
}

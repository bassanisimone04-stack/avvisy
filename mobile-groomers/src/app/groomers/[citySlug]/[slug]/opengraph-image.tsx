import { ImageResponse } from "next/og";
import { getAllGroomers, getGroomerBySlug } from "@/lib/groomers";
import { OG_CONTENT_TYPE, OG_SIZE, OgCard } from "@/lib/og";

export const alt = "Mobile dog groomer listing";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export async function generateStaticParams() {
  const groomers = await getAllGroomers();
  return groomers.map((g) => ({ citySlug: g.citySlug, slug: g.slug }));
}

/**
 * A claimed listing is the page its owner shares on their own social
 * accounts, so this card carries the business name rather than the site's.
 * That referral loop is worth more than another generic brand impression.
 */
export default async function Image({
  params,
}: {
  params: Promise<{ citySlug: string; slug: string }>;
}) {
  const { citySlug, slug } = await params;
  const groomer = await getGroomerBySlug(citySlug, slug);

  if (!groomer) {
    return new ImageResponse(
      <OgCard title="Mobile Dog Grooming" footer="Find a van near you" />,
      size,
    );
  }

  const badges: string[] = [];
  if (groomer.verified) badges.push("Verified van");
  // ASCII only. A glyph outside the system font (a star, an emoji) makes
  // Satori attempt a dynamic font download, which fails in the build
  // sandbox and would ship a card with a missing character.
  if (groomer.reviewCount) badges.push(`${groomer.rating!.toFixed(1)} / 5`);

  const footerParts = [
    groomer.zipCodes?.length ? `${groomer.zipCodes.length} zip codes served` : null,
    groomer.priceRange ?? null,
  ].filter((part): part is string => Boolean(part));

  return new ImageResponse(
    (
      <OgCard
        eyebrow={`Mobile Grooming · ${groomer.city}, ${groomer.state}`}
        title={groomer.name}
        footer={footerParts.length > 0 ? footerParts.join(" · ") : groomer.city}
        badges={badges}
      />
    ),
    size,
  );
}

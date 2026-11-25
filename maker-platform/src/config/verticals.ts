/**
 * Verticals are data, not code. Adding a vertical = adding an entry here
 * (Phase 1) or a row in `verticals` (Phase 2+). See docs/ARCHITECTURE.md.
 */
export type VerticalStatus = "active" | "coming_soon" | "hidden";

export interface Vertical {
  slug: string;
  name: string;
  shortName: string;
  status: VerticalStatus;
  /** One-line description used on cards and meta descriptions. */
  summary: string;
  /** Placeholder material image (procedurally generated, see scripts/). */
  image: string;
  imageAlt: string;
}

export const verticals: Vertical[] = [
  {
    slug: "woodworking",
    name: "Woodworking & CNC",
    shortName: "Woodworking",
    status: "active",
    summary: "Shared shops, CNC services, hardwood suppliers and plans you can cut this weekend.",
    image: "/images/materials/walnut-bench.jpg",
    imageAlt: "Close-up of oiled walnut boards (illustrative material texture)",
  },
  {
    slug: "quilting",
    name: "Quilting & Sewing",
    shortName: "Quilting",
    status: "coming_soon",
    summary: "Long-arm studios, fabric shops and patterns.",
    image: "/images/materials/quilt.jpg",
    imageAlt: "Patchwork quilt blocks (illustrative material texture)",
  },
  {
    slug: "leathercraft",
    name: "Leathercraft",
    shortName: "Leather",
    status: "coming_soon",
    summary: "Tanneries, tool makers and stitching patterns.",
    image: "/images/materials/leather.jpg",
    imageAlt: "Pebbled leather with saddle stitching (illustrative material texture)",
  },
  {
    slug: "jewelry",
    name: "Jewelry Making",
    shortName: "Jewelry",
    status: "coming_soon",
    summary: "Bench rentals, metal suppliers and casting services.",
    image: "/images/materials/brushed-silver.jpg",
    imageAlt: "Brushed silver surface (illustrative material texture)",
  },
  {
    slug: "ceramics",
    name: "Ceramics",
    shortName: "Ceramics",
    status: "coming_soon",
    summary: "Open studios, kiln rentals and clay suppliers.",
    image: "/images/materials/clay.jpg",
    imageAlt: "Thrown terracotta clay rings (illustrative material texture)",
  },
  {
    slug: "laser-3d-printing",
    name: "Laser Cutting & 3D Printing",
    shortName: "Laser & 3D",
    status: "coming_soon",
    summary: "Laser bureaus, print farms and ready-to-cut files.",
    image: "/images/materials/plywood-edge.jpg",
    imageAlt: "Laser-cut plywood edge (illustrative material texture)",
  },
];

export const activeVerticals = verticals.filter((v) => v.status === "active");

export function getVertical(slug: string): Vertical | undefined {
  return verticals.find((v) => v.slug === slug);
}

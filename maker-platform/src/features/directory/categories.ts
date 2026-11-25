import type { BusinessFlag, DirectoryCategory } from "./types";

export const directoryCategories: DirectoryCategory[] = [
  { slug: "woodworking-workshops", name: "Woodworking workshop", plural: "Woodworking workshops" },
  { slug: "shared-workshops", name: "Shared workshop", plural: "Shared workshops" },
  { slug: "makerspaces", name: "Makerspace", plural: "Makerspaces" },
  { slug: "cnc-services", name: "CNC machining service", plural: "CNC machining services" },
  { slug: "cnc-router-access", name: "CNC router access", plural: "CNC router access" },
  { slug: "hardwood-suppliers", name: "Hardwood supplier", plural: "Hardwood suppliers" },
  { slug: "lumber-stores", name: "Lumber store", plural: "Lumber stores" },
  { slug: "laser-cutting", name: "Laser cutting service", plural: "Laser cutting" },
  { slug: "tool-rental", name: "Tool rental", plural: "Tool rental" },
  { slug: "woodworking-classes", name: "Woodworking classes", plural: "Woodworking classes" },
  { slug: "custom-fabrication", name: "Custom fabrication", plural: "Custom fabrication" },
];

export function getCategory(slug: string) {
  return directoryCategories.find((c) => c.slug === slug);
}

/** Boolean filters for the Woodworking & CNC vertical (docs/DATABASE.md). */
export const flagFilters: { key: BusinessFlag; label: string }[] = [
  { key: "publicAccess", label: "Public workshop access" },
  { key: "hourlyRental", label: "Hourly rental" },
  { key: "classes", label: "Classes" },
  { key: "toolRental", label: "Tool rental" },
  { key: "laserCutting", label: "Laser cutting" },
  { key: "customFabrication", label: "Custom manufacturing" },
];

/** Facets derived from attribute lists. */
export const capabilityFilters = [
  { key: "cnc", label: "CNC machine on site" },
] as const;

export const fileFormatOptions = ["DXF", "SVG", "DWG", "STEP", "STL", "AI", "PDF"] as const;
export const materialOptions = ["Hardwood", "Plywood", "MDF", "Acrylic", "Walnut", "White oak", "Maple"] as const;

import type { Difficulty, FileFormat, ProductCategorySlug } from "./types";

export const productCategories: { slug: ProductCategorySlug; name: string; blurb: string }[] = [
  { slug: "furniture-plans", name: "Furniture plans", blurb: "Benches, tables and shelves with full cut lists." },
  { slug: "cnc-files", name: "CNC-ready files", blurb: "Nested DXF and SVG files for sheet goods." },
  { slug: "shop-jigs", name: "Shop & jigs", blurb: "Sleds, jigs and benches that make every project better." },
  { slug: "kitchen-gifts", name: "Kitchen & gifts", blurb: "Cutting boards and small builds that make great gifts." },
  { slug: "planning-tools", name: "Planning tools", blurb: "Spreadsheets for cut lists, costs and orders." },
  { slug: "bundles", name: "Bundles", blurb: "Curated sets at a lower combined price." },
];

export const formatOptions: FileFormat[] = ["PDF", "DXF", "SVG", "STEP", "STL", "XLSX", "CSV", "ZIP"];
export const difficultyOptions: Difficulty[] = ["Beginner", "Intermediate", "Advanced"];

export const formatDescriptions: Record<FileFormat, string> = {
  PDF: "Printable guide",
  SVG: "Vector for laser & CNC",
  DXF: "CAD/CAM vector",
  STL: "3D mesh",
  STEP: "3D solid model",
  ZIP: "Archive",
  XLSX: "Spreadsheet",
  CSV: "Data table",
};

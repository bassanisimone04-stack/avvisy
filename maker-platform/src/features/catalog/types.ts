import type { DirectoryCategorySlug } from "@/features/directory/types";

export type FileFormat = "PDF" | "SVG" | "DXF" | "STL" | "STEP" | "ZIP" | "XLSX" | "CSV";
export type Difficulty = "Beginner" | "Intermediate" | "Advanced";
export type ProductCategorySlug = "furniture-plans" | "cnc-files" | "shop-jigs" | "kitchen-gifts" | "planning-tools" | "bundles";
export type LicenseType = "personal" | "commercial";

/** An axis-aligned part in inches: [x, y, z, width, depth, height]. */
export interface DrawingPart {
  box: [number, number, number, number, number, number];
  tone?: "light" | "dark" | "accent";
}

export interface Product {
  slug: string;
  title: string;
  subtitle: string;
  vertical: string;
  category: ProductCategorySlug;
  description: string[];
  highlights: string[];
  formats: FileFormat[];
  compatibility: string[];
  difficulty: Difficulty;
  materials: string[];
  /** Finished size in inches (W × D × H), when the project has one. */
  dimensions: { width: number; depth: number; height: number } | null;
  /** Prices in USD cents. Commercial license is optional. */
  prices: { personal: number; commercial: number | null };
  includes: { name: string; format: FileFormat; detail: string }[];
  drawing: DrawingPart[];
  cover: string;
  /** Directory categories used for "Make it locally" cross-links. */
  makeLocally: DirectoryCategorySlug[];
  related: string[];
  bundleOf?: string[];
  isDemo: boolean;
  status: "draft" | "published";
  /** Every file must be human-checked before sale (docs/PROJECT_CONTEXT.md). */
  filesVerified: boolean;
}

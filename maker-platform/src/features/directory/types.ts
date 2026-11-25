export type DirectoryCategorySlug =
  | "woodworking-workshops"
  | "shared-workshops"
  | "makerspaces"
  | "cnc-services"
  | "cnc-router-access"
  | "hardwood-suppliers"
  | "lumber-stores"
  | "laser-cutting"
  | "tool-rental"
  | "woodworking-classes"
  | "custom-fabrication";

export interface DirectoryCategory {
  slug: DirectoryCategorySlug;
  name: string;
  plural: string;
}

/** Boolean facets that map to the directory filters (docs/DATABASE.md). */
export type BusinessFlag =
  | "publicAccess"
  | "hourlyRental"
  | "classes"
  | "toolRental"
  | "laserCutting"
  | "customFabrication";

export interface BusinessAttributes extends Record<BusinessFlag, boolean> {
  /** Free-form machine capabilities, e.g. "4×8 ft CNC router". */
  cncMachines: string[];
  materials: string[];
  fileFormats: string[];
}

export interface DataProvenance {
  sourceName: string;
  sourceId: string;
  license: string;
  attribution: string | null;
}

export interface Business {
  slug: string;
  name: string;
  vertical: string;
  primaryCategory: DirectoryCategorySlug;
  categories: DirectoryCategorySlug[];
  summary: string;
  description: string[];
  services: string[];
  neighborhood: string;
  city: string;
  citySlug: string;
  state: string;
  stateCode: string;
  stateSlug: string;
  zip: string;
  coordinates: { lat: number; lng: number };
  website: string | null;
  phone: string | null;
  attributes: BusinessAttributes;
  /** Illustrative material image — never presented as a photo of the business. */
  image: string;
  isDemo: boolean;
  provenance: DataProvenance;
  lastVerifiedAt: string | null;
  ownership: "unclaimed" | "claimed" | "verified";
  publicationStatus: "draft" | "published" | "archived";
}

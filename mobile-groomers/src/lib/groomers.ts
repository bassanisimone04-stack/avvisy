import groomersData from "@/data/groomers.json";

export type Groomer = {
  slug: string;
  name: string;
  city: string;
  state: string;
  citySlug: string;
  phone: string;
  rating: number;
  reviewCount: number;
  tier: "free" | "pro" | "fleet";
  verified: boolean;
  website: string | null;
  tagline: string;
  about: string;
  tags: string[];
  zipCodes: string[];
  priceRange: string;
  responseTime: string;
};

const GROOMERS = groomersData as Groomer[];

export function getAllGroomers(): Groomer[] {
  return GROOMERS;
}

export function getGroomerBySlug(citySlug: string, slug: string): Groomer | undefined {
  return GROOMERS.find((g) => g.citySlug === citySlug && g.slug === slug);
}

export function getGroomersByCitySlug(citySlug: string): Groomer[] {
  return GROOMERS.filter((g) => g.citySlug === citySlug);
}

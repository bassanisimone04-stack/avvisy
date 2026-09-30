import type { Locale } from "./locale";

const CITY_EN: Record<string, string> = {
  Milano: "Milan",
  Roma: "Rome",
  Napoli: "Naples",
  Firenze: "Florence",
  Torino: "Turin",
  Venezia: "Venice",
  Padova: "Padua",
  Genova: "Genoa",
};

const REGION_EN: Record<string, string> = {
  Lombardia: "Lombardy",
  Toscana: "Tuscany",
  Sicilia: "Sicily",
  Piemonte: "Piedmont",
};

export function cityName(name: string, locale: Locale): string {
  return locale === "en" ? CITY_EN[name] ?? name : name;
}

export function regionName(name: string, locale: Locale): string {
  return locale === "en" ? REGION_EN[name] ?? name : name;
}

import type { Locale } from "@/config/brand";
import type { Dataset, Restaurant } from "@/db/types";
import { t } from "@/db/types";
import { cityOf, countryOf, cuisineName } from "@/db/queries";

export function cardInfo(d: Dataset, r: Restaurant, locale: Locale) {
  return {
    city: t(cityOf(d, r.citySlug)?.name, locale),
    country: t(countryOf(d, r.countrySlug)?.name, locale),
    cuisines: r.cuisines.slice(0, 2).map((c) => cuisineName(d, c, locale)),
  };
}

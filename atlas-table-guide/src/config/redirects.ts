/** Static redirect map (301/308/410). The admin "Redirects" module manages the DB table; export it here at deploy. */
export const STATIC_REDIRECTS: Record<string, { to?: string; status: 301 | 308 | 410 }> = {
  "/en/restaurant/": { to: "/en/restaurants/", status: 301 },
  "/it/restaurant/": { to: "/it/restaurants/", status: 301 },
};

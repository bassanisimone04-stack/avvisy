function unsplash(id: string): string {
  return `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=75`;
}

const PIZZA = unsplash("photo-1513104890138-7c749659a591");
const PIZZA_SLICE = unsplash("photo-1594007654729-407eedc4be65");
const PASTA = unsplash("photo-1551183053-bf91a1d81141");
const PASTA_PLATE = unsplash("photo-1473093295043-cdd812d0e601");
const BREAD = unsplash("photo-1509440159596-0249088772ff");
const BREAD_LOAVES = unsplash("photo-1608198093002-ad4e005484ec");
const RESTAURANT_INTERIOR = unsplash("photo-1517248135467-4c7edcad34c4");
const RESTAURANT_TABLE = unsplash("photo-1414235077428-338989a2e8c0");
const SALAD_BOWL = unsplash("photo-1512621776951-a57141f2eefd");
const VEGETABLES = unsplash("photo-1610832958506-aa56368176cf");
const COFFEE = unsplash("photo-1495474472287-4d71bcdd2085");
const PASTRIES = unsplash("photo-1486427944299-d1955d23e34d");
const FAMILY_MEAL = unsplash("photo-1529333166437-7750a6dd5a70");
const KIDS_BREAKFAST = unsplash("photo-1543353071-873f17a7a088");
const TRAVEL_MARKET = unsplash("photo-1541014741259-de529411b96a");
const TRAVEL_SUITCASE = unsplash("photo-1436491865332-7a61a109cc05");
const DOCTOR = unsplash("photo-1576091160399-112ba8d25d1d");
const LAB_TEST = unsplash("photo-1579154204601-01588f351e67");
const SUPERMARKET = unsplash("photo-1578916171728-46686eac8d58");
const FARMERS_MARKET = unsplash("photo-1488459716781-31db52582fe9");
const HOTEL_ROOM = unsplash("photo-1566073771259-6a8506099945");
const ICE_CREAM = unsplash("photo-1497034825429-c343d7c6a68a");

const BLOG_PHOTOS: Record<string, string[]> = {
  Celiachia: [DOCTOR, LAB_TEST],
  Guide: [RESTAURANT_INTERIOR, RESTAURANT_TABLE],
  Ricette: [PASTA, PIZZA],
  Viaggi: [TRAVEL_MARKET, TRAVEL_SUITCASE],
  Alimentazione: [SALAD_BOWL, VEGETABLES],
  Salute: [SALAD_BOWL, LAB_TEST],
  Prodotti: [SUPERMARKET, BREAD_LOAVES],
  Bambini: [FAMILY_MEAL, KIDS_BREAKFAST],
  Eventi: [FARMERS_MARKET, TRAVEL_MARKET],
  News: [PIZZA_SLICE, SUPERMARKET],
};

const BUSINESS_PHOTOS: Record<string, string[]> = {
  ristorante: [RESTAURANT_INTERIOR, RESTAURANT_TABLE],
  pizzeria: [PIZZA, PIZZA_SLICE],
  hotel: [HOTEL_ROOM, RESTAURANT_TABLE],
  farmacia: [LAB_TEST, DOCTOR],
  supermercato: [SUPERMARKET, VEGETABLES],
  negozio: [SUPERMARKET, BREAD_LOAVES],
  "bar-pasticceria": [COFFEE, PASTRIES],
  gelateria: [ICE_CREAM, PASTRIES],
};

export function blogCoverPhoto(category: string, seed: number): string {
  const list = BLOG_PHOTOS[category] ?? BLOG_PHOTOS.Guide;
  return list[seed % list.length];
}

export function businessCoverPhoto(category: string, seed: number): string {
  const list = BUSINESS_PHOTOS[category] ?? BUSINESS_PHOTOS.ristorante;
  return list[seed % list.length];
}

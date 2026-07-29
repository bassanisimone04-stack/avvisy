function unsplash(id: string): string {
  return `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=75`;
}

// Foto generiche a tema, usate solo per le copertine degli articoli del
// blog (non legate a un locale specifico, quindi nessun problema di
// veridicità). Le foto delle attività della directory vengono invece solo
// dall'illustrazione SVG di default o da business.photoUrl quando un
// locale reale ne carica una propria: vedi BusinessCard/BusinessDetailContent.
const PIZZA = unsplash("photo-1513104890138-7c749659a591");
const PIZZA_SLICE = unsplash("photo-1594007654729-407eedc4be65");
const PASTA = unsplash("photo-1551183053-bf91a1d81141");
const PASTA_PLATE = unsplash("photo-1473093295043-cdd812d0e601");
const BREAD_LOAVES = unsplash("photo-1608198093002-ad4e005484ec");
const BAKERY_COUNTER = unsplash("photo-1607532941433-304659e8198a");
const RESTAURANT_INTERIOR = unsplash("photo-1517248135467-4c7edcad34c4");
const RESTAURANT_TABLE = unsplash("photo-1414235077428-338989a2e8c0");
const PLATED_DISH = unsplash("photo-1466978913421-dad2ebd01d17");
const VEGETABLES = unsplash("photo-1610832958506-aa56368176cf");
const GROCERY_BASKET = unsplash("photo-1506484381205-f7945653044d");
const FRESH_SALAD = unsplash("photo-1490818387583-1baba5e638af");
const FAMILY_MEAL = unsplash("photo-1529333166437-7750a6dd5a70");
const KIDS_BREAKFAST = unsplash("photo-1543353071-873f17a7a088");
const TRAVEL_MARKET = unsplash("photo-1541014741259-de529411b96a");
const TRAVEL_SUITCASE = unsplash("photo-1436491865332-7a61a109cc05");
const DOCTOR = unsplash("photo-1576091160399-112ba8d25d1d");
const DOCTOR_CONSULT = unsplash("photo-1550831107-1553da8c8464");
const LAB_TEST = unsplash("photo-1579154204601-01588f351e67");
const SUPERMARKET = unsplash("photo-1578916171728-46686eac8d58");
const FARMERS_MARKET = unsplash("photo-1488459716781-31db52582fe9");
const CELEBRATION_TABLE = unsplash("photo-1541185933-ef5d8ed016c2");
const MEDICAL_CHECK = unsplash("photo-1631815589968-fdb09a223b1e");
const DINING_SCENE = unsplash("photo-1428515613728-6b4607e44363");
const TABLE_SETTING = unsplash("photo-1555396273-367ea4eb4db5");

const BLOG_PHOTOS: Record<string, string[]> = {
  Celiachia: [DOCTOR, LAB_TEST, MEDICAL_CHECK],
  Guide: [RESTAURANT_INTERIOR, PLATED_DISH, DINING_SCENE, TABLE_SETTING],
  Ricette: [PASTA, PASTA_PLATE],
  Viaggi: [TRAVEL_MARKET, TRAVEL_SUITCASE],
  Alimentazione: [VEGETABLES, GROCERY_BASKET],
  Salute: [FRESH_SALAD, DOCTOR_CONSULT],
  Prodotti: [SUPERMARKET, BAKERY_COUNTER],
  Bambini: [FAMILY_MEAL, KIDS_BREAKFAST],
  Eventi: [CELEBRATION_TABLE, FARMERS_MARKET],
  News: [PIZZA_SLICE, BREAD_LOAVES],
};

export function blogCoverPhoto(category: string, seed: number): string {
  const list = BLOG_PHOTOS[category] ?? BLOG_PHOTOS.Guide;
  return list[seed % list.length];
}

export const HERO_COLLAGE_PHOTOS = {
  pizza: PIZZA,
  pasta: PASTA,
  restaurantTable: RESTAURANT_TABLE,
};

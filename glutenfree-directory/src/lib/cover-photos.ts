function unsplash(id: string): string {
  return `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=75`;
}

// Una foto unica per ogni articolo del blog, indicizzata per coverSeed.
// Nessuna si ripete e nessuna coincide con le foto della directory o
// con le foto inline degli articoli.
const BLOG_COVER: Record<number, string> = {
  101: unsplash("photo-1576091160399-112ba8d25d1d"),
  102: unsplash("photo-1517248135467-4c7edcad34c4"),
  103: unsplash("photo-1473093295043-cdd812d0e601"),
  104: unsplash("photo-1541014741259-de529411b96a"),
  105: unsplash("photo-1543353071-873f17a7a088"),
  106: unsplash("photo-1578916171728-46686eac8d58"),
  107: unsplash("photo-1488459716781-31db52582fe9"),
  108: unsplash("photo-1490818387583-1baba5e638af"),
  109: unsplash("photo-1506484381205-f7945653044d"),
  110: unsplash("photo-1608198093002-ad4e005484ec"),
  111: unsplash("photo-1607532941433-304659e8198a"),
  112: unsplash("photo-1466978913421-dad2ebd01d17"),
  113: unsplash("photo-1579154204601-01588f351e67"),
  114: unsplash("photo-1436491865332-7a61a109cc05"),
  115: unsplash("photo-1555396273-367ea4eb4db5"),
  116: unsplash("photo-1610832958506-aa56368176cf"),
  117: unsplash("photo-1559339352-11d035aa65de"),
  118: unsplash("photo-1631815589968-fdb09a223b1e"),
  119: unsplash("photo-1552566626-52f8b828add9"),
  120: unsplash("photo-1493770348161-369560ae357d"),
  121: unsplash("photo-1571091718767-18b5b1457add"),
  122: unsplash("photo-1516559828984-fb3b99548b21"),
  123: unsplash("photo-1571896349842-33c89424de2d"),
  124: unsplash("photo-1509365465985-25d11c17e812"),
};

const FALLBACK = unsplash("photo-1466978913421-dad2ebd01d17");

// Foto caricate dall'utente in public/images/blog/ (ritagliate 4:3, 1600 px).
// Hanno la precedenza sulle foto Unsplash; gli articoli senza voce qui
// continuano a usare la foto di riserva finché non arriva la loro foto.
const LOCAL_BLOG_COVER: Record<number, string> = {
  112: "contaminazione-cucina",
  143: "napoli",
  144: "venezia",
  145: "bari",
  146: "palermo",
  147: "genova",
  148: "verona",
  149: "dieta-dimagrire",
  150: "spesa-discount",
  151: "panettone-colomba",
  152: "birra",
  153: "celiachia-uomini",
  154: "volare",
  155: "farine",
  156: "svezzamento",
  157: "sagre",
  158: "sushi-etnico",
  159: "certificazione-aic",
  160: "besciamella",
  161: "pane",
  162: "crostata",
  163: "crepes",
  164: "pancake",
  165: "biscotti",
  166: "glutine",
  168: "avena",
  169: "pasta",
  170: "dolci",
  172: "dove-comprare",
  174: "catene",
};

// Illustrazioni originali (SVG in public/images/blog/) per gli articoli senza foto.
// La foto vera in LOCAL_BLOG_COVER ha sempre la precedenza: quando arriva, si sostituisce.
const ILLUSTRATED_BLOG_COVER: Record<number, string> = {
  167: "intolleranza",
  171: "pasticcerie",
  173: "old-wild-west",
  175: "vicino-a-me",
  176: "alimenti-dubbi",
  177: "gelato",
  178: "pizza",
  179: "pane",
  180: "dall-estero",
  181: "ingredienti",
  182: "ingestione",
  183: "false-credenze",
  184: "cena-amici",
  185: "ristoratori",
  186: "panettiere",
  187: "bologna",
  188: "buono-celiachia",
};

export function blogCoverPhoto(_category: string, seed: number): string {
  const local = LOCAL_BLOG_COVER[seed];
  if (local) return `/images/blog/${local}.jpg`;
  const illustrated = ILLUSTRATED_BLOG_COVER[seed];
  if (illustrated) return `/images/blog/${illustrated}.svg`;
  return BLOG_COVER[seed] ?? FALLBACK;
}

// Le 13 ricette (categoria Ricette + la merenda scuola) non usano foto
// Unsplash: da questo ambiente non è possibile raggiungere il dominio per
// verificare che un ID esista davvero, quindi niente scommesse su URL non
// verificabili. Ogni ricetta ha invece un'illustrazione SVG originale,
// disegnata apposta per il piatto specifico (vedi PlaceholderImage.tsx):
// nessuna dipendenza di rete, e ogni copertina è sia pertinente sia diversa
// dalle altre, verificabile a occhio perché il codice è tutto qui.
const RECIPE_ILLUSTRATIONS: Record<number, string> = {
  132: "ricetta-torta",
  135: "ricetta-pizza",
  137: "ricetta-merenda",
  139: "ricetta-crostini",
};

export function recipeIllustration(seed: number): string | undefined {
  return RECIPE_ILLUSTRATIONS[seed];
}

// Foto vere caricate dall'utente (in public/images/ricette/), sostituiscono
// l'illustrazione SVG quando disponibili. Percorso locale, non Unsplash:
// serve direttamente da /public, nessuna verifica di rete necessaria.
const RECIPE_PHOTOS: Record<number, string> = {
  132: "/images/ricette/03-torta.png",
  135: "/images/ricette/06-pizza.webp",
  137: "/images/ricette/08-merenda.png",
  139: "/images/ricette/10-crostini.webp",
};

export function recipePhoto(seed: number): string | undefined {
  return RECIPE_PHOTOS[seed];
}

// Foto reali dei prodotti caricate dall'utente (in public/images/prodotti/).
// Percorso locale, come per le ricette. Il slug del prodotto fa da chiave.
const PRODUCT_PHOTOS: Record<string, string> = {
  "barilla-fusilli-senza-glutine-400g": "/images/prodotti/barilla-fusilli.webp.png",
};

export function productPhoto(slug: string): string | undefined {
  return PRODUCT_PHOTOS[slug];
}

export const HERO_COLLAGE_PHOTOS = {
  pizza: unsplash("photo-1513104890138-7c749659a591"),
  pasta: unsplash("photo-1551183053-bf91a1d81141"),
  restaurantTable: unsplash("photo-1414235077428-338989a2e8c0"),
};

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
};

const FALLBACK = unsplash("photo-1466978913421-dad2ebd01d17");

export function blogCoverPhoto(_category: string, seed: number): string {
  return BLOG_COVER[seed] ?? FALLBACK;
}

export const HERO_COLLAGE_PHOTOS = {
  pizza: unsplash("photo-1513104890138-7c749659a591"),
  pasta: unsplash("photo-1551183053-bf91a1d81141"),
  restaurantTable: unsplash("photo-1414235077428-338989a2e8c0"),
};

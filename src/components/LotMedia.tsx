import LotImage from "./LotImage";
import LotPhoto from "./LotPhoto";

/**
 * Mostra la prima foto reale del lotto se presente, altrimenti l'illustrazione
 * generata. Usato in card, galleria e pagina lotto. Se la foto reale non si
 * carica, LotPhoto ripiega da solo sull'illustrazione.
 */
export default function LotMedia({
  category,
  seed,
  imageUrls,
  index = 0,
  className = "",
  ratio = "aspect-[4/3]",
}: {
  category: string;
  seed: number;
  imageUrls?: string[];
  index?: number;
  className?: string;
  ratio?: string;
}) {
  const url = imageUrls && imageUrls.length > 0 ? imageUrls[index % imageUrls.length] : null;
  if (url) {
    return (
      <LotPhoto url={url} category={category} seed={seed} className={className} ratio={ratio} />
    );
  }
  return <LotImage category={category} seed={seed} className={className} ratio={ratio} />;
}

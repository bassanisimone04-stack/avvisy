import LotImage from "./LotImage";

/**
 * Mostra la prima foto reale del lotto se presente, altrimenti l'illustrazione
 * generata. Usato in card, galleria e pagina lotto.
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
      <div className={`relative overflow-hidden ${ratio} ${className}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={url} alt="Foto del lotto" className="h-full w-full object-cover" loading="lazy" />
      </div>
    );
  }
  return <LotImage category={category} seed={seed} className={className} ratio={ratio} />;
}

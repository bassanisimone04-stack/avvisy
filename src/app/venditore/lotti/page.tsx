import Link from "next/link";
import { PageTitle } from "@/components/dash";
import { ConditionChip } from "@/components/badges";
import LotImage from "@/components/LotImage";
import { IconPlus } from "@/components/icons";
import { lots, lotTotal, offers } from "@/lib/mock-data";
import { formatEuro, formatNumber } from "@/lib/format";

const SELLER = "co-metalfer";

export default function MieiLottiPage() {
  const myLots = lots.filter((l) => l.sellerId === SELLER);

  return (
    <>
      <PageTitle
        title="I miei lotti"
        subtitle={`${myLots.length} lotti pubblicati nel marketplace.`}
        action={
          <Link href="/venditore/pubblica" className="btn btn-primary btn-sm">
            <IconPlus width={16} height={16} /> Pubblica lotto
          </Link>
        }
      />

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="border-b border-line bg-surface-2/60 text-left text-xs uppercase tracking-wide text-muted">
                <th className="px-4 py-3 font-semibold">Lotto</th>
                <th className="px-4 py-3 font-semibold">Condizione</th>
                <th className="px-4 py-3 text-right font-semibold">Quantità</th>
                <th className="px-4 py-3 text-right font-semibold">Prezzo</th>
                <th className="px-4 py-3 text-right font-semibold">Totale</th>
                <th className="px-4 py-3 text-right font-semibold">Offerte</th>
                <th className="px-4 py-3 text-right font-semibold">Viste</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {myLots.map((l) => {
                const offerCount = offers.filter((o) => o.lotId === l.id).length;
                return (
                  <tr key={l.id} className="border-b border-line last:border-0 hover:bg-surface-2/40">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="hidden w-14 shrink-0 sm:block">
                          <LotImage category={l.category} seed={l.imageSeed} className="rounded-md" />
                        </div>
                        <Link href={`/lotto/${l.id}`} className="font-medium text-ink hover:text-brand-dark">
                          {l.title}
                        </Link>
                      </div>
                    </td>
                    <td className="px-4 py-3"><ConditionChip condition={l.condition} /></td>
                    <td className="px-4 py-3 text-right text-ink">
                      {formatNumber(l.quantity)} {l.unit}
                    </td>
                    <td className="px-4 py-3 text-right text-ink">{formatEuro(l.unitPrice)}</td>
                    <td className="px-4 py-3 text-right font-semibold text-brand-dark">
                      {formatEuro(lotTotal(l), true)}
                    </td>
                    <td className="px-4 py-3 text-right text-ink">{offerCount}</td>
                    <td className="px-4 py-3 text-right text-muted">{formatNumber(l.views)}</td>
                    <td className="px-4 py-3 text-right">
                      <Link href={`/lotto/${l.id}`} className="text-sm font-semibold text-brand-dark hover:underline">
                        Apri
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

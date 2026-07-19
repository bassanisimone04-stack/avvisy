import Link from "next/link";
import { PageTitle } from "@/components/dash";
import SellerLots from "@/components/SellerLots";
import { IconPlus } from "@/components/icons";

export default function MieiLottiPage() {
  return (
    <>
      <PageTitle
        title="I miei lotti"
        subtitle="Gestisci lo stato dei tuoi lotti, modifica prezzi e quantità."
        action={
          <Link href="/venditore/pubblica" className="btn btn-primary btn-sm">
            <IconPlus width={16} height={16} /> Pubblica lotto
          </Link>
        }
      />
      <SellerLots />
    </>
  );
}

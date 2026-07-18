import DashboardShell, { type NavItem } from "@/components/DashboardShell";
import {
  IconBox,
  IconChart,
  IconDoc,
  IconMessage,
  IconPlus,
  IconStore,
  IconTag,
  IconTruck,
  IconVerified,
} from "@/components/icons";
import { companyById } from "@/lib/mock-data";

const seller = companyById("co-metalfer")!;

const nav: NavItem[] = [
  { href: "/venditore", label: "Dashboard", icon: <IconChart width={18} height={18} /> },
  { href: "/venditore/lotti", label: "I miei lotti", icon: <IconBox width={18} height={18} /> },
  { href: "/venditore/pubblica", label: "Pubblica nuovo lotto", icon: <IconPlus width={18} height={18} /> },
  { href: "/venditore/offerte", label: "Offerte ricevute", icon: <IconTag width={18} height={18} /> },
  { href: "/venditore/ordini", label: "Ordini", icon: <IconTruck width={18} height={18} /> },
  { href: "/venditore/messaggi", label: "Messaggi", icon: <IconMessage width={18} height={18} /> },
  { href: "/venditore/documenti", label: "Documenti", icon: <IconDoc width={18} height={18} /> },
  { href: "/venditore/statistiche", label: "Statistiche", icon: <IconChart width={18} height={18} /> },
  { href: "/venditore/profilo", label: "Profilo aziendale", icon: <IconStore width={18} height={18} /> },
];

export default function VenditoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardShell
      navItems={nav}
      areaLabel="Area venditore"
      accountName={seller.name}
      accountMeta={`${seller.city} · Verificata`}
    >
      {children}
    </DashboardShell>
  );
}

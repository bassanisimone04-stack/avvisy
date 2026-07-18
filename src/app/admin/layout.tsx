import DashboardShell, { type NavItem } from "@/components/DashboardShell";
import {
  IconBox,
  IconChart,
  IconDoc,
  IconShield,
  IconStore,
  IconTag,
  IconVerified,
  IconWallet,
} from "@/components/icons";

const nav: NavItem[] = [
  { href: "/admin", label: "Panoramica", icon: <IconChart width={18} height={18} /> },
  { href: "/admin/aziende", label: "Aziende", icon: <IconVerified width={18} height={18} /> },
  { href: "/admin/annunci", label: "Annunci", icon: <IconBox width={18} height={18} /> },
  { href: "/admin/utenti", label: "Utenti", icon: <IconStore width={18} height={18} /> },
  { href: "/admin/segnalazioni", label: "Segnalazioni", icon: <IconShield width={18} height={18} /> },
  { href: "/admin/transazioni", label: "Transazioni", icon: <IconWallet width={18} height={18} /> },
  { href: "/admin/categorie", label: "Categorie", icon: <IconTag width={18} height={18} /> },
  { href: "/admin/controversie", label: "Controversie", icon: <IconDoc width={18} height={18} /> },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardShell
      navItems={nav}
      areaLabel="Amministrazione"
      accountName="Scortvia Admin"
      accountMeta="Operatore piattaforma"
    >
      {children}
    </DashboardShell>
  );
}

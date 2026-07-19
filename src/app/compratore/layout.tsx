import DashboardShell, { type NavItem } from "@/components/DashboardShell";
import {
  IconBell,
  IconBox,
  IconChart,
  IconMessage,
  IconSearch,
  IconTag,
  IconTruck,
} from "@/components/icons";
import { CURRENT_BUYER_ID, companyById } from "@/lib/mock-data";

const buyer = companyById(CURRENT_BUYER_ID)!;

const nav: NavItem[] = [
  { href: "/compratore", label: "Dashboard", icon: <IconChart width={18} height={18} /> },
  { href: "/compratore/offerte", label: "Offerte inviate", icon: <IconTag width={18} height={18} /> },
  { href: "/compratore/ordini", label: "Ordini in corso", icon: <IconTruck width={18} height={18} /> },
  { href: "/compratore/acquisti", label: "Acquisti conclusi", icon: <IconBox width={18} height={18} /> },
  { href: "/compratore/salvati", label: "Lotti salvati", icon: <IconBox width={18} height={18} /> },
  { href: "/compratore/ricerche", label: "Ricerche salvate", icon: <IconSearch width={18} height={18} /> },
  { href: "/compratore/messaggi", label: "Messaggi", icon: <IconMessage width={18} height={18} /> },
  { href: "/compratore/notifiche", label: "Notifiche", icon: <IconBell width={18} height={18} /> },
];

export default function CompratoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardShell
      navItems={nav}
      areaLabel="Area compratore"
      accountName={buyer.displayName}
      accountMeta={`${buyer.province} · ${buyer.verification}`}
      audience="buyer"
      notificationsHref="/compratore/notifiche"
    >
      {children}
    </DashboardShell>
  );
}

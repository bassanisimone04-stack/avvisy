import { requireUser, isAdvertiser } from "@/lib/session";
import { logoutAction } from "@/app/actions";
import { Tabs } from "@/components/Tabs";
import { AdvertiserTypeBadge } from "@/components/trust";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  const adv = isAdvertiser(user);
  const items = [
    { href: "/dashboard", label: "Panoramica" },
    ...(adv ? [{ href: "/dashboard/annunci", label: "I miei annunci" }] : []),
    { href: "/dashboard/visite", label: "Visite" },
    { href: "/dashboard/messaggi", label: "Messaggi" },
    ...(adv ? [{ href: "/dashboard/calendario", label: "Calendario" }] : []),
    ...(process.env.NODE_ENV !== "production" ? [{ href: "/dashboard/email", label: "Email (sviluppo)" }] : []),
  ];
  return (
    <div className="container section">
      <div className="spread" style={{ marginBottom: 12 }}>
        <div>
          <h1 style={{ margin: 0 }}>Ciao, {user.name.split(" ")[0]}</h1>
          <div className="row small muted">
            {user.email}
            {adv ? <AdvertiserTypeBadge role={user.role as "private" | "agency"} agencyName={user.agency_name} /> : <span className="badge badge-neutral">Cerco casa</span>}
          </div>
        </div>
        <form action={logoutAction}>
          <button className="btn btn-sm">Esci</button>
        </form>
      </div>
      <Tabs items={items} />
      {children}
    </div>
  );
}

import { notFound } from "next/navigation";
import ServicesBoard from "@/components/ServicesBoard";
import { getMyOrganization, getServicesByOrg } from "@/lib/data";

export default async function ServicesPage() {
  const org = await getMyOrganization();
  if (!org) notFound();
  const services = await getServicesByOrg(org.id);

  return <ServicesBoard initialServices={services} orgId={org.id} />;
}

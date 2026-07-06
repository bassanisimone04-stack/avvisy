import ServicesBoard from "@/components/ServicesBoard";
import { getServicesByOrg } from "@/lib/mock-data";

const ORG_ID = "org-1";

export default function ServicesPage() {
  const services = getServicesByOrg(ORG_ID);

  return <ServicesBoard initialServices={services} orgId={ORG_ID} />;
}

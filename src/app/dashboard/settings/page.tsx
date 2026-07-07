import { notFound } from "next/navigation";
import SettingsForm from "@/components/SettingsForm";
import { getMyOrganization } from "@/lib/data";

export default async function SettingsPage() {
  const org = await getMyOrganization();
  if (!org) notFound();
  return <SettingsForm org={org} />;
}

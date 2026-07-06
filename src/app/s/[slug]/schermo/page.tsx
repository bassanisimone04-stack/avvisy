import { notFound } from "next/navigation";
import WaitingRoomDisplay from "@/components/WaitingRoomDisplay";
import { getOrganizationBySlug, getQueueByOrg } from "@/lib/mock-data";

export default async function DisplayPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const org = getOrganizationBySlug(slug);
  if (!org) notFound();

  const queue = getQueueByOrg(org.id);
  const serving = queue.find((e) => e.status === "in-servizio")?.ticket ?? null;
  const waiting = queue
    .filter((e) => e.status !== "in-servizio")
    .slice(0, 5)
    .map((e) => e.ticket);

  return (
    <WaitingRoomDisplay
      orgName={org.name}
      serving={serving}
      waiting={waiting}
    />
  );
}

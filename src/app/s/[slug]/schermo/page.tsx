import { notFound } from "next/navigation";
import WaitingRoomDisplay from "@/components/WaitingRoomDisplay";
import { getOrganizationBySlug, getQueueByOrg } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function DisplayPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const org = await getOrganizationBySlug(slug);
  if (!org) notFound();

  const queue = await getQueueByOrg(org.id);
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

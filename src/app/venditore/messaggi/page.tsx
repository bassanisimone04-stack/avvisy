import { PageTitle } from "@/components/dash";
import MessagesInbox from "@/components/MessagesInbox";

export default function MessaggiVenditorePage() {
  return (
    <>
      <PageTitle
        title="Messaggi"
        subtitle="Comunica con i compratori interessati ai tuoi lotti."
      />
      <MessagesInbox />
    </>
  );
}

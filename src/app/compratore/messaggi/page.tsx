import { PageTitle } from "@/components/dash";
import MessagesInbox from "@/components/MessagesInbox";

export default function BuyerMessagesPage() {
  return (
    <>
      <PageTitle title="Messaggi" subtitle="Le tue conversazioni con i venditori." />
      <MessagesInbox />
    </>
  );
}

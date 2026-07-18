import { PageTitle } from "@/components/dash";
import AdminUsers from "@/components/AdminUsers";

export default function AdminUsersPage() {
  return (
    <>
      <PageTitle title="Utenti" subtitle="Gestisci gli account e blocca gli utenti sospetti." />
      <AdminUsers />
    </>
  );
}

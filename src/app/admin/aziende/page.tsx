import { PageTitle } from "@/components/dash";
import AdminCompanies from "@/components/AdminCompanies";
import { companies } from "@/lib/mock-data";

export default function AdminCompaniesPage() {
  return (
    <>
      <PageTitle
        title="Aziende"
        subtitle="Approva o sospendi le aziende. La verifica KYB è simulata a scopo dimostrativo."
      />
      <AdminCompanies initial={companies} />
    </>
  );
}

import { PageTitle } from "@/components/dash";
import AdminCategories from "@/components/AdminCategories";

export default function AdminCategoriesPage() {
  return (
    <>
      <PageTitle title="Categorie" subtitle="Gestisci le categorie merceologiche del marketplace." />
      <AdminCategories />
    </>
  );
}

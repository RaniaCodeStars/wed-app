import AdminHeader from "@/components/admin/AdminHeader";
import CategoriesManager from "@/components/admin/CategoriesManager";
import { getAdminArchivedCategories } from "@/lib/data";

export default async function ArchivedCategoriesPage() {
  const archivedCategories = await getAdminArchivedCategories().catch(
    () => []
  );

  return (
    <div className="space-y-6">
      <AdminHeader
        title="التصنيفات المؤرشفة"
        subtitle="التصنيفات التي تم أرشفتها"
      />

      <CategoriesManager initialCategories={archivedCategories} />
    </div>
  );
}
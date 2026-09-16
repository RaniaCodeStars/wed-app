import AdminHeader from "@/components/admin/AdminHeader";
import CategoriesManager from "@/components/admin/CategoriesManager";
import { getAdminCategories } from "@/lib/data";

export default async function AdminCategoriesPage() {
  const categories = await getAdminCategories().catch(() => []);
  return (
    <div className="space-y-6">
      <AdminHeader title="التصنيفات" subtitle="تنظيم منتجاتك حسب الفئة" />
      <CategoriesManager initialCategories={categories} />
    </div>
  );
}

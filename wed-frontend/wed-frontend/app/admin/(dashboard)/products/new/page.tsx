import AdminHeader from "@/components/admin/AdminHeader";
import ProductForm from "@/components/admin/ProductForm";
import { getAdminCategories } from "@/lib/data";

export default async function NewProductPage() {
  const categories = await getAdminCategories().catch(() => []);
  return (
    <div className="space-y-6">
      <AdminHeader title="إضافة منتج جديد" />
      <ProductForm categories={categories} />
    </div>
  );
}

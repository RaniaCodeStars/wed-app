import AdminHeader from "@/components/admin/AdminHeader";
import ProductsTable from "@/components/admin/ProductsTable";
import { getAdminProducts } from "@/lib/data";

export default async function AdminProductsPage() {
  const products = await getAdminProducts().catch(() => []);
  return (
    <div className="space-y-6">
      <AdminHeader title="المنتجات" subtitle="إدارة كاملة لكتالوج المتجر" />
      <ProductsTable initialProducts={products} />
    </div>
  );
}

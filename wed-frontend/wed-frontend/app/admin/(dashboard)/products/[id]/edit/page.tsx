import { notFound } from "next/navigation";
import AdminHeader from "@/components/admin/AdminHeader";
import ProductForm from "@/components/admin/ProductForm";
import { getAdminCategories, getAdminProduct } from "@/lib/data";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const [categories, product] = await Promise.all([
    getAdminCategories().catch(() => []),
    getAdminProduct(id).catch(() => null),
  ]);

  if (!product) notFound();

  return (
    <div className="space-y-6">
      <AdminHeader title={`تعديل: ${product.title}`} />
      <ProductForm categories={categories} existingProduct={product} />
    </div>
  );
}

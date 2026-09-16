import ProductsArchiveTable from "@/components/admin/ProductsArchiveTable";
import { getSessionToken } from "@/lib/session";
import type { Product } from "@/lib/types";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8000";

export default async function ArchivedProductsPage() {
  const token = await getSessionToken();

  const res = await fetch(
    `${BACKEND_URL}/api/v1/admin/products/?include_inactive=true`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    },
  );

  if (!res.ok) {
    throw new Error("Impossible de récupérer les produits archivés");
  }

  const products: Product[] = await res.json();

  // On garde uniquement les produits archivés
  const archivedProducts = products.filter((product) => !product.is_active);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">المنتجات المؤرشفة</h1>

        <p className="text-sm text-gray-400 mt-1">
          المنتجات التي تم حذفها من المتجر
        </p>
      </div>

      <ProductsArchiveTable products={archivedProducts} />
    </div>
  );
}

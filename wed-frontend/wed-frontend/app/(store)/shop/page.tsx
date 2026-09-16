import { Suspense } from "react";
import ProductCard from "@/components/ProductCard";
import ShopFilters from "@/components/ShopFilters";
import { getProducts, getCategories } from "@/lib/data";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "المتجر | WED ود",
  description: "تصفحي كامل تشكيلة WED ود من اللانجيري، البيجامات، وأطقم العرائس.",
};

function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="h-96 rounded-2xl bg-white/50 border border-white/80 animate-pulse"
        />
      ))}
    </div>
  );
}

async function ShopGrid({ categoryId }: { categoryId?: number }) {
  const products = await getProducts(
    categoryId ? { category_id: categoryId } : {}
  );

  if (products.length === 0) {
    return (
      <p className="text-center text-gray-500 py-16">
        لا توجد منتجات في هذا التصنيف حالياً
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}


export default async function ShopPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const { category } = await searchParams;
  const categoryId = category ? Number(category) : undefined;
  const categories = await getCategories().catch(() => []);

  return (<div className="w-full max-w-7xl mx-auto px-4 py-10 space-y-8" dir="rtl">
      <div className="text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl font-arabic-title font-bold text-gray-900">تشكيلتنا الكاملة</h1>
        <p className="text-sm text-gray-500">اكتشفي جميع منتجات WED ود في مكان واحد</p>
      </div>

      <Suspense>
        <ShopFilters categories={categories} />
      </Suspense>

      <Suspense fallback={<ProductGridSkeleton />}>
        <ShopGrid categoryId={categoryId} />
      </Suspense>
    </div>
  );
}

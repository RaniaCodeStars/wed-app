import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { getProducts } from "@/lib/data";

export default async function ProductsSection() {
  let products = [];
  try {
    products = await getProducts();
  } catch {
    products = [];
  }

  const featured = products.slice(0, 8);

  return (
    <section className="py-16 px-4 max-w-7xl mx-auto" dir="rtl">
      <div className="text-center mb-12">
        <span className="text-xs font-bold tracking-[0.2em] text-[#b88080] uppercase mb-2 block">
          ✦ تشكيلة مختارة بعناية ✦
        </span>
        <h2 className="text-2xl sm:text-4xl font-arabic-title font-bold text-gray-900">منتجاتنا المميزة</h2>
        <p className="text-gray-600 text-sm mt-2 max-w-md mx-auto">اكتشفي أناقتكِ اليومية بأروع خامات الساتان والراحة المطلقة</p>
      </div>

      {featured.length === 0 ? (
        <p className="text-center text-gray-500 py-10">لا توجد منتجات حالياً</p>
      ) : (<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      <div className="text-center mt-12">
        <Link
          href="/shop"
          className="inline-flex items-center justify-center px-8 py-3.5 border border-gray-900 text-gray-900 text-sm font-medium rounded-full hover:bg-gray-900 hover:text-white transition shadow-sm"
        >
          عرض كل المنتجات
        </Link>
      </div>
    </section>
  );
}

import { notFound } from "next/navigation";
import Link from "next/link";
import { Star } from "lucide-react";
import type { Metadata } from "next";
import ProductGallery from "@/components/ProductGallery";
import ProductPurchaseBox from "@/components/ProductPurchaseBox";
import ReviewsList from "@/components/ReviewsList";
import ReviewForm from "@/components/ReviewForm";
import ProductCard from "@/components/ProductCard";
import { getProductById, getProductReviews, getProducts } from "@/lib/data";
import { formatPrice } from "@/lib/format";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  try {
    const product = await getProductById(id);
    return {
      title: `${product.title} | WED ود`,
      description: product.description?.slice(0, 155) || `${product.title} - تشكيلة WED ود للانجيري الفاخر`,
    };
  } catch {
    return { title: "المنتج غير موجود | WED ود" };
  }
}

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  let product;
  try {
    product = await getProductById(id);
  } catch {
    notFound();
  }

  const [reviews, related] = await Promise.all([
    getProductReviews(id).catch(() => []),
    getProducts(product.category ? { category_id: product.category.id } : {}).catch(() => []),
  ]);

  const avgRating = reviews.length > 0 ? reviews.reduce((a, r) => a + r.rating, 0) / reviews.length : 0;
  const relatedProducts = related.filter((p) => p.id !== product.id).slice(0, 4);
  const images = [product.image_principale, ...(product.images || [])].filter(Boolean) as string[];

  return (
    <div className="max-w-6xl mx-auto px-4 py-10" dir="rtl">
      <nav className="text-xs text-gray-400 mb-6 flex items-center gap-1.5">
        <Link href="/" className="hover:text-gray-700">الرئيسية</Link>
        <span>/</span>
        <Link href="/shop" className="hover:text-gray-700">المتجر</Link>
        <span>/</span>
        <span className="text-gray-600">{product.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <ProductGallery images={images} title={product.title} />

        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs text-gray-500">{product.category?.name}</span>
              {product.badge && (
                <span className="bg-[#E8C4C4]/60 text-gray-800 text-[10px] font-semibold px-2.5 py-0.5 rounded-full">{product.badge}</span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-arabic-title font-bold text-gray-900 mb-2">{product.title}</h1>

            {reviews.length > 0 && (
              <div className="flex items-center gap-2 mb-3">
                <div className="flex text-amber-400 gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < Math.round(avgRating) ? "fill-amber-400" : "fill-gray-200 text-gray-200"}`} />
                  ))}
                </div>
                <span className="text-xs text-gray-500">({reviews.length} تقييم)</span>
              </div>
            )}

            <p className="text-2xl font-bold text-[#b88080]">{formatPrice(product.price)}</p>
          </div>

          {product.description && <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>}

          <ProductPurchaseBox product={product} />

          <div className="bg-[#f9f2f2] rounded-2xl p-4 text-xs text-gray-700 space-y-1">
            <p className="font-bold text-gray-900">✦ الدفع عند الاستلام (COD)</p>
            <p>توصيل متوفر لكامل 58 ولاية عبر التراب الوطني.</p>
          </div>
        </div>
      </div>

      <section className="mt-16 max-w-3xl">
        <h2 className="text-xl font-arabic-title font-bold text-gray-900 mb-4">تقييمات الزبائن</h2>
        <div className="space-y-6">
          <ReviewForm productId={product.id} />
          <ReviewsList reviews={reviews} />
        </div>
      </section>

      {relatedProducts.length > 0 && (
        <section className="mt-16">
          <h2 className="text-xl font-arabic-title font-bold text-gray-900 mb-6">قد يعجبكِ أيضاً</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  );
}

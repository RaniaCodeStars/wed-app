"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart, Plus } from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { addItemToLocalCart } from "@/lib/cart";
import { getImageUrl } from "@/lib/media";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/lib/types";

export default function ProductCard({ product }: { product: Product }) {
  if (!product) return null;

  const categoryName = product.category?.name || "لانجيري";
  const outOfStock = !product.is_available || product.stock <= 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (outOfStock) {
      toast.error("هذا المنتج غير متوفر حالياً");
      return;
    }

    try {
      addItemToLocalCart({
        id: product.id,
        name: product.title,
        price: product.price,
        priceFormatted: formatPrice(product.price),
        image: getImageUrl(product.image_principale),
        category: categoryName,
        quantity: 1,
        stock: product.stock,
      });

      toast.success(
        <div className="flex items-center gap-3" dir="rtl">
          <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-xl">👗</div>
          <div>
            <p className="font-medium text-sm text-gray-900">تمت الإضافة للسلة!</p>
            <p className="text-xs text-gray-500 line-clamp-1">{product.title}</p>
          </div>
        </div>,
        { duration: 3000, position: "top-center", style: { background: "#fff", borderRadius: "16px", boxShadow: "0 10px 40px rgba(0,0,0,0.1)", padding: "8px 16px" } }
      );
    } catch {
      toast.error("حدث خطأ أثناء الإضافة");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="h-full flex w-full"
    >
      <div className="group relative bg-white/60 backdrop-blur-md rounded-2xl border border-white/80 p-3 shadow-[0_4px_20px_rgba(200,162,162,0.1)] hover:shadow-[0_8px_30px_rgba(200,162,162,0.25)] transition-all duration-300 flex flex-col w-full">
        <div className="relative w-full h-72 rounded-xl overflow-hidden bg-gray-100 mb-4">
          {product.badge && (
            <span className="absolute top-3 right-3 z-10 bg-[#D8B8D2]/90 backdrop-blur-sm text-gray-900 text-xs font-medium px-3 py-1 rounded-full shadow-sm">
              {product.badge}
            </span>
          )}
          {outOfStock && (
            <span className="absolute top-3 left-3 z-10 bg-gray-900/85 backdrop-blur-sm text-white text-xs font-medium px-3 py-1 rounded-full shadow-sm">
              غير متوفر
            </span>
          )}

          <Link href={`/shop/${product.id}`} className="block w-full h-full">
            <Image
              src={getImageUrl(product.image_principale)}
              alt={product.title}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </Link>

          {/* <button
            aria-label="Ajouter aux favoris"
            className="absolute bottom-3 left-3 z-10 w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-gray-700 hover:text-violet-500 hover:bg-white transition"
          >
            <Heart className="w-4 h-4" />
          </button> */}

          <motion.button
            onClick={handleAddToCart}
            aria-label="Ajouter au panier"
            whileHover={{ scale: outOfStock ? 1 : 1.1 }}
            whileTap={{ scale: outOfStock ? 1 : 0.95 }}
            className={`absolute bottom-3 right-3 z-20 w-12 h-12 rounded-full text-white shadow-lg flex items-center justify-center border-2 border-white transition-all duration-300 ${outOfStock ? "bg-gray-300 cursor-not-allowed" : "bg-[#9954ae] cursor-pointer"}`}
          >
            <Plus className="w-5 h-5 hover:rotate-90 transition-transform duration-300" />
          </motion.button>
        </div>

        <div className="flex flex-col flex-grow px-1">
          <span className="text-xs text-gray-500 mb-1">{categoryName}</span>
          <Link href={`/shop/${product.id}`}>
            <h3 className="text-sm font-semibold text-violet-900 mb-2 line-clamp-1 group-hover:text-[#D8B8D2] transition-colors">
              {product.title}
            </h3>
          </Link>
          <div className="mt-auto flex items-center justify-between pt-2 border-t border-gray-100">
            <span className="text-sm font-bold text-gray-900">{formatPrice(product.price)}</span>
            <span className="text-xs text-[#9954ae] font-medium">
              {outOfStock ? "نفدت الكمية" : "متوفر للتوصيل ✦"}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

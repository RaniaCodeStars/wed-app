"use client";

import { useState } from "react";
import { Minus, Plus, ShoppingBag } from "lucide-react";
import toast from "react-hot-toast";
import { addItemToLocalCart } from "@/lib/cart";
import { getImageUrl } from "@/lib/media";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/lib/types";

export default function ProductPurchaseBox({ product }: { product: Product }) {
  const sizes = product.sizes ? product.sizes.split(",").map((s) => s.trim()).filter(Boolean) : [];
  const colors = product.colors ? product.colors.split(",").map((c) => c.trim()).filter(Boolean) : [];

  const [selectedSize, setSelectedSize] = useState<string | null>(sizes[0] ?? null);
  const [selectedColor, setSelectedColor] = useState<string | null>(colors[0] ?? null);
  const [quantity, setQuantity] = useState(1);

  const outOfStock = !product.is_available || product.stock <= 0;

  const handleAddToCart = () => {
    if (outOfStock) return;
    if (sizes.length > 0 && !selectedSize) {
      toast.error("يرجى اختيار المقاس أولاً");
      return;
    }

    addItemToLocalCart({
      id: product.id,
      name: product.title,
      price: product.price,
      priceFormatted: formatPrice(product.price),
      image: getImageUrl(product.image_principale),
      category: product.category?.name || "لانجيري",
      quantity,
      stock: product.stock,
      selected_size: selectedSize,
      selected_color: selectedColor,
    });

    toast.success("تمت إضافة المنتج إلى السلة ✦", { position: "top-center" });
  };

  return (
    <div className="space-y-6">
      {sizes.length > 0 && (
        <div>
          <span className="block text-xs font-semibold text-gray-700 mb-2">المقاس</span>
          <div className="flex flex-wrap gap-2">
            {sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold border transition ${selectedSize === size ? "bg-[#b88080] text-white border-[#b88080]" : "bg-white border-gray-200 text-gray-700 hover:border-[#b88080]"}`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {colors.length > 0 && (
        <div>
          <span className="block text-xs font-semibold text-gray-700 mb-2">اللون</span>
          <div className="flex flex-wrap gap-2">
            {colors.map((color) => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold border transition ${selectedColor === color ? "bg-[#b88080] text-white border-[#b88080]" : "bg-white border-gray-200 text-gray-700 hover:border-[#b88080]"}`}
              >
                {color}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center gap-4">
        <span className="text-xs font-semibold text-gray-700">الكمية</span>
        <div className="flex items-center border border-gray-200 rounded-xl bg-white overflow-hidden">
          <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="w-9 h-9 flex items-center justify-center text-gray-600 hover:bg-gray-100">
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="w-10 text-center text-sm font-medium">{quantity}</span>
          <button
            onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
            disabled={quantity >= product.stock}
            className="w-9 h-9 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-30"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
        {product.stock > 0 && product.stock <= 5 && (
          <span className="text-xs text-amber-600 font-medium">بقي {product.stock} فقط!</span>
        )}
      </div>

      <button
        onClick={handleAddToCart}
        disabled={outOfStock}
        className={`w-full py-4 rounded-2xl text-sm font-bold shadow-md transition flex items-center justify-center gap-2 ${outOfStock ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-[#E8C4C4] text-gray-900 hover:bg-[#dfb5b5]"}`}
      >
        <ShoppingBag className="w-4 h-4" />
        <span>{outOfStock ? "غير متوفر حالياً" : "أضيفي إلى السلة"}</span>
      </button>
    </div>
  );
}

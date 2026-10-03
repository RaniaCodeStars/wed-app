"use client";

import { useRouter, useSearchParams } from "next/navigation";
import type { Category } from "@/lib/types";

export default function ShopFilters({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get("category");

  const setCategory = (id: number | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (id) params.set("category", String(id));
    else params.delete("category");
    router.push(`/shop?${params.toString()}`);
  };

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none" dir="rtl">
      <button
        onClick={() => setCategory(null)}
        className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-semibold border transition ${!activeCategory ? "bg-gray-900 text-white border-gray-900" : "bg-white/70 text-gray-700 border-gray-200 hover:bg-white"}`}
      >
        الكل
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => setCategory(cat.id)}
          className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-semibold border transition ${String(cat.id) === activeCategory ? "bg-[#9954ae] text-white border-[#9954ae]" : "bg-white/70 text-gray-700 border-gray-200 hover:bg-white"}`}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}

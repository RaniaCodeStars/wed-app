import Link from "next/link";

import { Sparkles, Heart, Flower2, Ribbon, Star, Feather } from "lucide-react";

import { getCategories } from "@/lib/data";

const ICONS = [Sparkles, Heart, Flower2, Ribbon, Star, Feather];

export default async function CategoryPills() {
  let categories: Awaited<ReturnType<typeof getCategories>> = [];

  try {
    categories = await getCategories();
  } catch {
    categories = [];
  }

  if (categories.length === 0) return null;

  return (
    <section className="px-4 py-6 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex items-end justify-between mb-5">
        <div className="text-right">
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#9954ae] font-medium">
            Collection
          </span>

          <h3 className="mt-1 text-xl font-arabic-title font-bold text-gray-900">
            التصنيفات
          </h3>
        </div>
      </div>

      {/* Categories */}
      <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-none">
        {categories.map((cat, i) => {
          const Icon = ICONS[i % ICONS.length];

          return (
            <Link
              key={cat.id}
              href={`/shop?category=${cat.id}`}
              className="
                group
                flex-shrink-0
                w-32
                bg-white
                border border-[#eadada]
                rounded-2xl
                p-4
                text-center
                transition-all
                duration-300
                hover:-translate-y-1
                hover:border-[#D8B8D2]
                hover:shadow-[0_10px_30px_rgba(184,128,128,0.12)]
              "
            >
              {/* Icon */}
              <div
                className="
                  mx-auto
                  mb-3
                  w-12
                  h-12
                  rounded-full
                  bg-[#faf3f3]
                  border border-[#eadada]
                  flex
                  items-center
                  justify-center
                  transition-all
                  duration-300
                  group-hover:bg-[#f6eaea]
                  group-hover:border-[#D8B8D2]
                "
              >
                <Icon
                  className="
                    w-5
                    h-5
                    text-[#9954ae]
                    stroke-[1.4]
                    transition-transform
                    duration-300
                    group-hover:scale-110
                  "
                />
              </div>

              {/* Category name */}
              <span
                className="
                  block
                  text-xs
                  font-semibold
                  text-gray-800
                  leading-relaxed
                  group-hover:text-[#9954ae]
                  transition-colors
                "
              >
                {cat.name}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

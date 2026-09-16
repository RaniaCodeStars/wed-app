import { Star } from "lucide-react";
import type { Review } from "@/lib/types";
import { formatDate } from "@/lib/format";

export default function ReviewsList({ reviews }: { reviews: Review[] }) {
  if (reviews.length === 0) {
    return <p className="text-sm text-gray-500 py-6">لا توجد تقييمات بعد — كوني أول من يقيّم هذا المنتج!</p>;
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div key={review.id} className="bg-white/70 border border-gray-100 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="font-semibold text-sm text-gray-900">{review.customer_name}</span>
            <div className="flex text-amber-400 gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={`w-3.5 h-3.5 ${i < review.rating ? "fill-amber-400" : "fill-gray-200 text-gray-200"}`} />
              ))}
            </div>
          </div>
          <p className="text-xs text-gray-600 leading-relaxed">{review.text}</p>
          <span className="text-[10px] text-gray-400 mt-2 block">{formatDate(review.created_at)}</span>
        </div>
      ))}
    </div>
  );
}

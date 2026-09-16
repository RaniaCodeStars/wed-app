"use client";

import { useState } from "react";
import { Star, Check, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { apiFetch, ApiClientError } from "@/lib/api";
import { formatDate } from "@/lib/format";
import type { Review } from "@/lib/types";

export default function ReviewsModeration({ initialReviews }: { initialReviews: Review[] }) {
  const [reviews, setReviews] = useState(initialReviews);

  const approve = async (id: number) => {
    try {
      await apiFetch(`/reviews/${id}/status`, { method: "PATCH", body: JSON.stringify({ status: "approved" }) });
      setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, status: "approved" } : r)));
      toast.success("تم اعتماد التقييم");
    } catch (err) {
      toast.error(err instanceof ApiClientError ? err.message : "حدث خطأ");
    }
  };

  const remove = async (id: number) => {
    if (!confirm("حذف هذا التقييم؟")) return;
    try {
      await apiFetch(`/reviews/${id}`, { method: "DELETE" });
      setReviews((prev) => prev.filter((r) => r.id !== id));
      toast.success("تم حذف التقييم");
    } catch (err) {
      toast.error(err instanceof ApiClientError ? err.message : "حدث خطأ");
    }
  };

  return (
    <div className="space-y-3">
      {reviews.map((review) => (
        <div key={review.id} className="bg-white/80 backdrop-blur-md rounded-2xl p-5 border border-gray-100 shadow-sm flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-sm text-gray-900">{review.customer_name}</span>
              <div className="flex text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`w-3.5 h-3.5 ${i < review.rating ? "fill-amber-400" : "fill-gray-200 text-gray-200"}`} />
                ))}
              </div>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${review.status === "approved" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                {review.status === "approved" ? "معتمد" : "قيد المراجعة"}
              </span>
            </div>
            <p className="text-xs text-gray-600">{review.text}</p>
            <span className="text-[10px] text-gray-400 mt-1 block">{formatDate(review.created_at)}</span>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            {review.status !== "approved" && (
              <button onClick={() => approve(review.id)} className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 hover:bg-emerald-100 transition">
                <Check className="w-3.5 h-3.5" />
              </button>
            )}
            <button onClick={() => remove(review.id)} className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center text-rose-500 hover:bg-rose-100 transition">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ))}
      {reviews.length === 0 && <p className="text-center text-gray-400 py-10">لا توجد تعليقات بعد</p>}
    </div>
  );
}

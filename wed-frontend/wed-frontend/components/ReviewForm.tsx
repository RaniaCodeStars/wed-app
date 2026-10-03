"use client";

import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import toast from "react-hot-toast";
import { apiFetch } from "@/lib/api";

export default function ReviewForm({ productId }: { productId: number }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me").then((r) => r.json()).then((d) => setIsAuthenticated(!!d.authenticated));
  }, []);

  if (isAuthenticated === false) {
    return (
      <p className="text-xs text-gray-500 bg-gray-50 rounded-xl p-4">
        <a href="/login" className="text-[#9954ae] font-semibold underline underline-offset-2">سجّلي الدخول</a> لتتمكني من إضافة تقييم لهذا المنتج.
      </p>
    );
  }

  if (done) {
    return <p className="text-xs text-emerald-600 bg-emerald-50 rounded-xl p-4">شكراً لتقييمك! سيظهر تعليقك بعد مراجعته من فريقنا ✦</p>;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || !customerName.trim()) return;
    setSubmitting(true);
    try {
      await apiFetch("/reviews/", {
        method: "POST",
        body: JSON.stringify({ product_id: productId, rating, text, customer_name: customerName }),
      });
      setDone(true);
      toast.success("تم إرسال تقييمك بنجاح!");
    } catch {
      toast.error("حدث خطأ أثناء إرسال التقييم");
    } finally {
      setSubmitting(false);
    }
  };

  if (isAuthenticated === null) return null;

  return (
    <form onSubmit={handleSubmit} className="space-y-3 bg-white/70 border border-gray-100 rounded-2xl p-4">
      <div className="flex items-center gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <button key={i} type="button" onClick={() => setRating(i + 1)}>
            <Star className={`w-5 h-5 ${i < rating ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200"}`} />
          </button>
        ))}
      </div>
      <input
        value={customerName}
        onChange={(e) => setCustomerName(e.target.value)}
        placeholder="اسمكِ الظاهر مع التقييم"
        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8C4C4]"
      />
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="شاركينا رأيك في هذا المنتج..."
        rows={3}
        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#D8B8D2] resize-none"
      />
      <button
        type="submit"
        disabled={submitting}
        className="px-5 py-2.5 bg-gray-900 text-white text-xs font-bold rounded-xl hover:bg-gray-800 transition disabled:opacity-50"
      >
        {submitting ? "جاري الإرسال..." : "إرسال التقييم"}
      </button>
    </form>
  );
}

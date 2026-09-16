"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Printer } from "lucide-react";
import toast from "react-hot-toast";
import { apiFetch, ApiClientError } from "@/lib/api";
import { ORDER_STATUS_LABELS } from "@/lib/format";
import type { Order, OrderStatus } from "@/lib/types";

const STATUS_FLOW: OrderStatus[] = ["pending", "confirmed", "shipped", "delivered"];

export default function OrderStatusControl({ order }: { order: Order }) {
  const router = useRouter();
  const [status, setStatus] = useState<OrderStatus>(order.status);
  const [loading, setLoading] = useState(false);

  const updateStatus = async (newStatus: OrderStatus) => {
    setLoading(true);
    try {
      await apiFetch(`/admin/orders/${order.id}/status`, { method: "PUT", body: JSON.stringify({ status: newStatus }) });
      setStatus(newStatus);
      toast.success(`تم تحديث الحالة إلى: ${ORDER_STATUS_LABELS[newStatus]}`);
      router.refresh();
    } catch (err) {
      toast.error(err instanceof ApiClientError ? err.message : "حدث خطأ");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("هل تريدين حذف هذه الطلبية نهائياً؟")) return;
    setLoading(true);
    try {
      await apiFetch(`/admin/orders/${order.id}`, { method: "DELETE" });
      toast.success("تم حذف الطلبية");
      router.push("/admin/orders");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof ApiClientError ? err.message : "حدث خطأ");
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 border border-gray-100 shadow-sm space-y-5">
      <h3 className="font-bold text-gray-900 text-sm">حالة الطلبية</h3>

      <div className="flex flex-wrap gap-2">
        {STATUS_FLOW.map((s) => (
          <button
            key={s}
            onClick={() => updateStatus(s)}
            disabled={loading || status === s}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition ${status === s ? "bg-gray-900 text-white border-gray-900" : "bg-white text-gray-700 border-gray-200 hover:border-gray-900"} disabled:opacity-60`}
          >
            {ORDER_STATUS_LABELS[s]}
          </button>
        ))}
      </div>

      <div className="flex gap-2 pt-2 border-t border-gray-100">
        <button
          onClick={() => updateStatus("returned")}
          disabled={loading}
          className="flex-1 px-4 py-2.5 rounded-xl text-xs font-bold bg-orange-50 text-orange-700 border border-orange-200 hover:bg-orange-100 transition disabled:opacity-60"
        >
          مرتجعة
        </button>
        <button
          onClick={() => updateStatus("cancelled")}
          disabled={loading}
          className="flex-1 px-4 py-2.5 rounded-xl text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 transition disabled:opacity-60"
        >
          إلغاء الطلبية
        </button>
      </div>

      <div className="flex gap-2 pt-2 border-t border-gray-100">
        <button onClick={() => window.print()} className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-gray-50 text-gray-700 hover:bg-gray-100 transition">
          <Printer className="w-3.5 h-3.5" />
          <span>طباعة وصل التسليم</span>
        </button>
        <button onClick={handleDelete} disabled={loading} className="px-4 py-2.5 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 transition disabled:opacity-60">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

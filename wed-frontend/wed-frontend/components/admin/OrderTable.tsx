"use client";

import Link from "next/link";
import type { Order } from "@/lib/types";
import { formatPrice, formatDate, ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from "@/lib/format";

export default function OrderTable({ orders, compact }: { orders: Order[]; compact?: boolean }) {
  return (
    <div className="bg-white/80 backdrop-blur-md rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <h3 className="font-bold text-gray-900 text-sm">{compact ? "آخر الطلبيات" : "جميع الطلبيات"}</h3>
        {compact && <Link href="/admin/orders" className="text-xs text-[#b88080] font-semibold">عرض الكل</Link>}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-right">
          <thead className="bg-gray-50/70 text-gray-500 text-xs">
            <tr>
              <th className="py-3 px-6 font-medium">رقم الطلب</th>
              <th className="py-3 px-6 font-medium">الزبونة</th>
              <th className="py-3 px-6 font-medium">الولاية</th>
              <th className="py-3 px-6 font-medium">المجموع</th>
              <th className="py-3 px-6 font-medium">الحالة</th>
              <th className="py-3 px-6 font-medium">التاريخ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50/50 transition cursor-pointer" onClick={() => (window.location.href = `/admin/orders/${order.id}`)}>
                <td className="py-3 px-6 font-bold text-gray-900">#WED-{order.id}</td>
                <td className="py-3 px-6 text-gray-600">{order.customer_name}</td>
                <td className="py-3 px-6 text-gray-600">{order.wilaya}</td>
                <td className="py-3 px-6 font-semibold text-gray-900">{formatPrice(order.total_price)}</td>
                <td className="py-3 px-6">
                  <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border ${ORDER_STATUS_COLORS[order.status]}`}>
                    {ORDER_STATUS_LABELS[order.status]}
                  </span>
                </td>
                <td className="py-3 px-6 text-gray-400 text-xs">{formatDate(order.created_at)}</td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr><td colSpan={6} className="py-10 text-center text-gray-400">لا توجد طلبيات بعد</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

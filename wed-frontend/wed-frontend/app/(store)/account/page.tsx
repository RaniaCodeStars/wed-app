import { redirect } from "next/navigation";

import { Package, UserRound, Heart, ShoppingBag } from "lucide-react";

import { getSession } from "@/lib/session";
import { serverFetch } from "@/lib/server-api";

import {
  formatPrice,
  formatDate,
  ORDER_STATUS_LABELS,
  ORDER_STATUS_COLORS,
} from "@/lib/format";

import LogoutButton from "@/components/LogoutButton";

import type { Order } from "@/lib/types";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "حسابي | WED ود",
};

export default async function AccountPage() {
  const session = await getSession();

  if (!session) redirect("/login");

  const orders = await serverFetch<Order[]>("/orders/", {
    withAuth: true,
    revalidate: false,
  }).catch(() => []);

  return (
    <div
      className="min-h-screen max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12"
      dir="rtl"
    >
      {/* ================= HEADER ================= */}
      <div className="mb-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Heart className="w-4 h-4 text-[#b88080]" strokeWidth={1.7} />

              <span className="text-xs font-medium text-[#b88080]">WED ود</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-arabic-title font-bold text-gray-900">
              مرحباً بكِ في مساحتكِ
            </h1>

            <p className="text-sm text-gray-500 mt-2">
              تابعي طلباتكِ واحتفظي بتفاصيل مشترياتكِ في مكان واحد.
            </p>
          </div>

          <LogoutButton />
        </div>
      </div>

      {/* ================= PROFILE CARD ================= */}
      <div className="relative overflow-hidden bg-white/75 backdrop-blur-xl border border-[#eadada] rounded-3xl p-5 sm:p-6 mb-10 shadow-sm">
        {/* decorative circle */}
        <div className="absolute -top-12 -left-12 w-28 h-28 rounded-full bg-[#f8e9e9]/70" />

        <div className="relative flex items-center gap-4">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#f8e9e9] flex items-center justify-center shrink-0">
            <UserRound
              className="w-5 h-5 sm:w-6 sm:h-6 text-[#b88080]"
              strokeWidth={1.6}
            />
          </div>

          <div className="min-w-0">
            <p className="text-xs text-gray-400 mb-1">حسابكِ</p>

            <p className="text-sm sm:text-base font-semibold text-gray-900 truncate">
              {session.sub}
            </p>

            <p className="text-xs text-gray-400 mt-1">
              سعيدة بوجودكِ معنا في WED ود
            </p>
          </div>
        </div>
      </div>

      {/* ================= ORDERS HEADER ================= */}
      <div className="flex items-end justify-between mb-5">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-[#f8e9e9] flex items-center justify-center">
              <ShoppingBag
                className="w-4 h-4 text-[#b88080]"
                strokeWidth={1.7}
              />
            </div>

            <h2 className="text-lg font-bold text-gray-900">طلباتي</h2>
          </div>

          <p className="text-xs text-gray-400 mt-2 mr-11">
            جميع طلباتكِ السابقة والحالية
          </p>
        </div>

        <span className="text-xs font-semibold text-[#b88080] bg-[#f8e9e9] px-3 py-1.5 rounded-full">
          {orders.length} طلب
        </span>
      </div>

      {/* ================= EMPTY STATE ================= */}
      {orders.length === 0 ? (
        <div className="bg-white/70 backdrop-blur-sm border border-gray-100 rounded-3xl p-10 sm:p-14 text-center shadow-sm">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-[#f8e9e9] flex items-center justify-center">
            <Package className="w-6 h-6 text-[#b88080]" strokeWidth={1.6} />
          </div>

          <h3 className="mt-5 text-base font-bold text-gray-800">
            لم تقومي بأي طلب بعد
          </h3>

          <p className="text-sm text-gray-400 mt-2 max-w-sm mx-auto leading-6">
            عندما تقومين بأول طلب لكِ، ستجدين جميع تفاصيله هنا.
          </p>
        </div>
      ) : (
        /* ================= ORDERS ================= */
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="
                group
                bg-white/75
                backdrop-blur-md
                border border-gray-100
                rounded-3xl
                p-4 sm:p-5
                shadow-sm
                hover:shadow-md
                hover:border-[#eadada]
                transition-all duration-300
              "
            >
              <div className="flex items-center justify-between gap-4">
                {/* LEFT */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-11 h-11 rounded-2xl bg-gray-50 flex items-center justify-center shrink-0 group-hover:bg-[#f8e9e9] transition">
                    <Package
                      className="w-5 h-5 text-gray-400 group-hover:text-[#b88080] transition"
                      strokeWidth={1.6}
                    />
                  </div>

                  <div className="min-w-0">
                    <p className="font-semibold text-sm text-gray-900">
                      طلب #WED-{order.id}
                    </p>

                    <p className="text-xs text-gray-400 mt-1">
                      {formatDate(order.created_at)}
                    </p>

                    <p className="text-[11px] text-gray-400 mt-1">
                      {order.items.length} منتج
                    </p>
                  </div>
                </div>

                {/* RIGHT */}
                <div className="text-left shrink-0 space-y-2">
                  <p className="font-bold text-sm sm:text-base text-[#b88080]">
                    {formatPrice(order.total_price)}
                  </p>

                  <span
                    className={`inline-block text-[10px] font-semibold px-2.5 py-1 rounded-full border ${
                      ORDER_STATUS_COLORS[order.status]
                    }`}
                  >
                    {ORDER_STATUS_LABELS[order.status]}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ================= FOOTER MESSAGE ================= */}
      <div className="mt-10 text-center">
        <p className="text-xs text-gray-400">شكراً لاختياركِ WED ود 🤍</p>
      </div>
    </div>
  );
}

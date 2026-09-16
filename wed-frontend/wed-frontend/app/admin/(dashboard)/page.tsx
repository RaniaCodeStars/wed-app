import { DollarSign, ShoppingBag, Clock, TrendingUp } from "lucide-react";
import AdminHeader from "@/components/admin/AdminHeader";
import StatCard from "@/components/admin/StatCard";
import OrderTable from "@/components/admin/OrderTable";
import { getDashboardStats, getAdminOrders } from "@/lib/data";
import { formatPrice } from "@/lib/format";

export default async function AdminDashboardPage() {
  const [stats, orders] = await Promise.all([
    getDashboardStats().catch(() => null),
    getAdminOrders().catch(() => []),
  ]);

  return (
    <div className="space-y-6">
      <AdminHeader title="لوحة القيادة" subtitle="نظرة عامة على أداء متجرك" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="إجمالي المبيعات" value={formatPrice(stats?.total_revenue ?? 0)} icon={DollarSign} color="bg-emerald-50 text-emerald-600" />
        <StatCard title="طلبيات اليوم" value={String(stats?.orders_today ?? 0)} icon={TrendingUp} color="bg-blue-50 text-blue-600" />
        <StatCard title="قيد الانتظار" value={String(stats?.pending_orders ?? 0)} icon={Clock} color="bg-amber-50 text-amber-600" />
        <StatCard title="إجمالي الطلبيات" value={String(stats?.total_orders ?? 0)} icon={ShoppingBag} color="bg-[#f9f2f2] text-[#b88080]" />
      </div>

      {stats && stats.top_products.length > 0 && (
        <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-900 text-sm mb-4">🏆 المنتجات الأكثر مبيعاً</h3>
          <div className="grid sm:grid-cols-3 gap-4">
            {stats.top_products.map((p, i) => (
              <div key={p.product_id} className="flex items-center gap-3 bg-gray-50/70 rounded-2xl p-3">
                <span className="w-8 h-8 rounded-full bg-[#E8C4C4] text-gray-900 font-bold text-xs flex items-center justify-center flex-shrink-0">#{i + 1}</span>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-gray-900 truncate">{p.title}</p>
                  <p className="text-[11px] text-gray-500">{p.sales_count} مبيعة · {formatPrice(p.total_revenue)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <OrderTable orders={orders.slice(0, 6)} compact />
    </div>
  );
}

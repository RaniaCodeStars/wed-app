import AdminHeader from "@/components/admin/AdminHeader";
import OrderTable from "@/components/admin/OrderTable";
import { getAdminOrders } from "@/lib/data";

export default async function AdminOrdersPage() {
  const orders = await getAdminOrders().catch(() => []);
  return (
    <div className="space-y-6">
      <AdminHeader title="الطلبيات" subtitle={`${orders.length} طلبية بمختلف الحالات`} />
      <OrderTable orders={orders} />
    </div>
  );
}

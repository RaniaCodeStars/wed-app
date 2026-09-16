import { notFound } from "next/navigation";
import Image from "next/image";
import AdminHeader from "@/components/admin/AdminHeader";
import OrderStatusControl from "@/components/admin/OrderStatusControl";
import { getAdminOrder } from "@/lib/data";
import { getImageUrl } from "@/lib/media";
import { formatPrice, formatDate, ORDER_STATUS_LABELS } from "@/lib/format";

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await getAdminOrder(id).catch(() => null);
  if (!order) notFound();

  return (
    <div className="space-y-6">
      <AdminHeader title={`طلبية #WED-${order.id}`} subtitle={formatDate(order.created_at)} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 print:block">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-900 text-sm mb-4">المنتجات المطلوبة</h3>
            <div className="divide-y divide-gray-100">
              {order.items.map((item) => (
                <div key={item.id} className="py-3 flex items-center gap-4">
                  <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                    {item.product && <Image src={getImageUrl(item.product.image_principale)} alt={item.product.title} fill sizes="56px" className="object-cover" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-gray-900 truncate">{item.product?.title ?? `منتج #${item.product_id}`}</p>
                    <p className="text-xs text-gray-400">
                      الكمية: {item.quantity}
                      {item.selected_size ? ` · المقاس: ${item.selected_size}` : ""}
                      {item.selected_color ? ` · اللون: ${item.selected_color}` : ""}
                    </p>
                  </div>
                  <span className="font-bold text-sm text-gray-900">{formatPrice(item.price_at_purchase * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between pt-4 mt-2 border-t border-dashed border-gray-200 font-bold text-gray-900">
              <span>الإجمالي</span>
              <span className="text-[#b88080]">{formatPrice(order.total_price)}</span>
            </div>
          </div>

          <div className="print:hidden">
            <OrderStatusControl order={order} />
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 border border-gray-100 shadow-sm space-y-3">
            <h3 className="font-bold text-gray-900 text-sm mb-2">معلومات الزبونة والتوصيل</h3>
            <p className="text-sm"><span className="text-gray-400">الاسم: </span><span className="font-semibold text-gray-900">{order.customer_name}</span></p>
            <p className="text-sm" dir="ltr"><span className="text-gray-400">الهاتف: </span><span className="font-semibold text-gray-900">{order.phone}</span></p>
            <p className="text-sm"><span className="text-gray-400">الولاية: </span><span className="font-semibold text-gray-900">{order.wilaya}</span></p>
            <p className="text-sm"><span className="text-gray-400">البلدية: </span><span className="font-semibold text-gray-900">{order.commune}</span></p>
            <p className="text-sm"><span className="text-gray-400">نوع التوصيل: </span><span className="font-semibold text-gray-900">{order.delivery_type === "domicile" ? "توصيل للمنزل" : "استلام من المكتب"}</span></p>
            {order.address && <p className="text-sm"><span className="text-gray-400">العنوان: </span><span className="font-semibold text-gray-900">{order.address}</span></p>}
            {order.office_name && <p className="text-sm"><span className="text-gray-400">المكتب: </span><span className="font-semibold text-gray-900">{order.office_name}</span></p>}
            <p className="text-sm"><span className="text-gray-400">الدفع: </span><span className="font-semibold text-gray-900">الدفع عند الاستلام</span></p>
            <p className="text-sm"><span className="text-gray-400">الحالة الحالية: </span><span className="font-semibold text-gray-900">{ORDER_STATUS_LABELS[order.status]}</span></p>
          </div>
        </div>
      </div>
    </div>
  );
}

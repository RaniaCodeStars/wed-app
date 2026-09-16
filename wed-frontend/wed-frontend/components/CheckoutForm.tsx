"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingBag, Phone, User, CheckCircle2, Truck, Building2, Home } from "lucide-react";
import toast from "react-hot-toast";
import { getCartItems, clearCart, type CartItem } from "@/lib/cart";
import { apiFetch, ApiClientError } from "@/lib/api";
import { formatPrice, isValidAlgerianPhone } from "@/lib/format";
import type { Wilaya, Order, DeliveryType } from "@/lib/types";

export default function CheckoutForm({ wilayas }: { wilayas: Wilaya[] }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [deliveryType, setDeliveryType] = useState<DeliveryType>("domicile");
  const [formData, setFormData] = useState({ customer_name: "", phone: "", wilaya: "", commune: "", address: "", office_name: "" });
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  useEffect(() => {
    setCartItems(getCartItems());
  }, []);

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.customer_name.trim()) errs.customer_name = "الاسم مطلوب";
    if (!isValidAlgerianPhone(formData.phone)) errs.phone = "رقم هاتف غير صالح (مثال: 0550000000)";
    if (!formData.wilaya) errs.wilaya = "يرجى اختيار الولاية";
    if (!formData.commune.trim()) errs.commune = "البلدية مطلوبة";
    if (deliveryType === "domicile" && !formData.address.trim()) errs.address = "العنوان مطلوب للتوصيل للمنزل";
    if (deliveryType === "bureau" && !formData.office_name.trim()) errs.office_name = "اسم المكتب مطلوب";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      toast.error("سلة المشتريات فارغة");
      return;
    }
    if (!validate()) return;

    setSubmitting(true);
    try {
      const order = await apiFetch<Order>("/orders/", {
        method: "POST",
        body: JSON.stringify({
          customer_name: formData.customer_name,
          phone: formData.phone,
          wilaya: formData.wilaya,
          commune: formData.commune,
          delivery_type: deliveryType,
          address: deliveryType === "domicile" ? formData.address : null,
          office_name: deliveryType === "bureau" ? formData.office_name : null,
          items: cartItems.map((item) => ({
            product_id: item.id,
            quantity: item.quantity,
            selected_size: item.selected_size ?? null,
            selected_color: item.selected_color ?? null,
          })),
        }),
      });

      clearCart();
      setConfirmedOrder(order);
    } catch (err) {
      const message = err instanceof ApiClientError ? err.message : "حدث خطأ أثناء إرسال الطلب";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  if (confirmedOrder) {
    return (
      <div className="max-w-md mx-auto bg-white/90 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-gray-100 text-center space-y-6">
        <div className="w-20 h-20 bg-[#f9f2f2] text-[#b88080] rounded-full flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-arabic-title font-bold text-gray-900">تم تسجيل طلبك بنجاح!</h2>
          <p className="text-sm text-gray-500">
            شكراً لتشريفك لنا. رقم طلبك هو <span className="font-bold text-gray-900">#WED-{confirmedOrder.id}</span>
          </p>
        </div>
        <div className="bg-gray-50 rounded-2xl p-4 text-right space-y-2 text-xs text-gray-600 border border-gray-100">
          <p><span className="font-bold">الاسم:</span> {confirmedOrder.customer_name}</p>
          <p><span className="font-bold">الهاتف:</span> {confirmedOrder.phone}</p>
          <p><span className="font-bold">النوع:</span> {confirmedOrder.delivery_type === "domicile" ? "توصيل للمنزل" : "استلام من المكتب"}</p>
          <p><span className="font-bold">الوجهة:</span> {confirmedOrder.wilaya} - {confirmedOrder.commune}</p>
          <p><span className="font-bold">الإجمالي:</span> {formatPrice(confirmedOrder.total_price)}</p>
          <p className="text-[#b88080] font-medium pt-1 border-t border-gray-200">✦ سنتصل بك قريباً عبر الهاتف لتأكيد الطلب.</p>
        </div>
        <Link href="/" className="block w-full py-3.5 bg-gray-900 text-white text-sm font-medium rounded-2xl hover:bg-gray-800 transition shadow-md text-center">
          العودة إلى الرئيسية
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      <div className="lg:col-span-7 bg-white/80 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100">
        <h2 className="text-base font-bold text-gray-900 mb-6 flex items-center gap-2">
          <User className="w-5 h-5 text-[#b88080]" />
          معلومات التوصيل
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-2">طريقة التوصيل</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setDeliveryType("domicile")}
                className={`flex items-center justify-center gap-2 p-3.5 rounded-2xl border text-sm font-medium transition ${deliveryType === "domicile" ? "border-[#b88080] bg-[#f9f2f2] text-gray-900 shadow-sm" : "border-gray-200 bg-white/50 text-gray-600 hover:bg-white"}`}
              >
                <Home className="w-4 h-4 text-[#b88080]" />
                <span>توصيل للمنزل</span>
              </button>
              <button
                type="button"
                onClick={() => setDeliveryType("bureau")}
                className={`flex items-center justify-center gap-2 p-3.5 rounded-2xl border text-sm font-medium transition ${deliveryType === "bureau" ? "border-[#b88080] bg-[#f9f2f2] text-gray-900 shadow-sm" : "border-gray-200 bg-white/50 text-gray-600 hover:bg-white"}`}
              >
                <Building2 className="w-4 h-4 text-[#b88080]" />
                <span>استلام من المكتب</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">الاسم واللقب</label>
            <input
              name="customer_name"
              required
              placeholder="مثال: فاطمة الزهراء"
              value={formData.customer_name}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8C4C4] bg-white/50"
            />
            {errors.customer_name && <p className="text-[11px] text-rose-600 mt-1">{errors.customer_name}</p>}
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">رقم الهاتف (أساسي للتأكيد)</label>
            <div className="relative">
              <input
                type="tel"
                name="phone"
                required
                placeholder="0550000000"
                value={formData.phone}
                onChange={handleChange}
                dir="ltr"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8C4C4] bg-white/50 text-left"
              />
              <Phone className="absolute right-4 top-3.5 w-4 h-4 text-gray-400" />
            </div>
            {errors.phone && <p className="text-[11px] text-rose-600 mt-1">{errors.phone}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">الولاية</label>
              <select
                name="wilaya"
                required
                value={formData.wilaya}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8C4C4] bg-white/50"
              >
                <option value="">اختر الولاية...</option>
                {wilayas.map((w) => (
                  <option key={w.code} value={w.name_fr}>{w.code} - {w.name_ar}</option>
                ))}
              </select>
              {errors.wilaya && <p className="text-[11px] text-rose-600 mt-1">{errors.wilaya}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">البلدية</label>
              <input
                name="commune"
                required
                placeholder="مثال: الشراقة"
                value={formData.commune}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8C4C4] bg-white/50"
              />
              {errors.commune && <p className="text-[11px] text-rose-600 mt-1">{errors.commune}</p>}
            </div>
          </div>

          {deliveryType === "domicile" ? (
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">العنوان الكامل</label>
              <input
                name="address"
                required
                placeholder="مثال: حي البدر، عمارة 5"
                value={formData.address}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8C4C4] bg-white/50"
              />
              {errors.address && <p className="text-[11px] text-rose-600 mt-1">{errors.address}</p>}
            </div>
          ) : (
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">اسم المكتب (Stop Desk)</label>
              <input
                name="office_name"
                required
                placeholder="مثال: مكتب بلدية الشراقة"
                value={formData.office_name}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8C4C4] bg-white/50"
              />
              {errors.office_name && <p className="text-[11px] text-rose-600 mt-1">{errors.office_name}</p>}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full mt-2 py-4 bg-[#E8C4C4] text-gray-900 font-bold rounded-2xl shadow-md hover:bg-[#dfb5b5] transition text-sm flex items-center justify-center gap-2 disabled:opacity-60"
          >
            <span>{submitting ? "جاري إرسال الطلب..." : "تأكيد الطلب الآن"}</span>
          </button>
        </form>
      </div>

      <div className="lg:col-span-5 bg-white/80 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 space-y-6">
        <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
          <ShoppingBag className="w-5 h-5 text-[#b88080]" />
          ملخص الطلبية
        </h2>

        {cartItems.length === 0 ? (
          <p className="text-sm text-gray-500">
            سلة المشتريات فارغة. <Link href="/shop" className="text-[#b88080] font-semibold underline underline-offset-2">تسوقي الآن</Link>
          </p>
        ) : (
          <>
            <div className="divide-y divide-gray-100 max-h-60 overflow-y-auto space-y-4">
              {cartItems.map((item) => (
                <div key={`${item.id}-${item.selected_size}-${item.selected_color}`} className="pt-3 first:pt-0 flex justify-between items-center text-sm">
                  <div>
                    <h4 className="font-semibold text-gray-900">{item.name}</h4>
                    <span className="text-xs text-gray-400">الكمية: {item.quantity}{item.selected_size ? ` · ${item.selected_size}` : ""}</span>
                  </div>
                  <span className="font-bold text-[#b88080]">{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-100 pt-4 space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>المجموع الفرعي</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-1.5"><Truck className="w-4 h-4 text-[#b88080]" />رسوم التوصيل</span>
                <span className="text-xs text-[#b88080] font-medium">تُحدد عند التأكيد الهاتفي</span>
              </div>
              <div className="flex justify-between text-base font-bold text-gray-900 pt-2 border-t border-dashed border-gray-200">
                <span>الإجمالي الحالي</span>
                <span className="text-[#b88080]">{formatPrice(subtotal)}</span>
              </div>
            </div>
          </>
        )}

        <div className="bg-[#f9f2f2] rounded-2xl p-4 text-xs text-gray-700 space-y-1">
          <p className="font-bold text-gray-900">✦ الدفع عند الاستلام (COD)</p>
          <p>لن تقومي بدفع أي مبلغ حتى تستلمي طلبيتكِ وتتأكدي منها بنفسك.</p>
        </div>
      </div>
    </div>
  );
}

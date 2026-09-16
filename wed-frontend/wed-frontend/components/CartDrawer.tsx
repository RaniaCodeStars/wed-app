"use client";

import { X, ShoppingBag, Plus, Minus, Trash2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import type { CartItem } from "@/lib/cart";
import { formatPrice } from "@/lib/format";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (id: number, delta: number) => void;
  onRemoveItem: (id: number) => void;
}

export default function CartDrawer({ isOpen, onClose, cartItems, onUpdateQuantity, onRemoveItem }: CartDrawerProps) {
  if (!isOpen) return null;

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center sm:justify-start sm:items-center sm:pl-4" dir="rtl">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={onClose} />

      <div className="relative z-10 w-[92%] sm:w-full max-w-md h-[85vh] sm:h-[calc(100vh-2rem)] bg-white shadow-2xl flex flex-col rounded-3xl sm:rounded-[2.5rem] overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-white/80 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#b88080]" />
            <h2 className="text-lg font-serif font-bold text-gray-900">سلة المشتريات</h2>
            <span className="text-xs bg-[#E8C4C4]/30 text-gray-800 font-medium px-2.5 py-0.5 rounded-full">
              {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
            </span>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition" aria-label="إغلاق">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-gray-500 space-y-3">
              <div className="w-16 h-16 rounded-full bg-[#f9f2f2] flex items-center justify-center text-[#b88080]">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <p className="text-sm font-medium">سلة المشتريات فارغة حالياً</p>
              <p className="text-xs text-gray-400 max-w-xs">اكتشفي تشكيلتنا المميزة من اللانجيري وأضيفي ما يعجبكِ إلى السلة.</p>
              <Link href="/shop" onClick={onClose} className="text-xs font-semibold text-[#b88080] underline underline-offset-4">
                تسوقي الآن
              </Link>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={`${item.id}-${item.selected_size}-${item.selected_color}`} className="flex gap-4 p-3 bg-gray-50/70 rounded-2xl border border-gray-100 items-center">
                <div className="relative w-20 h-20 rounded-xl bg-gradient-to-br from-[#f9f2f2] to-[#eed7d7]/30 flex-shrink-0 overflow-hidden">
                  {item.image ? (
                    <Image src={item.image} alt={item.name} fill sizes="80px" className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">صورة</div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <span className="text-[11px] text-gray-400 block mb-0.5">
                    {item.category}
                    {item.selected_size ? ` · ${item.selected_size}` : ""}
                    {item.selected_color ? ` · ${item.selected_color}` : ""}
                  </span>
                  <h4 className="text-sm font-semibold text-gray-900 truncate mb-1">{item.name}</h4>
                  <span className="text-xs font-bold text-[#b88080] block mb-2">{item.priceFormatted}</span>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center border border-gray-200 rounded-lg bg-white overflow-hidden">
                      <button onClick={() => onUpdateQuantity(item.id, -1)} className="w-7 h-7 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition">
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-8 text-center text-xs font-medium text-gray-900">{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(item.id, 1)}
                        disabled={item.quantity >= item.stock}
                        className="w-7 h-7 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition disabled:opacity-30"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <button onClick={() => onRemoveItem(item.id)} className="text-gray-400 hover:text-red-500 transition p-1" aria-label="حذف من السلة">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="p-6 border-t border-gray-100 bg-white space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-500">
                <span>المجموع الفرعي</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>التوصيل</span>
                <span className="text-xs text-[#b88080] font-medium">يُحدد في الخطوة التالية</span>
              </div>
              <div className="flex justify-between text-base font-bold text-gray-900 pt-2 border-t border-dashed border-gray-200">
                <span>الإجمالي المتوقع</span>
                <span className="text-[#b88080]">{formatPrice(subtotal)}</span>
              </div>
            </div>

            <Link
              href="/checkout"
              onClick={onClose}
              className="w-full py-4 bg-[#E8C4C4] text-gray-900 text-sm font-semibold rounded-2xl shadow-md hover:bg-[#dfb5b5] transition flex items-center justify-center gap-2 text-center"
            >
              <span>إتمام الطلب الآن</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

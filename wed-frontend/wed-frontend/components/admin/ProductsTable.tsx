"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, Plus, X } from "lucide-react";
import toast from "react-hot-toast";
import { apiFetch, ApiClientError } from "@/lib/api";
import { getImageUrl } from "@/lib/media";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/lib/types";

export default function ProductsTable({
  initialProducts,
}: {
  initialProducts: Product[];
}) {
  const router = useRouter();

  const [products, setProducts] = useState(initialProducts);
  const [busyId, setBusyId] = useState<number | null>(null);

  const activeProducts = products.filter((product) => product.is_active);
  const archivedProducts = products.filter((product) => !product.is_active);

  // Produit actuellement sélectionné pour suppression
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  const toggleAvailability = async (product: Product) => {
    setBusyId(product.id);

    try {
      const updated = await apiFetch<Product>(
        `/admin/products/${product.id}/availability`,
        {
          method: "PATCH",
          body: JSON.stringify({
            is_available: !product.is_available,
          }),
        },
      );

      setProducts((prev) =>
        prev.map((p) => (p.id === product.id ? updated : p)),
      );
    } catch (err) {
      toast.error(err instanceof ApiClientError ? err.message : "حدث خطأ");
    } finally {
      setBusyId(null);
    }
  };

  // Ouvre le popup
  const handleDelete = (product: Product) => {
    setProductToDelete(product);
  };

  // Confirme réellement la suppression
  const confirmDelete = async () => {
    if (!productToDelete) return;

    const product = productToDelete;

    setBusyId(product.id);

    try {
      const updated = await apiFetch<Product>(`/admin/products/${product.id}`, {
        method: "DELETE",
      });

      setProducts((prev) =>
        prev.map((p) => (p.id === product.id ? updated : p)),
      );

      toast.success("تم حذف المنتج");

      // Fermer le popup
      setProductToDelete(null);
    } catch (err) {
      toast.error(err instanceof ApiClientError ? err.message : "حدث خطأ");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <>
      {/* =========================
          TABLE
      ========================== */}

      <div className="bg-white/80 backdrop-blur-md rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-bold text-gray-900 text-sm">
            {activeProducts.length} منتج
          </h3>

          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-2 bg-gray-900 text-white text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-gray-800 transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>منتج جديد</span>
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-right">
            <thead className="bg-gray-50/70 text-gray-500 text-xs">
              <tr>
                <th className="py-3 px-6 font-medium">المنتج</th>
                <th className="py-3 px-6 font-medium">السعر</th>
                <th className="py-3 px-6 font-medium">المخزون</th>
                <th className="py-3 px-6 font-medium">متوفر؟</th>
                <th className="py-3 px-6 font-medium">الحالة</th>
                <th className="py-3 px-6 font-medium">إجراءات</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-50">
              {activeProducts.map((product) => (
                <tr
                  key={product.id}
                  className={`hover:bg-gray-50/50 transition ${
                    !product.is_active ? "opacity-50" : ""
                  }`}
                >
                  <td className="py-3 px-6">
                    <div className="flex items-center gap-3">
                      <div className="relative w-11 h-11 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                        <Image
                          src={getImageUrl(product.image_principale)}
                          alt={product.title}
                          fill
                          sizes="44px"
                          className="object-cover"
                        />
                      </div>

                      <div className="min-w-0">
                        <p className="font-semibold text-gray-900 truncate max-w-[160px]">
                          {product.title}
                        </p>

                        <p className="text-[11px] text-gray-400">
                          {product.category?.name}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-6 font-semibold text-gray-900">
                    {formatPrice(product.price)}
                  </td>

                  <td className="py-3 px-6 text-gray-600">{product.stock}</td>

                  <td className="py-3 px-6">
                    <button
                      onClick={() => toggleAvailability(product)}
                      disabled={busyId === product.id || !product.is_active}
                      className={`relative w-11 h-6 rounded-full transition ${
                        product.is_available ? "bg-emerald-500" : "bg-gray-300"
                      } disabled:opacity-40`}
                    >
                      <span
                        className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                          product.is_available
                            ? "translate-x-[-1.5px]"
                            : "translate-x-[-19px]"
                        }`}
                      />
                    </button>
                  </td>

                  <td className="py-3 px-6">
                    <span
                      className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border ${
                        product.is_active
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-gray-100 text-gray-500 border-gray-200"
                      }`}
                    >
                      {product.is_active ? "منشور" : "محذوف"}
                    </span>
                  </td>

                  <td className="py-3 px-6">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/products/${product.id}/edit`}
                        className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </Link>

                      {product.is_active && (
                        <button
                          onClick={() => handleDelete(product)}
                          disabled={busyId === product.id}
                          className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center text-rose-500 hover:bg-rose-100 transition disabled:opacity-40"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}

              {activeProducts.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-gray-400">
                    لا توجد منتجات منشورة{" "}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* =========================
          DELETE CONFIRMATION MODAL
      ========================== */}

      {productToDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          onClick={() => {
            if (busyId !== productToDelete.id) {
              setProductToDelete(null);
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-title"
            className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-gray-100 p-6 animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-rose-50 flex items-center justify-center">
                  <Trash2 className="w-5 h-5 text-rose-500" />
                </div>

                <div>
                  <h2 id="delete-title" className="font-bold text-gray-900">
                    حذف المنتج
                  </h2>

                  <p className="text-xs text-gray-400 mt-0.5">
                    تأكيد عملية الحذف
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setProductToDelete(null)}
                disabled={busyId === productToDelete.id}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition disabled:opacity-40"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <div className="mt-5">
              <p className="text-sm text-gray-600 leading-6">
                هل تريدين حذف المنتج:
              </p>

              <p className="mt-1 font-bold text-gray-900">
                «{productToDelete.title}»
              </p>

              <div className="mt-4 rounded-2xl bg-rose-50 border border-rose-100 px-4 py-3">
                <p className="text-xs text-rose-700 leading-5">
                  سيختفي المنتج من المتجر، لكنه سيبقى مرتبطاً بالطلبيات القديمة.
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setProductToDelete(null)}
                disabled={busyId === productToDelete.id}
                className="flex-1 h-11 rounded-xl border border-gray-200 text-gray-700 text-sm font-semibold hover:bg-gray-50 transition disabled:opacity-40"
              >
                إلغاء
              </button>

              <button
                type="button"
                onClick={confirmDelete}
                disabled={busyId === productToDelete.id}
                className="flex-1 h-11 rounded-xl bg-rose-500 text-white text-sm font-semibold hover:bg-rose-600 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {busyId === productToDelete.id ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    جارٍ الحذف...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    حذف المنتج
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

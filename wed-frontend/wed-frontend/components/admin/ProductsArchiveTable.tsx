"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

import {
  Pencil,
  Archive,
  RefreshCw,
} from "lucide-react";

import { getImageUrl } from "@/lib/media";
import { formatPrice } from "@/lib/format";
import {
  apiFetch,
  ApiClientError,
} from "@/lib/api";
import type { Product } from "@/lib/types";

import { toast } from "sonner";

interface ProductsArchiveTableProps {
  products: Product[];
}

export default function ProductsArchiveTable({
  products,
}: ProductsArchiveTableProps) {
  const [restoringId, setRestoringId] =
    useState<number | null>(null);

  const handleRestore = async (
    product: Product
  ) => {
    setRestoringId(product.id);

    try {
      await apiFetch<Product>(
        `/admin/products/${product.id}/restore`,
        {
          method: "PATCH",
        }
      );

      toast.success(
        "تم استرجاع المنتج بنجاح"
      );

      // Rafraîchir la page pour retirer
      // le produit de la liste des archives
      window.location.reload();
    } catch (err) {
      toast.error(
        err instanceof ApiClientError
          ? err.message
          : "حدث خطأ أثناء استرجاع المنتج"
      );
    } finally {
      setRestoringId(null);
    }
  };

  if (products.length === 0) {
    return (
      <div className="mt-8 bg-white/80 backdrop-blur-md rounded-3xl border border-gray-100 shadow-sm p-10 text-center">
        <div className="mx-auto w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center">
          <Archive className="w-6 h-6 text-gray-400" />
        </div>

        <h3 className="mt-4 font-bold text-gray-800">
          لا توجد منتجات مؤرشفة
        </h3>

        <p className="text-sm text-gray-400 mt-1">
          المنتجات التي يتم حذفها ستظهر هنا
        </p>
      </div>
    );
  }

  return (
    <div className="mt-8 bg-white/80 backdrop-blur-md rounded-3xl border border-gray-100 shadow-sm overflow-hidden">

      {/* =========================
          HEADER
      ========================== */}

      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">

        <div>
          <div className="flex items-center gap-2">

            <div className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center">
              <Archive className="w-4 h-4 text-gray-500" />
            </div>

            <h3 className="font-bold text-gray-900 text-sm">
              المنتجات المؤرشفة
            </h3>

          </div>

          <p className="text-xs text-gray-400 mt-1 mr-10">
            المنتجات التي تم حذفها من المتجر
          </p>
        </div>

        <span className="px-3 py-1.5 rounded-full bg-gray-100 text-gray-500 text-xs font-semibold">
          {products.length} منتج
        </span>

      </div>

      {/* =========================
          TABLE
      ========================== */}

      <div className="overflow-x-auto">

        <table className="w-full text-sm text-right">

          <thead className="bg-gray-50/70 text-gray-500 text-xs">

            <tr>

              <th className="py-3 px-6 font-medium">
                المنتج
              </th>

              <th className="py-3 px-6 font-medium">
                السعر
              </th>

              <th className="py-3 px-6 font-medium">
                المخزون
              </th>

              <th className="py-3 px-6 font-medium">
                الحالة
              </th>

              <th className="py-3 px-6 font-medium">
                إجراءات
              </th>

            </tr>

          </thead>

          <tbody className="divide-y divide-gray-50">

            {products.map((product) => (

              <tr
                key={product.id}
                className="hover:bg-gray-50/50 transition"
              >

                {/* =========================
                    PRODUCT
                ========================== */}

                <td className="py-3 px-6">

                  <div className="flex items-center gap-3">

                    <div className="relative w-11 h-11 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">

                      <Image
                        src={getImageUrl(
                          product.image_principale
                        )}
                        alt={product.title}
                        fill
                        sizes="44px"
                        className="object-cover grayscale"
                      />

                    </div>

                    <div className="min-w-0">

                      <p className="font-semibold text-gray-700 truncate max-w-[160px]">
                        {product.title}
                      </p>

                      <p className="text-[11px] text-gray-400">
                        {product.category?.name}
                      </p>

                    </div>

                  </div>

                </td>

                {/* =========================
                    PRICE
                ========================== */}

                <td className="py-3 px-6 font-semibold text-gray-600">
                  {formatPrice(product.price)}
                </td>

                {/* =========================
                    STOCK
                ========================== */}

                <td className="py-3 px-6 text-gray-500">
                  {product.stock}
                </td>

                {/* =========================
                    STATUS
                ========================== */}

                <td className="py-3 px-6">

                  <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full border bg-gray-100 text-gray-500 border-gray-200">
                    محذوف
                  </span>

                </td>

                {/* =========================
                    ACTIONS
                ========================== */}

                <td className="py-3 px-6">

                  <div className="flex items-center gap-2">

                    {/* EDIT */}

                    <Link
                      href={`/admin/products/${product.id}/edit`}
                      className="inline-flex items-center gap-2 h-8 px-3 rounded-lg bg-gray-50 text-gray-500 hover:bg-gray-100 transition text-xs font-medium"
                    >

                      <Pencil className="w-3.5 h-3.5" />

                      تعديل

                    </Link>

                    {/* RESTORE */}

                    <button
                      type="button"
                      onClick={() =>
                        handleRestore(product)
                      }
                      disabled={
                        restoringId === product.id
                      }
                      className="inline-flex items-center gap-2 h-8 px-3 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >

                      <RefreshCw
                        className={`w-3.5 h-3.5 ${
                          restoringId === product.id
                            ? "animate-spin"
                            : ""
                        }`}
                      />

                      {restoringId === product.id
                        ? "جاري الاسترجاع..."
                        : "استرجاع"}

                    </button>

                  </div>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}
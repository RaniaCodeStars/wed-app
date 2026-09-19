"use client";

import { useState } from "react";
import { Plus, LayoutGrid, Archive, RotateCcw, X } from "lucide-react";
import { usePathname } from "next/navigation";
import toast from "react-hot-toast";

import { apiFetch, ApiClientError } from "@/lib/api";
import type { Category } from "@/lib/types";

export default function CategoriesManager({
  initialCategories,
}: {
  initialCategories: Category[];
}) {
  const pathname = usePathname();

  const isArchivedPage = pathname === "/admin/categories/archived";

  const [categories, setCategories] = useState(initialCategories);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );

  const [actionLoading, setActionLoading] = useState(false);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) return;

    setSaving(true);

    try {
      const created = await apiFetch<Category>("/admin/products/categories", {
        method: "POST",
        body: JSON.stringify({ name }),
      });

      setCategories((prev) => [...prev, created]);
      setName("");

      toast.success("تمت إضافة التصنيف");
    } catch (err) {
      toast.error(err instanceof ApiClientError ? err.message : "حدث خطأ");
    } finally {
      setSaving(false);
    }
  };

  const handleArchive = async () => {
    if (!selectedCategory) return;

    setActionLoading(true);

    try {
      await apiFetch<Category>(
        `/admin/products/categories/${selectedCategory.id}/archive`,
        {
          method: "PATCH",
        },
      );

      setCategories((prev) =>
        prev.filter((cat) => cat.id !== selectedCategory.id),
      );

      setSelectedCategory(null);

      toast.success("تمت أرشفة التصنيف بنجاح");
    } catch (err) {
      toast.error(err instanceof ApiClientError ? err.message : "حدث خطأ");
    } finally {
      setActionLoading(false);
    }
  };

  const handleRestore = async () => {
    if (!selectedCategory) return;

    setActionLoading(true);

    try {
      await apiFetch<Category>(
        `/admin/products/categories/${selectedCategory.id}/restore`,
        {
          method: "PATCH",
        },
      );

      setCategories((prev) =>
        prev.filter((cat) => cat.id !== selectedCategory.id),
      );

      setSelectedCategory(null);

      toast.success("تم استرجاع التصنيف بنجاح");
    } catch (err) {
      toast.error(err instanceof ApiClientError ? err.message : "حدث خطأ");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <>
      <div className="grid sm:grid-cols-2 gap-6">
        {/* Add category */}
        {!isArchivedPage && (
          <form
            onSubmit={handleAdd}
            className="bg-white/80 backdrop-blur-md rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4 h-fit"
          >
            <h3 className="font-bold text-gray-900 text-sm">
              إضافة تصنيف جديد
            </h3>

            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="مثال: بيجامات"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8C4C4]"
            />

            <button
              type="submit"
              disabled={saving}
              className="w-full py-3 bg-gray-900 text-white text-sm font-bold rounded-xl hover:bg-gray-800 transition flex items-center justify-center gap-2 disabled:opacity-60"
            >
              <Plus className="w-4 h-4" />

              <span>{saving ? "جاري الإضافة..." : "إضافة"}</span>
            </button>
          </form>
        )}

        {/* Categories list */}
        <div
          className={`bg-white/80 backdrop-blur-md rounded-3xl p-6 border border-gray-100 shadow-sm ${
            isArchivedPage ? "sm:col-span-2" : ""
          }`}
        >
          <h3 className="font-bold text-gray-900 text-sm mb-4">
            {isArchivedPage
              ? `التصنيفات المؤرشفة (${categories.length})`
              : `التصنيفات الحالية (${categories.length})`}
          </h3>

          <div className="space-y-2">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="flex items-center justify-between gap-3 bg-gray-50/70 rounded-xl p-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <LayoutGrid className="w-4 h-4 text-[#b88080] shrink-0" />

                  <span className="text-sm font-medium text-gray-800 truncate">
                    {cat.name}
                  </span>
                </div>

                {isArchivedPage ? (
                  <button
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className="shrink-0 inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold text-gray-700 bg-white border border-gray-200 hover:bg-gray-100 transition"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    استرجاع
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className="shrink-0 inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold text-[#9f6f6f] bg-white border border-[#ead4d4] hover:bg-[#faf0f0] transition"
                  >
                    <Archive className="w-3.5 h-3.5" />
                    أرشفة
                  </button>
                )}
              </div>
            ))}

            {categories.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-8">
                {isArchivedPage
                  ? "لا توجد تصنيفات مؤرشفة"
                  : "لا توجد تصنيفات بعد"}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation modal */}
      {selectedCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay */}
          <button
            type="button"
            aria-label="إغلاق"
            onClick={() => {
              if (!actionLoading) {
                setSelectedCategory(null);
              }
            }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />

          {/* Modal */}
          <div
            dir="rtl"
            className="relative z-10 w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl"
          >
            <button
              type="button"
              onClick={() => {
                if (!actionLoading) {
                  setSelectedCategory(null);
                }
              }}
              className="absolute top-4 left-4 w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-11 h-11 rounded-2xl bg-[#faf0f0] flex items-center justify-center">
                {isArchivedPage ? (
                  <RotateCcw className="w-5 h-5 text-[#9f6f6f]" />
                ) : (
                  <Archive className="w-5 h-5 text-[#9f6f6f]" />
                )}
              </div>

              <div>
                <h3 className="font-bold text-gray-900">
                  {isArchivedPage ? "استرجاع التصنيف" : "أرشفة التصنيف"}
                </h3>

                <p className="text-xs text-gray-400 mt-1">
                  {selectedCategory.name}
                </p>
              </div>
            </div>

            <p className="text-sm text-gray-600 leading-6 mb-6">
              {isArchivedPage
                ? "هل أنت متأكد من أنك تريد استرجاع هذا التصنيف؟ سيظهر مرة أخرى ضمن التصنيفات النشطة."
                : "هل أنت متأكد من أنك تريد أرشفة هذا التصنيف؟ لن يظهر في المتجر أو ضمن التصنيفات النشطة، وستبقى المنتجات المرتبطة به محفوظة."}
            </p>

            <div className="flex gap-3">
              <button
                type="button"
                disabled={actionLoading}
                onClick={() => setSelectedCategory(null)}
                className="flex-1 py-3 rounded-xl border border-gray-200 text-sm font-bold text-gray-700 hover:bg-gray-50 transition disabled:opacity-50"
              >
                إلغاء
              </button>

              <button
                type="button"
                disabled={actionLoading}
                onClick={isArchivedPage ? handleRestore : handleArchive}
                className="flex-1 py-3 rounded-xl bg-gray-900 text-white text-sm font-bold hover:bg-gray-800 transition disabled:opacity-60"
              >
                {actionLoading
                  ? "جاري التنفيذ..."
                  : isArchivedPage
                    ? "استرجاع"
                    : "أرشفة"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

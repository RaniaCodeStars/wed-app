"use client";

import { useState } from "react";
import { Plus, LayoutGrid } from "lucide-react";
import toast from "react-hot-toast";
import { apiFetch, ApiClientError } from "@/lib/api";
import type { Category } from "@/lib/types";

export default function CategoriesManager({ initialCategories }: { initialCategories: Category[] }) {
  const [categories, setCategories] = useState(initialCategories);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    try {
      const created = await apiFetch<Category>("/admin/products/categories", { method: "POST", body: JSON.stringify({ name }) });
      setCategories((prev) => [...prev, created]);
      setName("");
      toast.success("تمت إضافة التصنيف");
    } catch (err) {
      toast.error(err instanceof ApiClientError ? err.message : "حدث خطأ");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="grid sm:grid-cols-2 gap-6">
      <form onSubmit={handleAdd} className="bg-white/80 backdrop-blur-md rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4 h-fit">
        <h3 className="font-bold text-gray-900 text-sm">إضافة تصنيف جديد</h3>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="مثال: بيجامات" className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8C4C4]" />
        <button type="submit" disabled={saving} className="w-full py-3 bg-gray-900 text-white text-sm font-bold rounded-xl hover:bg-gray-800 transition flex items-center justify-center gap-2 disabled:opacity-60">
          <Plus className="w-4 h-4" />
          <span>{saving ? "جاري الإضافة..." : "إضافة"}</span>
        </button>
      </form>

      <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 border border-gray-100 shadow-sm">
        <h3 className="font-bold text-gray-900 text-sm mb-4">التصنيفات الحالية ({categories.length})</h3>
        <div className="space-y-2">
          {categories.map((cat) => (
            <div key={cat.id} className="flex items-center gap-3 bg-gray-50/70 rounded-xl p-3">
              <LayoutGrid className="w-4 h-4 text-[#b88080]" />
              <span className="text-sm font-medium text-gray-800">{cat.name}</span>
            </div>
          ))}
          {categories.length === 0 && <p className="text-sm text-gray-400 text-center py-4">لا توجد تصنيفات بعد</p>}
        </div>
      </div>
    </div>
  );
}

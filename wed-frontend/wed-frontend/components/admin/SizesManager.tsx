"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { apiFetch, ApiClientError } from "@/lib/api";
import type { SizeGroup } from "@/lib/types";

export default function SizesManager({ initialGroups }: { initialGroups: SizeGroup[] }) {
  const [groups, setGroups] = useState(initialGroups);
  const [form, setForm] = useState({ name: "", sizes_list: "" });
  const [saving, setSaving] = useState(false);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.sizes_list.trim()) return;
    setSaving(true);
    try {
      const created = await apiFetch<SizeGroup>("/sizes/", { method: "POST", body: JSON.stringify(form) });
      setGroups((prev) => [...prev, created]);
      setForm({ name: "", sizes_list: "" });
      toast.success("تمت إضافة مجموعة المقاسات");
    } catch (err) {
      toast.error(err instanceof ApiClientError ? err.message : "حدث خطأ");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("حذف مجموعة المقاسات هذه؟")) return;
    try {
      await apiFetch(`/sizes/${id}`, { method: "DELETE" });
      setGroups((prev) => prev.filter((g) => g.id !== id));
    } catch (err) {
      toast.error(err instanceof ApiClientError ? err.message : "حدث خطأ");
    }
  };

  return (
    <div className="grid sm:grid-cols-2 gap-6">
      <form onSubmit={handleAdd} className="bg-white/80 backdrop-blur-md rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4 h-fit">
        <h3 className="font-bold text-gray-900 text-sm">إضافة مجموعة مقاسات</h3>
        <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="اسم المجموعة (مثال: مقاسات قياسية)" className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8C4C4]" />
        <input value={form.sizes_list} onChange={(e) => setForm({ ...form, sizes_list: e.target.value })} placeholder="S,M,L,XL" dir="ltr" className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8C4C4]" />
        <button type="submit" disabled={saving} className="w-full py-3 bg-gray-900 text-white text-sm font-bold rounded-xl hover:bg-gray-800 transition flex items-center justify-center gap-2 disabled:opacity-60">
          <Plus className="w-4 h-4" />
          <span>{saving ? "جاري الإضافة..." : "إضافة"}</span>
        </button>
      </form>

      <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 border border-gray-100 shadow-sm">
        <h3 className="font-bold text-gray-900 text-sm mb-4">المجموعات الحالية ({groups.length})</h3>
        <div className="space-y-2">
          {groups.map((g) => (
            <div key={g.id} className="flex items-center justify-between bg-gray-50/70 rounded-xl p-3">
              <div>
                <p className="text-sm font-semibold text-gray-900">{g.name}</p>
                <p className="text-xs text-gray-400" dir="ltr">{g.sizes_list}</p>
              </div>
              <button onClick={() => handleDelete(g.id)} className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center text-rose-500 hover:bg-rose-100 transition">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
          {groups.length === 0 && <p className="text-sm text-gray-400 text-center py-4">لا توجد مجموعات بعد</p>}
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save } from "lucide-react";
import toast from "react-hot-toast";
import { apiFetch, ApiClientError } from "@/lib/api";
import type { User } from "@/lib/types";

export default function CustomerEditForm({ user }: { user: User }) {
  const router = useRouter();
  const [form, setForm] = useState({
    badge: user.badge ?? "",
    internal_notes: user.internal_notes ?? "",
    is_active: user.is_active,
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await apiFetch(`/admin/users/${user.id}`, { method: "PUT", body: JSON.stringify(form) });
      toast.success("تم حفظ التعديلات");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof ApiClientError ? err.message : "حدث خطأ");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white/80 backdrop-blur-md rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
      <h3 className="font-bold text-gray-900 text-sm">فيچة إدارية</h3>

      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1.5">شارة (مثال: زبونة مميزة ✦)</label>
        <input value={form.badge} onChange={(e) => setForm({ ...form, badge: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8C4C4]" />
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1.5">ملاحظات داخلية (لا تظهر للزبونة)</label>
        <textarea rows={4} value={form.internal_notes} onChange={(e) => setForm({ ...form, internal_notes: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8C4C4] resize-none" />
      </div>

      <label className="flex items-center gap-2 text-sm text-gray-700">
        <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} className="w-4 h-4 accent-[#b88080]" />
        <span>الحساب نشط</span>
      </label>

      <button type="submit" disabled={saving} className="px-6 py-3 bg-gray-900 text-white text-sm font-bold rounded-xl hover:bg-gray-800 transition flex items-center gap-2 disabled:opacity-60">
        <Save className="w-4 h-4" />
        <span>{saving ? "جاري الحفظ..." : "حفظ"}</span>
      </button>
    </form>
  );
}

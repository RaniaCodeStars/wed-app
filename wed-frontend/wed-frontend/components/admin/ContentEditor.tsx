"use client";

import { useState } from "react";
import { Save } from "lucide-react";
import toast from "react-hot-toast";
import { apiFetch, ApiClientError } from "@/lib/api";
import type { LandingContent } from "@/lib/types";

export default function ContentEditor({ initial }: { initial: LandingContent | null }) {
  const [form, setForm] = useState({
    hero_title: initial?.hero_title ?? "",
    hero_subtitle: initial?.hero_subtitle ?? "",
    hero_image: initial?.hero_image ?? "",
    announcement_bar: initial?.announcement_bar ?? "",
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await apiFetch("/admin/landing/", { method: "PUT", body: JSON.stringify(form) });
      toast.success("تم حفظ محتوى الموقع بنجاح!");
    } catch (err) {
      toast.error(err instanceof ApiClientError ? err.message : "حدث خطأ");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white/80 backdrop-blur-md rounded-3xl p-6 border border-gray-100 shadow-sm space-y-5 max-w-2xl">
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1.5">عنوان الصفحة الرئيسية</label>
        <input value={form.hero_title} onChange={(e) => setForm({ ...form, hero_title: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8C4C4]" />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1.5">العنوان الفرعي</label>
        <textarea rows={2} value={form.hero_subtitle} onChange={(e) => setForm({ ...form, hero_subtitle: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8C4C4] resize-none" />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1.5">شريط الإعلان العلوي</label>
        <input value={form.announcement_bar} onChange={(e) => setForm({ ...form, announcement_bar: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8C4C4]" />
      </div>

      <button type="submit" disabled={saving} className="px-6 py-3 bg-gray-900 text-white text-sm font-bold rounded-xl hover:bg-gray-800 transition flex items-center gap-2 disabled:opacity-60">
        <Save className="w-4 h-4" />
        <span>{saving ? "جاري الحفظ..." : "حفظ التغييرات"}</span>
      </button>
    </form>
  );
}

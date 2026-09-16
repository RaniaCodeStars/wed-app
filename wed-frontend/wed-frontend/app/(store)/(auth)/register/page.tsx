"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, Phone, UserPlus } from "lucide-react";
import toast from "react-hot-toast";
import { isValidAlgerianPhone } from "@/lib/format";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "", phone: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (form.phone && !isValidAlgerianPhone(form.phone)) {
      setError("رقم الهاتف غير صالح (مثال: 0550000000)");
      return;
    }

    setLoading(true);
    try {
      const registerRes = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const registerData = await registerRes.json();

      if (!registerRes.ok) {
        setError(typeof registerData.detail === "string" ? registerData.detail : "تعذر إنشاء الحساب");
        return;
      }

      const loginRes = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });

      if (loginRes.ok) {
        toast.success("تم إنشاء حسابك بنجاح!");
        router.push("/account");
        router.refresh();
      } else {
        router.push("/login");
      }
    } catch {
      setError("حدث خطأ، حاولي مجدداً");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16" dir="rtl">
      <div className="w-full max-w-sm bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-sm border border-gray-100 space-y-6">
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-arabic-title font-bold text-gray-900">انضمي إلينا ✦</h1>
          <p className="text-xs text-gray-500">أنشئي حساباً لمتابعة طلباتك بسهولة</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type="email"
              required
              placeholder="البريد الإلكتروني"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-4 py-3 pr-11 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8C4C4] bg-white/50"
            />
            <Mail className="absolute right-4 top-3.5 w-4 h-4 text-gray-400" />
          </div>

          <div className="relative">
            <input
              type="tel"
              placeholder="رقم الهاتف (اختياري)"
              dir="ltr"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full px-4 py-3 pr-11 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8C4C4] bg-white/50 text-left"
            />
            <Phone className="absolute right-4 top-3.5 w-4 h-4 text-gray-400" />
          </div>

          <div className="relative">
            <input
              type="password"
              required
              minLength={6}
              placeholder="كلمة المرور"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full px-4 py-3 pr-11 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8C4C4] bg-white/50"
            />
            <Lock className="absolute right-4 top-3.5 w-4 h-4 text-gray-400" />
          </div>

          {error && <p className="text-xs text-rose-600 bg-rose-50 rounded-lg px-3 py-2">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-[#E8C4C4] text-gray-900 text-sm font-bold rounded-2xl hover:bg-[#dfb5b5] transition flex items-center justify-center gap-2 disabled:opacity-60"
          >
            <UserPlus className="w-4 h-4" />
            <span>{loading ? "جاري الإنشاء..." : "إنشاء حساب"}</span>
          </button>
        </form>

        <p className="text-center text-xs text-gray-500">
          لديك حساب بالفعل؟{" "}
          <Link href="/login" className="text-[#b88080] font-semibold underline underline-offset-2">سجّلي الدخول</Link>
        </p>
      </div>
    </div>
  );
}

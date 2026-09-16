"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, LogIn } from "lucide-react";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(typeof data.detail === "string" ? data.detail : "بيانات الدخول غير صحيحة");
        return;
      }

      toast.success("تم تسجيل الدخول بنجاح!");
      router.push(data.is_admin ? "/admin" : "/account");
      router.refresh();
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
          <h1 className="text-2xl font-arabic-title font-bold text-gray-900">مرحباً بعودتك ✦</h1>
          <p className="text-xs text-gray-500">سجّلي الدخول لمتابعة طلباتك وحفظ تفضيلاتك</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type="email"
              required
              placeholder="البريد الإلكتروني"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 pr-11 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8C4C4] bg-white/50"
            />
            <Mail className="absolute right-4 top-3.5 w-4 h-4 text-gray-400" />
          </div>

          <div className="relative">
            <input
              type="password"
              required
              placeholder="كلمة المرور"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 pr-11 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8C4C4] bg-white/50"
            />
            <Lock className="absolute right-4 top-3.5 w-4 h-4 text-gray-400" />
          </div>

          {error && <p className="text-xs text-rose-600 bg-rose-50 rounded-lg px-3 py-2">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-gray-900 text-white text-sm font-bold rounded-2xl hover:bg-gray-800 transition flex items-center justify-center gap-2 disabled:opacity-60"
          >
            <LogIn className="w-4 h-4" />
            <span>{loading ? "جاري الدخول..." : "تسجيل الدخول"}</span>
          </button>
        </form>

        <p className="text-center text-xs text-gray-500">
          ليس لديك حساب؟{" "}
          <Link href="/register" className="text-[#b88080] font-semibold underline underline-offset-2">أنشئي حساباً</Link>
        </p>
      </div>
    </div>
  );
}

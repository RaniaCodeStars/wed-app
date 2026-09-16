"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, ShieldCheck } from "lucide-react";
import Logo from "@/components/logo";

export default function AdminLoginPage() {
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
      if (!data.is_admin) {
        setError("هذا الحساب لا يملك صلاحية الوصول للوحة التحكم.");
        await fetch("/api/auth/logout", { method: "POST" });
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch {
      setError("حدث خطأ، حاولي مجدداً");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div dir="rtl" className="min-h-screen flex items-center justify-center px-4 dotted-bg">
      <div className="w-full max-w-sm bg-white/90 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-gray-100 space-y-6">
        <div className="text-center space-y-2">
          <div className="flex justify-center"><Logo /></div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 bg-gray-50 px-3 py-1 rounded-full">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>لوحة التحكم الإدارية</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type="email"
              required
              placeholder="البريد الإلكتروني"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 pr-11 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/20"
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
              className="w-full px-4 py-3 pr-11 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/20"
            />
            <Lock className="absolute right-4 top-3.5 w-4 h-4 text-gray-400" />
          </div>

          {error && <p className="text-xs text-rose-600 bg-rose-50 rounded-lg px-3 py-2">{error}</p>}

          <button type="submit" disabled={loading} className="w-full py-3.5 bg-gray-900 text-white text-sm font-bold rounded-2xl hover:bg-gray-800 transition disabled:opacity-60">
            {loading ? "جاري التحقق..." : "دخول لوحة التحكم"}
          </button>
        </form>
      </div>
    </div>
  );
}

import { ShieldCheck } from "lucide-react";
import AdminHeader from "@/components/admin/AdminHeader";
import { getSession } from "@/lib/session";

export default async function AdminSettingsPage() {
  const session = await getSession();

  return (
    <div className="space-y-6">
      <AdminHeader title="إعدادات المتجر" subtitle="معلومات حسابك الإداري" />

      <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 border border-gray-100 shadow-sm max-w-md space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-[#f9f2f2] text-[#b88080] flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <p className="font-semibold text-sm text-gray-900">{session?.sub}</p>
            <p className="text-xs text-gray-400">{session?.role || "admin"}</p>
          </div>
        </div>
        <p className="text-xs text-gray-500 bg-gray-50 rounded-xl p-4">
          لإضافة حسابات إدارية أخرى (مثلاً حساب "مؤكدة الطلبيات") أو تغيير كلمة المرور،
          تواصلي مع المطوّر — هذه الميزات ستُضاف قريباً إلى لوحة التحكم.
        </p>
      </div>
    </div>
  );
}

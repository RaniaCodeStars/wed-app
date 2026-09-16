import Link from "next/link";
import { Users } from "lucide-react";
import AdminHeader from "@/components/admin/AdminHeader";
import { getAdminUsers } from "@/lib/data";
import { formatDate } from "@/lib/format";

export default async function AdminCustomersPage() {
  const users = await getAdminUsers().catch(() => []);

  return (
    <div className="space-y-6">
      <AdminHeader title="الزبائن" subtitle={`${users.length} زبونة مسجّلة`} />

      <div className="bg-white/80 backdrop-blur-md rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-right">
            <thead className="bg-gray-50/70 text-gray-500 text-xs">
              <tr>
                <th className="py-3 px-6 font-medium">البريد الإلكتروني</th>
                <th className="py-3 px-6 font-medium">الهاتف</th>
                <th className="py-3 px-6 font-medium">الولاية</th>
                <th className="py-3 px-6 font-medium">الشارة</th>
                <th className="py-3 px-6 font-medium">تاريخ التسجيل</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50/50 transition cursor-pointer">
                  <td className="py-3 px-6">
                    <Link href={`/admin/customers/${user.id}`} className="font-semibold text-gray-900 hover:text-[#b88080] flex items-center gap-2">
                      <Users className="w-3.5 h-3.5 text-gray-300" />
                      {user.email}
                    </Link>
                  </td>
                  <td className="py-3 px-6 text-gray-600" dir="ltr">{user.phone || "—"}</td>
                  <td className="py-3 px-6 text-gray-600">{user.wilaya || "—"}</td>
                  <td className="py-3 px-6">
                    {user.badge ? <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-[#f9f2f2] text-[#b88080]">{user.badge}</span> : "—"}
                  </td>
                  <td className="py-3 px-6 text-gray-400 text-xs">{formatDate(user.created_at)}</td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr><td colSpan={5} className="py-10 text-center text-gray-400">لا توجد زبونات مسجّلات بعد</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

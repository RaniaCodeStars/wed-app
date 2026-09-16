import { notFound } from "next/navigation";
import AdminHeader from "@/components/admin/AdminHeader";
import CustomerEditForm from "@/components/admin/CustomerEditForm";
import { getAdminUser } from "@/lib/data";
import { formatDate } from "@/lib/format";

export default async function CustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getAdminUser(id).catch(() => null);
  if (!user) notFound();

  return (
    <div className="space-y-6">
      <AdminHeader title={user.email} subtitle={`عضوة منذ ${formatDate(user.created_at)}`} />

      <div className="grid sm:grid-cols-2 gap-6">
        <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 border border-gray-100 shadow-sm space-y-2 h-fit">
          <h3 className="font-bold text-gray-900 text-sm mb-2">معلومات الاتصال</h3>
          <p className="text-sm"><span className="text-gray-400">الهاتف: </span><span className="font-semibold text-gray-900" dir="ltr">{user.phone || "—"}</span></p>
          <p className="text-sm"><span className="text-gray-400">الولاية: </span><span className="font-semibold text-gray-900">{user.wilaya || "—"}</span></p>
          <p className="text-sm"><span className="text-gray-400">العنوان: </span><span className="font-semibold text-gray-900">{user.address || "—"}</span></p>
        </div>

        <CustomerEditForm user={user} />
      </div>
    </div>
  );
}

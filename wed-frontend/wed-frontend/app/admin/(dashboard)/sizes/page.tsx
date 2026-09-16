import AdminHeader from "@/components/admin/AdminHeader";
import SizesManager from "@/components/admin/SizesManager";
import { serverFetch } from "@/lib/server-api";
import type { SizeGroup } from "@/lib/types";

export default async function AdminSizesPage() {
  const groups = await serverFetch<SizeGroup[]>("/sizes/", { withAuth: true, revalidate: false }).catch(() => []);
  return (
    <div className="space-y-6">
      <AdminHeader title="إدارة المقاسات" subtitle="مجموعات المقاسات المتاحة للمنتجات" />
      <SizesManager initialGroups={groups} />
    </div>
  );
}

import AdminHeader from "@/components/admin/AdminHeader";
import ContentEditor from "@/components/admin/ContentEditor";
import { serverFetch } from "@/lib/server-api";
import type { LandingContent } from "@/lib/types";

export default async function AdminContentPage() {
  const content = await serverFetch<LandingContent>("/landing/", { revalidate: false }).catch(() => null);
  return (
    <div className="space-y-6">
      <AdminHeader title="محتوى الموقع" subtitle="تعديل نصوص الصفحة الرئيسية" />
      <ContentEditor initial={content} />
    </div>
  );
}

import AdminHeader from "@/components/admin/AdminHeader";
import ReviewsModeration from "@/components/admin/ReviewsModeration";
import { getAdminReviews } from "@/lib/data";

export default async function AdminCommentsPage() {
  const reviews = await getAdminReviews().catch(() => []);
  return (
    <div className="space-y-6">
      <AdminHeader title="إدارة التعليقات" subtitle="اعتماد أو حذف تقييمات الزبونات" />
      <ReviewsModeration initialReviews={reviews} />
    </div>
  );
}

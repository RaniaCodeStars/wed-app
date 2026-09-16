import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      dir="rtl"
      className="min-h-screen flex bg-[#FAFAFA]"
    >
      <AdminSidebar />

      <main className="flex-1 min-w-0 p-4 sm:p-8 pt-20 md:pt-8 space-y-6">
        {children}
      </main>
    </div>
  );
}
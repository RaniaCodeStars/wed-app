"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  const router = useRouter();
  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  };
  return (
    <button onClick={handleLogout} className="flex items-center gap-2 text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 transition px-4 py-2.5 rounded-xl">
      <LogOut className="w-3.5 h-3.5" />
      <span>تسجيل الخروج</span>
    </button>
  );
}

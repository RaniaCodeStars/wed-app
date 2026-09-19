"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Users,
  FileText,
  Settings,
  Menu,
  X,
  ArrowRight,
  LogOut,
  LayoutGrid,
  Maximize,
  MessageSquare,
  Archive,
  Truck,
} from "lucide-react";

import Logo from "@/components/logo";

const links = [
  { name: "لوحة القيادة", href: "/admin", icon: LayoutDashboard },
  { name: "الطلبيات", href: "/admin/orders", icon: ShoppingBag },
  { name: "المنتجات", href: "/admin/products", icon: Package },
  {
    name: "المنتجات المؤرشفة",
    href: "/admin/products/archived",
    icon: Archive,
  },
  { name: "التصنيفات", href: "/admin/categories", icon: LayoutGrid },
  {
    name: "التصنيفات المؤرشفة",
    href: "/admin/categories/archived",
    icon: Archive,
  },
  { name: "إدارة المقاسات", href: "/admin/sizes", icon: Maximize },
  { name: "الزبائن", href: "/admin/customers", icon: Users },
  {
    name: "إدارة التوصيل",
    href: "/admin/delivery",
    icon: Truck,
  },
  { name: "محتوى الموقع", href: "/admin/content", icon: FileText },
  { name: "إدارة التعليقات", href: "/admin/comments", icon: MessageSquare },
  { name: "إعدادات المتجر", href: "/admin/settings", icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", {
      method: "POST",
    });

    router.push("/admin/login");
    router.refresh();
  };

  const isLinkActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";

    if (href === "/admin/categories") {
      return (
        pathname === "/admin/categories" ||
        (pathname.startsWith("/admin/categories/") &&
          pathname !== "/admin/categories/archived")
      );
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <>
      {/* =====================================================
          MOBILE HEADER
      ====================================================== */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-100 z-50 flex items-center justify-between px-4">
        <Logo />

        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-700 hover:bg-gray-200 transition"
          aria-label="فتح القائمة"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* =====================================================
          MOBILE OVERLAY
      ====================================================== */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-[60]"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* =====================================================
          MOBILE DRAWER
      ====================================================== */}
      <aside
        className={`
          md:hidden
          fixed
          top-0
          right-0
          bottom-0
          z-[70]
          w-72
          bg-white
          border-l
          border-gray-100
          p-6
          flex
          flex-col
          justify-between
          transition-transform
          duration-300
          ease-in-out
          ${isOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        <div className="overflow-y-auto">
          {/* Drawer header */}
          <div className="flex items-center justify-between mb-6">
            <Logo />

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition"
              aria-label="إغلاق القائمة"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="space-y-1.5">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = isLinkActive(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`
                    flex items-center gap-3
                    px-4 py-3
                    rounded-2xl
                    text-sm font-bold
                    transition-all duration-200
                    ${
                      isActive
                        ? "bg-[#f9f2f2] text-[#b88080]"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }
                  `}
                >
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? "text-[#b88080]" : "text-gray-400"
                    }`}
                  />

                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="pt-4 border-t border-gray-100 space-y-2">
          <Link
            href="/"
            onClick={() => setIsOpen(false)}
            className="flex items-center justify-between text-xs text-gray-500 hover:text-gray-900 transition p-2.5 rounded-xl hover:bg-gray-50 group"
          >
            <span>العودة للمتجر</span>

            <ArrowRight className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold text-rose-600 bg-rose-50/60 hover:bg-rose-100/70 transition"
          >
            <LogOut className="w-4 h-4 text-rose-500" />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </aside>

      {/* =====================================================
          DESKTOP SIDEBAR
      ====================================================== */}
      <aside className="hidden md:flex md:static md:w-64 md:shrink-0 bg-white/95 backdrop-blur-xl border-l border-gray-100 p-6 flex-col justify-between">
        <div className="space-y-6 overflow-y-auto pb-6">
          <div className="flex items-center gap-3">
            <div className="flex flex-col">
              <Logo />

              <span className="text-[10px] text-gray-400 font-medium">
                لوحة التحكم الإدارية
              </span>
            </div>
          </div>

          <nav className="space-y-1.5">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = isLinkActive(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`
                    flex items-center gap-3
                    px-4 py-3
                    rounded-2xl
                    text-sm font-bold
                    transition-all duration-200
                    ${
                      isActive
                        ? "bg-[#f9f2f2] text-[#b88080] shadow-xs"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }
                  `}
                >
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? "text-[#b88080]" : "text-gray-400"
                    }`}
                  />

                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="pt-4 border-t border-gray-100 space-y-2 shrink-0 bg-white/95">
          <Link
            href="/"
            className="flex items-center justify-between text-xs text-gray-500 hover:text-gray-900 transition p-2.5 rounded-xl hover:bg-gray-50 group"
          >
            <span>العودة للمتجر</span>

            <ArrowRight className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold text-rose-600 bg-rose-50/60 hover:bg-rose-100/70 transition"
          >
            <LogOut className="w-4 h-4 text-rose-500" />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </aside>
    </>
  );
}

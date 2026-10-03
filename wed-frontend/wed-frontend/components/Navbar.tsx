"use client";

import { useState, useEffect } from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { User, ShoppingBag, Ruler, Home, ShoppingBasket } from "lucide-react";

import Logo from "./logo";
import { getCartCount } from "@/lib/cart";

interface NavbarProps {
  onOpenCart: () => void;
  cartCount?: number;
}

export default function Navbar({ onOpenCart, cartCount }: NavbarProps) {
  const pathname = usePathname();

  const [count, setCount] = useState(cartCount ?? 0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  /* =========================
     CART COUNT
  ========================= */
  useEffect(() => {
    setCount(getCartCount());

    const updateCartCount = () => setCount(getCartCount());

    window.addEventListener("cartUpdated", updateCartCount);

    return () => {
      window.removeEventListener("cartUpdated", updateCartCount);
    };
  }, []);

  /* =========================
     AUTH
  ========================= */
  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => setIsAuthenticated(!!d.authenticated))
      .catch(() => setIsAuthenticated(false));
  }, []);

  const navLinks = [
    {
      name: "profile",
      href: isAuthenticated ? "/account" : "/login",
      icon: User,
    },
    {
      name: "shop",
      href: "/shop",
      icon: ShoppingBag,
    },
    {
      name: "size",
      href: "/guide-des-tailles",
      icon: Ruler,
    },
    {
      name: "home",
      href: "/",
      icon: Home,
    },
  ];

  return (
    <header className="sticky top-0 z-50 bg-transparent pt-3 sm:pt-4 pb-2 px-3 sm:px-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* =========================
            NAVIGATION
        ========================= */}
        <nav
          className="
            bg-[#8E5A9E]/75
            backdrop-blur-xl
            px-2 sm:px-4
            py-2 sm:py-
            rounded-full
            shadow-lg
            border border-white/60
            flex
            items-center
            gap-0.5 sm:gap-3
            shrink-0
          "
        >
          {/* Navigation links */}
          {navLinks.map((link) => {
            const Icon = link.icon;

            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname === link.href ||
                  pathname.startsWith(`${link.href}/`);

            return (
              <Link
                key={link.name}
                href={link.href}
                aria-label={link.name}
                className={`
                  relative
                  flex
                  items-center
                  justify-center
                  p-2
                  sm:p-2.5
                  rounded-full
                  transition-all
                  duration-300

                  ${
                    isActive
                      ? "bg-[#111111]/70 text-[#ffff] shadow-sm"
                      : "text-gray-900 hover:bg-[#FAF5F7]/70 hover:text-[#D8B8D2]"
                  }
                `}
              >
                <Icon
                  className="w-[18px] h-[18px] sm:w-5 sm:h-5"
                  strokeWidth={1.7}
                />
              </Link>
            );
          })}

          {/* =========================
              CART
          ========================= */}
          <button
            type="button"
            onClick={onOpenCart}
            aria-label="سلة المشتريات"
            className="
              relative
              flex
              items-center
              justify-center
              p-2
              sm:p-2.5
              rounded-full
              text-gray-900
              hover:bg-white/40
              hover:text-[#b88080]
              transition-all
              duration-300
            "
          >
            <ShoppingBasket
              className="w-[18px] h-[18px] sm:w-5 sm:h-5"
              strokeWidth={1.7}
            />

            {count > 0 && (
              <span
                className="
                  absolute
                  -top-0.5
                  -right-0.5
                  min-w-4
                  h-4
                  px-1
                  bg-white
                  text-[#9f6d6d]
                  font-bold
                  text-[9px]
                  rounded-full
                  flex
                  items-center
                  justify-center
                  shadow-sm
                  border
                  border-[#eadada]
                "
              >
                {count}
              </span>
            )}
          </button>
        </nav>

        {/* =========================
            LOGO
        ========================= */}
        <div className="shrink-0">
          <Logo />
        </div>
      </div>
    </header>
  );
}

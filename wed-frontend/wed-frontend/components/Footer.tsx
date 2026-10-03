import Logo from "./logo";
import Link from "next/link";
import { Instagram, Facebook, MessageCircle } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full bg-transparent py-8 text-xs sm:text-sm text-gray-700">
      <section className="px-4" dir="rtl">
        <div className="relative max-w-7xl mx-auto rounded-[2.5rem] bg-gradient-to-b from-[#D8B8D2] to-[#D8B8D2] px-6 py-10 shadow-lg border border-white/40 overflow-visible flex flex-col sm:flex-row justify-between items-center gap-6 text-center sm:text-right">
          <div className="flex flex-col font-medium gap-1 text-gray-800">
            <p>جميع الحقوق محفوظة © WED ود</p>
            <p>الجزائر - {new Date().getFullYear()}</p>
          </div>

          <nav className="flex flex-wrap justify-center gap-4 font-medium text-gray-800">
            <Link href="/shop" className="hover:text-white transition">
              المتجر
            </Link>
            <Link
              href="/guide-des-tailles"
              className="hover:text-white transition"
            >
              دليل المقاسات
            </Link>
            <Link href="/checkout" className="hover:text-white transition">
              إتمام الطلب
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <a
              href="https://www.instagram.com/wed_lingerie_dz/"
              aria-label="Instagram"
              className="w-9 h-9 rounded-full bg-white/50 flex items-center justify-center text-gray-800 hover:bg-white transition"
            >
              <Instagram className="w-4 h-4" />
            </a>
            <a
              href="https://www.facebook.com/wed.lingerie.dz"
              aria-label="Facebook"
              className="w-9 h-9 rounded-full bg-white/50 flex items-center justify-center text-gray-800 hover:bg-white transition"
            >
              <Facebook className="w-4 h-4" />
            </a>
            <a
              href="https://wa.me/your-number"
              aria-label="واتساب"
              className="w-9 h-9 rounded-full bg-white/50 flex items-center justify-center text-gray-800 hover:bg-white transition"
            >
              <MessageCircle className="w-4 h-4" />
            </a>
          </div>

          <div>
            <Logo />
          </div>
        </div>
      </section>
    </footer>
  );
}

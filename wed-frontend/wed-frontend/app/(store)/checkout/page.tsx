import Link from "next/link";
import { ArrowRight } from "lucide-react";
import CheckoutForm from "@/components/CheckoutForm";
import { getWilayas } from "@/lib/data";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "إتمام الطلب | WED ود" };

export default async function CheckoutPage() {
  const wilayas = await getWilayas().catch(() => []);

  return (
    <div className="py-10 px-4">
      <div className="max-w-5xl mx-auto space-y-8" dir="rtl">
        <div className="flex items-center justify-between">
          <Link href="/shop" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition bg-white/80 backdrop-blur-md px-4 py-2 rounded-full border border-gray-200 shadow-sm">
            <ArrowRight className="w-4 h-4" />
            <span>العودة للتسوق</span>
          </Link>
          <h1 className="text-xl font-arabic-title font-bold text-gray-900">إتمام الطلب</h1>
        </div>

        <CheckoutForm wilayas={wilayas} />
      </div>
    </div>
  );
}

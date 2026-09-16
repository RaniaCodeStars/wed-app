import { Ruler, MessageCircle } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "دليل المقاسات | WED ود",
  description: "دليل شامل لاختيار المقاس المثالي لمنتجات WED ود من اللانجيري والبيجامات.",
};

const sizeTable = [
  { size: "S", bust: "80-85 سم", waist: "60-65 سم" },
  { size: "M", bust: "85-90 سم", waist: "65-70 سم" },
  { size: "L", bust: "90-95 سم", waist: "70-75 سم" },
  { size: "XL", bust: "95-100 سم", waist: "75-80 سم" },
  { size: "XXL", bust: "100-105 سم", waist: "80-85 سم" },
];

export default function SizeGuidePage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-10" dir="rtl">
      <div className="text-center space-y-2">
        <div className="w-14 h-14 rounded-full bg-[#f9f2f2] text-[#b88080] flex items-center justify-center mx-auto">
          <Ruler className="w-6 h-6" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-arabic-title font-bold text-gray-900">دليل المقاسات</h1>
        <p className="text-sm text-gray-500 max-w-md mx-auto">قومي بأخذ قياساتك بشريط قياس مرن لتحديد المقاس الأنسب لكِ</p>
      </div>

      <div className="bg-white/80 backdrop-blur-md rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm text-center">
          <thead className="bg-[#f9f2f2] text-gray-800">
            <tr>
              <th className="py-3 px-4 font-bold">المقاس</th>
              <th className="py-3 px-4 font-bold">محيط الصدر</th>
              <th className="py-3 px-4 font-bold">محيط الخصر</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {sizeTable.map((row) => (
              <tr key={row.size}>
                <td className="py-3 px-4 font-bold text-[#b88080]">{row.size}</td>
                <td className="py-3 px-4 text-gray-600">{row.bust}</td>
                <td className="py-3 px-4 text-gray-600">{row.waist}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 text-sm text-gray-600">
        <div className="bg-white/60 rounded-2xl p-5 border border-gray-100">
          <h3 className="font-bold text-gray-900 mb-2">📏 كيف تقيسين محيط الصدر؟</h3>
          <p>لفّي شريط القياس حول أوسع نقطة من صدرك، بشكل مستقيم وبدون شدّ.</p>
        </div>
        <div className="bg-white/60 rounded-2xl p-5 border border-gray-100">
          <h3 className="font-bold text-gray-900 mb-2">📏 كيف تقيسين محيط الخصر؟</h3>
          <p>لفّي شريط القياس حول أضيق نقطة من خصرك، فوق السرة مباشرة.</p>
        </div>
      </div>

      <div className="bg-[#201f1fb7] rounded-3xl p-8 text-white text-center space-y-4 border border-white/50">
        <h2 className="text-lg font-arabic-title font-bold">لا زلتِ متردّدة؟</h2>
        <p className="text-sm text-gray-300 max-w-md mx-auto">راسلينا مباشرة وسنساعدك على اختيار المقاس المثالي.</p>
        <Link href="https://wa.me/213000000000" target="_blank" className="inline-flex items-center gap-2 px-6 py-3 bg-[#E8C4C4] text-gray-900 rounded-2xl text-sm font-bold">
          <MessageCircle className="w-4 h-4" />
          <span>تحدثي معنا على واتساب</span>
        </Link>
      </div>
    </div>
  );
}

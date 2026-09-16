import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function Story() {
  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6">
      <div className="bg-gradient-to-br from-[#f9f2f2] to-[#eed7d7]/30 rounded-3xl p-8 sm:p-12 border border-white shadow-sm text-center space-y-6">
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-gray-900">مصممة خصيصاً لتمنحكِ الثقة والراحة</h2>
        <p className="text-sm text-gray-600 leading-relaxed max-w-2xl mx-auto">
          نحن نؤمن بأن الأناقة تبدأ من التفاصيل الدقيقة داخل منزلك. كل قطعة نقوم بتصميمها هي مزيج متقن بين الفخامة والراحة.
        </p>
        <Link href="/shop" className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white text-xs font-bold rounded-2xl">
          <span>تسوقي التشكيلة</span>
          <ArrowLeft className="w-3.5 h-3.5" />
        </Link>
      </div>
    </section>
  );
}
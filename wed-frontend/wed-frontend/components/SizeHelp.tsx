// components/SizeHelp.tsx
import { Ruler, MessageCircle } from 'lucide-react';
import Link from 'next/link';

export default function SizeHelp() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      <div className="bg-[#201f1fb7] rounded-3xl p-8 sm:p-10 text-white flex flex-col sm:flex-row items-center justify-between gap-6 overflow-hidden relative  backdrop-blur-[1px] border border-white/50  ">
        {/* Décoration de fond subtile */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        
        <div className="space-y-2 text-center sm:text-right z-10">
          <h2 className="text-xl sm:text-2xl font-serif font-bold">تحتاجين مساعدة في اختيار المقاس؟</h2>
          <p className="text-gray-300 text-sm max-w-md">
            لا داعي للحيرة! دليلك الخاص للمقاسات موجود، أو يمكنك مراسلتنا مباشرة للحصول على استشارة شخصية.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 z-10 w-full sm:w-auto">
          <Link 
            href="/guide-des-tailles" 
            className="flex items-center justify-center gap-2 px-6 py-3.5 bg-white/10 hover:bg-white/20 transition rounded-2xl text-sm font-bold border border-white/20"
          >
            <Ruler className="w-4 h-4" />
            <span>دليل المقاسات</span>
          </Link>
          <Link 
            href="https://wa.me/213XXXXXXXXX" // Remplace par ton numéro WhatsApp
            target="_blank"
            className="flex items-center justify-center gap-2 px-6 py-3.5 bg-[#D8B8D2] text-gray-900 transition rounded-2xl text-sm font-bold"
          >
            <MessageCircle className="w-4 h-4" />
            <span>تحدثي معنا</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
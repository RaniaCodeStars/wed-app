// components/Reassurance.tsx
import { Truck, ShieldCheck, HeartHandshake, RefreshCw } from 'lucide-react';

export default function Reassurance() {
  const points = [
    { icon: ShieldCheck, title: 'جودة ممتازة', desc: 'أقمشة مختارة بعناية تدوم طويلاً' },
    { icon: Truck, title: 'توصيل سريع', desc: 'توصيل لجميع ولايات الوطن' },
    { icon: HeartHandshake, title: 'الدفع عند الاستلام', desc: 'ادفعي عند استلام طلبيتك بسلام' },
    { icon: RefreshCw, title: 'تبديل سهل', desc: 'نحن هنا لضمان رضاكِ التام دائماً' },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {points.map((point, index) => (
          <div key={index} className="bg-white/60 backdrop-blur-md p-5 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center text-center space-y-3">
            <div className="w-10 h-10 rounded-full bg-[#f9f2f2] text-[#b88080] flex items-center justify-center">
              <point.icon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-sm">{point.title}</h3>
              <p className="text-[11px] text-gray-500 mt-1">{point.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
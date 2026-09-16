'use client';

import { Star, Share2 } from 'lucide-react';

const testimonials = [
  { id: 1, name: 'فاطمة الزهراء', wilaya: 'الجزائر', comment: 'الخامة تاع الساتان بزاف هايلة وناعمة على البشرة.', rating: 5 },
  { id: 2, name: 'سارة ميموني', wilaya: 'وهران', comment: 'أول مرة نطلب اونلاين ونلقى المنتج أحسن حتى من الصور.', rating: 5 },
  { id: 3, name: 'إيمان بلقاسم', wilaya: 'قسنطينة', comment: 'طقم العرائس تحفة فنية! أنيق وفيه راحة غير معتادة.', rating: 5 },
  { id: 4, name: 'ياسمين بن عيسى', wilaya: 'بليدة', comment: 'التوصيل كان سريع بزاف، والأطقم توپ تاع الصح!', rating: 5 },
  { id: 5, name: 'مريم حماني', wilaya: 'عنابة', comment: 'رائع جداً، شكراً على المصداقية وحسن التعامل.', rating: 5 },
];

export default function Testimonials() {
  const duplicatedTestimonials = [...testimonials, ...testimonials];

  return (
    <section className="max-w-full overflow-hidden py-10 space-y-8">
      
      {/* Titre et badge style Instagram */}
      <div className="text-center space-y-2 max-w-xl mx-auto px-4">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 bg-rose-50 px-3 py-1 rounded-full border border-rose-100">
          <Share2 className="w-3.5 h-3.5" />
          <span>آراء الزبائن من إنستغرام</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-gray-900">ماذا تقلن عنا؟</h2>
      </div>

      {/* Conteneur du défilement infini */}
      <div className="relative w-full overflow-hidden flex">
        
        {/* Effet de fondu sur les côtés */}
        <div className="absolute top-0 bottom-0 right-0 w-20 bg-gradient-to-l from-[#FDFBF7] to-transparent z-10 pointer-events-none" />
        <div className="absolute top-0 bottom-0 left-0 w-20 bg-gradient-to-r from-[#FDFBF7] to-transparent z-10 pointer-events-none" />

        {/* Piste animée en CSS (marquee) */}
        <div className="flex gap-6 animate-infinite-scroll py-4 w-max">
          {duplicatedTestimonials.map((t, index) => (
            <div 
              key={`${t.id}-${index}`} 
              className="w-[300px] sm:w-[350px] bg-white/80 backdrop-blur-md rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between space-y-4 flex-shrink-0"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex text-amber-400 gap-0.5">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                  <Share2 className="w-4 h-4 text-gray-400" />
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  &ldquo;{t.comment}&rdquo;
                </p>
              </div>

              <div className="pt-4 border-t border-gray-100 flex justify-between items-center text-xs">
                <span className="font-bold text-gray-900">{t.name}</span>
                <span className="text-gray-400 bg-gray-50 px-2.5 py-1 rounded-full">{t.wilaya}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx global>{`
        @keyframes infiniteScroll {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(50%);
          }
        }
        .animate-infinite-scroll {
          display: flex;
          animation: infiniteScroll 35s linear infinite;
        }
        .animate-infinite-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>

    </section>
  );
}
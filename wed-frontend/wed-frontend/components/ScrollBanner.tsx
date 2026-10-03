import { Truck, Sparkles, Heart, Crown } from "lucide-react";

export default function ScrollBanner() {
  const items = [
    {
      text: "توصيل سريع لـ 58 ولاية",
      icon: <Truck className="w-4 h-4 text-gray-700" />,
    },
    {
      text: "أقمشة ساتان راقية وناعمة",
      icon: <Sparkles className="w-4 h-4 text-gray-700" />,
    },
    {
      text: "تشكيلة خاصة بالعرائس والجهاز",
      icon: <Crown className="w-4 h-4 text-gray-700" />,
    },
    {
      text: "راحة وأناقة في كل لحظة",
      icon: <Heart className="w-4 h-4 text-gray-700 fill-gray-700/20" />,
    },
  ];

  return (
    <>
      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 28s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-marquee {
            animation: none;
          }
        }
      `}</style>

      {/* Bannière avec marges externes équilibrées (my-8) */}
      <div
        dir="ltr"
        className="w-full bg-transparent backdrop-blur-md border-y border-white/60 py-3 my-8 mt-20 overflow-hidden shadow-[0_4px_20px_rgba(200,162,162,0.1)] relative z-10"
      >
        {/* Conteneur de la piste défilante */}
        <div className="flex w-max animate-marquee whitespace-nowrap">
          {/* On répète le groupe pour saturer l'espace et empêcher tout blanc */}
          {[1, 2, 3, 4, 5, 6].map((groupIndex) => (
            <div
              key={groupIndex}
              className="flex items-center gap-8 shrink-0 px-4"
              aria-hidden={groupIndex > 1 ? "true" : "false"}
            >
              {items.map((item, index) => (
                <div
                  key={`${groupIndex}-${index}`}
                  className="flex items-center gap-2.5 text-gray-800 font-medium text-xs sm:text-sm"
                >
                  <span>{item.icon}</span>
                  <span>{item.text}</span>
                  {/* Correction de l'espacement du séparateur pour le sens LTR */}
                  <span className="text-[#9954ae] ml-8 font-bold">✦</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
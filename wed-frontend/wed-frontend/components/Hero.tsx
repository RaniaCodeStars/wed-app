import Link from "next/link";

interface HeroProps {
  title?: string;
  subtitle?: string;
}

export default function Hero({ title, subtitle }: HeroProps) {
  return (
    <section className="px-4 py-8" dir="rtl">
      <div className="relative max-w-7xl mx-auto rounded-[2.5rem] bg-gradient-to-b from-white/40 to-white/10 backdrop-blur-[2px] border border-white/50 px-6 pt-20 pb-36 sm:pt-28 sm:pb-44 text-center shadow-[0_8px_32px_0_rgba(31,38,15,0.1)] overflow-visible flex flex-col items-center justify-center">
        <h1 className="text-3xl sm:text-5xl font-arabic-title font-bold text-gray-900 mb-4 leading-tight">
          {title || (
            <>
              لأن الأنوثة تبدأ من{" "}
              <span className="font-normal italic text-[#b88080]">
                شعورك بالراحة
              </span>
            </>
          )}
        </h1>

        <p className="text-gray-900/80 text-xs sm:text-sm font-arabic-title font-light max-w-md mx-auto mb-10 leading-relaxed">
          {subtitle ||
            "تشكيلة مختارة من اللانجيري والبيجامات المصممة لتمنحك الراحة والأناقة في كل لحظة"}
        </p>

        <div className="flex flex-row items-center justify-center gap-3 w-full sm:w-auto">
          <Link
            href="/shop"
            className="w-full sm:w-auto px-7 py-3.5 bg-[#E8C4C4] text-white text-xs sm:text-sm font-medium rounded-full shadow-md hover:bg-gray-800 transition text-center"
          >
            اكتشفي مجموعتنا
          </Link>
          <Link
            href="/shop"
            className="w-full sm:w-auto px-7 py-3.5 backdrop-blur-sm border border-gray-900 text-gray-900 text-xs sm:text-sm font-medium rounded-full hover:bg-white transition text-center"
          >
            اشتري الآن !
          </Link>
        </div>

        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-[45%] sm:translate-y-[50%] flex items-center justify-center z-20 pointer-events-none">
          <div className="looped-animation-rotate absolute w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center">
            <img
              src="/badge-wed1.svg"
              alt=""
              className="w-full h-full object-contain"
            />
          </div>

          <div className="flex flex-col items-center justify-center w-28 h-28 sm:w-30 sm:h-30 rounded-full bg-[#E8C4C4] shadow-md border-2 border-white z-10 pointer-events-auto">
            <div className="flex flex-col items-center justify-center text-gray-800 space-y-[-6px]">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m6 9 6 6 6-6"
                />
              </svg>
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m6 9 6 6 6-6"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

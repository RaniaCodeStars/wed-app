export default function TrustBanner() {
  return (
    <section className="bg-rose-950/5 py-5 border-y border-rose-100">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-center text-xs sm:text-sm font-medium text-rose-950">
        <div className="flex items-center justify-center gap-2">
          <span>🚚</span> توصيل متوفر لـ 58 ولاية
        </div>
        <div className="flex items-center justify-center gap-2">
          <span>💎</span> أقمشة ساتان راقية وعالية الجودة
        </div>
        <div className="flex items-center justify-center gap-2">
          <span>✨</span> خاصة بالجهاز والسهرات
        </div>
      </div>
    </section>
  );
}
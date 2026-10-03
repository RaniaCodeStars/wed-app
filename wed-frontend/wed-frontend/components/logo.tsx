import Link from "next/link";

export default function Logo() {
  return (
    <Link href="/" className="flex items-baseline gap-2 select-none" aria-label="WED ود - الصفحة الرئيسية">
      <span className="font-bold text-xl sm:text-2xl text-[#9954ae] tracking-wider drop-shadow-[0_2px_3px_rgba(0,0,0,0.1)]" dir="rtl">
        ود
      </span>
      <span className="font-serif italic font-semibold text-3xl sm:text-4xl text-gray-900 tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.15)]">
        WED
      </span>
    </Link>
  );
}

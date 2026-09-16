import type { Metadata } from "next";
import { Cairo, El_Messiri, Playfair_Display } from "next/font/google";

import { Toaster as HotToastToaster } from "react-hot-toast";
import { Toaster as SonnerToaster } from "sonner";

import "./globals.css";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
  weight: ["400", "500", "600", "700"],
});

const elMessiri = El_Messiri({
  subsets: ["arabic", "latin"],
  variable: "--font-el-messiri",
  weight: ["400", "500", "600", "700"],
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  style: ["normal", "italic"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: "WED ود | متجر لانجيري جزائري فاخر",
  description:
    "اكتشفي تشكيلة WED ود من اللانجيري والبيجامات الراقية، بتصاميم أنيقة وخامات فاخرة، مع توصيل إلى 58 ولاية عبر كامل التراب الجزائري والدفع عند الاستلام.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  ),
  openGraph: {
    title: "WED ود | متجر لانجيري جزائري فاخر",
    description:
      "تشكيلة مختارة من اللانجيري والبيجامات المصممة لتمنحك الراحة والأناقة في كل لحظة.",
    locale: "ar_DZ",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${cairo.variable} ${elMessiri.variable} ${playfair.variable}`}
    >
      <body className="dotted-bg min-h-screen text-gray-800 font-sans selection:bg-rose-200 flex flex-col antialiased">
        {/* Existing notifications */}
        <HotToastToaster />

        {/* Sonner notifications */}
        <SonnerToaster position="top-center" richColors />

        {children}
      </body>
    </html>
  );
}

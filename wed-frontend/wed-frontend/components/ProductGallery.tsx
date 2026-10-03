"use client";

import { useState } from "react";
import Image from "next/image";
import { getImageUrl } from "@/lib/media";

export default function ProductGallery({ images, title }: { images: string[]; title: string }) {
  const gallery = images.length > 0 ? images : [""];
  const [active, setActive] = useState(0);

  return (
    <div className="space-y-3">
      <div className="relative w-full aspect-[4/5] rounded-3xl overflow-hidden bg-gray-100 shadow-sm border border-white/80">
        <Image src={getImageUrl(gallery[active])} alt={title} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" priority />
      </div>
      {gallery.length > 1 && (
        <div className="flex gap-2 overflow-x-auto scrollbar-none">
          {gallery.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`relative flex-shrink-0 w-16 h-20 rounded-xl overflow-hidden border-2 transition ${active === i ? "border-[#D8B8D2]" : "border-transparent opacity-70 hover:opacity-100"}`}
            >
              <Image src={getImageUrl(img)} alt="" fill sizes="64px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

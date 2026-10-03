"use client";

import { useRef, useState } from "react";
import { Play, Volume2, VolumeX } from "lucide-react";

interface BrandVideo {
  id: number;
  src: string;
  title: string;
  subtitle: string;
}

const videos: BrandVideo[] = [
  {
    id: 1,
    src: "/videos/wed-01.mp4",
    title: "Behind WED",
    subtitle: "من خلف الكواليس",
  },
  {
    id: 2,
    src: "/videos/wed-02.mp4",
    title: "Our Details",
    subtitle: "تفاصيل صُنعت بحب",
  },
  {
    id: 3,
    src: "/videos/wed-03.mp4",
    title: "WED Moments",
    subtitle: "لحظات من عالم WED",
  },
  {
    id: 4,
    src: "/videos/wed-04.mp4",
    title: "New Collection",
    subtitle: "اكتشفي تشكيلتنا الجديدة",
  },
];

function VideoCard({ video }: { video: BrandVideo }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  const handlePlay = async () => {
    if (!videoRef.current) return;

    try {
      if (videoRef.current.paused) {
        await videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    } catch {
      // Autoplay / browser restriction
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!videoRef.current) return;

    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  return (
    <article
      className="
        group
        relative
        shrink-0
        w-[78vw]
        sm:w-[280px]
        lg:w-[300px]
        aspect-[9/14]
        overflow-hidden
        rounded-[28px]
        bg-gray-100
        shadow-sm
        border
        border-white
      "
    >
      {/* VIDEO */}
      <video
        ref={videoRef}
        src={video.src}
        muted
        autoPlay
        loop
        playsInline
        preload="metadata"
        className="
          absolute
          inset-0
          w-full
          h-full
          object-cover
          transition-transform
          duration-700
          group-hover:scale-[1.03]
        "
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      {/* DARK GRADIENT */}
      <div
        className="
          absolute
          inset-0
          bg-gradient-to-t
          from-black/55
          via-transparent
          to-black/10
          pointer-events-none
        "
      />

      {/* PLAY BUTTON */}
      {!isPlaying && (
        <button
          type="button"
          onClick={handlePlay}
          aria-label="تشغيل الفيديو"
          className="
            absolute
            top-1/2
            left-1/2
            -translate-x-1/2
            -translate-y-1/2
            w-14
            h-14
            rounded-full
            bg-white/90
            backdrop-blur-sm
            flex
            items-center
            justify-center
            text-[#9954ae]
            shadow-lg
            transition-all
            duration-300
            hover:scale-110
          "
        >
          <Play
            className="w-5 h-5 ml-0.5"
            fill="currentColor"
            strokeWidth={0}
          />
        </button>
      )}

      {/* MUTE BUTTON */}
      <button
        type="button"
        onClick={toggleMute}
        aria-label={isMuted ? "تشغيل الصوت" : "كتم الصوت"}
        className="
          absolute
          top-4
          right-4
          w-9
          h-9
          rounded-full
          bg-black/25
          backdrop-blur-md
          border
          border-white/20
          flex
          items-center
          justify-center
          text-white
          transition
          hover:bg-black/40
        "
      >
        {isMuted ? (
          <VolumeX className="w-4 h-4" />
        ) : (
          <Volume2 className="w-4 h-4" />
        )}
      </button>

      {/* TEXT */}
      <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
        <p className="text-[10px] uppercase tracking-[0.2em] opacity-80 mb-1">
          {video.title}
        </p>

        <h3 className="text-sm font-medium">{video.subtitle}</h3>
      </div>
    </article>
  );
}

export default function BrandVideosSection() {
  return (
    <section className="py-16 sm:py-20 overflow-hidden" dir="rtl">
      {/* HEADER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-9 sm:mb-12">
        <div className="text-center">
          <span className="block text-[10px] sm:text-xs font-semibold tracking-[0.25em] text-[#9954ae] uppercase mb-3">
            ✦ WED JOURNAL ✦
          </span>

          <h2 className="text-2xl sm:text-4xl font-arabic-title font-bold text-gray-900">
            لحظات من عالم WED
          </h2>

          <p className="text-sm text-gray-500 mt-2 max-w-md mx-auto leading-6">
            اكتشفي التفاصيل، الأناقة واللحظات التي تصنع تجربة WED.
          </p>
        </div>
      </div>

      {/* VIDEOS */}
      <div
        className="
          flex
          gap-4
          sm:gap-5
          overflow-x-auto
          px-4
          sm:px-6
          pb-5
          snap-x
          snap-mandatory
          scrollbar-hide
          lg:justify-center
        "
      >
        {videos.map((video) => (
          <div key={video.id} className="snap-center">
            <VideoCard video={video} />
          </div>
        ))}
      </div>

      {/* MOBILE SCROLL INDICATOR */}
      <div className="flex lg:hidden justify-center gap-1.5 mt-3">
        {videos.map((video, index) => (
          <span
            key={video.id}
            className={`
              h-1.5
              rounded-full
              transition-all
              ${index === 0 ? "w-5 bg-[#9954ae]" : "w-1.5 bg-[#e6caca]"}
            `}
          />
        ))}
      </div>

      {/* BOTTOM PHRASE */}
      <div className="text-center mt-10 sm:mt-12 px-4">
        <p className="text-xs text-gray-400">
          صُممت كل قطعة لتمنحكِ إحساساً مختلفاً 🤍
        </p>
      </div>
    </section>
  );
}

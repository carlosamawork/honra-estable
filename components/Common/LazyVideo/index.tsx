'use client';
import { useEffect, useRef, useState } from "react";
import s from "./LazyVideo.module.scss";
import LazyImage from "../LazyImage";
import Hls from "hls.js";  // 👈 NUEVO

interface LazyVideoProps {
  alt?: string;
  src: string;              // puede ser .mp4 o .m3u8
  thumbnail?: any;
  defaultInView?: boolean;
  autoplay: boolean;
  controls?: boolean;
  muted?: boolean;
  preload?: boolean;
  isHero?: boolean;
  fullHeight?: boolean;
  onLoadedData?: () => void;
  onLoadedMetadata?: (e: React.SyntheticEvent<HTMLVideoElement>) => void;
}

const isSafariBrowser = () => {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent;
  // Safari = contiene "Safari" pero no "Chrome" ni "Chromium"
  return /Safari/.test(ua) && !/Chrome|Chromium|Edg/.test(ua);
};

export default function LazyVideo({
  src = "",
  thumbnail,
  defaultInView = false,
  autoplay = false,
  controls = false,
  muted = true,
  preload = false,
  fullHeight = false,
  onLoadedData,
  onLoadedMetadata,
}: LazyVideoProps) {
  const [isInView, setIsInView] = useState(defaultInView);
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [videoSrc, setVideoSrc] = useState<string | undefined>(
    defaultInView ? src : undefined
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const isHlsSource = (url?: string) =>
    !!url && url.includes(".m3u8");

  // IntersectionObserver (igual que ya tenías)
  useEffect(() => {
    if (defaultInView) return;
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      {
        root: null,
        rootMargin: '0px 0px -20% 0px', // opcional
        threshold: 0.2, 
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [defaultInView]);

  // Cuando entra en viewport, cargamos el src real
  useEffect(() => {
    if (isInView && !videoSrc) {
      setVideoSrc(src);
    }
  }, [isInView, src, videoSrc]);

  // HLS: attach cuando tengamos videoSrc
  // useEffect(() => {
  //   if (!videoSrc || !videoRef.current || !isHlsSource(videoSrc)) return;

  //   const video = videoRef.current;

  //   // 1) Safari / iOS: soporte nativo de HLS
  //   if (video.canPlayType('application/vnd.apple.mpegurl')) {
  //     video.src = videoSrc;
  //     return;
  //   }

  //   // 2) Otros navegadores: usar hls.js
  //   if (Hls.isSupported()) {
  //     const hls = new Hls({
  //       capLevelToPlayerSize: true, // 👈 adapta la calidad al tamaño del player
  //     });
  //     hls.loadSource(videoSrc);
  //     hls.attachMedia(video);

  //     return () => {
  //       hls.destroy();
  //     };
  //   } else {
  //     // Fallback raro: intentamos poner src igualmente
  //     video.src = videoSrc;
  //   }
  // }, [videoSrc]);

  useEffect(() => {
  if (!videoSrc || !videoRef.current) return;

  const video = videoRef.current;

  // Si NO es HLS → MP4 normal
  if (!isHlsSource(videoSrc)) {
    console.log("[LazyVideo] MP4 normal:", videoSrc);
    video.src = videoSrc;
    return;
  }

  console.log("[LazyVideo] HLS detectado:", videoSrc);

  const isSafari = isSafariBrowser();

  // ✅ Solo Safari usa HLS nativo
  if (isSafari && video.canPlayType("application/vnd.apple.mpegurl")) {
    console.log("[LazyVideo] HLS nativo (Safari)");
    video.src = videoSrc;
    return;
  }

  // 🌐 Chrome / Firefox / Edge → SIEMPRE hls.js
  if (Hls.isSupported()) {
    console.log("[LazyVideo] HLS via hls.js (no Safari)");
    const hls = new Hls({
      capLevelToPlayerSize: true,
    });

    hls.loadSource(videoSrc);
    hls.attachMedia(video);

    hls.on(Hls.Events.ERROR, (event, data) => {
      console.error("[LazyVideo] HLS error", event, data);
    });

    return () => {
      hls.destroy();
    };
  } else {
    console.warn("[LazyVideo] HLS no soportado, intento fallback src directo");
    video.src = videoSrc;
  }
}, [videoSrc]);

  // Volumen
  useEffect(() => {
    if (videoRef.current && !muted) {
      videoRef.current.volume = 0.5;
    }
  }, [muted]);

  const handleLoadedData = () => {
    setIsLoaded(true);
    setTimeout(() => setIsVisible(true), 50);
    onLoadedData?.();
  };

  
  const handleCanPlay = () => {};
  const handleError = (e: any) => {
    console.log('❌ onError fired', e);
  };

  // Autoplay cuando ya está cargado
  useEffect(() => {
    if (!autoplay) return;
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;

    const tryPlay = async () => {
      try {
        await video.play();
      } catch (e) {
        console.log('Autoplay bloqueado', e);
      }
    };

    if (isLoaded && videoSrc) {
      tryPlay();
    }
  }, [autoplay, isLoaded, videoSrc]);

  return (
    <div className={s.lazyVideo} ref={containerRef}>
      {thumbnail && (
        <div className={s.thumbnailWrapper} style={{ height: fullHeight ? "100%" : "auto", opacity: isLoaded ? 0 : 1, aspectRatio: `${thumbnail?.metadata?.dimensions?.width || 16} / ${thumbnail?.metadata?.dimensions?.height || 9}` }}>
        <LazyImage
          src={thumbnail.imageUrl}
          alt={thumbnail.alt || 'Video thumbnail'}
          width={thumbnail?.metadata?.dimensions?.width || 160}
          height={thumbnail?.metadata?.dimensions?.height || 90}
          filename={thumbnail.filename}
          objectFit="contain"
          fill
        />
        </div>
      )}

      <div
        style={{ height: "100%" }}
        className={`${s.contentVideo} ${isLoaded && isVisible ? s.fadeIn : ""}`}
      >
        {videoSrc && (
          <video
            ref={videoRef}
            // 👇 importante: para HLS, el src real lo setea el efecto de Hls,
            // pero dejarlo aquí no molesta para MP4
            src={!isHlsSource(videoSrc) ? videoSrc : undefined}
            data-src={src}
            autoPlay={true}
            muted={muted || autoplay}
            loop={true}
            playsInline
            preload={preload ? "metadata" : "auto"}
            controls={controls}
            controlsList="nodownload noplaybackrate nofullscreen"
            onLoadedData={handleLoadedData}
            onLoadedMetadata={onLoadedMetadata}
            onCanPlay={handleCanPlay}
            onError={handleError}
          />
        )}
      </div>
    </div>
  );
}
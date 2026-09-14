"use client";

import { useEffect, useRef } from "react";

export default function Video({ src, label }: { src: string; label: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const visible = useRef(false);
  const pausedByUser = useRef(false);

  useEffect(() => {
    const video = ref.current;
    if (!video || !("IntersectionObserver" in window)) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const observer = new IntersectionObserver(([entry]) => {
      visible.current = entry.isIntersecting;
      if (!entry.isIntersecting) {
        video.pause();
      } else if (!reducedMotion.matches && !pausedByUser.current) {
        video.muted = true;
        void video.play().catch(() => {
          // Native controls remain available when autoplay is blocked.
        });
      }
    }, { threshold: 0.1 });
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      muted
      loop
      playsInline
      controls
      preload="none"
      poster={src.replace(/\.mp4$/, ".jpg")}
      aria-label={label}
      onPlay={() => { pausedByUser.current = false; }}
      onPause={() => {
        if (visible.current && document.visibilityState === "visible") pausedByUser.current = true;
      }}
    >
      <source src={src} type="video/mp4" />
      <a href={src}>Download {label}</a>
    </video>
  );
}

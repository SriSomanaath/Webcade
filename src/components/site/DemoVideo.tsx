"use client";

import { useEffect, useRef } from "react";

type Props = {
  src: string;
  className?: string;
  ariaLabel: string;
  threshold?: number;
};

export function DemoVideo({
  src,
  className,
  ariaLabel,
  threshold = 0.5,
}: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let ioPausing = false;
    let userPaused = false;

    const onPause = () => {
      if (!ioPausing) userPaused = true;
    };
    const onPlay = () => {
      userPaused = false;
    };

    video.addEventListener("pause", onPause);
    video.addEventListener("play", onPlay);

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            if (!userPaused) {
              video.play().catch(() => {
                // Autoplay can be blocked even when muted; surface controls and move on.
              });
            }
          } else {
            ioPausing = true;
            video.pause();
            ioPausing = false;
          }
        }
      },
      { threshold }
    );
    io.observe(video);

    return () => {
      io.disconnect();
      video.removeEventListener("pause", onPause);
      video.removeEventListener("play", onPlay);
    };
  }, [threshold]);

  return (
    <video
      ref={videoRef}
      className={className}
      src={src}
      muted
      loop
      playsInline
      preload="metadata"
      controls
      aria-label={ariaLabel}
    />
  );
}

"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import styles from "./HeroBackgroundCarousel.module.css";
import { HeroCarouselDots } from "@/sections/Hero/components/HeroCarouselDots";

export type HeroBackgroundCarouselProps = {
  imageUrls: string[];
  alt?: string;
  intervalMs?: number;
  maskUrl?: string;
};

export function HeroBackgroundCarousel(props: HeroBackgroundCarouselProps) {
  const intervalMs = props.intervalMs ?? 5000;
  const images = props.imageUrls.filter(Boolean);

  const debugMask = process.env.NEXT_PUBLIC_DEBUG_MASK === "1";

  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const pointerStartX = useRef<number | null>(null);
  const pointerMoved = useRef(false);

  const next = useCallback(() => {
    if (images.length <= 1) return;
    setActive((i) => (i + 1) % images.length);
  }, [images.length]);

  const prev = useCallback(() => {
    if (images.length <= 1) return;
    setActive((i) => (i - 1 + images.length) % images.length);
  }, [images.length]);

  useEffect(() => {
    if (paused) return;
    if (images.length <= 1) return;

    const id = window.setInterval(() => {
      next();
    }, intervalMs);

    return () => {
      window.clearInterval(id);
    };
  }, [paused, images.length, intervalMs, next]);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    pointerStartX.current = e.clientX;
    pointerMoved.current = false;
    setPaused(true);
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (pointerStartX.current == null) return;
    const dx = e.clientX - pointerStartX.current;
    if (Math.abs(dx) > 6) pointerMoved.current = true;
  }, []);

  const onPointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (pointerStartX.current == null) return;
      const dx = e.clientX - pointerStartX.current;
      pointerStartX.current = null;

      if (pointerMoved.current) {
        if (dx < -30) next();
        if (dx > 30) prev();
      }

      pointerMoved.current = false;
      setPaused(false);
    },
    [next, prev],
  );

  const layer = (
    <div className={styles.root}>
      {images.map((src, idx) => (
        <img
          key={`${src}-${idx}`}
          src={src}
          alt={props.alt ?? ""}
          className={`${styles.slide} ${idx === active ? styles.slideActive : ""}`}
          draggable={false}
        />
      ))}
    </div>
  );

  return (
    <div
      className={styles.mask}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={() => {
        pointerStartX.current = null;
        pointerMoved.current = false;
        setPaused(false);
      }}
    >
      <div className={styles.masked}>
        {layer}
        {debugMask ? <div className={styles.debugOverlay} /> : null}
      </div>
      <div className={styles.dots}>
        <HeroCarouselDots totalDots={Math.min(5, images.length)} activeDotIndex={active} />
      </div>
    </div>
  );
}

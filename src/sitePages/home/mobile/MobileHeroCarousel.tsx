"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";

export type MobileHeroCarouselProps = {
  imageUrls: string[];
  alt?: string;
  intervalMs?: number;
};

function encodeMaskUrl(path: string) {
  return path.split(" ").join("%20");
}

export function MobileHeroCarousel(props: MobileHeroCarouselProps) {
  const intervalMs = props.intervalMs ?? 5000;
  const images = props.imageUrls.filter(Boolean);

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

  const maskPath = encodeMaskUrl("/masks/Home Page mask Mobile.svg");
  const fullOpaqueMask = "linear-gradient(#fff 0 0)";

  return (
    <div
      className="relative w-full overflow-hidden bg-white"
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
      <div
        className="relative w-full aspect-[393/518]"
        style={{
          backgroundColor: "#fff",
          WebkitMaskImage: `${fullOpaqueMask}, url('${maskPath}')`,
          maskImage: `${fullOpaqueMask}, url('${maskPath}')`,
          WebkitMaskRepeat: "no-repeat, no-repeat",
          maskRepeat: "no-repeat, no-repeat",
          WebkitMaskSize: "100% 100%, calc(100% + 4px) calc(100% + 4px)",
          maskSize: "100% 100%, calc(100% + 4px) calc(100% + 4px)",
          WebkitMaskPosition: "center, center",
          maskPosition: "center, center",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
          filter: "drop-shadow(0 0 2px #fff)",
          transform: "translateZ(0)",
        }}
      >
        {images.map((src, idx) => (
          <img
            key={`${src}-${idx}`}
            src={src}
            alt={props.alt ?? ""}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-in-out ${
              idx === active ? "opacity-100" : "opacity-0"
            }`}
            draggable={false}
          />
        ))}
      </div>

      <div className="pointer-events-none absolute left-0 right-0 bottom-0 h-[2px] bg-white" />

      <div className="absolute left-6 bottom-[187px]">
        <div className="flex items-center gap-2.5">
          {Array.from({ length: Math.min(5, images.length) }).map((_, index) => {
            const selected = index === active;
            return (
              <button
                key={index}
                type="button"
                aria-label={`Go to slide ${index + 1}`}
                aria-current={selected ? "true" : undefined}
                className={
                  "h-3 w-3 rounded-full transition-opacity duration-200 focus:outline-none focus:ring-2 focus:ring-orange-600 focus:ring-offset-2 " +
                  (selected ? "bg-white opacity-100" : "bg-white opacity-40")
                }
                onClick={() => {
                  setActive(index);
                  setPaused(false);
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

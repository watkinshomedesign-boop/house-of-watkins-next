"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { PlanImage } from "@/components/media/PlanImage";

export type ImageLightboxProps = {
  open: boolean;
  images: string[];
  index: number;
  onClose: () => void;
  onIndexChange?: (next: number) => void;
};

export function ImageLightbox(props: ImageLightboxProps) {
  const { open, images, index, onClose, onIndexChange } = props;
  const [mounted, setMounted] = useState(false);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  const prevFocusRef = useRef<HTMLElement | null>(null);

  const safeImages = useMemo(() => (Array.isArray(images) ? images.filter(Boolean) : []), [images]);
  const canNav = safeImages.length > 1;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;

    prevFocusRef.current = (document.activeElement as HTMLElement | null) ?? null;
    closeBtnRef.current?.focus();

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }

      if (e.key === "Tab") {
        const root = dialogRef.current;
        if (!root) return;
        const focusables = Array.from(
          root.querySelectorAll<HTMLElement>(
            'button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])'
          )
        ).filter((el) => !el.hasAttribute("disabled") && el.tabIndex !== -1);

        if (focusables.length === 0) {
          e.preventDefault();
          return;
        }

        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        const active = document.activeElement as HTMLElement | null;
        if (e.shiftKey) {
          if (!active || active === first || !root.contains(active)) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (!active || active === last || !root.contains(active)) {
            e.preventDefault();
            first.focus();
          }
        }
        return;
      }

      if (!canNav) return;
      if (e.key === "ArrowRight") {
        if (onIndexChange) onIndexChange((index + 1) % safeImages.length);
      }
      if (e.key === "ArrowLeft") {
        if (onIndexChange) onIndexChange((index - 1 + safeImages.length) % safeImages.length);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
      prevFocusRef.current?.focus?.();
    };
  }, [open, onClose, canNav, index, onIndexChange, safeImages.length]);

  if (!mounted) return null;
  if (!open) return null;

  const src = safeImages[index] || safeImages[0];

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4"
      role="dialog"
      aria-modal="true"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        className="relative w-full max-w-5xl"
        onMouseDown={(e) => {
          e.stopPropagation();
        }}
      >
        <button
          ref={closeBtnRef}
          type="button"
          aria-label="Close"
          className="absolute right-0 top-0 -translate-y-12 rounded-full bg-white/90 px-3 py-2 text-sm font-semibold text-zinc-900 shadow"
          onClick={onClose}
        >
          ✕
        </button>

        {canNav ? (
          <>
            <button
              type="button"
              aria-label="Previous"
              className="absolute left-0 top-1/2 -translate-x-2 -translate-y-1/2 rounded-full bg-white/90 px-3 py-2 text-sm font-semibold text-zinc-900 shadow"
              onClick={() => onIndexChange && onIndexChange((index - 1 + safeImages.length) % safeImages.length)}
            >
              ‹
            </button>
            <button
              type="button"
              aria-label="Next"
              className="absolute right-0 top-1/2 translate-x-2 -translate-y-1/2 rounded-full bg-white/90 px-3 py-2 text-sm font-semibold text-zinc-900 shadow"
              onClick={() => onIndexChange && onIndexChange((index + 1) % safeImages.length)}
            >
              ›
            </button>
          </>
        ) : null}

        <div className="rounded-2xl bg-black shadow">
          <PlanImage src={src} alt="" sizes="100vw" />
        </div>
      </div>
    </div>
  );
}

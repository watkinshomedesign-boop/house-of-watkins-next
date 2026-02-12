"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

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
  const cloudpanoEmbedRef = useRef<HTMLDivElement | null>(null);

  const safeImages = useMemo(
    () => (Array.isArray(images) ? images.filter(Boolean) : []),
    [images],
  );
  const canNav = safeImages.length > 1;
  const hasImages = safeImages.length > 0;
  const currentIndex = hasImages
    ? ((index % safeImages.length) + safeImages.length) % safeImages.length
    : 0;
  const src =
    safeImages[currentIndex] || safeImages[0] || "/placeholders/plan-hero.svg";
  const trimmedSrc = String(src || "").trim();

  function toUrl(value: string) {
    try {
      return new URL(value);
    } catch {
      return null;
    }
  }

  function isImageLike(value: string) {
    const v = String(value || "")
      .trim()
      .toLowerCase();
    if (!v) return false;
    if (v.startsWith("/")) return true;
    if (v.startsWith("data:image/")) return true;
    const clean = v.split(/[?#]/)[0] || "";
    return /\.(png|jpe?g|webp|gif|bmp|avif|svg)$/.test(clean);
  }

  function isPdfLike(value: string) {
    const v = String(value || "")
      .trim()
      .toLowerCase();
    if (!v) return false;
    const clean = v.split(/[?#]/)[0] || "";
    return clean.endsWith(".pdf");
  }

  function toCanvaEmbedUrl(value: string) {
    const u = toUrl(value);
    if (!u) return null;
    const host = u.hostname.toLowerCase();
    if (!host.includes("canva.com")) return null;
    u.searchParams.set("embed", "");
    return u.toString();
  }

  function extractCloudpanoTourId(value: string) {
    const raw = String(value || "").trim();
    if (!raw) return null;
    const normalized = raw.includes("://")
      ? raw
      : `https://${raw.replace(/^\/+/, "")}`;
    try {
      const u = new URL(normalized);
      const host = u.hostname.toLowerCase();
      if (!host.includes("cloudpano.com")) return null;
      const parts = u.pathname.split("/").filter(Boolean);
      const idx = parts.findIndex((p) => p === "tours");
      if (idx >= 0 && parts[idx + 1]) return parts[idx + 1];
      return parts[parts.length - 1] || null;
    } catch {
      const match = raw.match(/tours\/([a-z0-9_-]+)/i);
      return match?.[1] ?? null;
    }
  }

  const canvaEmbedUrl = toCanvaEmbedUrl(trimmedSrc);
  const cloudpanoTourId = extractCloudpanoTourId(trimmedSrc);
  const showCloudpano = Boolean(cloudpanoTourId);
  const showIframe = Boolean(
    !showCloudpano &&
    (canvaEmbedUrl ||
      isPdfLike(trimmedSrc) ||
      (!isImageLike(trimmedSrc) && toUrl(trimmedSrc))),
  );
  const iframeSrc = canvaEmbedUrl || trimmedSrc;

  const goPrev = useCallback(() => {
    if (!canNav || !onIndexChange || safeImages.length < 2) return;
    onIndexChange((currentIndex - 1 + safeImages.length) % safeImages.length);
  }, [canNav, onIndexChange, currentIndex, safeImages.length]);

  const goNext = useCallback(() => {
    if (!canNav || !onIndexChange || safeImages.length < 2) return;
    onIndexChange((currentIndex + 1) % safeImages.length);
  }, [canNav, onIndexChange, currentIndex, safeImages.length]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;

    prevFocusRef.current =
      (document.activeElement as HTMLElement | null) ?? null;
    closeBtnRef.current?.focus();

    const prevOverflow = document.body.style.overflow;
    const prevPaddingRight = document.body.style.paddingRight;
    const scrollbarCompensation =
      window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (scrollbarCompensation > 0) {
      document.body.style.paddingRight = `${scrollbarCompensation}px`;
    }

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
            'button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])',
          ),
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
        goNext();
      }
      if (e.key === "ArrowLeft") {
        goPrev();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
      document.body.style.paddingRight = prevPaddingRight;
      prevFocusRef.current?.focus?.();
    };
  }, [open, onClose, canNav, goNext, goPrev]);

  useEffect(() => {
    if (!open || !showCloudpano || !cloudpanoTourId) return;
    const el = cloudpanoEmbedRef.current;
    if (!el) return;

    el.innerHTML = "";
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.async = true;
    script.setAttribute("data-short", cloudpanoTourId);
    script.setAttribute("data-path", "tours");
    script.setAttribute("data-is-self-hosted", "false");
    script.setAttribute("width", "100%");
    script.setAttribute("height", "100%");
    script.src = "https://app.cloudpano.com/public/shareScript.js";
    el.appendChild(script);

    return () => {
      el.innerHTML = "";
    };
  }, [open, showCloudpano, cloudpanoTourId]);

  if (!mounted) return null;
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/65 p-3 md:p-6"
      role="dialog"
      aria-modal="true"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        className="relative flex w-full max-w-[1120px] flex-col items-center justify-center rounded-[22px] bg-[#f4f4f4] px-10 py-0 shadow-2xl md:rounded-[30px]"
        onMouseDown={(e) => {
          e.stopPropagation();
        }}
      >
        <div className="w-full max-w-[1120px]">
          <div className="my-5 flex items-center justify-end">
            <button
              ref={closeBtnRef}
              type="button"
              aria-label="Close"
              className="inline-flex h-[18px] w-[18px] items-center justify-center text-zinc-800 transition hover:text-black"
              onClick={onClose}
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="h-[18px] w-[18px]"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M5 5L19 19" />
                <path d="M19 5L5 19" />
              </svg>
            </button>
          </div>

          <div className="relative h-[min(68vh,720px)] w-full overflow-hidden bg-[#f4f4f4] md:h-[min(75vh,820px)]">
            <div
              ref={cloudpanoEmbedRef}
              className={showCloudpano ? "h-full w-full" : "hidden h-full w-full"}
            />

            {showIframe ? (
              <iframe
                src={iframeSrc}
                title="Plan canvas"
                className="h-full w-full border-0"
                loading="lazy"
                allowFullScreen
              />
            ) : null}

            {!showCloudpano && !showIframe ? (
              <div className="relative flex h-full w-full items-center justify-center">
                <div className="relative h-full w-full">
                  <Image
                    src={src}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 70vw, 95vw"
                    className="object-contain object-center"
                    unoptimized={
                      src.startsWith("/") ||
                      src.startsWith("http://localhost") ||
                      src.startsWith("https://localhost") ||
                      src.includes(".supabase.co/") ||
                      src.includes("/storage/v1/object/public/")
                    }
                  />
                </div>
              </div>
            ) : null}
          </div>
        </div>

        <div className="my-5 flex min-h-[44px] items-center justify-center gap-3 md:min-h-[50px]">
          <button
            type="button"
            aria-label="Previous"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[rgba(255,92,2,0.12)] text-xl text-[rgba(255,92,2,1)] transition disabled:opacity-40 md:h-11 md:w-11"
            onClick={goPrev}
            disabled={!canNav}
          >
            <span aria-hidden="true">&larr;</span>
          </button>
          <button
            type="button"
            aria-label="Next"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[rgba(255,92,2,0.12)] text-xl text-[rgba(255,92,2,1)] transition disabled:opacity-40 md:h-11 md:w-11"
            onClick={goNext}
            disabled={!canNav}
          >
            <span aria-hidden="true">&rarr;</span>
          </button>
        </div>
      </div>
    </div>
  );
}

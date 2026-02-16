"use client";

import type { HomePageMediaSlots } from "@/lib/homePage/types";
import { urlForImage } from "@/lib/sanity/image";
import React, { useCallback, useMemo, useState } from "react";

function imageUrl(source: unknown): string | undefined {
  if (!source) return undefined;
  if (typeof source === "string") return source;
  try {
    return urlForImage(source as any).width(1200).fit("max").url();
  } catch {
    return undefined;
  }
}

export const WelcomeGallery = (props: { media?: HomePageMediaSlots }) => {
  const images = useMemo(() => {
    const raw = Array.isArray(props.media?.tripleCarouselImages) ? props.media?.tripleCarouselImages : [];
    const urls = raw.map((img) => imageUrl(img)).filter((u): u is string => Boolean(u));
    return urls;
  }, [props.media?.tripleCarouselImages]);

  const pageSize = 3;
  const pageCount = Math.max(1, Math.ceil(images.length / pageSize));
  const [page, setPage] = useState(0);

  const visible = useMemo(() => {
    if (images.length === 0) {
      return ["/placeholders/plan-hero.svg", "/placeholders/plan-hero.svg", "/placeholders/plan-hero.svg"];
    }

    const start = (page % pageCount) * pageSize;
    const slice = images.slice(start, start + pageSize);
    if (slice.length === pageSize) return slice;

    const padded = [...slice];
    while (padded.length < pageSize) padded.push(images[padded.length % images.length]);
    return padded;
  }, [images, page, pageCount]);

  const goPrev = useCallback(() => {
    setPage((p) => (p - 1 + pageCount) % pageCount);
  }, [pageCount]);

  const goNext = useCallback(() => {
    setPage((p) => (p + 1) % pageCount);
  }, [pageCount]);

  return (
    <div
      className="static [align-items:normal] box-content caret-black gap-x-[normal] block flex-row shrink justify-normal min-h-0 min-w-0 outline-black gap-y-[normal] w-auto md:relative md:items-center md:aspect-auto md:box-border md:caret-transparent md:gap-x-[17.792px] md:flex md:flex-col md:shrink-0 md:justify-start md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:gap-y-[17.792px] md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-full md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]"
      tabIndex={0}
      role="region"
      aria-label="Welcome gallery"
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") goPrev();
        if (e.key === "ArrowRight") goNext();
      }}
    >
      <div className="static [align-items:normal] box-content caret-black gap-x-[normal] block shrink justify-normal min-h-0 min-w-0 outline-black gap-y-[normal] w-auto md:relative md:items-center md:aspect-auto md:box-border md:caret-transparent md:gap-x-[17.792px] md:flex md:shrink-0 md:justify-start md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:gap-y-[17.792px] md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-full md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
        <div className="box-content caret-black gap-x-[normal] block min-h-0 min-w-0 outline-black gap-y-[normal] w-auto md:aspect-auto md:box-border md:caret-transparent md:gap-x-[17.792px] md:flex md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:gap-y-[17.792px] md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-full md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
          {visible.map((src, idx) => (
            <div
              key={`${src}-${idx}`}
              className="bg-none bg-repeat bg-auto box-content caret-black basis-auto grow-0 shrink h-auto min-h-0 min-w-0 outline-black rounded-none md:aspect-auto md:bg-no-repeat md:bg-cover md:box-border md:caret-transparent md:basis-0 md:grow md:shrink-0 md:h-[328px] md:min-h-px md:min-w-px md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-center md:scroll-m-0 md:scroll-p-[auto] md:rounded-[35.584px] overflow-hidden"
            >
              <img src={src} alt="Gallery image" className="h-full w-full object-cover" draggable={false} />
            </div>
          ))}
        </div>
      </div>

      <div className="static [align-items:normal] box-content caret-black gap-x-[normal] block shrink justify-normal min-h-0 min-w-0 outline-black gap-y-[normal] md:relative md:items-center md:aspect-auto md:box-border md:caret-transparent md:flex md:shrink-0 md:justify-center md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:gap-[10px] md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
        <button
          type="button"
          aria-label="Previous images"
          onClick={goPrev}
          className="inline-flex h-[50px] w-[50px] shrink-0 items-center justify-center rounded-[100px] p-[13px] opacity-100 md:h-[50px] md:w-[50px] md:rounded-[100px] md:p-[13px]"
          style={{ background: "var(--Background-orange-light, rgba(255, 239, 235, 1))" }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path
              d="M9.57 5.92993L3.5 11.9999L9.57 18.0699"
              stroke="#FF5C02"
              strokeWidth="1.5"
              strokeMiterlimit="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M20.4999 12H3.66992"
              stroke="#FF5C02"
              strokeWidth="1.5"
              strokeMiterlimit="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <button
          type="button"
          aria-label="Next images"
          onClick={goNext}
          className="inline-flex h-[50px] w-[50px] shrink-0 items-center justify-center rounded-[100px] p-[13px] opacity-100 md:h-[50px] md:w-[50px] md:rounded-[100px] md:p-[13px]"
          style={{ background: "var(--Background-orange-light, rgba(255, 239, 235, 1))" }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path
              d="M14.43 5.92993L20.5 11.9999L14.43 18.0699"
              stroke="#FF5C02"
              strokeWidth="1.5"
              strokeMiterlimit="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M3.5001 12H20.33"
              stroke="#FF5C02"
              strokeWidth="1.5"
              strokeMiterlimit="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

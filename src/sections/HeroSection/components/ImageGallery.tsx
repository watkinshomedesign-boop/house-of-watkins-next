"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { usePlan } from "@/lib/planContext";
import { ImageLightbox } from "@/components/ImageLightbox";
import { PlanImage } from "@/components/media/PlanImage";

function isValidHttpUrl(v: string | null | undefined) {
  const s = String(v || "").trim();
  if (!s) return false;
  try {
    const u = new URL(s);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

function extractCloudpanoTourId(tourUrl: string | null): string | null {
  const raw = String(tourUrl || "").trim();
  if (!raw) return null;
  try {
    const u = new URL(raw);
    const parts = u.pathname.split("/").filter(Boolean);
    const idx = parts.findIndex((p) => p === "tours");
    if (idx >= 0 && parts[idx + 1]) return parts[idx + 1];
    const last = parts[parts.length - 1];
    return last ? last : null;
  } catch {
    return null;
  }
}

export const ImageGallery = () => {
  const plan = usePlan();

  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia("(min-width: 768px)");
    const onChange = () => setIsDesktop(mql.matches);
    onChange();
    if (mql.addEventListener) mql.addEventListener("change", onChange);
    else (mql as any).addListener?.(onChange);
    return () => {
      if (mql.removeEventListener) mql.removeEventListener("change", onChange);
      else (mql as any).removeListener?.(onChange);
    };
  }, []);

  const embedRef = useRef<HTMLDivElement | null>(null);
  const tour = isValidHttpUrl((plan as any)?.tour3d_url) ? String((plan as any).tour3d_url).trim() : null;
  const tourId = extractCloudpanoTourId(tour);
  const showTourInHero = Boolean(isDesktop && tourId);

  useEffect(() => {
    if (!showTourInHero || !tourId) return;
    const el = embedRef.current;
    if (!el) return;

    el.innerHTML = "";
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.async = true;
    script.setAttribute("data-short", tourId);
    script.setAttribute("data-path", "tours");
    script.setAttribute("data-is-self-hosted", "false");
    script.setAttribute("width", "100%");
    script.setAttribute("height", "100%");
    script.src = "https://app.cloudpano.com/public/shareScript.js";
    el.appendChild(script);

    return () => {
      el.innerHTML = "";
    };
  }, [showTourInHero, tourId]);

  function resolvePublicImageUrl(pathOrUrl: string | null | undefined) {
    const s = String(pathOrUrl || "").trim();
    if (!s) return null;
    if (s.startsWith("http://") || s.startsWith("https://")) return s;
    if (s.includes("cloudpano.com")) return `https://${s.replace(/^\/+/, "")}`;
    if (s.startsWith("/")) return s;
    const base = String(process.env.NEXT_PUBLIC_SUPABASE_URL || "").replace(/\/$/, "");
    if (!base) return null;
    return `${base}/storage/v1/object/public/${s.replace(/^\/+/, "")}`;
  }

  const gallery0Url =
    resolvePublicImageUrl((plan as any).galleryImages?.[0]) || resolvePublicImageUrl(plan.images?.gallery?.[0]) || "/placeholders/plan-hero.svg";
  const gallery1Url =
    resolvePublicImageUrl((plan as any).galleryImages?.[1]) || resolvePublicImageUrl(plan.images?.gallery?.[1]) || gallery0Url;
  const gallery2Url =
    resolvePublicImageUrl((plan as any).galleryImages?.[2]) || resolvePublicImageUrl(plan.images?.gallery?.[2]) || gallery1Url;
  const floor0Url =
    resolvePublicImageUrl((plan as any).floorplanImages?.[0]) ||
    resolvePublicImageUrl(plan.images?.floorplan?.[0]) ||
    "/placeholders/floorplan.svg";

  const galleryHref = `/house/${plan.slug}#gallery`;

  const viewAllMedia = useMemo(() => {
    const gResolved = Array.isArray((plan as any).galleryImages) ? (((plan as any).galleryImages ?? []) as any[]) : [];
    const fpResolved = Array.isArray((plan as any).floorplanImages) ? (((plan as any).floorplanImages ?? []) as any[]) : [];
    const gLegacy = Array.isArray(plan.images?.gallery) ? (plan.images?.gallery ?? []) : [];
    const fpLegacy = Array.isArray(plan.images?.floorplan) ? (plan.images?.floorplan ?? []) : [];
    const extraPlanMedia = [
      (plan as any).tour3d_url,
      (plan as any).planThumbnailUrl,
      plan.images?.hover,
      (plan as any).buildFeatureFloorplanUrl,
      (plan as any).buildFeatureFloorplan,
    ];
    const resolved = [...gResolved, ...gLegacy, ...fpResolved, ...fpLegacy, ...extraPlanMedia]
      .map(resolvePublicImageUrl)
      .filter(Boolean) as string[];
    const unique = Array.from(new Set(resolved));
    return unique.length > 0 ? unique : ["/placeholders/plan-hero.svg"];
  }, [plan]);

  const imageIndexBySrc = useMemo(() => {
    const map = new Map<string, number>();
    viewAllMedia.forEach((src, idx) => {
      if (!map.has(src)) map.set(src, idx);
    });
    return map;
  }, [viewAllMedia]);

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const viewAllCount = viewAllMedia.length;

  return (
    <>
      <ImageLightbox
        open={lightboxOpen}
        images={viewAllMedia}
        index={lightboxIndex}
        onClose={() => setLightboxOpen(false)}
        onIndexChange={setLightboxIndex}
      />

      <div id="gallery" className="box-content caret-black gap-x-[normal] block grid-cols-none grid-rows-none h-auto min-h-0 min-w-0 outline-black gap-y-[normal] w-auto md:aspect-auto md:box-border md:caret-transparent md:gap-x-[1.792px] md:grid md:grid-cols-[2fr_1fr_1fr] md:grid-rows-[auto_auto] md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:gap-y-[1.792px] md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-full md:max-w-[1600px] md:mx-auto md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
        <button
          type="button"
          aria-label="Open image"
          className="relative md:row-span-2"
          onClick={() => {
            setLightboxIndex(0);
            setLightboxOpen(true);
          }}
        >
          <PlanImage
            src={gallery0Url}
            alt=""
            sizes="(min-width: 768px) 60vw, 100vw"
            className="rounded-l-none md:rounded-l-[35.584px] rounded-tr-none rounded-br-none md:rounded-tr-none md:rounded-br-none"
          />
        </button>
        {showTourInHero ? (
          <div
            className="relative hidden md:block md:row-span-2 md:overflow-hidden"
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="absolute inset-0 overflow-hidden bg-black/5">
              <div className="h-full w-full" ref={embedRef} />
            </div>
          </div>
        ) : null}
        <button
          type="button"
          aria-label="Open image"
          className={`relative md:row-span-2 md:overflow-hidden ${showTourInHero ? "md:hidden" : ""}`}
          onClick={() => {
            const idx = imageIndexBySrc.get(gallery1Url) ?? 0;
            setLightboxIndex(Math.max(0, idx));
            setLightboxOpen(true);
          }}
        >
          <div className="relative h-full w-full overflow-hidden">
            <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 h-full aspect-[3/2]">
              <PlanImage
                src={gallery1Url}
                alt=""
                sizes="(min-width: 768px) 20vw, 100vw"
                rounded={false}
                aspect="auto"
                className="h-full w-full"
                imgClassName="object-cover object-center"
              />
            </div>
          </div>
        </button>
        <button
          type="button"
          aria-label="Open image"
          className="relative"
          onClick={() => {
            const src = showTourInHero ? gallery1Url : gallery2Url;
            const idx = imageIndexBySrc.get(src) ?? 0;
            setLightboxIndex(Math.max(0, idx));
            setLightboxOpen(true);
          }}
        >
          <PlanImage
            src={showTourInHero ? gallery1Url : gallery2Url}
            alt=""
            sizes="(min-width: 768px) 20vw, 100vw"
            className="rounded-tr-none md:rounded-tr-[35.584px] rounded-tl-none md:rounded-tl-none rounded-bl-none rounded-br-none md:rounded-bl-none md:rounded-br-none"
          />
        </button>
      <div className="relative">
        <PlanImage
          src={floor0Url}
          alt=""
          sizes="(min-width: 768px) 20vw, 100vw"
          className="rounded-br-none md:rounded-br-[35.584px] rounded-tl-none rounded-tr-none rounded-bl-none md:rounded-tl-none md:rounded-tr-none md:rounded-bl-none"
        />
        <Link href={galleryHref} className="contents">
          <button className="static [align-items:normal] self-auto bg-zinc-100 shadow-none caret-black gap-x-[normal] inline-block justify-normal outline-black gap-y-[normal] px-1.5 py-px rounded-none right-auto bottom-auto md:absolute md:items-center md:self-stretch md:aspect-auto md:bg-zinc-800 md:shadow-[rgba(0,0,0,0)_0px_0px_0px_0px,rgba(0,0,0,0)_0px_0px_0px_0px,rgba(0,0,0,0)_0px_0px_0px_0px,rgba(0,0,0,0)_0px_0px_0px_0px,rgba(0,0,0,0.07)_0px_4px_4px_0px] md:caret-transparent md:gap-x-[8.832px] md:flex md:justify-center md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:gap-y-[8.832px] md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:px-[17.792px] md:py-[8.832px] md:scroll-m-0 md:scroll-p-[auto] md:rounded-[31.104px] md:right-[17.792px] md:bottom-[17.792px]">
            <div className="static text-black text-base font-normal box-content caret-black block flex-row shrink justify-normal tracking-[normal] leading-[normal] min-h-0 min-w-0 outline-black normal-case text-wrap md:relative md:text-white md:text-[13.312px] md:font-semibold md:aspect-auto md:box-border md:caret-transparent md:flex md:flex-col md:shrink-0 md:justify-center md:tracking-[0.128px] md:leading-[0px] md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:uppercase md:text-nowrap md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
              <p className="box-content caret-black leading-[normal] min-h-0 min-w-0 outline-black text-wrap md:aspect-auto md:box-border md:caret-transparent md:leading-[21.376px] md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:text-nowrap md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
                view all ({viewAllCount})
              </p>
            </div>
          </button>
        </Link>
      </div>
      </div>
    </>
  );
};


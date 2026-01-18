import { HeroBackgroundCarousel } from "@/sections/Hero/components/HeroBackgroundCarousel";
import { HeroCallToAction } from "@/sections/Hero/components/HeroCallToAction";
import { HeroNavbar } from "@/sections/Hero/components/HeroNavbar";
import { HeroHeading } from "@/sections/Hero/components/HeroHeading";
import { HeroDescription } from "@/sections/Hero/components/HeroDescription";
import { HeroFeatureImage } from "@/sections/Hero/components/HeroFeatureImage";
import { HeroFeatureText } from "@/sections/Hero/components/HeroFeatureText";
import type { HomePageHeroSlot, HomePageMediaSlots } from "@/lib/homePage/types";
import { urlForImage } from "@/lib/sanity/image";
import styles from "@/sections/Hero/Hero.module.css";

function heroImageUrl(source: unknown): string | undefined {
  if (!source) return undefined;
  if (typeof source === "string") return source;
  try {
    return urlForImage(source as any).width(2400).fit("max").url();
  } catch {
    return undefined;
  }
}

function heroCarouselImageUrls(media?: HomePageMediaSlots, fallback?: string): string[] {
  const raw = Array.isArray(media?.heroCarouselImages) ? media?.heroCarouselImages : [];
  const urls = raw
    .map((img) => heroImageUrl(img))
    .filter((u): u is string => Boolean(u));

  if (urls.length >= 5) return urls.slice(0, 5);

  const fill = fallback || "/placeholders/plan-hero.svg";
  const padded = [...urls];
  while (padded.length < 5) padded.push(fill);
  return padded;
}

export const Hero = (props: { cms?: HomePageHeroSlot; media?: HomePageMediaSlots }) => {
  const headlineLine1 = props.cms?.headlineLine1;
  const headlineLine2 = props.cms?.headlineLine2;
  const subhead = props.cms?.subhead;
  const ctaLabel = props.cms?.ctaLabel;
  const ctaUrl = props.cms?.ctaUrl;
  const bgSrc = heroImageUrl(props.cms?.heroImage);
  const bgAlt = props.cms?.heroImageAlt;
  const headshotSrc = heroImageUrl(props.cms?.headshotImage);
  const headshotAlt = props.cms?.headshotImageAlt;

  const debugMask = process.env.NEXT_PUBLIC_DEBUG_MASK === "1";

  const carouselUrls = heroCarouselImageUrls(props.media, bgSrc);
  const maskUrl = props.media?.heroMaskUrl ? "/api/hero-mask" : "/masks/home-hero-mask.png";

  return (
    <div className="static box-content caret-black h-auto min-h-0 min-w-0 outline-black w-auto md:relative md:aspect-auto md:box-border md:caret-transparent md:h-[700px] md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:w-full">
      <div className="md:mx-auto md:grid md:h-full md:max-w-[1440px] md:grid-cols-[880px_560px]">
        <div className="relative md:h-full md:overflow-visible md:mr-[-84px]">
          <HeroBackgroundCarousel imageUrls={carouselUrls} alt={bgAlt} maskUrl={maskUrl} intervalMs={5000} />
        </div>

        <div className="relative md:z-30 md:h-full md:-ml-[40px] md:w-[640px]">
          {debugMask ? (
            <div className="absolute left-2 top-2 z-[999] bg-black/80 px-2 py-1 text-[11px] font-semibold tracking-wide text-white">
              DEBUG MASK
            </div>
          ) : null}
          <div className="absolute inset-0 z-50" data-hero-cta>
            <HeroCallToAction cms={{ label: ctaLabel, href: ctaUrl }} />
          </div>
          <div
            className={`absolute inset-0 z-10 ${styles.maskedPanel}`}
            data-hero-masked-panel
          >
            <svg
              className="pointer-events-none absolute inset-y-0 left-[-40px]"
              viewBox="0 0 1280 1600"
              preserveAspectRatio="xMinYMid meet"
              aria-hidden="true"
              focusable="false"
              style={{
                height: "100%",
                width: "640px",
                maxWidth: "none",
                transform: "translate(-65px, -120px) scale(1.329)",
                transformOrigin: "left top",
              }}
            >
              <g
                transform="translate(0,1600) scale(0.1,-0.1)"
                fill={debugMask ? "rgba(255, 0, 255, 0.12)" : "#ffffff"}
                stroke={debugMask ? "#ff00ff" : "none"}
                strokeWidth={debugMask ? 60 : 0}
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M1127 14243 c-12 -11 -8 -9497 3 -9598 20 -174 81 -322 201 -482 127 -168 344 -305 564 -354 31 -7 272 -14 635 -19 640 -8 617 -6 791 -73 91 -34 124 -53 194 -105 193 -145 306 -316 371 -562 24 -90 24 -320 0 -410 -78 -296 -244 -510 -491 -632 -122 -61 -217 -88 -375 -106 -36 -4 -65 -11 -65 -17 0 -7 1559 -11 4653 -13 l4652 -2 0 6190 0 6190 -5563 0 c-3060 0 -5567 -3 -5570 -7z"
                />
              </g>
            </svg>

            <div className="relative z-10">
              <HeroHeading cms={{ line1: headlineLine1, line2: headlineLine2 }} />
              <HeroDescription cms={{ subhead }} />
              <HeroFeatureImage cms={{ src: headshotSrc, alt: headshotAlt }} />
              <HeroFeatureText />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

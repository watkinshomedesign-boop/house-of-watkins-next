"use client";

import type { HomePageHeroSlot, HomePageMediaSlots, HomePageSlots } from "@/lib/homePage/types";
import { urlForImage } from "@/lib/sanity/image";
import { FilterSidebar, type CatalogFilterState } from "@/sections/FilterSidebar";
import { MobileHeroCarousel } from "@/sitePages/home/mobile/MobileHeroCarousel";
import { MobilePopularPlans } from "@/sitePages/home/mobile/MobilePopularPlans.client";
import { MobileDesignSecrets } from "@/sitePages/home/mobile/MobileDesignSecrets.client";
import { MobileWelcomeSection } from "@/sitePages/home/mobile/MobileWelcomeSection";
import { MobileLeadCaptureSection } from "@/sitePages/home/mobile/MobileLeadCaptureSection";
import { MobileFooter } from "@/sitePages/home/mobile/MobileFooter";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

import iconCartBlack from "../../assets/Final small icon images black svg/Icon shopping cart-black.svg";
import iconArrowTopRightBlack from "../../assets/Final small icon images black svg/Icon arrow top right-black.svg";
import iconToolsBlack from "../../assets/Final small icon images black svg/Icon tools-black.svg";
import iconSearch from "../../assets/search Icon.png";

function imgSrc(mod: unknown): string {
  return (mod as any)?.src ?? (mod as any);
}

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
  const urls = raw.map((img) => heroImageUrl(img)).filter((u): u is string => Boolean(u));

  if (urls.length >= 5) return urls.slice(0, 5);

  const fill = fallback || "/placeholders/plan-hero.svg";
  const padded = [...urls];
  while (padded.length < 5) padded.push(fill);
  return padded;
}

function heroCopy(hero?: HomePageHeroSlot) {
  return {
    line1: hero?.headlineLine1 || "Design that feels like ",
    line2: hero?.headlineLine2 || "home",
    subhead:
      hero?.subhead ||
      "Collaborate directly with David Watkins, an award-winning designer\nwith over 30 years of experience, to customize a design that's\ntailored to your unique lifestyle, location, and budget.",
    ctaLabel: hero?.ctaLabel || "CHOOSE HOUSE",
    ctaUrl: hero?.ctaUrl || "/catalog",
  };
}

const DEFAULT_FILTERS: CatalogFilterState = {
  bedrooms: [],
  office: false,
  casita: false,
  baths: [],
  bigWindows: null,
  garages: [],
  rv: false,
  sideLoad: false,
  stories: [],
  bonusRoom: false,
  basement: false,
  maxSqft: null,
  maxWidth: null,
  maxDepth: null,
  styles: [],
};

const MOBILE_DESIGN_WIDTH_PX = 400;

export function HomePageMobile(props: { cms?: HomePageSlots }) {
  const router = useRouter();
  const hero = heroCopy(props.cms?.hero);
  const bgSrc = heroImageUrl(props.cms?.hero?.heroImage);
  const headshotSrc = heroImageUrl(props.cms?.hero?.headshotImage);
  const headshotAlt = props.cms?.hero?.headshotImageAlt || "Portrait";
  const carouselUrls = heroCarouselImageUrls(props.cms?.media, bgSrc);

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [filterState, setFilterState] = useState<CatalogFilterState>(DEFAULT_FILTERS);
  const [mobileFilterDraft, setMobileFilterDraft] = useState<CatalogFilterState>(DEFAULT_FILTERS);
  const scrollRestoreYRef = useRef(0);
  const [homeQuery, setHomeQuery] = useState("");

  const canvasRef = useRef<HTMLDivElement | null>(null);
  const scaleRef = useRef(1);
  const [scale, setScale] = useState(() => {
    if (typeof window === "undefined") return 1;
    return window.innerWidth / MOBILE_DESIGN_WIDTH_PX;
  });
  const [scaledHeightPx, setScaledHeightPx] = useState(() => {
    if (typeof window === "undefined") return 800;
    return window.innerHeight;
  });

  const recalcScaleAndHeight = useCallback(() => {
    const nextScale = window.innerWidth / MOBILE_DESIGN_WIDTH_PX;
    const stableScale = Number.isFinite(nextScale) && nextScale > 0 ? nextScale : 1;
    scaleRef.current = stableScale;
    setScale(stableScale);

    const contentHeight = canvasRef.current?.scrollHeight ?? 0;
    if (contentHeight > 0) setScaledHeightPx(Math.ceil(contentHeight * stableScale));
  }, []);

  useEffect(() => {
    if (!mobileFiltersOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileFiltersOpen]);

  useEffect(() => {
    recalcScaleAndHeight();
    window.addEventListener("resize", recalcScaleAndHeight);
    return () => window.removeEventListener("resize", recalcScaleAndHeight);
  }, [recalcScaleAndHeight]);

  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      const h = el.scrollHeight;
      if (h > 0) setScaledHeightPx(Math.ceil(h * scaleRef.current));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  function closeMobileFilters() {
    setMobileFiltersOpen(false);
    requestAnimationFrame(() => window.scrollTo(0, scrollRestoreYRef.current));
  }

  function goToHousePlans(nextFilters: CatalogFilterState) {
    const sp = new URLSearchParams();
    const q = homeQuery.trim();
    if (q) sp.set("q", q);
    sp.set("filters", JSON.stringify(nextFilters));
    router.push(`/house-plans?${sp.toString()}`);
  }

  return (
    <div className="bg-white text-zinc-800 font-gilroy overflow-x-hidden">
      <div className="block md:hidden">
        <div className="relative w-full overflow-hidden" style={{ height: scaledHeightPx }}>
          <div style={{ height: scaledHeightPx }} />
          <div
            ref={canvasRef}
            style={{
              position: "absolute",
              top: 0,
              left: "50%",
              width: MOBILE_DESIGN_WIDTH_PX,
              transform: `translateX(-50%) scale(${scale})`,
              transformOrigin: "top center",
              willChange: "transform",
            }}
          >
            <div className="relative w-full">
              <MobileHeroCarousel imageUrls={carouselUrls} alt={props.cms?.hero?.heroImageAlt} />

              <div className="pointer-events-none absolute left-0 right-0 top-0 z-10 px-4 pt-4">
                <div className="flex items-start justify-between">
                  <Link href="/" className="pointer-events-auto inline-flex items-center" aria-label="Home">
                    <Image
                      src="/brand/Logo%20Images/Logo%20Stacked.png"
                      alt="House of Watkins"
                      width={200}
                      height={48}
                      className="h-[36px] w-auto invert"
                      priority
                    />
                  </Link>

                  <div className="pointer-events-auto flex items-center gap-3">
                    <Link
                      href="/cart"
                      className="relative flex h-10 w-10 items-center justify-center focus:outline-none focus:ring-2 focus:ring-[#FF5C02] focus:ring-offset-2"
                      aria-label="Cart"
                    >
                      <Image
                        src={imgSrc(iconCartBlack)}
                        alt=""
                        aria-hidden="true"
                        width={22}
                        height={22}
                        className="h-[22px] w-[22px] invert"
                        draggable={false}
                      />
                      <span className="absolute right-1.5 top-1.5 h-2.5 w-2.5 rounded-full bg-[#FF5C02]" />
                    </Link>

                    <button
                      type="button"
                      aria-label="Menu"
                      className="flex h-10 w-10 items-center justify-center focus:outline-none focus:ring-2 focus:ring-[#FF5C02] focus:ring-offset-2"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        className="h-9 w-9 text-white"
                        aria-hidden="true"
                      >
                        <path d="M4 7h16" />
                        <path d="M4 12h16" />
                        <path d="M4 17h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              <div className="pointer-events-none absolute left-0 right-0 bottom-0 z-10 px-4 pb-[82px]">
                <div className="flex items-center justify-between gap-4">
                  <div className="max-w-[160px] origin-left translate-y-[37px] scale-[0.8] text-[18px] leading-[26px] font-medium text-neutral-900">
                    Take the guesswork out of designing your dream home.
                  </div>

                  <a
                    href={hero.ctaUrl}
                    className="pointer-events-auto inline-flex h-[56px] w-[230px] translate-x-[5px] translate-y-[15px] items-center justify-between gap-4 rounded-full bg-[#FF5C02] pl-6 pr-3 text-[14px] font-semibold tracking-wide text-white transition-transform duration-150 active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-[#FF5C02] focus:ring-offset-2"
                  >
                    <span className="whitespace-nowrap">{hero.ctaLabel}</span>
                    <span className="flex h-[44px] w-[44px] items-center justify-center rounded-full bg-white">
                      <Image
                        src={imgSrc(iconArrowTopRightBlack)}
                        alt=""
                        aria-hidden="true"
                        width={18}
                        height={18}
                        className="h-[18px] w-[18px]"
                        draggable={false}
                      />
                    </span>
                  </a>
                </div>
              </div>
            </div>

            <div className="relative -mt-[60px] px-4 pt-8">
              <div className="text-[52px] leading-[54px] font-semibold tracking-tight">
                <div>{hero.line1}</div>
                <div>{hero.line2}</div>
              </div>

              {headshotSrc ? (
                <div className="pointer-events-none absolute right-4 top-[98px] translate-x-[-8px] -translate-y-[6px]">
                  <div className="h-[140px] w-[140px] overflow-hidden rounded-full">
                    <img src={headshotSrc} alt={headshotAlt} className="h-full w-full object-cover" draggable={false} />
                  </div>
                </div>
              ) : null}

              <div className="mt-6 max-w-[320px] text-[16px] leading-[24px] font-semibold tracking-wide text-neutral-900">
                WE FOCUS ON PERSONAL COLLABORATION, ENSURING EVERY DETAIL OF YOUR HOME IS TRULY YOURS.
              </div>

              <div className="mt-4 text-[14px] leading-[20px] text-neutral-700">{hero.subhead.replace(/\s*\n\s*/g, " ")}</div>

              <div className="mt-12 text-[44px] leading-[46px] font-semibold tracking-tight text-neutral-900">
                <div>Find something</div>
                <div>you&apos;ll love</div>
              </div>

              <div className="mt-6">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    goToHousePlans(filterState);
                  }}
                  className="flex h-[58px] w-full items-center rounded-full border border-neutral-200 bg-white pl-6 shadow-sm"
                >
                  <button type="submit" aria-label="Search" className="flex items-center justify-center">
                    <Image src={imgSrc(iconSearch)} alt="" aria-hidden="true" width={24} height={24} className="h-6 w-6" draggable={false} />
                  </button>

                  <input
                    type="text"
                    placeholder="Search plans"
                    value={homeQuery}
                    onChange={(e) => setHomeQuery(e.target.value)}
                    className="ml-4 flex-1 bg-transparent text-[16px] text-neutral-900 placeholder:text-neutral-400 focus:outline-none"
                  />

                  <div className="h-full w-[72px] border-l border-neutral-200">
                    <button
                      type="button"
                      aria-label="Filters"
                      className="flex h-full w-full items-center justify-center rounded-r-full"
                      onClick={() => {
                        scrollRestoreYRef.current = window.scrollY;
                        setMobileFilterDraft(filterState);
                        setMobileFiltersOpen(true);
                      }}
                    >
                      <Image
                        src={imgSrc(iconToolsBlack)}
                        alt=""
                        aria-hidden="true"
                        width={22}
                        height={22}
                        className="h-[22px] w-[22px]"
                        style={{
                          filter:
                            "brightness(0) saturate(100%) invert(43%) sepia(95%) saturate(2040%) hue-rotate(2deg) brightness(103%) contrast(103%)",
                        }}
                        draggable={false}
                      />
                    </button>
                  </div>
                </form>
              </div>

              <div className="mt-10">
                <div className="text-[24px] leading-[30px] font-semibold">Popular house plans</div>
                <div className="mt-4">
                  <MobilePopularPlans />
                </div>
              </div>

              <div className="mt-10">
                <MobileDesignSecrets cms={props.cms} />
              </div>

              <div className="mt-10">
                <div className="text-[24px] leading-[30px] font-semibold">Welcome to House of Watkins</div>
                <div className="mt-4">
                  <MobileWelcomeSection media={props.cms?.media} />
                </div>
              </div>

              <div className="mt-10">
                <MobileLeadCaptureSection media={props.cms?.media} />
              </div>
            </div>

            <div className="mt-10">
              <MobileFooter />
            </div>

            {mobileFiltersOpen ? (
              <div className="fixed inset-0 z-50">
                <button type="button" aria-label="Close filters" onClick={closeMobileFilters} className="absolute inset-0 bg-black/40" />
                <div className="absolute inset-x-0 bottom-0 top-0 flex w-full flex-col bg-white">
                  <div className="flex-1 overflow-y-auto px-4 py-6">
                    <FilterSidebar
                      state={mobileFilterDraft}
                      onChange={(patch) => setMobileFilterDraft((st) => ({ ...st, ...patch }))}
                      onClearAll={() => {
                        setMobileFilterDraft(DEFAULT_FILTERS);
                        setFilterState(DEFAULT_FILTERS);
                      }}
                      onClose={closeMobileFilters}
                      onShowResults={() => {
                        setFilterState(mobileFilterDraft);
                        closeMobileFilters();
                        goToHousePlans(mobileFilterDraft);
                      }}
                      showResultsLabel="Show results"
                      hideHeaderClearAll
                    />
                  </div>

                  <div className="sticky bottom-0 border-t border-stone-200 bg-white px-4 pb-[calc(env(safe-area-inset-bottom)+16px)] pt-4">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        className="w-full rounded-full border border-stone-200 px-5 py-3 text-sm font-semibold"
                        onClick={() => {
                          setMobileFilterDraft(DEFAULT_FILTERS);
                          setFilterState(DEFAULT_FILTERS);
                        }}
                      >
                        CLEAR ALL
                      </button>
                      <button
                        type="button"
                        className="w-full rounded-full bg-orange-600 px-5 py-3 text-sm font-semibold text-white"
                        onClick={() => {
                          setFilterState(mobileFilterDraft);
                          closeMobileFilters();
                          goToHousePlans(mobileFilterDraft);
                        }}
                      >
                        SHOW RESULTS
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePageMobile;

"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useEffect, useMemo, useState, type ReactNode } from "react";

import { usePlan } from "@/lib/planContext";
import { PdpProvider, type PlanSetConfig, type PlanSetId, usePdp } from "@/lib/pdpState";
import { useTypographyStyle } from "@/lib/typographyContext";
import { getTextStyleCss } from "@/lib/typography";
import { useCart } from "@/lib/cart/CartContext";
import { FavoritesProvider } from "@/lib/favorites/useFavorites";
import { usePlansCache, type CachedPlan } from "@/lib/plans/PlansCache";

import { PlanChangeDescriptionModal } from "@/components/PlanChangeDescriptionModal";

import { ImageLightbox } from "@/components/ImageLightbox";
import { FavoriteButton } from "@/components/favorites/FavoriteButton";
import { PlanImage } from "@/components/media/PlanImage";
import { MobileFooter } from "@/sitePages/home/mobile/MobileFooter";

import iconBed from "../../assets/Final small icon images black svg/Icon bed-black.svg";
import iconBath from "../../assets/Final small icon images black svg/Icon bath-black.svg";
import iconGarage from "../../assets/Final small icon images black svg/Icon garage-black.svg";
import iconCart from "../../assets/Final small icon images black svg/Icon shopping cart-black.svg";

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

function formatUsdFromCents(cents: number | null | undefined) {
  const dollars = Math.round((Number(cents) || 0) / 100);
  return `$${dollars.toLocaleString()}`;
}

function formatFeetInches(feetFloat: number | null | undefined) {
  const raw = Number(feetFloat);
  if (!Number.isFinite(raw) || raw <= 0) return "-";
  const feet = Math.floor(raw);
  const inches = Math.round((raw - feet) * 12);
  if (!Number.isFinite(inches)) return `${feet} ft`;
  return `${feet}'-${Math.max(0, inches)}\"`;
}

function startingPriceUsdFallback(heatedSqft: number) {
  const price = 1250 + 0.65 * heatedSqft;
  return `$${Math.round(price).toLocaleString()}`;
}

function imgSrc(mod: unknown): string {
  return (mod as any)?.src ?? (mod as any);
}

function isUnoptimizedImage(src: string) {
  const s = String(src || "");
  return (
    s.startsWith("/") ||
    s.startsWith("http://localhost") ||
    s.startsWith("https://localhost") ||
    s.startsWith("http://127.0.0.1") ||
    s.startsWith("https://127.0.0.1") ||
    s.includes(".supabase.co/") ||
    s.includes("/storage/v1/object/public/")
  );
}

function trendingScore(p: CachedPlan) {
  return (p.stats?.purchases ?? 0) * 100 + (p.stats?.favorites ?? 0) * 10 + (p.stats?.views ?? 0);
}

function trendingStartingPriceUsd(heatedSqft: number) {
  const price = 1250 + 0.65 * heatedSqft;
  return `$${Math.round(price).toLocaleString()}`;
}

function trendingSafeImageSrc(p: CachedPlan) {
  const front = String(p.cardImages?.front ?? "").trim();
  const plan = String(p.cardImages?.plan ?? "").trim();
  return front || plan || "/placeholders/plan-hero.svg";
}

function MobileTrendingPlans(props: { excludeSlug?: string }) {
  const { plans, loading, error } = usePlansCache();

  const top = useMemo(() => {
    const filtered = (plans ?? []).filter((p) => String(p.slug) && String(p.slug) !== String(props.excludeSlug || ""));
    const sorted = [...filtered].sort((a, b) => {
      const score = trendingScore(b) - trendingScore(a);
      if (score !== 0) return score;
      const sqft = Number(b.heated_sqft ?? 0) - Number(a.heated_sqft ?? 0);
      if (sqft !== 0) return sqft;
      return String(a.slug || "").localeCompare(String(b.slug || ""));
    });

    return sorted.slice(0, 3);
  }, [plans, props.excludeSlug]);

  if (loading) return null;
  if (error) return null;
  if (top.length === 0) return null;

  return (
    <div className="flex flex-col gap-6">
      {top.map((p) => {
        const img = trendingSafeImageSrc(p);
        const price = trendingStartingPriceUsd(Number(p.heated_sqft ?? 0));
        const sqft = `${Number(p.heated_sqft ?? 0).toLocaleString()} Sq Ft`;
        return (
          <Link
            key={p.id || p.slug}
            href={`/house/${p.slug}`}
            className="block overflow-hidden rounded-[28px] bg-stone-50 p-4"
          >
            <div className="relative">
              <PlanImage src={img} alt="" sizes="(max-width: 767px) 100vw, 480px" rounded={false} className="rounded-[24px]" />
              {p.slug ? <FavoriteButton planSlug={p.slug} /> : null}
            </div>

            <div className="mt-4 flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-600 text-white">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden="true">
                  <path d="M4 11l8-7 8 7" />
                  <path d="M5 10v10h14V10" />
                  <path d="M9 20v-6h6v6" />
                </svg>
              </div>

              <div className="min-w-0">
                <div className="truncate text-[14px] font-semibold text-[#2D2D2D]">{p.name}</div>
                <div className="mt-1 text-[12px] font-medium text-[#9A9A9A]">{sqft}</div>
              </div>

              <div className="ml-auto flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-orange-600">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden="true">
                  <path d="M7 17L17 7" />
                  <path d="M7 7h10v10" />
                </svg>
              </div>
            </div>

            <div className="mt-4">
              <div className="text-[12px] font-medium text-[#9A9A9A]">starting at</div>
              <div className="mt-1 text-[18px] font-semibold text-orange-600">{price}</div>
            </div>

            <div className="mt-4 flex flex-wrap gap-3">
              <MobileSpecPill iconSrc={imgSrc(iconBed)} label={`${p.beds ?? "-"} Beds`} />
              <MobileSpecPill iconSrc={imgSrc(iconBath)} label={`${p.baths ?? "-"} Bath`} />
              <MobileSpecPill iconSrc={imgSrc(iconGarage)} label={`${p.garage_bays ?? "-"} Garage`} />
            </div>
          </Link>
        );
      })}
    </div>
  );
}

function MobileSpecPill(props: { iconSrc: string; label: string }) {
  return (
    <div className="inline-flex items-center whitespace-nowrap rounded-full border border-neutral-200 bg-white px-3 py-[6px] text-[13px] font-normal text-[#666666]">
      <Image
        src={props.iconSrc}
        alt=""
        aria-hidden="true"
        width={14}
        height={14}
        className="mr-[6px] h-[14px] w-[14px]"
        draggable={false}
      />
      <span>{props.label}</span>
    </div>
  );
}

const MOBILE_PDP_TABS: Array<{ id: "overview" | "description" | "plans" | "build" | "gallery" | "order"; label: string }> = [
  { id: "overview", label: "Overview" },
  { id: "description", label: "Description" },
  { id: "plans", label: "Included" },
  { id: "build", label: "Design Principles" },
  { id: "gallery", label: "Gallery" },
  { id: "order", label: "Order" },
];

function MobilePdpTabs() {
  const { tab, setTab } = usePdp();

  return (
    <div className="flex w-full items-center justify-between overflow-x-auto border-b border-stone-200 pb-3">
      {MOBILE_PDP_TABS.map((t) => {
        const active = tab === t.id;
        return (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={
              "relative shrink-0 pb-3 text-[14px] font-semibold leading-none " +
              (active ? "text-orange-600" : "text-[#2D2D2D]")
            }
            aria-current={active ? "page" : undefined}
          >
            <span>{t.label}</span>
            {active ? <span className="absolute inset-x-0 -bottom-[13px] h-[2px] bg-orange-600" /> : null}
          </button>
        );
      })}
    </div>
  );
}

function MobilePdpDetailSection(props: {
  title: string;
  rows: Array<{ label: string; value: ReactNode }>;
}) {
  return (
    <div className="pt-5">
      <div className="text-[13px] font-semibold text-[#2D2D2D]">{props.title}</div>
      <div className="mt-3 space-y-3">
        {props.rows.map((r) => (
          <div key={r.label} className="flex items-center text-[13px]">
            <div className="shrink-0 text-[#9A9A9A] font-medium">{r.label}</div>
            <div className="mx-3 h-0 flex-1 border-b border-dotted border-stone-300" />
            <div className="shrink-0 text-[#2D2D2D] font-semibold">{r.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MobilePdpHeader() {
  return (
    <header className="w-full bg-white">
      <div className="flex h-[58px] items-center justify-between px-4">
        <Link href="/" className="inline-flex items-center">
          <Image
            src="/brand/Logo%20Images/House-of-Watkins-Logo-black.png"
            alt="House of Watkins"
            width={180}
            height={22}
            className="h-[22px] w-auto"
            priority
          />
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href="/cart"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-orange-600"
            aria-label="Cart"
          >
            <Image
              src={imgSrc(iconCart)}
              alt=""
              aria-hidden="true"
              width={18}
              height={18}
              className="h-[18px] w-[18px]"
              draggable={false}
            />
          </Link>

          <button
            type="button"
            aria-label="Menu"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-orange-600"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              className="h-[18px] w-[18px] text-zinc-900"
              aria-hidden="true"
            >
              <path d="M4 6h16" />
              <path d="M4 12h16" />
              <path d="M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}

function MobileAddToCartButton(props: { className?: string; variant?: "cta" }) {
  const plan = usePlan();
  const { addItem } = useCart();
  const router = useRouter();
  const { selections, planSetOptions, canAddToCart } = usePdp();

  const planSet = planSetOptions.find((o) => o.id === selections.planSetId) ?? null;

  function onClick() {
    if (!canAddToCart || !planSet) {
      window.alert("Please select a Plan Set.");
      return;
    }

    addItem({
      slug: plan.slug,
      name: plan.name,
      heated_sqft: plan.heated_sqft,
      license_type: planSet.license,
      addons: {
        ...(planSet.addOns ?? {}),
        ...(selections.addOns ?? {}),
      },
      rush: false,
      paper_sets: planSet.paperSets,
      qty: 1,
    });

    fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event_name: "add_to_cart", plan_slug: plan.slug }),
    }).catch(() => {
      // ignore
    });

    router.push("/cart");
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!canAddToCart}
      className={
        "inline-flex w-full cursor-pointer items-center justify-center disabled:cursor-not-allowed disabled:opacity-50 " +
        (props.variant === "cta"
          ? "h-[52px] rounded-full bg-orange-600 text-[14px] font-semibold text-white hover:bg-orange-700 "
          : "h-[50px] rounded-[25px] bg-[#FF6B35] text-[14px] font-medium text-white hover:bg-[#e85f2f] ") +
        (props.className || "")
      }
    >
      {props.variant === "cta" ? (
        <span className="inline-flex items-center gap-3">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-[18px] w-[18px]" aria-hidden="true">
            <path d="M6 6h15l-1.5 9h-13z" />
            <path d="M6 6l-2-3H1" />
            <path d="M9 22a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" />
            <path d="M18 22a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" />
          </svg>
          <span className="uppercase">Add to cart</span>
        </span>
      ) : (
        "Add to cart"
      )}
    </button>
  );
}

function ProductDetailsMobileInner() {
  const plan = usePlan();
  const { tab, planSetOptions, selections, setPlanSetId, toggleAddOn, quote, quoteLoading } = usePdp();
  const { planChangeDescription, setPlanChangeDescription } = useCart();

  const [planChangeModalOpen, setPlanChangeModalOpen] = useState(false);
  const [planChangeModalKey, setPlanChangeModalKey] = useState<
    "smallAdjustments" | "minorChanges" | "additions" | null
  >(null);
  const [planChangeModalLabel, setPlanChangeModalLabel] = useState<string>("");

  function requestToggleAddOn(
    key: "readableReverse" | "sitePlan" | "smallAdjustments" | "minorChanges" | "additions",
    label: string,
  ) {
    const enabled = Boolean(selections.addOns?.[key]);
    const isPlanChange = key === "smallAdjustments" || key === "minorChanges" || key === "additions";

    if (isPlanChange && !enabled && !planChangeDescription.trim()) {
      setPlanChangeModalKey(key);
      setPlanChangeModalLabel(label);
      setPlanChangeModalOpen(true);
      return;
    }

    toggleAddOn(key);
  }

  const titleStyle = useTypographyStyle("house.hero.title", "Title/28");
  const overviewDescriptionStyle = useTypographyStyle("house.overview.description", "Body/15");

  const hero =
    (plan as any).galleryImages?.[0] ||
    plan.images?.gallery?.[0] ||
    "/placeholders/plan-hero.svg";

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
    const raw = [...gResolved, ...gLegacy, ...fpResolved, ...fpLegacy, ...extraPlanMedia];
    const resolved = raw.map(resolvePublicImageUrl).filter(Boolean) as string[];
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

  const buildExteriorImageSrc =
    (plan as any).buildFeatureExteriorUrl || (plan as any).buildFeatureExterior || "/build/build-feature-exterior.jpg";
  const buildFloorplanImageSrc =
    (plan as any).buildFeatureFloorplanUrl || (plan as any).buildFeatureFloorplan || "/build/build-feature-floorplan.jpg";

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const metaSqft = `${plan.heated_sqft.toLocaleString()} sq ft`;
  const beds = plan.beds ?? null;
  const baths = plan.baths ?? null;
  const garages = plan.garage_bays ?? null;
  const stories = plan.stories ?? null;

  const floorplanSrc = useMemo(() => {
    const fpResolved = Array.isArray((plan as any).floorplanImages) ? (((plan as any).floorplanImages ?? []) as any[]) : [];
    const fpLegacy = Array.isArray(plan.images?.floorplan) ? (plan.images?.floorplan ?? []) : [];
    const first = (fpResolved[0] ?? fpLegacy[0]) as any;
    return resolvePublicImageUrl(first) || null;
  }, [plan]);

  const frontSrc = viewAllMedia[0] || "/placeholders/plan-hero.svg";
  const frontIndex = imageIndexBySrc.get(frontSrc) ?? 0;
  const floorIndex = floorplanSrc ? (imageIndexBySrc.get(floorplanSrc) ?? frontIndex) : frontIndex;

  const currentPrice = quote?.subtotalCents ? formatUsdFromCents(quote.subtotalCents) : startingPriceUsdFallback(plan.heated_sqft);

  return (
    <div className="bg-white text-zinc-800 font-gilroy">
      <MobilePdpHeader />

      <ImageLightbox
        open={lightboxOpen}
        images={viewAllMedia}
        index={lightboxIndex}
        onClose={() => setLightboxOpen(false)}
        onIndexChange={setLightboxIndex}
      />

      <main className="px-4 pb-6">
        <div className="pt-[14px]">
          <div className="text-[12px] font-normal text-[#757575] whitespace-nowrap overflow-hidden">
            <Link href="/" className="text-[#FF6B35]">
              Main
            </Link>
            <span className="mx-1 text-[#B0B0B0]">/</span>
            <Link href="/catalog" className="text-[#757575]">
              House plans
            </Link>
          </div>

          <section className="mt-[6px]">
            <div className="text-[30px] font-semibold leading-[36px] text-[#1A1A1A]">
              <span style={getTextStyleCss(titleStyle)}>{plan.name}</span>
            </div>
            <div className="mt-1 text-[13px] font-normal text-[#888888]">{metaSqft}</div>

            <div className="mt-3 flex items-center gap-5">
              <MobileSpecPill iconSrc={imgSrc(iconBed)} label={`${beds ?? "-"} Beds`} />
              <MobileSpecPill iconSrc={imgSrc(iconBath)} label={`${baths ?? "-"} Baths`} />
              <MobileSpecPill iconSrc={imgSrc(iconGarage)} label={`${garages ?? "-"} Garage`} />
            </div>
          </section>

          <section className="mt-4">
            <div className="overflow-hidden rounded-[28px] bg-neutral-100">
              <button
                type="button"
                aria-label="Open front elevation"
                className="block w-full"
                onClick={() => {
                  setLightboxIndex(frontIndex);
                  setLightboxOpen(true);
                }}
              >
                <div className="relative w-full aspect-[3/2] bg-neutral-100">
                  <Image
                    src={frontSrc}
                    alt=""
                    fill
                    sizes="(max-width: 480px) 100vw, 480px"
                    unoptimized={isUnoptimizedImage(frontSrc)}
                    className="object-cover"
                    draggable={false}
                  />
                </div>
              </button>

              <button
                type="button"
                aria-label="Open floor plan"
                className="block w-full"
                onClick={() => {
                  setLightboxIndex(floorIndex);
                  setLightboxOpen(true);
                }}
                disabled={!floorplanSrc}
              >
                <div className="relative w-full aspect-[3/2] bg-white">
                  <Image
                    src={floorplanSrc || frontSrc}
                    alt=""
                    fill
                    sizes="(max-width: 480px) 100vw, 480px"
                    unoptimized={isUnoptimizedImage(floorplanSrc || frontSrc)}
                    className="object-contain"
                    draggable={false}
                  />
                </div>
              </button>
            </div>

            <button
              type="button"
              className="mt-3 inline-flex h-[52px] w-full items-center justify-center rounded-full bg-[#2D2D2D] text-[14px] font-semibold text-white"
              onClick={() => {
                setLightboxIndex(frontIndex);
                setLightboxOpen(true);
              }}
            >
              VIEW ALL ({viewAllMedia.length})
            </button>
          </section>

          <section className="mt-4 rounded-[28px] bg-stone-50 p-5">
            <div className="flex items-baseline gap-3">
              <div className="text-[14px] font-semibold text-stone-500">Starting at</div>
              <div className="text-[28px] font-semibold text-orange-600">{currentPrice}</div>
              <div className="ml-auto text-[12px] text-stone-400">{quoteLoading ? "Updating…" : ""}</div>
            </div>

            <div className="mt-4 flex flex-wrap gap-3">
              <MobileSpecPill iconSrc={imgSrc(iconBed)} label={`${beds ?? "-"} Beds`} />
              <MobileSpecPill iconSrc={imgSrc(iconBath)} label={`${baths ?? "-"} Bath`} />
              <MobileSpecPill iconSrc={imgSrc(iconGarage)} label={`${garages ?? "-"} Garage`} />
              <div className="inline-flex items-center whitespace-nowrap rounded-full border border-neutral-200 bg-white px-3 py-[6px] text-[13px] font-normal text-[#666666]">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-[6px] h-[14px] w-[14px]" aria-hidden="true">
                  <path d="M4 20V10l8-6 8 6v10" />
                  <path d="M9 20v-6h6v6" />
                </svg>
                <span>{stories ?? "-"} Story</span>
              </div>
            </div>

            <div className="mt-5 space-y-3 text-[13px]">
              {[
                { label: "Total Area", value: `${plan.heated_sqft.toLocaleString()} Sq Ft` },
                { label: "Width", value: formatFeetInches(plan.width_ft) },
                { label: "Depth", value: formatFeetInches(plan.depth_ft) },
                { label: "Max Ridge Height", value: "18'-7\"" },
              ].map((row) => (
                <div key={row.label} className="flex items-center text-stone-600">
                  <div className="shrink-0 font-medium text-stone-500">{row.label}</div>
                  <div className="mx-3 h-0 flex-1 border-b border-dotted border-stone-300" />
                  <div className="shrink-0 font-semibold text-stone-800">{row.value}</div>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <div className="text-[13px] font-semibold text-stone-600">Plan Set</div>
              <div className="mt-2">
                <select
                  value={selections.planSetId ?? ""}
                  onChange={(e) => setPlanSetId((e.target.value || null) as PlanSetId | null)}
                  className="h-[50px] w-full rounded-full border border-stone-200 bg-white px-4 text-[14px] font-semibold text-stone-700 outline-none"
                >
                  <option value="" disabled>
                    Select a plan
                  </option>
                  {planSetOptions.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-5">
              <div className="text-[13px] font-semibold text-stone-600">Options</div>
              <details className="mt-2">
                <summary className="list-none">
                  <div className="flex h-[50px] w-full items-center justify-between rounded-full border border-stone-200 bg-white px-4 text-[14px] font-semibold text-stone-700">
                    <span>Options add-on</span>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </div>
                </summary>
                <div className="mt-3 space-y-2 rounded-[18px] border border-stone-200 bg-white p-4">
                  {[
                    { key: "readableReverse" as const, label: "Readable Reverse" },
                    { key: "sitePlan" as const, label: "Site Plan" },
                    { key: "smallAdjustments" as const, label: "Small Adjustments" },
                    { key: "minorChanges" as const, label: "Minor Changes" },
                    { key: "additions" as const, label: "Additions" },
                  ].map((a) => (
                    <label key={a.key} className="flex items-center justify-between gap-3 text-[14px] text-stone-700">
                      <span className="flex items-center gap-1 font-semibold">
                        <span>{a.label}</span>
                        {a.key === "smallAdjustments" || a.key === "minorChanges" || a.key === "additions" ? (
                          <a
                            href="#plan-change-definitions"
                            className="text-orange-600"
                            onMouseDown={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                            }}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              const el = document.getElementById("plan-change-definitions");
                              if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                            }}
                          >
                            *
                          </a>
                        ) : null}
                      </span>
                      <input
                        type="checkbox"
                        checked={Boolean(selections.addOns?.[a.key])}
                        onChange={() => requestToggleAddOn(a.key, a.label)}
                        className="h-5 w-5 accent-orange-600"
                      />
                    </label>
                  ))}
                </div>
              </details>
            </div>

            <PlanChangeDescriptionModal
              open={planChangeModalOpen}
              optionLabel={planChangeModalLabel}
              initialValue={planChangeDescription}
              onClose={() => setPlanChangeModalOpen(false)}
              onSave={(value) => {
                if (!value) {
                  window.alert("Please describe the request.");
                  return;
                }
                if (!planChangeModalKey) return;
                setPlanChangeDescription(value);
                toggleAddOn(planChangeModalKey);
                setPlanChangeModalOpen(false);
              }}
            />

            <div className="mt-6">
              <MobileAddToCartButton variant="cta" />
            </div>
          </section>

          <section className="mt-8">
            <MobilePdpTabs />

            {tab === "overview" ? (
              <div className="pt-5">
                <div>
                  <div className="text-[12px] font-medium text-[#9A9A9A]">Name of Project</div>
                  <div className="mt-2 text-[16px] font-semibold leading-[22px] text-[#2D2D2D]">{plan.name}</div>
                </div>

                <div className="mt-6 border-t border-stone-200" />

                <MobilePdpDetailSection
                  title="Square Footage Breakdown"
                  rows={[
                    { label: "Total Heated Area", value: `${plan.heated_sqft.toLocaleString()} Sq Ft` },
                    { label: "1st Floor", value: `${plan.heated_sqft.toLocaleString()} Sq Ft` },
                    { label: "Covered Patio", value: "92 Sq Ft" },
                    { label: "Entry", value: "30 Sq Ft" },
                    { label: "Porch, Front", value: "42 Sq Ft" },
                  ]}
                />

                <MobilePdpDetailSection
                  title="Beds/Baths"
                  rows={[
                    { label: "Bedrooms", value: String(plan.beds ?? "-") },
                    { label: "Full bathrooms", value: String(plan.baths ?? "-") },
                  ]}
                />

                <MobilePdpDetailSection title="Exterior Walls" rows={[{ label: "Standard Type(s)", value: "2x6" }]} />

                <MobilePdpDetailSection
                  title="Garage"
                  rows={[
                    { label: "Type", value: "Attached" },
                    { label: "Area", value: "446 sq. ft." },
                    { label: "Count", value: String(plan.garage_bays ?? "-") },
                    { label: "Entry Location", value: "Front" },
                  ]}
                />

                <MobilePdpDetailSection
                  title="Ceiling Heights"
                  rows={[
                    { label: "First Floor", value: "9 ft." },
                    { label: "Living Room", value: "10' Vaulted" },
                  ]}
                />

                <MobilePdpDetailSection
                  title="Roof Details"
                  rows={[
                    { label: "Primary Pitch", value: "4:12" },
                    { label: "Framing Type", value: "Truss" },
                  ]}
                />
              </div>
            ) : tab === "description" ? (
              <div className="pt-5">
                <div className="text-[12px] font-medium text-[#9A9A9A]">Description</div>
                <div className="mt-2 text-[14px] font-semibold leading-[20px] text-[#2D2D2D]">
                  <span style={getTextStyleCss(overviewDescriptionStyle)}>
                    {String(plan.description || "").trim() || "Description coming soon."}
                  </span>
                </div>
              </div>
            ) : tab === "plans" ? (
              <div className="pt-5">
                <div className="text-[18px] font-semibold leading-[24px] text-[#2D2D2D]">Included in All House Plans</div>
                <div className="mt-3 text-[14px] font-semibold leading-[20px] text-[#2D2D2D]">
                  All Drawings are on 24&quot; x 36&quot; Sheets, Delivered as PDF files via email
                </div>

                <div className="mt-6 space-y-5">
                  {[
                    {
                      title: "Cover Sheet",
                      items: ["3D Rendering", "Page Index", "Sq. Ft. Calculations"],
                    },
                    {
                      title: "Floor Plans",
                      items: [
                        "Depiction and locations of walls, windows, doors, fixtures and appliances",
                        "Labeled rooms, flooring & shape of ceilings",
                        "Floor elevations (not relating to topography)",
                        "Dimensions & other annotation",
                        "Door & Window Schedules w/ notes",
                      ],
                    },
                    {
                      title: "Elevations",
                      items: [
                        "General illustration of door & window styles",
                        "General height of walls, window and door headers",
                        "Depiction & location of siding and a general representation of grading",
                      ],
                    },
                    {
                      title: "Roof Plan",
                      items: [
                        "Depiction and locations of all ridges, valleys, dormers & eaves",
                        "Roof pitch, appropriate annotation, and the Locations and general heights of wall plates.",
                      ],
                    },
                    {
                      title: "Site Plan",
                      items: [
                        "Site description (legal description, property line bearings, north arrow)",
                        "Drawing of Site with proposed house",
                        "Proposed concrete work (driveways, walkways, patios etc.), Area calculation",
                        "Setbacks and easements",
                      ],
                    },
                    {
                      title: "Extra Drawing",
                      items: [
                        "Every county is different and may require something not included in a standard set of plans. We will make an extra drawing if needed. $65 per hour, not to exceed $500.",
                      ],
                    },
                  ].map((sec) => (
                    <div key={sec.title} className="rounded-[20px] border border-stone-200 bg-white p-4">
                      <div className="text-[12px] font-medium text-[#9A9A9A]">{sec.title}</div>
                      <ul className="mt-3 list-disc space-y-2 pl-5 text-[14px] font-semibold leading-[20px] text-[#2D2D2D]">
                        {sec.items.map((it) => (
                          <li key={it}>{it}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            ) : tab === "build" ? (
              <div className="pt-5">
                <div className="text-[18px] font-semibold leading-[24px] text-[#2D2D2D]">Key Features to Look For</div>
                <div className="mt-3 text-[14px] leading-[20px] text-[#2D2D2D]">
                  The ratio of exterior wall to interior sq. ft. determines construction costs and energy efficiency. Exterior walls are expensive. More linear ft of exterior walls = more concrete, more siding, more insulation... It all adds up. Exterior walls also transfer heat and cold. All of the floor plans on this site are designed to have the right balance between curb-appeal and efficiency.
                </div>

                <div className="mt-5 grid grid-cols-1 gap-4">
                  {[
                    { src: buildExteriorImageSrc, caption: "© House of Watkins, LLC" },
                    { src: buildFloorplanImageSrc, caption: "© House of Watkins, LLC" },
                  ].map((img) => (
                    <div key={img.src} className="rounded-[20px] border border-stone-200 bg-white p-4">
                      <div className="relative aspect-[3/2] w-full overflow-hidden rounded-[16px] bg-stone-100">
                        <Image
                          src={img.src}
                          alt=""
                          fill
                          sizes="(max-width: 767px) 100vw, 480px"
                          unoptimized={isUnoptimizedImage(img.src)}
                          className="object-cover"
                        />
                      </div>
                      <div className="mt-3 text-[12px] font-medium text-[#2D2D2D]">{img.caption}</div>
                    </div>
                  ))}
                </div>

                <div className="mt-5 rounded-[20px] border border-orange-600 bg-white p-4">
                  <div className="text-[13px] font-semibold text-[#2D2D2D]">Pro Tip</div>
                  <div className="mt-2 text-[14px] font-semibold leading-[20px] text-[#2D2D2D]">
                    Choose Your Plan Based on the Layout. How Many Bedrooms, How Many Stories, Where the Views are. That&apos;s all for now. We Can Modify the Rest.
                  </div>
                </div>
              </div>
            ) : tab === "gallery" ? (
              <div className="pt-5">
                <div className="grid grid-cols-2 gap-2">
                  {viewAllMedia.map((src, i) => (
                    <button
                      key={`${src}-${i}`}
                      type="button"
                      className="relative aspect-[1/1] w-full overflow-hidden rounded-[16px] bg-stone-100"
                      onClick={() => {
                        setLightboxIndex(i);
                        setLightboxOpen(true);
                      }}
                      aria-label="Open image"
                    >
                      <Image
                        src={src}
                        alt=""
                        fill
                        sizes="(max-width: 767px) 50vw, 240px"
                        unoptimized={isUnoptimizedImage(src)}
                        className="object-cover"
                        draggable={false}
                      />
                    </button>
                  ))}
                </div>
              </div>
            ) : tab === "order" ? (
              <div className="pt-5">
                <div className="text-[18px] font-semibold leading-[24px] text-[#2D2D2D]">Included in a Purchase</div>

                <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-5">
                  {[
                    { k: "Consulting", v: "1 hour" },
                    { k: "General Specifications", v: "1 psc" },
                  ].map((it) => (
                    <div key={it.k}>
                      <div className="text-[12px] font-medium text-[#9A9A9A]">{it.k}</div>
                      <div className="mt-1 text-[14px] font-semibold text-[#2D2D2D]">{it.v}</div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 space-y-4 rounded-[20px] border border-stone-200 bg-white p-4">
                  {[
                    {
                      k: "Floor Plan",
                      v: "Depiction and locations of walls, windows, doors, fixtures and appliances, Labeled rooms, Dimensions, Door & Window Schedules w/ notes",
                    },
                    { k: "Roof Plan", v: "Dimensioned roof layout indicating slopes, roof areas and decorative elements" },
                    { k: "Typical Sections", v: "Cut through the building showing detailed floor, wall, and roof construction elements with specifications" },
                    { k: "Elevations", v: "Shows all sides of the house indicating building elements, specifications and all decorative elements" },
                    { k: "Door and Window Schedule", v: "List of all doors and windows with indicated specifications for manufacturer" },
                  ].map((it) => (
                    <div key={it.k}>
                      <div className="text-[12px] font-medium text-[#9A9A9A]">{it.k}</div>
                      <div className="mt-1 text-[14px] font-semibold leading-[20px] text-[#2D2D2D]">{it.v}</div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 text-[18px] font-semibold leading-[24px] text-[#2D2D2D]">Additional Services</div>
                <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-5">
                  {[
                    { k: "Consulting & Meeting", v: "$125 per hr (beyond first hr)" },
                    { k: "Site Plan", v: "$399" },
                    { k: "3D Renderings", v: "Price varies (free estimate)" },
                    { k: "Electrical Plan", v: "15 cents per sq. ft." },
                    { k: "Furniture Placement", v: "15 cents per sq. ft." },
                    { k: "Special Requests", v: "$65 per hour (not to exceed $500. (free estimate)" },
                  ].map((it) => (
                    <div key={it.k}>
                      <div className="text-[12px] font-medium text-[#9A9A9A]">{it.k}</div>
                      <div className="mt-1 text-[14px] font-semibold leading-[20px] text-[#2D2D2D]">{it.v}</div>
                    </div>
                  ))}
                </div>

                <div id="plan-change-definitions" className="mt-8">
                  <div className="text-[18px] font-semibold leading-[24px] text-[#2D2D2D]">Plan Change Definitions</div>
                  <div className="mt-4 space-y-3 rounded-[20px] border border-stone-200 bg-white p-4">
                    <div>
                      <div className="text-[12px] font-medium text-[#9A9A9A]">Small Adjustments</div>
                      <div className="mt-1 text-[14px] font-semibold leading-[20px] text-[#2D2D2D]">
                        Minor edits to a plan without changing the overall footprint.
                      </div>
                    </div>
                    <div>
                      <div className="text-[12px] font-medium text-[#9A9A9A]">Minor Changes</div>
                      <div className="mt-1 text-[14px] font-semibold leading-[20px] text-[#2D2D2D]">
                        Moderate modifications such as moving/adjusting interior elements.
                      </div>
                    </div>
                    <div>
                      <div className="text-[12px] font-medium text-[#9A9A9A]">Additions</div>
                      <div className="mt-1 text-[14px] font-semibold leading-[20px] text-[#2D2D2D]">
                        Adding new space or rooms that meaningfully changes the plan layout.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="pt-5">
                <div className="rounded-[20px] border border-stone-200 bg-white p-4 text-[14px] leading-[20px] text-[#2D2D2D]">
                  This section is available on desktop under the {MOBILE_PDP_TABS.find((t) => t.id === tab)?.label ?? "selected"} tab.
                </div>
              </div>
            )}
          </section>

          <section className="mt-10">
            <div className="text-[32px] leading-[38px] font-semibold tracking-tight text-[#2D2D2D]">Trending Now</div>
            <div className="mt-6">
              <MobileTrendingPlans excludeSlug={plan.slug} />
            </div>
          </section>
        </div>
      </main>

      <div className="mt-10">
        <MobileFooter />
      </div>
    </div>
  );
}

export function ProductDetailsPageMobile() {
  const plan = usePlan();

  return (
    <FavoritesProvider>
      <PdpProvider slug={plan.slug}>
        <ProductDetailsMobileInner />
      </PdpProvider>
    </FavoritesProvider>
  );
}

export default ProductDetailsPageMobile;

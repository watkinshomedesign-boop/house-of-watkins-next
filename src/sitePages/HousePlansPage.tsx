"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Footer } from "@/sections/Footer";
import { InteriorHeader } from "@/sections/InteriorHeader";
import { HouseGrid } from "@/sections/HouseGrid";
import { FavoritesProvider } from "@/lib/favorites/useFavorites";
import { ContentHeader } from "@/sections/ContentHeader";
import { FilterSidebar, type CatalogFilterState } from "@/sections/FilterSidebar";
import { SearchBar } from "@/sections/Hero/components/SearchBar";
import { ProductCard } from "@/sections/ProductGrid/components/ProductCard";
import { MobileFooter } from "@/sitePages/home/mobile/MobileFooter";
import { PlanGridSkeleton, PlanListSkeleton } from "@/components/PlanCardsSkeleton";
import { HousePlansSalesAgentChat } from "@/components/HousePlansSalesAgentChat";

 import iconX from "../../assets/Final small icon images black svg/Icon X-black.svg";
 import searchIcon from "../../assets/search Icon.png";

type CatalogPlan = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  tour3d_url?: string | null;
  heated_sqft: number;
  beds: number | null;
  baths: number | null;
  stories: number | null;
  garage_bays: number | null;
  width_ft: number | null;
  depth_ft: number | null;
  tags: string[] | null;
  filters: any;
  cardImages: { front: string; plan: string };
  stats: { views: number; favorites: number; purchases: number };
};

type SortKey = "popular" | "size" | "price";

type ViewKey = "front" | "plan";

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

function formatSqft(n: number) {
  return n.toLocaleString();
}

 function imgSrc(mod: unknown): string {
   return (mod as any)?.src ?? (mod as any);
 }

function startingPriceUsd(heatedSqft: number) {
  const price = 1250 + 0.65 * heatedSqft;
  return Math.round(price);
}

function popularScore(p: CatalogPlan) {
  // Tuned to match the existing stats views and provide stable ordering.
  return p.stats.purchases * 100 + p.stats.favorites * 10 + p.stats.views;
}

function toNumberOrNull(v: unknown): number | null {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string" && v.trim() !== "") {
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

function anySelected(arr: string[] | undefined) {
  return Array.isArray(arr) && arr.length > 0;
}

function matchesNumericPick(value: number | null | undefined, picks: string[]) {
  const v = value ?? null;
  if (!anySelected(picks)) return true;
  if (v == null) return false;
  return picks.some((p) => {
    if (p.endsWith("+")) {
      const min = Number(p.slice(0, -1));
      return Number.isFinite(min) ? v >= min : false;
    }
    const n = Number(p);
    return Number.isFinite(n) ? v === n : false;
  });
}

function matchesBathPick(value: number | null | undefined, picks: string[]) {
  const v = value ?? null;
  if (!anySelected(picks)) return true;
  if (v == null) return false;
  return picks.some((p) => {
    if (p === "3+") return v >= 3;
    const n = Number(p);
    return Number.isFinite(n) ? v === n : false;
  });
}

function planMatchesFilters(p: CatalogPlan, state: CatalogFilterState) {
  const f = (p.filters ?? {}) as any;
  const beds = toNumberOrNull(f.beds ?? p.beds);
  const baths = toNumberOrNull(f.baths ?? p.baths);
  const stories = toNumberOrNull(f.stories ?? p.stories);
  const garages = toNumberOrNull(f.garage_bays ?? p.garage_bays);
  const width = toNumberOrNull(f.width_ft ?? p.width_ft);
  const depth = toNumberOrNull(f.depth_ft ?? p.depth_ft);
  const sqft = toNumberOrNull(f.heated_sqft ?? p.heated_sqft);

  if (!matchesNumericPick(beds, state.bedrooms)) return false;
  if (!matchesBathPick(baths, state.baths)) return false;
  if (!matchesNumericPick(stories, state.stories)) return false;
  if (!matchesNumericPick(garages, state.garages)) return false;

  if (state.office && !Boolean(f.office)) return false;
  if (state.casita && !Boolean(f.casita)) return false;
  if (state.rv && !Boolean(f.rv)) return false;
  if (state.sideLoad && !Boolean(f.sideLoad)) return false;
  if (state.bonusRoom && !Boolean(f.bonusRoom)) return false;
  if (state.basement && !Boolean(f.basement)) return false;

  if (state.bigWindows && String(f.bigWindows ?? "").toLowerCase() !== state.bigWindows.toLowerCase()) return false;

  if (state.maxSqft != null && sqft != null && sqft > state.maxSqft) return false;
  if (state.maxSqft != null && sqft == null) return false;

  if (state.maxWidth != null && width != null && width > state.maxWidth) return false;
  if (state.maxWidth != null && width == null) return false;

  if (state.maxDepth != null && depth != null && depth > state.maxDepth) return false;
  if (state.maxDepth != null && depth == null) return false;

  if (anySelected(state.styles)) {
    const planStyles = Array.isArray(f.styles) ? (f.styles as any[]).map((s) => String(s).toLowerCase()) : [];
    const wanted = state.styles.map((s) => s.toLowerCase());
    if (!wanted.some((w) => planStyles.includes(w))) return false;
  }

  return true;
}

function normalizeFilterState(input: unknown): CatalogFilterState | null {
  if (!input || typeof input !== "object") return null;
  const next = { ...DEFAULT_FILTERS, ...(input as any) } as CatalogFilterState;
  return next;
}

export type HousePlansPageProps = {
  headerTitle?: string | null;
  headerDescription?: string | null;
  searchIconSrc?: string | null;
  searchIconAlt?: string | null;
};

function useHousePlansCatalogState() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [plans, setPlans] = useState<CatalogPlan[]>([]);

  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("popular");
  const [view, setView] = useState<ViewKey>("front");
  const [desktopFiltersOpen, setDesktopFiltersOpen] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [mobileSortOpen, setMobileSortOpen] = useState(false);
  const [filterState, setFilterState] = useState<CatalogFilterState>(DEFAULT_FILTERS);
  const [mobileFilterDraft, setMobileFilterDraft] = useState<CatalogFilterState>(DEFAULT_FILTERS);
  const [mobileSortDraft, setMobileSortDraft] = useState<SortKey>("popular");
  const scrollRestoreYRef = useRef(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const sp = new URLSearchParams(window.location.search);
    const q = sp.get("q");
    const filtersRaw = sp.get("filters");

    if (q != null && q.trim() !== "") setQuery(q);
    if (filtersRaw) {
      try {
        const parsed = JSON.parse(filtersRaw);
        const normalized = normalizeFilterState(parsed);
        if (normalized) {
          setFilterState(normalized);
          setMobileFilterDraft(normalized);
        }
      } catch {
        // ignore invalid filters
      }
    }
  }, []);

  const [page, setPage] = useState(1);
  const pageSize = desktopFiltersOpen ? 8 : 9;

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);

    fetch("/api/catalog/plans?includeStats=1")
      .then(async (r) => {
        const j = await r.json();
        if (!r.ok) throw new Error(j.error || "Failed to load plans");
        return j;
      })
      .then((j) => {
        if (!mounted) return;
        setPlans((j.plans ?? []) as CatalogPlan[]);
      })
      .catch((e: any) => {
        if (!mounted) return;
        setError(e?.message || "Failed to load");
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let rows = plans;

    if (q) {
      rows = rows.filter((p) => {
        const hay = `${p.name || ""} ${p.description || ""} ${(p.tags || []).join(" ")}`.toLowerCase();
        return hay.includes(q);
      });
    }

    rows = rows.filter((p) => planMatchesFilters(p, filterState));

    if (sort === "popular") {
      rows = [...rows].sort((a, b) => popularScore(b) - popularScore(a));
    } else if (sort === "size") {
      rows = [...rows].sort((a, b) => (a.heated_sqft || 0) - (b.heated_sqft || 0));
    } else if (sort === "price") {
      rows = [...rows].sort((a, b) => startingPriceUsd(a.heated_sqft || 0) - startingPriceUsd(b.heated_sqft || 0));
    }

    return rows;
  }, [plans, query, sort, filterState]);

  useEffect(() => {
    setPage(1);
  }, [query, sort, view, filterState]);

  useEffect(() => {
    if (!mobileFiltersOpen && !mobileSortOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileFiltersOpen, mobileSortOpen]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const pageSafe = Math.min(Math.max(1, page), totalPages);

  const pagePlans = useMemo(() => {
    const start = (pageSafe - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, pageSafe, pageSize]);

  const houseGridPlans = useMemo(() => {
    return pagePlans.map((p: any) => {
      const hero = view === "front" ? p.cardImages.front : p.cardImages.plan;
      const hover = view === "front" ? p.cardImages.plan : p.cardImages.front;
      return {
        ...p,
        images: {
          ...(p.images ?? {}),
          hero_desktop: hero,
          hero_mobile: hero,
          hero,
          hover,
        },
      };
    });
  }, [pagePlans, view]);

  function closeMobileFilters() {
    setMobileFiltersOpen(false);
    requestAnimationFrame(() => window.scrollTo(0, scrollRestoreYRef.current));
  }

  function closeMobileSort() {
    setMobileSortOpen(false);
    requestAnimationFrame(() => window.scrollTo(0, scrollRestoreYRef.current));
  }

  return {
    loading,
    error,
    plans,
    query,
    setQuery,
    sort,
    setSort,
    view,
    setView,
    desktopFiltersOpen,
    setDesktopFiltersOpen,
    mobileFiltersOpen,
    setMobileFiltersOpen,
    mobileSortOpen,
    setMobileSortOpen,
    filterState,
    setFilterState,
    mobileFilterDraft,
    setMobileFilterDraft,
    mobileSortDraft,
    setMobileSortDraft,
    scrollRestoreYRef,
    page,
    setPage,
    pageSize,
    total,
    totalPages,
    pageSafe,
    pagePlans,
    houseGridPlans,
    closeMobileFilters,
    closeMobileSort,
  };
}

export function HousePlansPageMobile(props: HousePlansPageProps) {
  const s = useHousePlansCatalogState();
  const headerDescription = String(props.headerDescription || "").trim();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (s.loading || s.error) {
      setVisible(false);
      return;
    }
    const id = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(id);
  }, [s.loading, s.error]);

  return (
    <FavoritesProvider>
      <>
        <InteriorHeader />
        <main className="px-4 pt-6">
          <div className="text-xs tracking-[0.24em] text-neutral-500">
            <Link href="/" className="text-orange-600">
              MAIN
            </Link>
            <span className="px-2 text-neutral-400">/</span>
            <Link href="/house-plans" className="text-neutral-700">
              HOUSE PLANS
            </Link>
          </div>

          <div className="mt-5">
            <h1 className="text-[32px] leading-[38px] font-semibold tracking-tight">{String(props.headerTitle || "").trim() || "House plans"}</h1>
            {headerDescription ? <p className="mt-3 text-[14px] leading-[20px] text-neutral-600 whitespace-pre-line">{headerDescription}</p> : null}
            <div className="mt-3 text-sm text-neutral-600">Houses found: {s.total}</div>
          </div>

          <HousePlansSalesAgentChat>
            <div>
              <div className="mt-6">
                <SearchBar
                  value={s.query}
                  onChange={s.setQuery}
                  onSubmit={() => {
                    // search is live; keep button for UX parity
                  }}
                  buttonLabel="search"
                  iconSrc={props.searchIconSrc ?? undefined}
                  iconAlt={props.searchIconAlt ?? undefined}
                />
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  className="w-full rounded-full bg-stone-50 px-5 py-3 text-sm font-semibold"
                  onClick={() => {
                    s.scrollRestoreYRef.current = window.scrollY;
                    s.setMobileFilterDraft(s.filterState);
                    s.setMobileFiltersOpen(true);
                  }}
                >
                  Filter
                </button>
                <button
                  type="button"
                  className="w-full rounded-full bg-stone-50 px-5 py-3 text-sm font-semibold"
                  onClick={() => {
                    s.scrollRestoreYRef.current = window.scrollY;
                    s.setMobileSortDraft(s.sort);
                    s.setMobileSortOpen(true);
                  }}
                >
                  Sort
                </button>
              </div>

              <div className="mt-6">
                {s.loading ? <PlanListSkeleton count={6} /> : null}
                {s.error ? <div className="text-sm text-red-600">{s.error}</div> : null}

                {!s.loading && !s.error && s.total === 0 ? (
                  <div className="mt-10 rounded border border-stone-200 bg-white p-8 text-center">
                    <div className="text-xl font-semibold">No house plans found</div>
                    <div className="mt-2 text-sm text-neutral-600">Try a different search or reset filters.</div>
                    <div className="mt-6 flex items-center justify-center gap-3">
                      <button
                        type="button"
                        className="rounded-full border border-stone-200 px-5 py-3 text-sm font-semibold"
                        onClick={() => {
                          s.setQuery("");
                          s.setFilterState(DEFAULT_FILTERS);
                        }}
                      >
                        Reset filters
                      </button>
                    </div>
                  </div>
                ) : null}

                {s.total > 0 ? (
                  <div>
                    <div className={`flex flex-col gap-6 transition-opacity duration-300 ease-out ${visible ? "opacity-100" : "opacity-0"}`}>
                      {s.pagePlans.map((p) => (
                        <ProductCard
                          key={p.slug}
                          href={`/house/${p.slug}`}
                          fullCardLink={true}
                          planSlug={p.slug}
                          tour3dUrl={(p as any).tour3d_url ?? null}
                          imageSrc={p.cardImages.front}
                          title={p.name}
                          squareFeet={`${formatSqft(p.heated_sqft)} Sq Ft`}
                          price={`$ ${startingPriceUsd(p.heated_sqft)}`}
                          bedrooms={`${p.beds ?? "-"} Bed`}
                          bathrooms={`${p.baths ?? "-"} Bath`}
                          garages={`${p.garage_bays ?? "-"} Garage`}
                          stories={`${p.stories ?? "-"} Story`}
                        />
                      ))}
                    </div>

                    <div className="mt-10 flex items-center justify-center gap-2">
                      <button
                        type="button"
                        className="rounded border px-3 py-2 text-sm disabled:opacity-50"
                        disabled={s.pageSafe <= 1}
                        onClick={() => s.setPage((p) => Math.max(1, p - 1))}
                      >
                        Prev
                      </button>
                      <div className="text-sm text-neutral-600">
                        Page {s.pageSafe} / {s.totalPages}
                      </div>
                      <button
                        type="button"
                        className="rounded border px-3 py-2 text-sm disabled:opacity-50"
                        disabled={s.pageSafe >= s.totalPages}
                        onClick={() => s.setPage((p) => Math.min(s.totalPages, p + 1))}
                      >
                        Next
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </HousePlansSalesAgentChat>
        </main>

        <div className="mt-10">
          <MobileFooter />
        </div>

        {s.mobileFiltersOpen ? (
          <div className="fixed inset-0 z-50">
            <button type="button" aria-label="Close filters" onClick={s.closeMobileFilters} className="absolute inset-0 bg-black/40" />
            <div className="absolute inset-x-0 bottom-0 top-0 flex w-full flex-col bg-white">
              <div className="flex-1 overflow-y-auto px-4 py-6">
                <FilterSidebar
                  state={s.mobileFilterDraft}
                  onChange={(patch) => s.setMobileFilterDraft((st) => ({ ...st, ...patch }))}
                  onClearAll={() => {
                    s.setMobileFilterDraft(DEFAULT_FILTERS);
                    s.setFilterState(DEFAULT_FILTERS);
                  }}
                  onClose={s.closeMobileFilters}
                  onShowResults={() => {
                    s.setFilterState(s.mobileFilterDraft);
                    s.closeMobileFilters();
                  }}
                  showResultsLabel={`Show results (${s.total})`}
                  hideHeaderClearAll
                />
              </div>

              <div className="sticky bottom-0 border-t border-stone-200 bg-white px-4 pb-[calc(env(safe-area-inset-bottom)+16px)] pt-4">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    className="w-full rounded-full border border-stone-200 px-5 py-3 text-sm font-semibold"
                    onClick={() => {
                      s.setMobileFilterDraft(DEFAULT_FILTERS);
                      s.setFilterState(DEFAULT_FILTERS);
                    }}
                  >
                    CLEAR ALL
                  </button>
                  <button
                    type="button"
                    className="w-full rounded-full bg-orange-600 px-5 py-3 text-sm font-semibold text-white"
                    onClick={() => {
                      s.setFilterState(s.mobileFilterDraft);
                      s.closeMobileFilters();
                    }}
                  >
                    SHOW RESULTS
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {s.mobileSortOpen ? (
          <div className="fixed inset-0 z-50">
            <button type="button" aria-label="Close sort" onClick={s.closeMobileSort} className="absolute inset-0 bg-black/40" />
            <div className="absolute inset-x-0 bottom-0 top-0 w-full bg-white px-4 py-6">
              <div className="flex items-center justify-between">
                <div className="text-lg font-semibold">Sort</div>
                <button type="button" className="rounded-full bg-stone-50 px-4 py-2 text-sm" onClick={s.closeMobileSort}>
                  Close
                </button>
              </div>

              <div className="mt-6 grid gap-3">
                <button
                  type="button"
                  className={
                    s.mobileSortDraft === "popular"
                      ? "rounded-full bg-orange-600 px-5 py-3 text-sm font-semibold text-white"
                      : "rounded-full bg-stone-50 px-5 py-3 text-sm font-semibold"
                  }
                  onClick={() => s.setMobileSortDraft("popular")}
                >
                  Most Popular
                </button>
                <button
                  type="button"
                  className={
                    s.mobileSortDraft === "size"
                      ? "rounded-full bg-orange-600 px-5 py-3 text-sm font-semibold text-white"
                      : "rounded-full bg-stone-50 px-5 py-3 text-sm font-semibold"
                  }
                  onClick={() => s.setMobileSortDraft("size")}
                >
                  Size
                </button>
                <button
                  type="button"
                  className={
                    s.mobileSortDraft === "price"
                      ? "rounded-full bg-orange-600 px-5 py-3 text-sm font-semibold text-white"
                      : "rounded-full bg-stone-50 px-5 py-3 text-sm font-semibold"
                  }
                  onClick={() => s.setMobileSortDraft("price")}
                >
                  Price
                </button>
              </div>

              <div className="mt-8">
                <button
                  type="button"
                  className="w-full rounded-full bg-orange-600 px-5 py-3 text-sm font-semibold text-white"
                  onClick={() => {
                    s.setSort(s.mobileSortDraft);
                    s.closeMobileSort();
                  }}
                >
                  Apply Sort
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </>
    </FavoritesProvider>
  );
}

export function HousePlansPageDesktop(props: HousePlansPageProps) {
  const s = useHousePlansCatalogState();
  const headerDescription = String(props.headerDescription || "").trim();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (s.loading || s.error) {
      setVisible(false);
      return;
    }
    const id = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(id);
  }, [s.loading, s.error]);

  return (
    <FavoritesProvider>
      <>
        <InteriorHeader />
        <main className="mx-auto w-full max-w-7xl px-4 py-12 lg:max-w-none lg:w-[calc(100%-200px)] lg:px-0 lg:py-2">
          <div className="text-xs tracking-[0.24em] text-neutral-500 lg:hidden md:text-[18px] md:font-semibold md:tracking-normal">
            <Link href="/" className="md:text-orange-600">
              MAIN
            </Link>
            <span className="mx-2 md:text-neutral-400">/</span>
            <Link href="/house-plans" className="md:text-neutral-700">
              HOUSE PLANS
            </Link>
          </div>
          <div className="hidden lg:block text-[18px] font-semibold leading-[22px]">
            <Link href="/" className="text-orange-600">
              Main
            </Link>
            <span className="px-2 text-neutral-400">/</span>
            <Link href="/house-plans" className="text-neutral-700">
              House plans
            </Link>
          </div>

          <div className="mt-5 flex flex-col gap-4 md:flex-row md:items-end md:justify-between lg:hidden">
            <div>
              <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">{String(props.headerTitle || "").trim() || "House plans"}</h1>
              {headerDescription ? <p className="mt-3 max-w-[640px] text-base text-neutral-600">{headerDescription}</p> : null}
            </div>
            <div className="text-sm text-neutral-600">Houses found: {s.total}</div>
          </div>

          <HousePlansSalesAgentChat>
            <div>
              <div className="hidden lg:flex mt-[50px] pb-[30px] items-center justify-between gap-10">
                <h1 className="min-w-0 text-[52px] leading-[56px] font-semibold tracking-tight text-[#1A1A1A] lg:origin-left lg:scale-[1.1] lg:-translate-y-[6px]">
                  {String(props.headerTitle || "").trim() || "House plans"}
                </h1>

                <div className="flex w-full max-w-[850px] items-center gap-4">
                  <div className="relative flex-1">
                    <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2">
                    <img src={imgSrc(searchIcon)} alt={props.searchIconAlt ?? "Search"} className="h-4 w-4" />
                    </div>
                    <input
                      type="text"
                      placeholder="Search plans"
                      value={s.query}
                      onChange={(e) => s.setQuery(e.target.value)}
                      className="h-[50px] w-full rounded-full border border-[#E0E0E0] bg-white pl-11 pr-4 text-[14px] leading-[20px] text-[#1A1A1A] placeholder:text-[#999]"
                    />
                  </div>
                  <button
                    type="button"
                    className="h-[50px] w-[124px] shrink-0 rounded-full bg-[#FF5C02] px-6 text-[13px] font-semibold uppercase tracking-[0.08em] text-white"
                    onClick={() => {
                      // search is live; keep button for UX parity
                    }}
                  >
                    SEARCH
                  </button>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between lg:hidden">
                <div className="w-full">
                  <SearchBar
                    value={s.query}
                    onChange={s.setQuery}
                    onSubmit={() => {
                      // search is live; keep button for UX parity
                    }}
                    buttonLabel="search"
                    iconSrc={props.searchIconSrc ?? undefined}
                    iconAlt={props.searchIconAlt ?? undefined}
                  />
                </div>
              </div>

              <div className="mt-6 lg:mt-4">
                <div className="flex items-start gap-6">
              {s.desktopFiltersOpen ? (
                <div className="hidden md:block">
                  <FilterSidebar
                    state={s.filterState}
                    onChange={(patch) => s.setFilterState((st) => ({ ...st, ...patch }))}
                    onClearAll={() => s.setFilterState(DEFAULT_FILTERS)}
                  />
                </div>
              ) : null}

                  <div className="min-w-0 flex-1">
                <div className="mb-6">
                  <div className="hidden md:block lg:hidden">
                    <div className="flex items-center justify-between gap-6">
                      <div className="flex items-center gap-2 text-sm">
                        <button
                          type="button"
                          className={
                            s.desktopFiltersOpen ? "rounded-full bg-orange-600 px-4 py-2 text-white" : "rounded-full bg-stone-50 px-4 py-2"
                          }
                          onClick={() => s.setDesktopFiltersOpen((v) => !v)}
                        >
                          Filter
                        </button>
                        <button
                          type="button"
                          className={
                            s.sort === "popular" ? "rounded-full bg-orange-600 px-4 py-2 text-white" : "rounded-full bg-stone-50 px-4 py-2"
                          }
                          onClick={() => s.setSort("popular")}
                        >
                          Most Popular
                        </button>
                        <button
                          type="button"
                          className={
                            s.sort === "size" ? "rounded-full bg-orange-600 px-4 py-2 text-white" : "rounded-full bg-stone-50 px-4 py-2"
                          }
                          onClick={() => s.setSort("size")}
                        >
                          Size
                        </button>
                        <button
                          type="button"
                          className={
                            s.sort === "price" ? "rounded-full bg-orange-600 px-4 py-2 text-white" : "rounded-full bg-stone-50 px-4 py-2"
                          }
                          onClick={() => s.setSort("price")}
                        >
                          Price
                        </button>
                      </div>

                      <div className="flex items-center gap-2 text-sm">
                        <span className="font-semibold">View</span>
                        <button
                          type="button"
                          className={
                            s.view === "front" ? "rounded-full bg-orange-600 px-4 py-2 text-white" : "rounded-full bg-stone-50 px-4 py-2"
                          }
                          onClick={() => s.setView("front")}
                        >
                          Front
                        </button>
                        <button
                          type="button"
                          className={
                            s.view === "plan" ? "rounded-full bg-orange-600 px-4 py-2 text-white" : "rounded-full bg-stone-50 px-4 py-2"
                          }
                          onClick={() => s.setView("plan")}
                        >
                          Plan
                        </button>
                      </div>
                    </div>
                    <div className="mt-4 text-[13px] leading-[18px] text-[#999]">Houses found: {s.total}</div>
                  </div>

                  <div className="hidden lg:block">
                    <div className="flex items-center justify-between gap-6">
                      <div className="flex items-center gap-5">
                        {s.desktopFiltersOpen ? (
                          <button
                            type="button"
                            aria-label="Close filter"
                            className="inline-flex h-[40px] w-[40px] items-center justify-center bg-transparent lg:-ml-6 lg:-translate-x-[100px]"
                            onClick={() => s.setDesktopFiltersOpen(false)}
                          >
                            <img src={imgSrc(iconX)} alt="Close" className="h-5 w-5" />
                          </button>
                        ) : (
                          <button
                            type="button"
                            className="inline-flex items-center gap-2 rounded-full border border-[#E0E0E0] bg-transparent px-4 py-2 text-[14px] leading-[20px] text-[#1A1A1A]"
                            onClick={() => s.setDesktopFiltersOpen((v) => !v)}
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path
                                d="M3 5h18l-7 8v5l-4 2v-7L3 5Z"
                                stroke="#1A1A1A"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                            Show Filter
                          </button>
                        )}

                        <div className="text-[13px] leading-[20px] text-[#666]">Sort by</div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            className={
                              s.sort === "popular"
                                ? "h-[40px] rounded-full bg-[#FF5C02] px-4 text-[13px] font-medium text-white"
                                : "h-[40px] rounded-full border border-[#E0E0E0] bg-white px-4 text-[13px] font-medium text-[#1A1A1A]"
                            }
                            onClick={() => s.setSort("popular")}
                          >
                            Most Popular
                          </button>
                          <button
                            type="button"
                            className={
                              s.sort === "size"
                                ? "h-[40px] rounded-full bg-[#FF5C02] px-4 text-[13px] font-medium text-white"
                                : "h-[40px] rounded-full border border-[#E0E0E0] bg-white px-4 text-[13px] font-medium text-[#1A1A1A]"
                            }
                            onClick={() => s.setSort("size")}
                          >
                            Size
                          </button>
                          <button
                            type="button"
                            className={
                              s.sort === "price"
                                ? "h-[40px] rounded-full bg-[#FF5C02] px-4 text-[13px] font-medium text-white"
                                : "h-[40px] rounded-full border border-[#E0E0E0] bg-white px-4 text-[13px] font-medium text-[#1A1A1A]"
                            }
                            onClick={() => s.setSort("price")}
                          >
                            Price
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-[13px] leading-[20px] text-[#1A1A1A]">View</span>
                        <button
                          type="button"
                          className={
                            s.view === "front"
                              ? "h-[40px] rounded-full bg-[#FF5C02] px-4 text-[13px] font-medium text-white"
                              : "h-[40px] rounded-full border border-[#E0E0E0] bg-white px-4 text-[13px] font-medium text-[#1A1A1A]"
                          }
                          onClick={() => s.setView("front")}
                        >
                          Front
                        </button>
                        <button
                          type="button"
                          className={
                            s.view === "plan"
                              ? "h-[40px] rounded-full bg-[#FF5C02] px-4 text-[13px] font-medium text-white"
                              : "h-[40px] rounded-full border border-[#E0E0E0] bg-white px-4 text-[13px] font-medium text-[#1A1A1A]"
                          }
                          onClick={() => s.setView("plan")}
                        >
                          Plan
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="md:hidden">
                    <ContentHeader sort={s.sort} onSortChange={s.setSort} view={s.view} onViewChange={s.setView} />
                  </div>
                </div>

                {s.loading ? <PlanGridSkeleton count={s.pageSize} desktopCols={s.desktopFiltersOpen ? 2 : 3} /> : null}
                {s.error ? <div className="text-sm text-red-600">{s.error}</div> : null}

                {!s.loading && !s.error && s.total === 0 ? (
                  <div className="mt-10 rounded border border-stone-200 bg-white p-8 text-center">
                    <div className="text-xl font-semibold">No house plans found</div>
                    <div className="mt-2 text-sm text-neutral-600">Try a different search or clear filters.</div>
                    <div className="mt-6 flex items-center justify-center gap-3">
                      <button
                        type="button"
                        className="rounded-full border border-stone-200 px-5 py-3 text-sm font-semibold"
                        onClick={() => {
                          s.setQuery("");
                          s.setFilterState(DEFAULT_FILTERS);
                          s.setDesktopFiltersOpen(false);
                        }}
                      >
                        Clear
                      </button>
                      <a
                        href="https://meetings.hubspot.com/watkinshomedesign"
                        className="rounded-full bg-orange-600 px-5 py-3 text-sm font-semibold text-white"
                      >
                        Book a consultation
                      </a>
                    </div>
                  </div>
                ) : null}

                {s.total > 0 ? (
                  <div>
                    <div className={`transition-opacity duration-300 ease-out ${visible ? "opacity-100" : "opacity-0"}`}>
                      <HouseGrid plans={s.houseGridPlans as any} desktopCols={s.desktopFiltersOpen ? 2 : 3} />
                    </div>

                    <div className="mt-10 flex items-center justify-center gap-2">
                      <button
                        type="button"
                        className="rounded border px-3 py-2 text-sm disabled:opacity-50"
                        disabled={s.pageSafe <= 1}
                        onClick={() => s.setPage((p) => Math.max(1, p - 1))}
                      >
                        Prev
                      </button>
                      <div className="text-sm text-neutral-600">
                        Page {s.pageSafe} / {s.totalPages}
                      </div>
                      <button
                        type="button"
                        className="rounded border px-3 py-2 text-sm disabled:opacity-50"
                        disabled={s.pageSafe >= s.totalPages}
                        onClick={() => s.setPage((p) => Math.min(s.totalPages, p + 1))}
                      >
                        Next
                      </button>
                    </div>
                  </div>
                ) : null}
                  </div>
                </div>
              </div>
            </div>
          </HousePlansSalesAgentChat>
        </main>
        <Footer />
      </>
    </FavoritesProvider>
  );
}

export function HousePlansPage(props: HousePlansPageProps) {
  return <HousePlansPageDesktop {...props} />;
}

export default HousePlansPage;

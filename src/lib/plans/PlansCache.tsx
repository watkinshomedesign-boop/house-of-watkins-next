"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";

export type CachedPlan = {
  id?: string;
  slug: string;
  name: string;
  description?: string | null;
  heated_sqft: number;
  beds: number | null;
  baths: number | null;
  stories: number | null;
  garage_bays: number | null;
  width_ft?: number | null;
  depth_ft?: number | null;
  tags?: string[] | null;
  filters?: any;
  tour3d_url?: string | null;
  cardImages?: { front: string; plan: string };
  stats: { views: number; favorites: number; purchases: number };
};

type PlansCacheState = {
  plans: CachedPlan[];
  loading: boolean;
  error: string | null;
  lastFetched: number | null;
};

type PlansCacheContextValue = {
  plans: CachedPlan[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
};

const CACHE_KEY = "house_plans_cache";
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

function loadFromStorage(): PlansCacheState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PlansCacheState;
    // Check if cache is still valid
    if (parsed.lastFetched && Date.now() - parsed.lastFetched < CACHE_TTL_MS) {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

function saveToStorage(state: PlansCacheState) {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify(state));
  } catch {
    // Ignore storage errors
  }
}

const PlansCacheContext = createContext<PlansCacheContextValue | null>(null);

export function PlansCacheProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PlansCacheState>(() => {
    const cached = loadFromStorage();
    if (cached) {
      return cached;
    }
    return {
      plans: [],
      loading: true,
      error: null,
      lastFetched: null,
    };
  });

  const fetchingRef = useRef(false);

  const fetchPlans = useCallback(async (force = false) => {
    // Don't fetch if already fetching
    if (fetchingRef.current) return;

    // Don't fetch if we have valid cached data (unless forced)
    if (!force && state.lastFetched && Date.now() - state.lastFetched < CACHE_TTL_MS && state.plans.length > 0) {
      return;
    }

    fetchingRef.current = true;
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const response = await fetch("/api/catalog/plans?includeStats=1");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to load plans");
      }

      const newState: PlansCacheState = {
        plans: (data.plans ?? []) as CachedPlan[],
        loading: false,
        error: null,
        lastFetched: Date.now(),
      };

      setState(newState);
      saveToStorage(newState);
    } catch (e: any) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: e?.message || "Failed to load",
      }));
    } finally {
      fetchingRef.current = false;
    }
  }, [state.lastFetched, state.plans.length]);

  // Initial fetch on mount
  useEffect(() => {
    // Check if we need to fetch (no cached data or expired)
    const cached = loadFromStorage();
    if (cached && cached.plans.length > 0) {
      setState(cached);
    } else {
      fetchPlans();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const refresh = useCallback(async () => {
    await fetchPlans(true);
  }, [fetchPlans]);

  return (
    <PlansCacheContext.Provider
      value={{
        plans: state.plans,
        loading: state.loading,
        error: state.error,
        refresh,
      }}
    >
      {children}
    </PlansCacheContext.Provider>
  );
}

export function usePlansCache(): PlansCacheContextValue {
  const context = useContext(PlansCacheContext);
  if (!context) {
    throw new Error("usePlansCache must be used within a PlansCacheProvider");
  }
  return context;
}

// Hook for components that need to ensure plans are loaded
export function usePlans() {
  const { plans, loading, error, refresh } = usePlansCache();
  return { plans, loading, error, refresh };
}

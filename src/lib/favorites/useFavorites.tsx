"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { FavoritesProviderApi, FavoritesUser } from "@/lib/favorites/provider";
import { getFavoritesProvider, hasSupabaseEnv } from "@/lib/favorites/getProvider";
import { clearLocalFavorites } from "@/lib/favorites/localProvider";

type FavoritesContextValue = {
  user: FavoritesUser | null;
  favorites: Set<string>;
  loading: boolean;
  providerType: "supabase" | "local";
  refresh: () => Promise<void>;
  toggle: (planSlug: string) => Promise<void>;
  isFavorited: (planSlug: string) => boolean;
  startLogin: (payload: { name: string; email: string }) => Promise<{ sent: boolean }>;
};

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

function safeProviderType(): "supabase" | "local" {
  return hasSupabaseEnv() ? "supabase" : "local";
}

export function FavoritesProvider(props: { children: React.ReactNode }) {
  const [user, setUser] = useState<FavoritesUser | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  const providerType = safeProviderType();

  const provider: FavoritesProviderApi = useMemo(() => getFavoritesProvider(), [providerType]);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const u = await provider.getUser();
      setUser(u);

      if (providerType === "supabase" && !u) {
        const localOnlyProvider = await import("@/lib/favorites/localProvider");
        const localFavorites = await new localOnlyProvider.LocalFavoritesProvider().listFavorites();
        setFavorites(new Set(localFavorites));
        return;
      }

      const list = await provider.listFavorites();
      setFavorites(new Set(list));

      if (providerType === "supabase" && u) {
        const localOnlyProvider = await import("@/lib/favorites/localProvider");
        const localFavorites = await new localOnlyProvider.LocalFavoritesProvider().listFavorites();
        if (localFavorites.length > 0) {
          for (const slug of localFavorites) {
            try {
              await provider.addFavorite(slug);
            } catch {
              // ignore
            }
          }
          clearLocalFavorites();
          const merged = await provider.listFavorites();
          setFavorites(new Set(merged));
        }
      }
    } catch {
      setUser(null);
      try {
        const localOnlyProvider = await import("@/lib/favorites/localProvider");
        const localFavorites = await new localOnlyProvider.LocalFavoritesProvider().listFavorites();
        setFavorites(new Set(localFavorites));
      } catch {
        setFavorites(new Set());
      }
    } finally {
      setLoading(false);
    }
  }, [provider, providerType]);

  useEffect(() => {
    refresh().catch(() => {
      // handled inside refresh
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [providerType]);

  useEffect(() => {
    if (providerType !== "supabase") return;
    try {
      const { createSupabaseBrowserClient } = require("@/lib/supabaseBrowser");
      const supabase = createSupabaseBrowserClient();
      const { data } = supabase.auth.onAuthStateChange(() => {
        refresh();
      });
      return () => {
        data.subscription.unsubscribe();
      };
    } catch {
      return;
    }
  }, [providerType, refresh]);

  const isFavorited = useCallback((planSlug: string) => favorites.has(planSlug), [favorites]);

  const toggle = useCallback(
    async (planSlug: string) => {
      if (providerType === "supabase" && !user) {
        const localOnlyProvider = await import("@/lib/favorites/localProvider");
        const local = new localOnlyProvider.LocalFavoritesProvider();
        const next = new Set(favorites);
        const currently = next.has(planSlug);
        if (currently) next.delete(planSlug);
        else next.add(planSlug);
        setFavorites(next);

        if (currently) await local.removeFavorite(planSlug);
        else await local.addFavorite(planSlug);
        return;
      }

      const next = new Set(favorites);
      const currently = next.has(planSlug);
      if (currently) next.delete(planSlug);
      else next.add(planSlug);
      setFavorites(next);

      try {
        if (currently) await provider.removeFavorite(planSlug);
        else await provider.addFavorite(planSlug);
      } catch {
        await refresh();
      }
    },
    [favorites, provider, providerType, refresh, user]
  );

  const startLogin = useCallback(async (payload: { name: string; email: string }) => {
    if (providerType !== "supabase") {
      return { sent: true };
    }

    const { createSupabaseBrowserClient } = await import("@/lib/supabaseBrowser");
    const supabase = createSupabaseBrowserClient();

    const redirectTo = `${window.location.origin}/auth/callback?next=/favorites`;
    const { error } = await supabase.auth.signInWithOtp({
      email: payload.email,
      options: {
        emailRedirectTo: redirectTo,
        data: { name: payload.name },
      },
    });
    if (error) throw error;

    return { sent: true };
  }, [providerType]);

  const value: FavoritesContextValue = {
    user,
    favorites,
    loading,
    providerType,
    refresh,
    toggle,
    isFavorited,
    startLogin,
  };

  return <FavoritesContext.Provider value={value}>{props.children}</FavoritesContext.Provider>;
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites must be used within FavoritesProvider");
  return ctx;
}

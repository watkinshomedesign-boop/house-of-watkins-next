import type { FavoritesProviderApi } from "@/lib/favorites/provider";
import { LocalFavoritesProvider } from "@/lib/favorites/localProvider";
import { SupabaseFavoritesProvider } from "@/lib/favorites/supabaseProvider";

export function hasSupabaseEnv(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

export function getFavoritesProvider(): FavoritesProviderApi {
  if (hasSupabaseEnv()) return new SupabaseFavoritesProvider();
  return new LocalFavoritesProvider();
}

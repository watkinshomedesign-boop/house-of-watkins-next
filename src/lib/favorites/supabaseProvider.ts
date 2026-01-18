import type { FavoritesProviderApi, FavoritesUser } from "@/lib/favorites/provider";
import { createSupabaseBrowserClient } from "@/lib/supabaseBrowser";

export class SupabaseFavoritesProvider implements FavoritesProviderApi {
  private supabase() {
    return createSupabaseBrowserClient();
  }

  async getUser(): Promise<FavoritesUser | null> {
    const supabase = this.supabase();
    const { data, error } = await supabase.auth.getUser();
    if (error) return null;
    const u = data.user;
    if (!u) return null;
    return {
      id: u.id,
      email: u.email ?? undefined,
      name: (u.user_metadata as any)?.name ?? undefined,
    };
  }

  async listFavorites(): Promise<string[]> {
    const supabase = this.supabase();
    const { data: userRes } = await supabase.auth.getUser();
    const user = userRes.user;
    if (!user) return [];

    const { data, error } = await supabase
      .from("favorites")
      .select("plan_slug")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return (data ?? []).map((r: any) => String(r.plan_slug)).filter(Boolean);
  }

  async addFavorite(planSlug: string): Promise<void> {
    const supabase = this.supabase();
    const { data: userRes } = await supabase.auth.getUser();
    const user = userRes.user;
    if (!user) throw new Error("Not logged in");

    const { error } = await supabase.from("favorites").insert({
      user_id: user.id,
      plan_slug: planSlug,
    });

    if (error) {
      const msg = String((error as any)?.message ?? "");
      if (msg.toLowerCase().includes("duplicate") || msg.includes("23505")) return;
      throw error;
    }
  }

  async removeFavorite(planSlug: string): Promise<void> {
    const supabase = this.supabase();
    const { data: userRes } = await supabase.auth.getUser();
    const user = userRes.user;
    if (!user) throw new Error("Not logged in");

    const { error } = await supabase
      .from("favorites")
      .delete()
      .eq("user_id", user.id)
      .eq("plan_slug", planSlug);
    if (error) throw error;
  }
}

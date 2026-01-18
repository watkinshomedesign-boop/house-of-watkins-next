import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export default async function AdminFavoritesPage() {
  try {
    const supabase = getSupabaseAdmin();

    const { count: totalFavorites, error: countErr } = await supabase
      .from("favorites")
      .select("id", { count: "exact", head: true });
    if (countErr) throw countErr;

    const { data: uniqueUsersRows, error: usersErr } = await supabase
      .from("favorites")
      .select("user_id");
    if (usersErr) throw usersErr;

    const uniqueUsers = new Set((uniqueUsersRows ?? []).map((r: any) => String(r.user_id))).size;

    const { data: topRows, error: topErr } = await supabase
      .from("favorite_counts_by_plan")
      .select("plan_slug,favorites_count")
      .order("favorites_count", { ascending: false })
      .limit(10);
    if (topErr) throw topErr;

    const topPlans = (topRows ?? []).map((r: any) => [String(r.plan_slug), Number(r.favorites_count)] as const);

    return (
      <div className="mx-auto w-full max-w-5xl">
        <h1 className="text-2xl font-semibold">Favorites Stats</h1>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-neutral-200 bg-white p-4">
            <div className="text-xs text-neutral-500">Total favorites</div>
            <div className="mt-1 text-xl font-semibold">{totalFavorites ?? 0}</div>
          </div>
          <div className="rounded-xl border border-neutral-200 bg-white p-4">
            <div className="text-xs text-neutral-500">Unique users</div>
            <div className="mt-1 text-xl font-semibold">{uniqueUsers}</div>
          </div>
          <div className="rounded-xl border border-neutral-200 bg-white p-4">
            <div className="text-xs text-neutral-500">Top plans tracked</div>
            <div className="mt-1 text-xl font-semibold">{topPlans.length}</div>
          </div>
        </div>

        <div className="mt-8 rounded-xl border border-neutral-200 bg-white">
          <div className="border-b border-neutral-200 px-4 py-3 text-sm font-semibold">
            Top favorited plans
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="text-xs text-neutral-500">
                <tr>
                  <th className="px-4 py-3">plan_slug</th>
                  <th className="px-4 py-3">favorites_count</th>
                </tr>
              </thead>
              <tbody>
                {topPlans.map(([slug, count]) => (
                  <tr key={slug} className="border-t border-neutral-100">
                    <td className="px-4 py-3 font-medium">{slug}</td>
                    <td className="px-4 py-3">{count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-8 text-sm text-neutral-600">
          Note: This page uses the Supabase service role key. If it isn’t configured, stats will be unavailable.
        </div>
      </div>
    );
  } catch (e) {
    const message = e instanceof Error ? e.message : "Stats unavailable";
    return (
      <div className="mx-auto w-full max-w-5xl">
        <h1 className="text-2xl font-semibold">Favorites Stats</h1>
        <p className="mt-4 text-sm text-neutral-600">Stats unavailable until Supabase is configured.</p>
        <p className="mt-2 text-xs text-neutral-500">{message}</p>
      </div>
    );
  }
}

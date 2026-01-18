import Link from "next/link";
import { requireAdmin } from "@/lib/adminAuth";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

type OrderRow = {
  id: string;
  email: string;
  status: string;
  total_cents: number;
  currency: string;
  created_at: string;
  builder_code?: string | null;
  builder_profile?: {
    first_name: string | null;
    last_name: string | null;
    email: string | null;
  } | null;
};

export default async function AdminOrdersPage() {
  await requireAdmin();

  const supabase = getSupabaseAdmin() as any;
  const { data, error } = await supabase
    .from("orders")
    .select(
      "id, email, status, subtotal_cents, shipping_cents, total_cents, currency, created_at, builder_code, builder_profile:builder_profiles(first_name,last_name,email)"
    )
    .order("created_at", { ascending: false })
    .limit(100);

  const { count: builderOrdersCount }: any = await supabase
    .from("orders")
    .select("id", { count: "exact", head: true })
    .not("builder_code", "is", null);

  const { data: allBuilderOrders }: any = await supabase
    .from("orders")
    .select("builder_code,total_cents,currency")
    .not("builder_code", "is", null)
    .limit(5000);

  const topCodes = (() => {
    const rows = (allBuilderOrders ?? []) as any[];
    const map = new Map<string, { code: string; revenueCents: number; orders: number; currency: string }>();
    for (const r of rows) {
      const code = String(r?.builder_code ?? "");
      if (!code) continue;
      const currency = String(r?.currency ?? "usd");
      const key = `${currency}:${code}`;
      const cur = map.get(key) ?? { code, revenueCents: 0, orders: 0, currency };
      cur.revenueCents += Number(r?.total_cents ?? 0);
      cur.orders += 1;
      map.set(key, cur);
    }
    return [...map.values()].sort((a, b) => b.revenueCents - a.revenueCents).slice(0, 10);
  })();

  if (error) {
    return <div className="text-sm text-red-600">{error.message}</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Orders</h1>
        <Link className="text-sm underline" href="/admin/plans">
          Plans
        </Link>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
        <div className="rounded border p-3 text-sm">
          <div className="text-xs text-zinc-500">Orders w/ Builder Code</div>
          <div className="mt-1 text-lg font-semibold">{Number(builderOrdersCount ?? 0)}</div>
        </div>
        <div className="rounded border p-3 text-sm">
          <div className="text-xs text-zinc-500">Top Builder Codes by Revenue (top 10)</div>
          <div className="mt-2 overflow-x-auto">
            <table className="min-w-full text-xs border">
              <thead>
                <tr className="bg-zinc-50">
                  <th className="text-left p-2 border">Code</th>
                  <th className="text-right p-2 border">Orders</th>
                  <th className="text-right p-2 border">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {topCodes.length === 0 ? (
                  <tr>
                    <td className="p-2 border" colSpan={3}>
                      No builder orders yet.
                    </td>
                  </tr>
                ) : (
                  topCodes.map((r) => (
                    <tr key={`${r.currency}:${r.code}`}>
                      <td className="p-2 border font-mono">{r.code}</td>
                      <td className="p-2 border text-right">{r.orders}</td>
                      <td className="p-2 border text-right">
                        ${(r.revenueCents / 100).toFixed(2)} {String(r.currency).toUpperCase()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="mt-6 overflow-x-auto">
        <table className="min-w-full text-sm border">
          <thead>
            <tr className="bg-zinc-50">
              <th className="text-left p-2 border">Created</th>
              <th className="text-left p-2 border">Email</th>
              <th className="text-left p-2 border">Builder</th>
              <th className="text-left p-2 border">Status</th>
              <th className="text-right p-2 border">Total</th>
              <th className="text-left p-2 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {((data ?? []) as OrderRow[]).map((o) => (
              <tr key={o.id}>
                <td className="p-2 border">{new Date(o.created_at).toLocaleString()}</td>
                <td className="p-2 border">{o.email}</td>
                <td className="p-2 border">
                  {o.builder_code ? (
                    <div className="space-y-0.5">
                      <div className="font-mono text-xs">{o.builder_code}</div>
                      {o.builder_profile?.email || o.builder_profile?.first_name || o.builder_profile?.last_name ? (
                        <div className="text-xs text-zinc-600">
                          {`${o.builder_profile?.first_name ?? ""} ${o.builder_profile?.last_name ?? ""}`.trim()}
                          {o.builder_profile?.email ? ` • ${o.builder_profile.email}` : ""}
                        </div>
                      ) : null}
                    </div>
                  ) : (
                    <span className="text-zinc-400">—</span>
                  )}
                </td>
                <td className="p-2 border">{o.status}</td>
                <td className="p-2 border text-right">
                  ${(o.total_cents / 100).toFixed(2)} {String(o.currency).toUpperCase()}
                </td>
                <td className="p-2 border">
                  <Link className="underline" href={`/admin/orders/${o.id}`}>
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

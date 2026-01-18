import Link from "next/link";
import { requireAdmin } from "@/lib/adminAuth";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { PlanStatusToggle } from "@/adminComponents/PlanStatusToggle";

type PlanRow = {
  id: string;
  slug: string;
  name: string;
  heated_sqft: number;
  status: string;
  created_at: string;
};

export default async function AdminPlansPage() {
  await requireAdmin();

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("plans")
    .select("id, slug, name, heated_sqft, status, created_at")
    .order("created_at", { ascending: false })
    .limit(200);

  if (error) {
    return <div className="text-sm text-red-600">{error.message}</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Plans</h1>
        <div className="flex items-center gap-4">
          <Link className="text-sm underline" href="/admin/plans/new">
            Create
          </Link>
          <Link className="text-sm underline" href="/admin/orders">
            Orders
          </Link>
        </div>
      </div>

      <div className="mt-6 overflow-x-auto">
        <table className="min-w-full text-sm border">
          <thead>
            <tr className="bg-zinc-50">
              <th className="text-left p-2 border">Slug</th>
              <th className="text-left p-2 border">Name</th>
              <th className="text-right p-2 border">Heated sqft</th>
              <th className="text-left p-2 border">Status</th>
              <th className="text-left p-2 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {((data ?? []) as PlanRow[]).map((p) => (
              <tr key={p.id}>
                <td className="p-2 border">{p.slug}</td>
                <td className="p-2 border">{p.name}</td>
                <td className="p-2 border text-right">{p.heated_sqft}</td>
                <td className="p-2 border">{p.status}</td>
                <td className="p-2 border">
                  <div className="flex items-center gap-3">
                    <Link className="underline" href={`/admin/plans/${p.id}`}>
                      Edit
                    </Link>
                    <PlanStatusToggle planId={p.id} currentStatus={p.status} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

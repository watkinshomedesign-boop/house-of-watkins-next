import Link from "next/link";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

type SearchParams = {
  page?: string;
  q?: string;
};

const PAGE_SIZE = 25;

export default async function AdminLeadHomeownersPage(props: { searchParams: Promise<SearchParams> }) {
  const searchParams = await props.searchParams;
  const page = Math.max(1, Number(searchParams.page ?? "1") || 1);
  const q = String(searchParams.q ?? "").trim();

  const supabase = getSupabaseAdmin();

  let query = supabase
    .from("lead_signups")
    .select("id,created_at,first_name,last_name,email,user_type,source,page_path,user_agent,ip", { count: "exact" })
    .eq("user_type", "homeowner")
    .order("created_at", { ascending: false });

  if (q) {
    const like = `%${q}%`;
    query = query.or(`email.ilike.${like},first_name.ilike.${like},last_name.ilike.${like}`);
  }

  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const { data, error, count } = await query.range(from, to);
  if (error) {
    return (
      <div className="mx-auto w-full max-w-6xl">
        <h1 className="text-2xl font-semibold">Lead Signups — Homeowners</h1>
        <p className="mt-4 text-sm text-neutral-600">Failed to load lead signups.</p>
        <p className="mt-2 text-xs text-neutral-500">{error.message}</p>
      </div>
    );
  }

  const total = count ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="mx-auto w-full max-w-6xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Lead Signups — Homeowners</h1>
          <p className="mt-1 text-sm text-neutral-600">Future Dream Homeowner leads.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href={`/admin/leads/builders${q ? `?q=${encodeURIComponent(q)}` : ""}`}
            className="inline-flex items-center justify-center rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm font-semibold"
          >
            View Builders
          </Link>
          <Link
            href={`/admin/leads/homeowners/export${q ? `?q=${encodeURIComponent(q)}` : ""}`}
            className="inline-flex items-center justify-center rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm font-semibold"
          >
            Export CSV
          </Link>
        </div>
      </div>

      <form className="mt-6" action="/admin/leads/homeowners" method="get">
        <div className="flex items-center gap-2">
          <input
            name="q"
            defaultValue={q}
            placeholder="Search email or name"
            className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-600"
          />
          <button type="submit" className="rounded-lg bg-orange-600 px-4 py-2 text-sm font-semibold text-white">
            Search
          </button>
        </div>
      </form>

      <div className="mt-6 overflow-x-auto rounded-xl border border-neutral-200 bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="text-xs text-neutral-500">
            <tr>
              <th className="px-4 py-3">Created</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Source</th>
              <th className="px-4 py-3">Page</th>
            </tr>
          </thead>
          <tbody>
            {(data ?? []).map((row: any) => (
              <tr key={row.id} className="border-t border-neutral-100 align-top">
                <td className="px-4 py-3 whitespace-nowrap text-xs text-neutral-500">
                  {new Date(row.created_at).toLocaleString()}
                </td>
                <td className="px-4 py-3 font-medium">{`${row.first_name ?? ""} ${row.last_name ?? ""}`.trim()}</td>
                <td className="px-4 py-3">{row.email}</td>
                <td className="px-4 py-3">{row.source ?? ""}</td>
                <td className="px-4 py-3">{row.page_path ?? ""}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-between text-sm text-neutral-600">
        <div>
          Page {page} of {totalPages} ({total} total)
        </div>
        <div className="flex items-center gap-2">
          <Link
            aria-disabled={page <= 1}
            className={`rounded-lg border border-neutral-200 bg-white px-3 py-2 ${page <= 1 ? "pointer-events-none opacity-50" : ""}`}
            href={`/admin/leads/homeowners?page=${page - 1}${q ? `&q=${encodeURIComponent(q)}` : ""}`}
          >
            Prev
          </Link>
          <Link
            aria-disabled={page >= totalPages}
            className={`rounded-lg border border-neutral-200 bg-white px-3 py-2 ${page >= totalPages ? "pointer-events-none opacity-50" : ""}`}
            href={`/admin/leads/homeowners?page=${page + 1}${q ? `&q=${encodeURIComponent(q)}` : ""}`}
          >
            Next
          </Link>
        </div>
      </div>
    </div>
  );
}

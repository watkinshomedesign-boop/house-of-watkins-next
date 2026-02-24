import { requireAdmin } from "@/lib/adminAuth";
import { AnalyticsTable } from "@/adminComponents/AnalyticsTable";
import { VisitorsDashboard } from "@/adminComponents/VisitorsDashboard";
import { LeadsDashboard } from "@/adminComponents/LeadsDashboard";

export default async function AdminAnalyticsPage() {
  await requireAdmin();

  return (
    <div className="mx-auto w-full max-w-5xl space-y-10">
      <h1 className="text-2xl font-semibold">Analytics</h1>

      <VisitorsDashboard />

      <hr className="border-neutral-200" />

      <LeadsDashboard />

      <hr className="border-neutral-200" />

      <div>
        <h2 className="mb-4 text-lg font-semibold">Plan Performance</h2>
        <AnalyticsTable />
      </div>
    </div>
  );
}

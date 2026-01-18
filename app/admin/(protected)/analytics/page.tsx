import { requireAdmin } from "@/lib/adminAuth";
import { AnalyticsTable } from "@/adminComponents/AnalyticsTable";

export default async function AdminAnalyticsPage() {
  await requireAdmin();

  return (
    <div className="mx-auto w-full max-w-5xl">
      <h1 className="text-2xl font-semibold">Analytics</h1>
      <div className="mt-6">
        <AnalyticsTable />
      </div>
    </div>
  );
}

import { requireAdmin } from "@/lib/adminAuth";
import { AdminDashboard } from "@/adminComponents/AdminDashboard";

export default async function AdminDashboardPage() {
  await requireAdmin();

  return (
    <div className="mx-auto w-full max-w-6xl">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <div className="mt-6">
        <AdminDashboard />
      </div>
    </div>
  );
}

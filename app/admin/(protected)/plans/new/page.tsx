import { requireAdmin } from "@/lib/adminAuth";
import { PlanEditor } from "@/adminComponents/PlanEditor";

export default async function AdminNewPlanPage() {
  await requireAdmin();

  return (
    <div className="mx-auto w-full max-w-5xl">
      <h1 className="text-2xl font-semibold">Create Plan</h1>
      <div className="mt-6">
        <PlanEditor mode="create" />
      </div>
    </div>
  );
}

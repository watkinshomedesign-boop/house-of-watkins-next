import { requireAdmin } from "@/lib/adminAuth";
import { PromosAdmin } from "@/adminComponents/PromosAdmin";

export default async function AdminPromosPage() {
  await requireAdmin();

  return (
    <div className="mx-auto w-full max-w-5xl">
      <h1 className="text-2xl font-semibold">Promos</h1>
      <div className="mt-6">
        <PromosAdmin />
      </div>
    </div>
  );
}

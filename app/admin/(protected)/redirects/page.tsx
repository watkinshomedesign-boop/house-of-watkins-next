import { requireAdmin } from "@/lib/adminAuth";
import { RedirectsAdmin } from "@/adminComponents/RedirectsAdmin";

export default async function AdminRedirectsPage() {
  await requireAdmin();

  return (
    <div className="mx-auto w-full max-w-6xl">
      <h1 className="text-2xl font-semibold">Redirects</h1>
      <div className="mt-6">
        <RedirectsAdmin />
      </div>
    </div>
  );
}

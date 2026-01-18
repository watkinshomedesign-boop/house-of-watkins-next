import { requireAdmin } from "@/lib/adminAuth";
import { PricingSettingsForm } from "@/adminComponents/PricingSettingsForm";

export default async function AdminPricingPage() {
  await requireAdmin();

  return (
    <div className="mx-auto w-full max-w-5xl">
      <h1 className="text-2xl font-semibold">Pricing</h1>
      <div className="mt-6">
        <PricingSettingsForm />
      </div>
    </div>
  );
}

import { requireAdmin } from "@/lib/adminAuth";
import ShopifySyncPanel from "@/adminComponents/ShopifySyncPanel";

export default async function AdminShopifySyncPage() {
  await requireAdmin();

  return (
    <div className="mx-auto w-full max-w-5xl">
      <h1 className="text-2xl font-semibold">Shopify Sync</h1>
      <p className="mt-2 text-sm text-zinc-600">
        Push all published house plans from your website to your Shopify store. Each plan becomes a
        Shopify product with Single Build and Builder License variants.
      </p>
      <div className="mt-6">
        <ShopifySyncPanel />
      </div>
    </div>
  );
}

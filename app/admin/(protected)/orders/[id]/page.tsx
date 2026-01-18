import Link from "next/link";
import { requireAdmin } from "@/lib/adminAuth";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { OrderStatusForm } from "@/adminComponents/OrderStatusForm";

export default async function AdminOrderDetailPage(props: { params: { id: string } }) {
  await requireAdmin();

  const supabase = getSupabaseAdmin() as any;

  const { data: order, error: orderErr }: any = await supabase
    .from("orders")
    .select(
      "id, email, phone, status, subtotal_cents, shipping_cents, total_cents, currency, created_at, stripe_checkout_session_id, stripe_payment_intent_id, billing_address, shipping_address, shipping_required, builder_code, builder_profile:builder_profiles(first_name,last_name,email,company)"
    )
    .eq("id", props.params.id)
    .maybeSingle();

  if (orderErr) {
    return <div className="text-sm text-red-600">{orderErr.message}</div>;
  }
  if (!order) {
    return <div className="text-sm">Order not found.</div>;
  }

  const { data: items }: any = await supabase
    .from("order_items")
    .select("id, slug, name, license_type, rush, paper_sets, addons, unit_price_cents, line_total_cents")
    .eq("order_id", order.id);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Order</h1>
        <Link className="text-sm underline" href="/admin/orders">
          Back
        </Link>
      </div>

      <div className="text-sm border rounded p-4 space-y-2">
        <div>
          <span className="font-medium">Order ID:</span> {order.id}
        </div>
        <div>
          <span className="font-medium">Email:</span> {order.email}
        </div>
        <div>
          <span className="font-medium">Status:</span> {order.status}
        </div>
        <div>
          <span className="font-medium">Totals:</span> ${(order.total_cents / 100).toFixed(2)} {String(order.currency).toUpperCase()}
        </div>
        <div>
          <span className="font-medium">Builder code:</span> {order.builder_code ? (
            <span className="font-mono">{order.builder_code}</span>
          ) : (
            <span className="text-zinc-400">—</span>
          )}
        </div>
        {order.builder_profile ? (
          <div>
            <span className="font-medium">Builder profile:</span>{" "}
            {`${order.builder_profile?.first_name ?? ""} ${order.builder_profile?.last_name ?? ""}`.trim()}
            {order.builder_profile?.email ? ` • ${order.builder_profile.email}` : ""}
            {order.builder_profile?.company ? ` • ${order.builder_profile.company}` : ""}
          </div>
        ) : null}
        <div>
          <span className="font-medium">Shipping required:</span> {order.shipping_required ? "yes" : "no"}
        </div>
      </div>

      <OrderStatusForm orderId={order.id} currentStatus={order.status} />

      <div className="text-sm border rounded p-4">
        <div className="font-medium">Order items</div>
        <pre className="mt-2 whitespace-pre-wrap">{JSON.stringify(items ?? [], null, 2)}</pre>
      </div>

      <div className="text-sm border rounded p-4">
        <div className="font-medium">Shipping address</div>
        <pre className="mt-2 whitespace-pre-wrap">{JSON.stringify(order.shipping_address ?? {}, null, 2)}</pre>
      </div>

      <div className="text-sm border rounded p-4">
        <div className="font-medium">Billing address</div>
        <pre className="mt-2 whitespace-pre-wrap">{JSON.stringify(order.billing_address ?? {}, null, 2)}</pre>
      </div>

      <div className="text-xs text-zinc-600">
        <div>Stripe checkout session: {order.stripe_checkout_session_id ?? ""}</div>
        <div>Stripe payment intent: {order.stripe_payment_intent_id ?? ""}</div>
        <div>Created: {new Date(order.created_at).toLocaleString()}</div>
      </div>
    </div>
  );
}

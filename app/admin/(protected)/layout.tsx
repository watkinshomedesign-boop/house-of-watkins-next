import { ReactNode } from "react";
import Link from "next/link";
import { requireAdmin } from "@/lib/adminAuth";

export default async function AdminProtectedLayout(props: { children: ReactNode }) {
  await requireAdmin();

  const previewConfigured = Boolean(String(process.env.PREVIEW_SECRET || "").trim());
  const studioPreviewConfigured = Boolean(String(process.env.NEXT_PUBLIC_PREVIEW_SECRET || "").trim());

  return (
    <div className="p-6">
      {!previewConfigured || !studioPreviewConfigured ? (
        <div className="mb-4 rounded-md border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
          Preview is not fully configured. Set env vars: PREVIEW_SECRET and NEXT_PUBLIC_PREVIEW_SECRET.
        </div>
      ) : null}
      <div className="mb-6 flex flex-wrap gap-3 text-sm">
        <Link className="underline" href="/admin/dashboard">
          Dashboard
        </Link>
        <Link className="underline" href="/admin/pages">
          Pages
        </Link>
        <Link className="underline" href="/admin/typography">
          Typography
        </Link>
        <Link className="underline" href="/studio">
          Content
        </Link>
        <Link className="underline" href="/admin/plans">
          Plans
        </Link>
        <Link className="underline" href="/admin/media">
          Media
        </Link>
        <Link className="underline" href="/admin/pricing">
          Pricing
        </Link>
        <Link className="underline" href="/admin/promos">
          Promos
        </Link>
        <Link className="underline" href="/admin/seo">
          SEO
        </Link>
        <Link className="underline" href="/admin/analytics">
          Analytics
        </Link>
        <Link className="underline" href="/admin/users">
          Users
        </Link>
        <Link className="underline" href="/admin/builders">
          Builders
        </Link>
        <Link className="underline" href="/admin/leads/homeowners">
          Leads (Homeowners)
        </Link>
        <Link className="underline" href="/admin/leads/builders">
          Leads (Builders)
        </Link>
        <Link className="underline" href="/admin/redirects">
          Redirects
        </Link>
        <Link className="underline" href="/admin/settings">
          Settings
        </Link>
        <Link className="underline" href="/admin/orders">
          Orders
        </Link>
        <Link className="underline" href="/admin/shopify-sync">
          Shopify Sync
        </Link>
      </div>
      {props.children}
    </div>
  );
}

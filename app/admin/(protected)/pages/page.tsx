import Link from "next/link";
import { requireAdmin } from "@/lib/adminAuth";
import { getServerSanityClient, hasSanity } from "@/lib/sanity/serverClient";

type PageRow = {
  key: string;
  title: string;
  route: string;
  schemaType: string;
  documentId: string;
};

type SanityDocMeta = {
  _id: string;
  _updatedAt?: string;
  status?: string;
};

const PAGES: PageRow[] = [
  { key: "home", title: "Home", route: "/", schemaType: "homePage", documentId: "homePage" },
  { key: "about", title: "About", route: "/about", schemaType: "aboutPage", documentId: "aboutPage" },
  { key: "contact", title: "Contact", route: "/contact-us", schemaType: "contactPage", documentId: "contactPage" },
  { key: "faq", title: "FAQ", route: "/faq", schemaType: "faqPage", documentId: "faqPage" },
  {
    key: "whatsIncluded",
    title: "What's Included",
    route: "/whats-included",
    schemaType: "whatsIncludedPage",
    documentId: "whatsIncludedPage",
  },
  {
    key: "contractors",
    title: "Contractors",
    route: "/contractors",
    schemaType: "contractorsPage",
    documentId: "contractorsPage",
  },
  {
    key: "portfolioIndex",
    title: "Portfolio Index",
    route: "/portfolio",
    schemaType: "portfolioIndexPage",
    documentId: "portfolioIndexPage",
  },
  { key: "terms", title: "Terms", route: "/terms", schemaType: "sitePage", documentId: "sitePage.terms" },
  { key: "privacy", title: "Privacy", route: "/privacy", schemaType: "sitePage", documentId: "sitePage.privacy" },
  {
    key: "privacyPolicy",
    title: "Privacy Policy",
    route: "/privacy-policy",
    schemaType: "sitePage",
    documentId: "sitePage.privacy-policy",
  },
  {
    key: "returnPolicy",
    title: "Return Policy",
    route: "/return-policy",
    schemaType: "sitePage",
    documentId: "sitePage.return-policy",
  },
  {
    key: "shippingPolicy",
    title: "Shipping Policy",
    route: "/shipping-policy",
    schemaType: "sitePage",
    documentId: "sitePage.shipping-policy",
  },
];

function formatDate(s?: string) {
  if (!s) return "";
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) return s;
  return d.toLocaleString();
}

function statusLabel(status?: string) {
  if (!status) return "";
  return status === "published" ? "Published" : "Draft";
}

function studioEditLink(schemaType: string, documentId: string) {
  // Best-effort stable link in Sanity Studio:
  // /studio/intent/edit/mode=presentation;id=<docId>;type=<schemaType>
  return `/studio/intent/edit/mode=presentation;id=${encodeURIComponent(documentId)};type=${encodeURIComponent(schemaType)}`;
}

function previewLink(path: string) {
  const params = new URLSearchParams();
  const secret = String(process.env.NEXT_PUBLIC_PREVIEW_SECRET || "").trim();
  if (secret) params.set("secret", secret);
  params.set("redirect", path);
  return `/api/preview?${params.toString()}`;
}

export default async function AdminPagesPage() {
  await requireAdmin();

  let metaByKey = new Map<string, SanityDocMeta>();

  if (hasSanity()) {
    const client = getServerSanityClient();
    const ids = PAGES.map((p) => p.documentId);
    const rows = await client.fetch(
      `*[_id in $ids]{ _id, _updatedAt, status }`,
      { ids },
      { cache: "no-store" } as any,
    );

    if (Array.isArray(rows)) {
      const byId = new Map<string, SanityDocMeta>();
      for (const r of rows as SanityDocMeta[]) {
        if (r && typeof r._id === "string") byId.set(r._id, r);
      }
      metaByKey = new Map(PAGES.map((p) => [p.key, byId.get(p.documentId) || { _id: p.documentId }]));
    }
  }

  return (
    <div className="mx-auto w-full max-w-6xl">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">Pages</h1>
        <div className="flex items-center gap-4 text-sm">
          <Link className="underline" href="/studio" target="_blank" rel="noreferrer">
            Open Studio
          </Link>
          <Link className="underline" href="/admin/media">
            Media
          </Link>
        </div>
      </div>

      <div className="mt-6 overflow-x-auto">
        <table className="min-w-full text-sm border">
          <thead>
            <tr className="bg-zinc-50">
              <th className="text-left p-2 border">Page</th>
              <th className="text-left p-2 border">Route</th>
              <th className="text-left p-2 border">Status</th>
              <th className="text-left p-2 border">Updated</th>
              <th className="text-left p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {PAGES.map((p) => {
              const meta = metaByKey.get(p.key);
              const updatedAt = meta?._updatedAt;
              const status = meta?.status;

              return (
                <tr key={p.key}>
                  <td className="p-2 border font-medium">{p.title}</td>
                  <td className="p-2 border">
                    <a className="underline" href={p.route} target="_blank" rel="noreferrer">
                      {p.route}
                    </a>
                  </td>
                  <td className="p-2 border">{statusLabel(status) || ""}</td>
                  <td className="p-2 border">{formatDate(updatedAt)}</td>
                  <td className="p-2 border">
                    <div className="flex flex-wrap items-center gap-3">
                      <a className="underline" href={studioEditLink(p.schemaType, p.documentId)} target="_blank" rel="noreferrer">
                        Edit Content
                      </a>
                      <a className="underline" href={previewLink(p.route)} target="_blank" rel="noreferrer">
                        Preview Draft
                      </a>
                      <a className="underline" href={p.route} target="_blank" rel="noreferrer">
                        View Live
                      </a>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {!hasSanity() ? (
        <div className="mt-6 rounded border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
          Sanity is not configured (missing NEXT_PUBLIC_SANITY_PROJECT_ID / NEXT_PUBLIC_SANITY_DATASET). Page metadata and status will not load.
        </div>
      ) : null}
    </div>
  );
}

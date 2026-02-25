/**
 * Shopify Admin API client – REST (2024-01).
 *
 * Env vars required:
 *   SHOPIFY_STORE_DOMAIN        – e.g. houseofwatkinsplans.com
 *   SHOPIFY_ADMIN_ACCESS_TOKEN  – permanent OAuth token (shpat_xxxxx)
 */

const API_VERSION = "2024-01";

function getConfig() {
  const domain = (process.env.SHOPIFY_STORE_DOMAIN || "").trim();
  const token = (process.env.SHOPIFY_ADMIN_ACCESS_TOKEN || "").trim();
  if (!domain || !token) {
    throw new Error(
      "[shopify] Missing SHOPIFY_STORE_DOMAIN or SHOPIFY_ADMIN_ACCESS_TOKEN env vars"
    );
  }
  return { domain, token };
}

function baseUrl() {
  const { domain } = getConfig();
  return `https://${domain}/admin/api/${API_VERSION}`;
}

function headers() {
  const { token } = getConfig();
  return {
    "Content-Type": "application/json",
    "X-Shopify-Access-Token": token,
  };
}

// ---------------------------------------------------------------------------
// Generic helpers
// ---------------------------------------------------------------------------

export async function shopifyGet<T = any>(path: string): Promise<T> {
  const res = await fetch(`${baseUrl()}${path}`, { method: "GET", headers: headers() });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`[shopify] GET ${path} → ${res.status}: ${body}`);
  }
  return res.json();
}

export async function shopifyPost<T = any>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${baseUrl()}${path}`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`[shopify] POST ${path} → ${res.status}: ${text}`);
  }
  return res.json();
}

export async function shopifyPut<T = any>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${baseUrl()}${path}`, {
    method: "PUT",
    headers: headers(),
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`[shopify] PUT ${path} → ${res.status}: ${text}`);
  }
  return res.json();
}

export async function shopifyDelete(path: string): Promise<void> {
  const res = await fetch(`${baseUrl()}${path}`, { method: "DELETE", headers: headers() });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`[shopify] DELETE ${path} → ${res.status}: ${text}`);
  }
}

// ---------------------------------------------------------------------------
// Product helpers
// ---------------------------------------------------------------------------

export type ShopifyProduct = {
  id: number;
  title: string;
  handle: string;
  body_html: string;
  vendor: string;
  product_type: string;
  tags: string;
  variants: Array<{
    id: number;
    title: string;
    price: string;
    sku: string;
    inventory_management: string | null;
    requires_shipping: boolean;
  }>;
  images: Array<{ id: number; src: string }>;
};

/** Fetch all products (paginated, up to ~250 per page). */
export async function getAllProducts(): Promise<ShopifyProduct[]> {
  const all: ShopifyProduct[] = [];
  let url: string | null = `/products.json?limit=250`;

  while (url) {
    const res: Response = await fetch(`${baseUrl()}${url}`, { method: "GET", headers: headers() });
    if (!res.ok) {
      const body = await res.text();
      throw new Error(`[shopify] GET ${url} → ${res.status}: ${body}`);
    }
    const json = await res.json();
    all.push(...(json.products ?? []));

    // Parse Link header for pagination
    const link: string = res.headers.get("link") || "";
    const next: RegExpMatchArray | null = link.match(/<([^>]+)>;\s*rel="next"/);
    if (next) {
      const nextUrl: URL = new URL(next[1]);
      url = nextUrl.pathname.replace(`/admin/api/${API_VERSION}`, "") + nextUrl.search;
    } else {
      url = null;
    }
  }

  return all;
}

export async function createProduct(product: Record<string, any>): Promise<ShopifyProduct> {
  const res = await shopifyPost<{ product: ShopifyProduct }>("/products.json", { product });
  return res.product;
}

export async function updateProduct(id: number, product: Record<string, any>): Promise<ShopifyProduct> {
  const res = await shopifyPut<{ product: ShopifyProduct }>(`/products/${id}.json`, { product });
  return res.product;
}

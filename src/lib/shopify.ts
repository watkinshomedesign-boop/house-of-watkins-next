/**
 * Shopify Admin API client – REST (2024-01).
 *
 * Uses OAuth client_credentials to obtain short-lived access tokens (24 h).
 * Tokens are cached in-memory and refreshed automatically when expired.
 *
 * Env vars required:
 *   SHOPIFY_STORE_DOMAIN  – e.g. vterik-w0.myshopify.com
 *   SHOPIFY_CLIENT_ID     – Custom app API key (client ID)
 *   SHOPIFY_CLIENT_SECRET – Custom app API secret (shpss_xxxxx)
 */

const API_VERSION = "2024-01";

// In-memory token cache
let cachedToken: string | null = null;
let tokenExpiresAt = 0; // epoch ms

function getDomain(): string {
  const domain = (process.env.SHOPIFY_STORE_DOMAIN || "").trim();
  if (!domain) throw new Error("[shopify] Missing SHOPIFY_STORE_DOMAIN env var");
  return domain;
}

function getClientCredentials() {
  const clientId = (process.env.SHOPIFY_CLIENT_ID || "").trim();
  const clientSecret = (process.env.SHOPIFY_CLIENT_SECRET || "").trim();
  if (!clientId || !clientSecret) {
    throw new Error("[shopify] Missing SHOPIFY_CLIENT_ID or SHOPIFY_CLIENT_SECRET env vars");
  }
  return { clientId, clientSecret };
}

/** Request a fresh access token via OAuth client_credentials grant. */
async function requestAccessToken(): Promise<string> {
  const domain = getDomain();
  const { clientId, clientSecret } = getClientCredentials();

  const res: Response = await fetch(`https://${domain}/admin/oauth/access_token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `grant_type=client_credentials&client_id=${clientId}&client_secret=${clientSecret}`,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`[shopify] OAuth token request failed (${res.status}): ${text}`);
  }

  const json = await res.json();
  const token = json.access_token as string;
  const expiresIn = (json.expires_in as number) || 86399;

  // Cache with 5-minute safety margin
  cachedToken = token;
  tokenExpiresAt = Date.now() + (expiresIn - 300) * 1000;

  return token;
}

/** Get a valid access token, refreshing if expired. */
async function getAccessToken(): Promise<string> {
  if (cachedToken && Date.now() < tokenExpiresAt) return cachedToken;
  return requestAccessToken();
}

function baseUrl() {
  const domain = getDomain();
  return `https://${domain}/admin/api/${API_VERSION}`;
}

async function headers() {
  const token = await getAccessToken();
  return {
    "Content-Type": "application/json",
    "X-Shopify-Access-Token": token,
  };
}

// ---------------------------------------------------------------------------
// Generic helpers
// ---------------------------------------------------------------------------

export async function shopifyGet<T = any>(path: string): Promise<T> {
  const res = await fetch(`${baseUrl()}${path}`, { method: "GET", headers: await headers() });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`[shopify] GET ${path} → ${res.status}: ${body}`);
  }
  return res.json();
}

export async function shopifyPost<T = any>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${baseUrl()}${path}`, {
    method: "POST",
    headers: await headers(),
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
    headers: await headers(),
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`[shopify] PUT ${path} → ${res.status}: ${text}`);
  }
  return res.json();
}

export async function shopifyDelete(path: string): Promise<void> {
  const res = await fetch(`${baseUrl()}${path}`, { method: "DELETE", headers: await headers() });
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
    const res: Response = await fetch(`${baseUrl()}${url}`, { method: "GET", headers: await headers() });
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

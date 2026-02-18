import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/adminApiAuth";

/**
 * One-time OAuth flow for Shopify.
 *
 * GET  /api/admin/shopify-oauth          → redirects to Shopify to authorize scopes
 * GET  /api/admin/shopify-oauth?code=... → exchanges code for permanent access token
 */

const SCOPES = "read_products,write_products,read_inventory,write_inventory";

function getOAuthConfig() {
  const domain = (process.env.SHOPIFY_STORE_DOMAIN || "").trim();
  const clientId = (process.env.SHOPIFY_CLIENT_ID || "").trim();
  const clientSecret = (process.env.SHOPIFY_CLIENT_SECRET || "").trim();
  if (!domain || !clientId || !clientSecret) {
    throw new Error("Missing SHOPIFY_STORE_DOMAIN, SHOPIFY_CLIENT_ID, or SHOPIFY_CLIENT_SECRET");
  }
  return { domain, clientId, clientSecret };
}

export async function GET(req: Request) {
  const auth = await requireAdminApi();
  if (!auth.ok) return auth.response;

  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const { domain, clientId, clientSecret } = getOAuthConfig();

  // Step 2: Exchange authorization code for permanent access token
  if (code) {
    const tokenRes = await fetch(`https://${domain}/admin/oauth/access_token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
      }),
    });

    if (!tokenRes.ok) {
      const text = await tokenRes.text();
      return NextResponse.json({ error: `Token exchange failed: ${text}` }, { status: 500 });
    }

    const tokenData = await tokenRes.json();
    // Return the token — user should save it as SHOPIFY_ADMIN_ACCESS_TOKEN
    return new NextResponse(
      `<html>
        <head><title>Shopify OAuth Complete</title></head>
        <body style="font-family:system-ui;padding:40px;max-width:600px;margin:0 auto">
          <h1>Shopify OAuth Complete!</h1>
          <p><strong>Access Token:</strong></p>
          <pre style="background:#f1f1f1;padding:12px;border-radius:6px;word-break:break-all">${tokenData.access_token}</pre>
          <p><strong>Scope:</strong> ${tokenData.scope}</p>
          <p style="margin-top:20px;color:#666">
            Save this token as <code>SHOPIFY_ADMIN_ACCESS_TOKEN</code> in your Vercel environment variables,
            then remove the SHOPIFY_CLIENT_ID and SHOPIFY_CLIENT_SECRET vars (they are no longer needed).
          </p>
        </body>
      </html>`,
      { headers: { "Content-Type": "text/html" } }
    );
  }

  // Step 1: Redirect to Shopify OAuth authorization page
  const redirectUri = `${url.origin}/api/admin/shopify-oauth`;
  const nonce = Math.random().toString(36).slice(2);
  const authUrl =
    `https://${domain}/admin/oauth/authorize` +
    `?client_id=${clientId}` +
    `&scope=${SCOPES}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&state=${nonce}`;

  return NextResponse.redirect(authUrl);
}

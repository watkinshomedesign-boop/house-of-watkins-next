/**
 * Push a GA4 ecommerce event to the GTM dataLayer.
 * Safe to call server-side (no-ops when `window` is unavailable).
 */
export function gtmPush(data: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  // Clear previous ecommerce object to avoid stale data bleeding across events
  window.dataLayer.push({ ecommerce: null });
  window.dataLayer.push(data);
}

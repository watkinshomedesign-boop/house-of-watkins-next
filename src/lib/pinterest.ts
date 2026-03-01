// Pinterest event tracking utility
// Docs: https://developers.pinterest.com/docs/conversions/conversion-management/

type PinterestEventName =
  | 'pagevisit'
  | 'viewcategory'
  | 'search'
  | 'addtocart'
  | 'checkout'
  | 'lead'
  | 'signup'
  | 'custom';

interface PinterestEventData {
  value?: number;
  order_quantity?: number;
  currency?: string;
  order_id?: string;
  product_name?: string;
  product_id?: string;
  product_category?: string;
  product_price?: number;
  line_items?: Array<{
    product_name?: string;
    product_id?: string;
    product_price?: number;
    product_quantity?: number;
    product_category?: string;
  }>;
  [key: string]: unknown;
}

declare global {
  interface Window {
    pintrk?: (action: string, event?: string, data?: PinterestEventData) => void;
  }
}

export function trackPinterestEvent(
  eventName: PinterestEventName,
  data?: PinterestEventData
) {
  if (typeof window !== 'undefined' && window.pintrk) {
    window.pintrk('track', eventName, data);
  }
}

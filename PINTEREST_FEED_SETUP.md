# Pinterest Product Feed (House of Watkins)

## Feed URLs

- `https://houseofwatkins.com/pinterest-feed.xml`
- `https://houseofwatkins.com/api/pinterest-feed` (redirects to the XML)
- `https://houseofwatkins.com/pinterest-feed.csv`
- `https://houseofwatkins.com/api/pinterest-feed.csv` (redirects to the CSV)

## What it contains

The feed is generated dynamically from:

- Supabase: published plans (`plans` table)
- Sanity: resolved plan media URLs (via existing `planMedia` documents)

The feed is RSS 2.0 XML with Google Merchant / Pinterest-style `g:` fields.

## Pinterest setup

1. In Pinterest Business → Catalogs / Data sources, choose **Data source URL**.
2. Paste one of the feed URLs above (recommended: `/pinterest-feed.csv` if you are seeing Error 102).
3. Set schedule to **daily**.
4. Use Pinterest’s **Test your data source** validator.

## Notes / troubleshooting

- The feed uses absolute URLs for product links and images.
- Availability is always `in_stock`.
- Price is computed as the base single-license price for each plan using the site’s current pricing settings.
- If Pinterest reports formatting errors, fetch the feed URL in a browser and check that the feed content is returned (not HTML).

## Error 102 remediation

If your Pinterest catalog currently points at an old WooCommerce feed:

1. Disable/remove the old WooCommerce data source.
2. Create a new data source that points to this feed URL (try the CSV feed first).
3. Re-test in Pinterest’s validator.

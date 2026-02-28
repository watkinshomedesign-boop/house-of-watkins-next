-- Daily visitor stats aggregated server-side
CREATE OR REPLACE FUNCTION get_daily_visitor_stats(start_date timestamptz)
RETURNS TABLE (
  day text,
  total_visits bigint,
  unique_sessions bigint,
  new_visitors bigint,
  returning_visitors bigint
) LANGUAGE sql STABLE AS $$
  SELECT
    to_char(created_at AT TIME ZONE 'UTC', 'YYYY-MM-DD') AS day,
    count(*)::bigint AS total_visits,
    count(DISTINCT session_id)::bigint AS unique_sessions,
    count(*) FILTER (WHERE is_new_visitor = true)::bigint AS new_visitors,
    count(*) FILTER (WHERE is_new_visitor = false)::bigint AS returning_visitors
  FROM page_visits
  WHERE created_at >= start_date
  GROUP BY day
  ORDER BY day;
$$;

-- Top referrer domains aggregated server-side
CREATE OR REPLACE FUNCTION get_top_referrers(start_date timestamptz, max_rows int DEFAULT 20)
RETURNS TABLE (
  domain text,
  visit_count bigint
) LANGUAGE sql STABLE AS $$
  SELECT
    CASE
      WHEN referrer IS NULL OR referrer = '' THEN NULL
      ELSE regexp_replace(
        regexp_replace(referrer, '^https?://', ''),
        '/.*$', ''
      )
    END AS domain,
    count(*)::bigint AS visit_count
  FROM page_visits
  WHERE created_at >= start_date
    AND referrer IS NOT NULL
    AND referrer != ''
  GROUP BY domain
  HAVING CASE
    WHEN referrer IS NULL OR referrer = '' THEN NULL
    ELSE regexp_replace(
      regexp_replace(referrer, '^https?://', ''),
      '/.*$', ''
    )
  END NOT IN ('houseofwatkins.com', 'www.houseofwatkins.com')
  ORDER BY visit_count DESC
  LIMIT max_rows;
$$;

-- Top traffic sources aggregated server-side
CREATE OR REPLACE FUNCTION get_top_sources(start_date timestamptz, max_rows int DEFAULT 20)
RETURNS TABLE (
  source text,
  visit_count bigint
) LANGUAGE sql STABLE AS $$
  SELECT
    COALESCE(
      NULLIF(utm_source, ''),
      CASE
        WHEN referrer IS NULL OR referrer = '' THEN 'direct'
        ELSE regexp_replace(
          regexp_replace(referrer, '^https?://', ''),
          '/.*$', ''
        )
      END
    ) AS source,
    count(*)::bigint AS visit_count
  FROM page_visits
  WHERE created_at >= start_date
  GROUP BY source
  HAVING COALESCE(
    NULLIF(utm_source, ''),
    CASE
      WHEN referrer IS NULL OR referrer = '' THEN 'direct'
      ELSE regexp_replace(
        regexp_replace(referrer, '^https?://', ''),
        '/.*$', ''
      )
    END
  ) NOT IN ('houseofwatkins.com', 'www.houseofwatkins.com')
  ORDER BY visit_count DESC
  LIMIT max_rows;
$$;

-- Total unique sessions across entire period
CREATE OR REPLACE FUNCTION get_total_unique_visitors(start_date timestamptz)
RETURNS bigint LANGUAGE sql STABLE AS $$
  SELECT count(DISTINCT session_id)::bigint
  FROM page_visits
  WHERE created_at >= start_date;
$$;

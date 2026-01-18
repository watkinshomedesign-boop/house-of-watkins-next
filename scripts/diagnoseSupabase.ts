import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

import { collectSupabaseDiagnosticsReport } from "../src/lib/supabaseDiagnostics";

async function main() {
  const report = await collectSupabaseDiagnosticsReport();
  console.log(JSON.stringify({ ok: true, report }, null, 2));

  const expectedCount = 12;
  const publishedCount = report.plans_count_by_status["published"] ?? 0;

  if (report.expected_slugs.length && report.missing_expected_slugs.length) {
    process.exitCode = 2;
  } else if (publishedCount !== expectedCount) {
    process.exitCode = 2;
  }
}

main().catch((err) => {
  console.error(JSON.stringify({ ok: false, error: String(err?.message || err) }, null, 2));
  process.exitCode = 1;
});

import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config({ path: ".env.local" });

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url) throw new Error("NEXT_PUBLIC_SUPABASE_URL is missing");
  if (!serviceKey) throw new Error("SUPABASE_SERVICE_ROLE_KEY is missing");

  const supabase = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const pageSize = 1000;
  let offset = 0;
  const names: string[] = [];

  while (true) {
    const { data, error } = await supabase
      .from("plans")
      .select("name,status")
      .eq("status", "published")
      .order("name", { ascending: true })
      .range(offset, offset + pageSize - 1);

    if (error) throw error;

    const batch = (data ?? []).map((r: any) => String(r.name || "").trim()).filter(Boolean);
    names.push(...batch);

    if (!data || data.length < pageSize) break;
    offset += pageSize;
  }

  // Print names only, one per line
  for (const n of names) {
    console.log(n);
  }
}

main().catch((err) => {
  console.error(String(err?.message || err));
  process.exitCode = 1;
});

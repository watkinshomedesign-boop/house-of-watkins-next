import process from "node:process";
import dotenv from "dotenv";

// Load env files like Next does in local dev. Keep this script Windows-friendly.
dotenv.config({ path: ".env.local", quiet: true });
dotenv.config({ path: ".env", quiet: true });

type Result = {
  ok: boolean;
  message: string;
};

type PreviewStatus = {
  server: {
    PREVIEW_SECRET: boolean;
    SANITY_API_READ_TOKEN: boolean;
  };
  client: {
    NEXT_PUBLIC_PREVIEW_SECRET: boolean;
    NEXT_PUBLIC_SITE_URL: boolean;
  };
};

function env(name: string): string {
  return String(process.env[name] ?? "").trim();
}

function baseUrl(): string {
  const fromEnv = env("NEXT_PUBLIC_SITE_URL");
  if (fromEnv) return fromEnv.replace(/\/$/, "");
  // local dev script default matches package.json `next dev -p 3001`
  return "http://localhost:3001";
}

async function checkEndpoint(url: string): Promise<{ status: number; redirectedTo?: string }> {
  const res = await fetch(url, { redirect: "manual" });
  const loc = res.headers.get("location") ?? undefined;
  return { status: res.status, redirectedTo: loc };
}

async function verifyPreview(): Promise<Result> {
  const base = baseUrl();

  // Probe server
  try {
    const probe = await fetch(`${base}/`, { redirect: "manual" });
    if (!probe.ok && probe.status >= 500) {
      return {
        ok: false,
        message: `❌ Server responded with ${probe.status} at ${base}/. Is \"npm run dev\" running?`,
      };
    }
  } catch {
    return {
      ok: false,
      message: `❌ Could not reach ${base}/. Start the dev server: npm run dev (port 3001).`,
    };
  }

  let status: PreviewStatus | null = null;
  try {
    const r = await fetch(`${base}/api/preview/status`, { cache: "no-store" });
    const j = (await r.json()) as PreviewStatus;
    status = j;
  } catch {
    return {
      ok: false,
      message:
        "❌ Could not read /api/preview/status. Is the app running, and is app/api/preview/status/route.ts present?",
    };
  }

  const missing: string[] = [];
  if (!status?.server?.PREVIEW_SECRET) missing.push("PREVIEW_SECRET (server)");
  if (!status?.server?.SANITY_API_READ_TOKEN) missing.push("SANITY_API_READ_TOKEN (server)");
  if (!status?.client?.NEXT_PUBLIC_PREVIEW_SECRET) missing.push("NEXT_PUBLIC_PREVIEW_SECRET (client)");

  if (missing.length) {
    return {
      ok: false,
      message:
        "❌ Preview is misconfigured. Missing:\n" +
        missing.map((m) => `- ${m}`).join("\n") +
        "\n\nFix: set these in .env.local, then restart `npm run dev`.\n" +
        "Optional (recommended): NEXT_PUBLIC_SITE_URL for production.",
    };
  }

  const sampleRedirect = "/about";

  const serverSecret = env("PREVIEW_SECRET");
  const previewUrl = `${base}/api/preview?secret=${encodeURIComponent(serverSecret)}&redirect=${encodeURIComponent(sampleRedirect)}`;
  const exitUrl = `${base}/api/exit-preview?redirect=${encodeURIComponent(sampleRedirect)}`;

  const p = await checkEndpoint(previewUrl);
  if (p.status !== 307 && p.status !== 302) {
    return {
      ok: false,
      message: `❌ Preview enable failed. Expected redirect (302/307) but got ${p.status}. File: app/api/preview/route.ts`,
    };
  }

  const e = await checkEndpoint(exitUrl);
  if (e.status !== 307 && e.status !== 302) {
    return {
      ok: false,
      message: `❌ Exit preview failed. Expected redirect (302/307) but got ${e.status}. File: app/api/exit-preview/route.ts`,
    };
  }

  return {
    ok: true,
    message:
      `✅ Preview enabled and redirected (${p.status} → ${p.redirectedTo ?? "<no location>"})\n` +
      `✅ Exit preview disabled and redirected (${e.status} → ${e.redirectedTo ?? "<no location>"})`,
  };
}

verifyPreview()
  .then((r) => {
    console.log(r.message);
    process.exit(r.ok ? 0 : 1);
  })
  .catch((err) => {
    console.error("❌ verify:preview crashed. File: scripts/verifyPreview.ts");
    console.error(err);
    process.exit(1);
  });

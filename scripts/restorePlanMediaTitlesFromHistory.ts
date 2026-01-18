import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { getSanityClient, getSanityConfig } from "../src/lib/sanity/client";

type Args = {
  dryRun: boolean;
  apply: boolean;
  since: string;
  before: string;
  limit: number;
};

function parseArgs(argv: string[]): Args {
  let dryRun = true;
  let apply = false;
  let since = new Date(Date.now() - 1000 * 60 * 60).toISOString();
  let before = "";
  let limit = 200;

  for (const a of argv) {
    if (a === "--dry-run") dryRun = true;
    if (a === "--apply") {
      apply = true;
      dryRun = false;
    }
    if (a.startsWith("--since=")) {
      const raw = a.slice("--since=".length).trim();
      if (raw) since = raw;
    }
    if (a.startsWith("--before=")) {
      const raw = a.slice("--before=".length).trim();
      if (raw) before = raw;
    }
    if (a.startsWith("--limit=")) {
      const raw = a.slice("--limit=".length).trim();
      const n = Number(raw);
      if (Number.isFinite(n)) limit = Math.max(1, Math.floor(n));
    }
  }

  if (!before) {
    throw new Error("Missing --before=<ISO timestamp>. Example: --before=2026-01-08T12:20:00+03:00");
  }

  return { dryRun, apply, since, before, limit };
}

function encodeDocId(id: string) {
  return encodeURIComponent(id).replace(/%2F/g, "/");
}

async function fetchHistoryDocTitle(opts: {
  projectId: string;
  dataset: string;
  apiVersion: string;
  token: string;
  docId: string;
  time: string;
}): Promise<string | null> {
  const base = `https://${opts.projectId}.api.sanity.io/v${opts.apiVersion}`;
  const url = `${base}/data/history/${encodeURIComponent(opts.dataset)}/documents/${encodeDocId(opts.docId)}?time=${encodeURIComponent(
    opts.time,
  )}`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${opts.token}`,
      Accept: "application/json",
    },
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`History API failed for ${opts.docId}: ${res.status} ${res.statusText} ${body}`);
  }

  const json: any = await res.json();
  const doc = Array.isArray(json?.documents) ? json.documents[0] : null;
  const title = doc && typeof doc.title === "string" ? doc.title.trim() : "";
  return title ? title : null;
}

async function main() {
  const { dryRun, apply, since, before, limit } = parseArgs(process.argv.slice(2));

  const token = process.env.SANITY_API_WRITE_TOKEN ?? process.env.SANITY_API_TOKEN;
  if (!token) {
    throw new Error(
      "Missing SANITY_API_WRITE_TOKEN (or SANITY_API_TOKEN) in .env.local. Create a Sanity API token with write access and set SANITY_API_WRITE_TOKEN=...",
    );
  }

  const config = getSanityConfig();
  if (!config) {
    throw new Error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID / NEXT_PUBLIC_SANITY_DATASET in .env.local");
  }

  const sanity = getSanityClient({ token, useCdn: false, perspective: "published" });

  const groq =
    `*[_type == "planMedia" && _updatedAt > $since] | order(_updatedAt desc)[0...$limit] { _id, _updatedAt, title, planSlug }`;

  const docs = (await sanity.fetch(groq, { since, limit })) as Array<{
    _id: string;
    _updatedAt: string;
    title?: string;
    planSlug?: string;
  }>;

  if (!docs || docs.length === 0) {
    console.log("No planMedia docs found in the given time window.");
    return;
  }

  console.log(`Found ${docs.length} planMedia docs updated after ${since}.`);

  let checked = 0;
  let wouldRestore = 0;
  let restored = 0;
  let skippedNoHistory = 0;
  let skippedAlreadyMatch = 0;

  for (const d of docs) {
    const id = String(d._id || "").trim();
    if (!id) continue;

    checked += 1;

    let prevTitle: string | null = null;
    try {
      prevTitle = await fetchHistoryDocTitle({
        projectId: config.projectId,
        dataset: config.dataset,
        apiVersion: config.apiVersion,
        token,
        docId: id,
        time: before,
      });
    } catch (e: any) {
      console.log(`[skip] ${id} (failed to read history: ${e?.message || String(e)})`);
      skippedNoHistory += 1;
      continue;
    }

    if (!prevTitle) {
      console.log(`[skip] ${id} (no title at --before time; doc likely created after that)`);
      skippedNoHistory += 1;
      continue;
    }

    const currentTitle = String(d.title ?? "").trim();
    if (currentTitle === prevTitle) {
      skippedAlreadyMatch += 1;
      continue;
    }

    wouldRestore += 1;

    if (dryRun) {
      console.log(`[dry-run] restore ${id} title: ${JSON.stringify(currentTitle)} -> ${JSON.stringify(prevTitle)}`);
      continue;
    }

    if (apply) {
      await sanity.patch(id).set({ title: prevTitle }).commit({ autoGenerateArrayKeys: true });
      restored += 1;
      console.log(`[apply] restored ${id} title -> ${JSON.stringify(prevTitle)}`);
    }
  }

  console.log(
    JSON.stringify(
      {
        mode: dryRun ? "dry-run" : "apply",
        since,
        before,
        limit,
        checked,
        wouldRestore,
        restored,
        skippedNoHistory,
        skippedAlreadyMatch,
      },
      null,
      2,
    ),
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

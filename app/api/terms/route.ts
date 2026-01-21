import { NextResponse } from "next/server";

import { readFile } from "fs/promises";
import { stat } from "fs/promises";
import path from "path";
import * as mammoth from "mammoth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

let cached: { html: string; mtimeMs: number } | null = null;

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "assets", "Terms & Conditions.docx");
    const fileStat = await stat(filePath);

    let html: string;
    if (cached && cached.mtimeMs === fileStat.mtimeMs) {
      html = cached.html;
    } else {
      const buffer = await readFile(filePath);
      const result = await mammoth.convertToHtml({ buffer });
      html = String(result.value || "");
      cached = { html, mtimeMs: fileStat.mtimeMs };
    }

    return NextResponse.json({ html }, { headers: { "Cache-Control": "no-store" } });
  } catch (e: any) {
    return NextResponse.json(
      { error: String(e?.message ?? "Failed to load terms") },
      { status: 500, headers: { "Cache-Control": "no-store" } }
    );
  }
}

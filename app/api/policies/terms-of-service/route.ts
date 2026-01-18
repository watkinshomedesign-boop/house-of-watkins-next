import { NextResponse } from "next/server";

import { readFile } from "fs/promises";
import path from "path";
import * as mammoth from "mammoth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "assets", "TERMS AND CONDITIONS2.docx");
    const buffer = await readFile(filePath);

    const result = await mammoth.convertToHtml({ buffer });
    const html = String(result.value || "");

    return NextResponse.json({ html }, { headers: { "Cache-Control": "no-store" } });
  } catch (e: any) {
    return NextResponse.json(
      { error: String(e?.message ?? "Failed to load terms") },
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );
  }
}

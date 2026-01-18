import { NextResponse } from "next/server";
import { validatePromoCodeServer } from "@/lib/promoCodesServer";

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as any;
  const code = String(body.code || "");
  const subtotalCents = body.subtotalCents == null ? undefined : Number(body.subtotalCents);

  const promo = await validatePromoCodeServer({ code, subtotalCents });
  if (!promo) {
    return NextResponse.json({ ok: false, promo: null });
  }

  return NextResponse.json({
    ok: true,
    promo: {
      code: promo.code,
      discount_type: promo.discount_type,
      discount_value: promo.discount_value,
      applies_to: promo.applies_to,
      metadata: promo.metadata ?? {},
    },
  });
}

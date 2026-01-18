import { NextResponse } from "next/server";

export async function GET() {
  const readFirst = (keys: string[]) => {
    for (const k of keys) {
      const v = String(process.env[k] ?? "").trim();
      if (v) return { key: k, value: v };
    }
    return { key: "", value: "" };
  };

  const client = readFirst([
    "NEXT_PUBLIC_PAYPAL_CLIENT_ID",
    "PAYPAL_CLIENT_ID",
    "PAYPAL_PUBLIC_CLIENT_ID",
    "PAYPAL_CLIENTID",
  ]);

  if (!client.value) {
    return NextResponse.json(
      {
        error: "PayPal not configured",
        diagnostics: {
          checkedClientIdKeys: ["NEXT_PUBLIC_PAYPAL_CLIENT_ID", "PAYPAL_CLIENT_ID", "PAYPAL_PUBLIC_CLIENT_ID", "PAYPAL_CLIENTID"],
          foundClientId: false,
          hasClientSecret: Boolean(String(process.env.PAYPAL_CLIENT_SECRET ?? process.env.PAYPAL_SECRET ?? process.env.PAYPAL_SECRET_KEY ?? "").trim()),
        },
      },
      { status: 500 },
    );
  }

  return NextResponse.json({ clientId: client.value, currency: "USD" });
}

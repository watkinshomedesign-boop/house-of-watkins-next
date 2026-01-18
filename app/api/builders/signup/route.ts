import { NextResponse } from "next/server";

import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { hubspotUpsertContact } from "@/lib/hubspot/client";

type SignupPayload = {
  firstName?: string;
  lastName?: string;
  email?: string;
  company?: string;
  role?: string;
  licenseNumber?: string;
  attestedBuilder?: boolean;
};

function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function generateCode() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const len = 7;
  let out = "";
  for (let i = 0; i < len; i++) {
    out += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return `BUILDER-${out}`;
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as SignupPayload | null;
  if (!body) return jsonError("Invalid JSON body");

  const firstName = String(body.firstName ?? "").trim();
  const lastName = String(body.lastName ?? "").trim();
  const email = normalizeEmail(String(body.email ?? ""));
  const company = String(body.company ?? "").trim();
  const role = String(body.role ?? "").trim();
  const licenseNumber = String(body.licenseNumber ?? "").trim();
  const attestedBuilder = Boolean(body.attestedBuilder);

  if (!firstName) return jsonError("First name is required");
  if (!lastName) return jsonError("Last name is required");
  if (!email || !email.includes("@")) return jsonError("Valid email is required");
  if (!company) return jsonError("Company is required");
  if (!role) return jsonError("Role is required");
  if (!attestedBuilder) return jsonError("Builder attestation is required");

  const supabase = getSupabaseAdmin() as any;

  // Upsert builder profile by email (do not create duplicates)
  const { data: existing, error: findErr }: any = await supabase
    .from("builder_profiles")
    .select("id,email")
    .eq("email", email)
    .maybeSingle();

  if (findErr) return jsonError(findErr.message, 500);

  let builderProfileId: string;

  if (existing?.id) {
    builderProfileId = existing.id as string;
    const { error: updErr } = await supabase
      .from("builder_profiles")
      .update({
        first_name: firstName,
        last_name: lastName,
        company,
        role,
        license_number: licenseNumber || null,
        attested_builder: true,
      })
      .eq("id", builderProfileId);

    if (updErr) return jsonError(updErr.message, 500);
  } else {
    const { data: ins, error: insErr }: any = await supabase
      .from("builder_profiles")
      .insert({
        first_name: firstName,
        last_name: lastName,
        email,
        company,
        role,
        license_number: licenseNumber || null,
        attested_builder: true,
      })
      .select("id")
      .single();

    if (insErr) return jsonError(insErr.message, 500);
    builderProfileId = ins.id as string;
  }

  // Ensure exactly one active code
  const { data: existingCode, error: codeFindErr }: any = await supabase
    .from("builder_discount_codes")
    .select(
      "id,code,discount_percent,active,includes_builder_pack,free_mirror,cad_discount_percent,priority_support"
    )
    .eq("builder_profile_id", builderProfileId)
    .eq("active", true)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (codeFindErr) return jsonError(codeFindErr.message, 500);

  let codeRow = existingCode as any;

  if (!codeRow?.code) {
    // Try a few times in case of uniqueness collisions
    let lastErr: any = null;
    for (let attempt = 0; attempt < 5; attempt++) {
      const code = generateCode();
      const { data: created, error: createErr }: any = await supabase
        .from("builder_discount_codes")
        .insert({
          builder_profile_id: builderProfileId,
          code,
          discount_percent: 15,
          active: true,
          includes_builder_pack: true,
          free_mirror: true,
          cad_discount_percent: 50,
          priority_support: true,
        })
        .select(
          "id,code,discount_percent,active,includes_builder_pack,free_mirror,cad_discount_percent,priority_support"
        )
        .single();

      if (!createErr) {
        codeRow = created as any;
        lastErr = null;
        break;
      }

      const msg = String((createErr as any)?.message ?? "");
      if (msg.toLowerCase().includes("duplicate") || msg.includes("23505")) {
        lastErr = createErr;
        continue;
      }

      lastErr = createErr;
      break;
    }

    if (lastErr) return jsonError(String(lastErr?.message ?? "Failed to create code"), 500);
  }

  // HubSpot sync (non-blocking)
  try {
    await hubspotUpsertContact({
      email,
      firstname: firstName,
      lastname: lastName,
      extraProperties: {
        contact_type: "builder",
        company,
        jobtitle: role,
        builder_code: String(codeRow.code),
        builder_discount_percent: 15,
        builder_pack: true,
        builder_pack_mirror: true,
        builder_pack_cad_discount_percent: 50,
        builder_pack_priority_support: true,
      },
    });

    await supabase
      .from("builder_profiles")
      .update({ hubspot_sync_status: "ok" })
      .eq("id", builderProfileId);
  } catch (e: any) {
    await supabase
      .from("builder_profiles")
      .update({ hubspot_sync_status: `error:${String(e?.message ?? "unknown")}`.slice(0, 250) })
      .eq("id", builderProfileId);
  }

  const { data: profile, error: profileErr }: any = await supabase
    .from("builder_profiles")
    .select("id,created_at,first_name,last_name,email,company,role,license_number,hubspot_sync_status")
    .eq("id", builderProfileId)
    .single();

  if (profileErr) return jsonError(profileErr.message, 500);

  return NextResponse.json({
    builderProfile: profile,
    code: {
      code: String(codeRow.code),
      discountPercent: Number(codeRow.discount_percent ?? 15),
      builderPack: {
        freeMirror: Boolean(codeRow.free_mirror ?? true),
        cadDiscountPercent: Number(codeRow.cad_discount_percent ?? 50),
        prioritySupport: Boolean(codeRow.priority_support ?? true),
      },
    },
  });
}

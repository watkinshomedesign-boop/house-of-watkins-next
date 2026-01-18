type HubSpotUpsertContactInput = {
  email: string;
  firstname?: string;
  lastname?: string;
  phone?: string;
  message?: string;
  pageUrl?: string;
  extraProperties?: Record<string, string | number | boolean | null | undefined>;
};

export async function hubspotUpsertContact(input: HubSpotUpsertContactInput) {
  const token = process.env.HUBSPOT_PRIVATE_APP_TOKEN;
  if (!token) {
    throw new Error("HUBSPOT_PRIVATE_APP_TOKEN is not configured");
  }

  const properties: Record<string, string> = {
    email: input.email,
  };
  if (input.firstname) properties.firstname = input.firstname;
  if (input.lastname) properties.lastname = input.lastname;
  if (input.phone) properties.phone = input.phone;

  if (input.message) properties.message = input.message;
  if (input.pageUrl) properties.website = input.pageUrl;

  if (input.extraProperties) {
    for (const [k, v] of Object.entries(input.extraProperties)) {
      if (v === null || typeof v === "undefined") continue;
      properties[k] = String(v);
    }
  }

  const res = await fetch("https://api.hubapi.com/crm/v3/objects/contacts", {
    method: "POST",
    headers: {
      authorization: `Bearer ${token}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({ properties }),
  });

  if (res.ok) return;

  const json = await res.json().catch(() => null);

  const duplicate = json?.category === "CONFLICT" || String(json?.message ?? "").toLowerCase().includes("already exists");
  if (!duplicate) {
    throw new Error(json?.message || "HubSpot request failed");
  }

  const patch = await fetch(
    `https://api.hubapi.com/crm/v3/objects/contacts/${encodeURIComponent(input.email)}?idProperty=email`,
    {
      method: "PATCH",
      headers: {
        authorization: `Bearer ${token}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({ properties }),
    }
  );

  if (!patch.ok) {
    const j2 = await patch.json().catch(() => null);
    throw new Error(j2?.message || "HubSpot update failed");
  }
}

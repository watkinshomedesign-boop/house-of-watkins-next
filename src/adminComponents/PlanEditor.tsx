"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type Mode = "create" | "edit";

type PlanRow = {
  id: string;
  slug: string;
  status: string;
  name: string;
  description: string | null;
  tour3d_url?: string | null;
  filters?: any;
  seo_title: string | null;
  seo_description: string | null;
  og_media_id: string | null;
  heated_sqft: number;
  beds: number | null;
  baths: number | null;
  stories: number | null;
  garage_bays: number | null;
  width_ft: number | null;
  depth_ft: number | null;
  tags: string[] | null;
};

type MediaRow = {
  id: string;
  plan_id: string;
  kind: string;
  file_path: string;
  is_external: boolean;
  alt: string | null;
  caption: string | null;
  sort_order: number;
};

type SanityAssetListItem = {
  _id: string;
  url: string;
  originalFilename: string | null;
  title?: string | null;
  mimeType?: string | null;
  metadata?: {
    dimensions?: {
      width?: number;
      height?: number;
    };
  };
};

function defaultTitle(planName: string) {
  const name = String(planName || "").trim() || "House Plan";
  return `${name} House Plan | House of Watkins`;
}

function defaultDescription(planName: string, description: string | null | undefined) {
  const base = String(description || "").trim();
  if (base) {
    return base.length > 160 ? `${base.slice(0, 157).trim()}...` : base;
  }
  const name = String(planName || "").trim() || "this plan";
  return `Explore ${name}, including square footage, key features, and downloadable plan options.`;
}

function snippetUrl(slug: string) {
  const s = String(slug || "").trim();
  const host = (process.env.NEXT_PUBLIC_SITE_URL || "").replace(/\/$/, "");
  if (host) return `${host}/house/${s}`;
  return `/house/${s}`;
}

export function PlanEditor(props: { mode: Mode }) {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = props.mode === "edit" ? String(params?.id || "") : "";

  const [loading, setLoading] = useState(props.mode === "edit");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [mediaLoading, setMediaLoading] = useState(false);
  const [mediaRows, setMediaRows] = useState<MediaRow[]>([]);

  const [sanityQ, setSanityQ] = useState<string>("");
  const [sanityLoading, setSanityLoading] = useState(false);
  const [sanityError, setSanityError] = useState<string | null>(null);
  const [sanityResults, setSanityResults] = useState<SanityAssetListItem[]>([]);

  const [selectedSanityAssets, setSelectedSanityAssets] = useState<Record<string, SanityAssetListItem>>({});

  const [statsRange, setStatsRange] = useState<"30d" | "total">("30d");
  const [statsLoading, setStatsLoading] = useState(false);
  const [stats, setStats] = useState<{ views: number; favorites: number; purchases: number; conversionRate: number } | null>(null);

  const [plan, setPlan] = useState<PlanRow>({
    id: "",
    slug: "",
    status: "draft",
    name: "",
    description: null,
    tour3d_url: null,
    filters: {},
    seo_title: null,
    seo_description: null,
    og_media_id: null,
    heated_sqft: 0,
    beds: null,
    baths: null,
    stories: null,
    garage_bays: null,
    width_ft: null,
    depth_ft: null,
    tags: [],
  });

  const tagsString = useMemo(() => (plan.tags ?? []).join(","), [plan.tags]);

  const catalogFilters = useMemo(() => {
    const f: any = plan.filters && typeof plan.filters === "object" ? plan.filters : {};
    return f;
  }, [plan.filters]);

  const selectedSanityIds = useMemo(() => {
    const ids = new Set<string>();
    const f: any = catalogFilters;

    const front = String(f.frontCardImage ?? f.frontSanityImageRef ?? "").trim();
    const planId = String(f.planCardImage ?? f.planSanityImageRef ?? "").trim();
    if (front) ids.add(front);
    if (planId) ids.add(planId);

    if (Array.isArray(f.galleryImages)) {
      for (const x of f.galleryImages) {
        const s = String(x || "").trim();
        if (s) ids.add(s);
      }
    }
    if (Array.isArray(f.floorplanImages)) {
      for (const x of f.floorplanImages) {
        const s = String(x || "").trim();
        if (s) ids.add(s);
      }
    }

    return Array.from(ids);
  }, [catalogFilters]);

  useEffect(() => {
    let canceled = false;

    async function loadSelected() {
      if (selectedSanityIds.length === 0) {
        setSelectedSanityAssets({});
        return;
      }

      try {
        const params = new URLSearchParams();
        params.set("ids", selectedSanityIds.map((id) => encodeURIComponent(id)).join(","));
        const res = await fetch(`/api/admin/sanity-assets?${params.toString()}`);
        const j = await res.json();
        if (!res.ok) throw new Error(j.error || "Failed to load selected assets");

        const map: Record<string, SanityAssetListItem> = {};
        for (const a of (j.items ?? []) as SanityAssetListItem[]) {
          if (a && typeof a._id === "string") map[a._id] = a;
        }
        if (!canceled) setSelectedSanityAssets(map);
      } catch {
        if (!canceled) setSelectedSanityAssets({});
      }
    }

    loadSelected();

    return () => {
      canceled = true;
    };
  }, [selectedSanityIds]);

  function renderSelectedSanityThumb(assetId: string) {
    const a = selectedSanityAssets[assetId];
    if (!a?.url) {
      return (
        <div className="flex items-center justify-center rounded border bg-neutral-50 p-2 text-[11px] text-neutral-600">
          {assetId}
        </div>
      );
    }

    return (
      <div className="overflow-hidden rounded border">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={a.url} alt={String(a.title || a.originalFilename || a._id)} className="h-24 w-24 object-cover" loading="lazy" />
      </div>
    );
  }

  async function searchSanityImages(query: string) {
    const q = String(query || "").trim();
    if (!q) {
      setSanityResults([]);
      return;
    }

    setSanityLoading(true);
    setSanityError(null);
    try {
      const params = new URLSearchParams();
      params.set("type", "images");
      params.set("q", q);
      params.set("limit", "24");
      params.set("offset", "0");
      const res = await fetch(`/api/admin/sanity-assets?${params.toString()}`);
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || "Failed");
      setSanityResults((j.items ?? []) as any);
      if (j.sanityConfigured === false) {
        setSanityError("Sanity is not configured. Set NEXT_PUBLIC_SANITY_PROJECT_ID and NEXT_PUBLIC_SANITY_DATASET.");
      }
    } catch (e: any) {
      setSanityError(e?.message || "Failed");
      setSanityResults([]);
    } finally {
      setSanityLoading(false);
    }
  }

  function setCatalogFilters(patch: Record<string, any>) {
    setPlan((prev) => ({
      ...prev,
      filters: {
        ...(prev.filters && typeof prev.filters === "object" ? prev.filters : {}),
        ...patch,
      },
    }));
  }

  useEffect(() => {
    if (props.mode !== "edit") return;
    if (!id) return;

    let mounted = true;
    setLoading(true);
    fetch(`/api/admin/plans/${id}`)
      .then(async (r) => {
        const j = await r.json();
        if (!r.ok) throw new Error(j.error || "Failed");
        return j;
      })
      .then((j) => {
        if (!mounted) return;
        if (j.data) setPlan(j.data);
      })
      .catch((e: any) => {
        if (!mounted) return;
        setError(e?.message || "Failed to load");
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [props.mode, id]);

  useEffect(() => {
    if (props.mode !== "edit") return;
    if (!id) return;

    let mounted = true;
    setStatsLoading(true);
    fetch(`/api/admin/plans/${id}/stats?range=${statsRange}`)
      .then(async (r) => {
        const j = await r.json();
        if (!r.ok) throw new Error(j.error || "Failed to load stats");
        return j;
      })
      .then((j) => {
        if (!mounted) return;
        setStats(j.stats ?? null);
      })
      .catch(() => {
        if (!mounted) return;
        setStats(null);
      })
      .finally(() => {
        if (!mounted) return;
        setStatsLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [props.mode, id, statsRange]);

  useEffect(() => {
    if (props.mode !== "edit") return;
    if (!id) return;

    let mounted = true;
    setMediaLoading(true);
    fetch(`/api/admin/plans/${id}/media`)
      .then(async (r) => {
        const j = await r.json();
        if (!r.ok) throw new Error(j.error || "Failed to load media");
        return j;
      })
      .then((j) => {
        if (!mounted) return;
        setMediaRows((j.data ?? []) as MediaRow[]);
      })
      .catch(() => {
        if (!mounted) return;
        setMediaRows([]);
      })
      .finally(() => {
        if (!mounted) return;
        setMediaLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [props.mode, id]);

  async function reloadMedia() {
    if (props.mode !== "edit" || !id) return;
    setMediaLoading(true);
    try {
      const res = await fetch(`/api/admin/plans/${id}/media`);
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || "Failed");
      setMediaRows((j.data ?? []) as MediaRow[]);
    } finally {
      setMediaLoading(false);
    }
  }

  async function save() {
    setSaving(true);
    setError(null);
    setSuccess(null);

    const migratedFilters = (() => {
      const f: any = plan.filters && typeof plan.filters === "object" ? { ...plan.filters } : {};
      if (!f.frontCardImage && typeof f.frontSanityImageRef === "string" && f.frontSanityImageRef.trim()) {
        f.frontCardImage = f.frontSanityImageRef.trim();
      }
      if (!f.planCardImage && typeof f.planSanityImageRef === "string" && f.planSanityImageRef.trim()) {
        f.planCardImage = f.planSanityImageRef.trim();
      }
      if (!Array.isArray(f.galleryImages)) f.galleryImages = [];
      if (!Array.isArray(f.floorplanImages)) f.floorplanImages = [];
      // Ensure arrays are strings
      f.galleryImages = (f.galleryImages ?? []).map((x: any) => String(x || "").trim()).filter(Boolean);
      f.floorplanImages = (f.floorplanImages ?? []).map((x: any) => String(x || "").trim()).filter(Boolean);
      return f;
    })();

    const payload: any = {
      slug: plan.slug,
      status: plan.status,
      name: plan.name,
      description: plan.description,
      tour3d_url: plan.tour3d_url,
      filters: migratedFilters,
      seo_title: plan.seo_title,
      seo_description: plan.seo_description,
      og_media_id: plan.og_media_id,
      heated_sqft: plan.heated_sqft,
      beds: plan.beds,
      baths: plan.baths,
      stories: plan.stories,
      garage_bays: plan.garage_bays,
      width_ft: plan.width_ft,
      depth_ft: plan.depth_ft,
      tags: plan.tags,
    };

    try {
      if (props.mode === "create") {
        const res = await fetch("/api/admin/plans", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const j = await res.json();
        if (!res.ok) throw new Error(j.error || "Failed");
        setSuccess("Created");
        if (j.id) router.push(`/admin/plans/${j.id}`);
      } else {
        const res = await fetch(`/api/admin/plans/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const j = await res.json();
        if (!res.ok) throw new Error(j.error || "Failed");
        setSuccess(j.slugChanged ? "Saved (redirect created)" : "Saved");
      }
    } catch (e: any) {
      setError(e?.message || "Failed");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="text-sm text-neutral-600">Loading...</div>;

  const field = (label: string, value: string, onChange: (v: string) => void) => (
    <label className="block text-sm">
      <div className="text-xs text-neutral-500">{label}</div>
      <input value={value} onChange={(e) => onChange(e.target.value)} className="mt-1 w-full rounded border px-3 py-2" />
    </label>
  );

  const numFilterField = (
    label: string,
    value: number | null | undefined,
    onChange: (v: number | null) => void
  ) => (
    <label className="block text-sm">
      <div className="text-xs text-neutral-500">{label}</div>
      <input
        value={value == null ? "" : String(value)}
        onChange={(e) => onChange(e.target.value === "" ? null : Number(e.target.value))}
        className="mt-1 w-full rounded border px-3 py-2"
        inputMode="numeric"
      />
    </label>
  );

  const boolFilterField = (label: string, value: boolean | undefined, onChange: (v: boolean) => void) => (
    <label className="flex items-center gap-2 text-sm">
      <input type="checkbox" checked={Boolean(value)} onChange={(e) => onChange(e.target.checked)} />
      <span>{label}</span>
    </label>
  );

  const textArea = (label: string, value: string, onChange: (v: string) => void) => (
    <label className="block text-sm">
      <div className="text-xs text-neutral-500">{label}</div>
      <textarea value={value} onChange={(e) => onChange(e.target.value)} className="mt-1 w-full rounded border px-3 py-2" rows={4} />
    </label>
  );

  const numField = (label: string, value: number | null, onChange: (v: number | null) => void) => (
    <label className="block text-sm">
      <div className="text-xs text-neutral-500">{label}</div>
      <input
        value={value == null ? "" : String(value)}
        onChange={(e) => onChange(e.target.value === "" ? null : Number(e.target.value))}
        className="mt-1 w-full rounded border px-3 py-2"
        inputMode="numeric"
      />
    </label>
  );

  return (
    <div className="rounded border p-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {field("slug", plan.slug, (v) => setPlan((p) => ({ ...p, slug: v })))}
        <label className="block text-sm">
          <div className="text-xs text-neutral-500">status</div>
          <select
            value={plan.status}
            onChange={(e) => setPlan((p) => ({ ...p, status: e.target.value }))}
            className="mt-1 w-full rounded border px-3 py-2"
          >
            <option value="draft">draft</option>
            <option value="published">published</option>
            <option value="archived">archived</option>
          </select>
        </label>

        {field("name", plan.name, (v) => setPlan((p) => ({ ...p, name: v })))}
        {field("description", plan.description ?? "", (v) => setPlan((p) => ({ ...p, description: v || null })))}
        {field("3D tour URL", plan.tour3d_url ?? "", (v) => setPlan((p) => ({ ...p, tour3d_url: v || null })))}

        {numField("heated_sqft", plan.heated_sqft, (v) => setPlan((p) => ({ ...p, heated_sqft: Number(v ?? 0) })))}
        {numField("beds (int)", plan.beds, (v) => setPlan((p) => ({ ...p, beds: v })))}
        {numField("baths", plan.baths, (v) => setPlan((p) => ({ ...p, baths: v })))}
        {numField("stories", plan.stories, (v) => setPlan((p) => ({ ...p, stories: v })))}
        {numField("garage_bays", plan.garage_bays, (v) => setPlan((p) => ({ ...p, garage_bays: v })))}
        {numField("width_ft", plan.width_ft, (v) => setPlan((p) => ({ ...p, width_ft: v })))}
        {numField("depth_ft", plan.depth_ft, (v) => setPlan((p) => ({ ...p, depth_ft: v })))}

        <label className="block text-sm sm:col-span-2">
          <div className="text-xs text-neutral-500">tags (comma-separated)</div>
          <input
            value={tagsString}
            onChange={(e) =>
              setPlan((p) => ({
                ...p,
                tags: e.target.value
                  .split(",")
                  .map((t) => t.trim())
                  .filter(Boolean),
              }))
            }
            className="mt-1 w-full rounded border px-3 py-2"
          />
        </label>
      </div>

      {props.mode === "edit" ? (
        <div className="mt-6 rounded border p-4">
          <div className="text-sm font-semibold">Catalog Filters</div>
          <div className="mt-1 text-xs text-neutral-500">
            These fields control how the plan appears and filters on /house-plans. Leave blank/unchecked to avoid excluding the plan.
          </div>
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <label className="block text-sm sm:col-span-2">
              <div className="text-xs text-neutral-500">Front card image</div>
              <select
                value={String(catalogFilters.frontImageMediaId ?? "")}
                onChange={(e) => setCatalogFilters({ frontImageMediaId: e.target.value || null })}
                className="mt-1 w-full rounded border px-3 py-2"
              >
                <option value="">(auto)</option>
                {mediaRows.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.kind} • {m.file_path}
                  </option>
                ))}
              </select>
              <div className="mt-1 text-xs text-neutral-500">Used when View = Front on /house-plans.</div>
            </label>

            <label className="block text-sm sm:col-span-2">
              <div className="text-xs text-neutral-500">Front card image (Sanity ref)</div>
              <div className="mt-1 flex items-center gap-2">
                <input
                  value={String(catalogFilters.frontCardImage ?? catalogFilters.frontSanityImageRef ?? "")}
                  readOnly
                  className="w-full rounded border px-3 py-2 font-mono text-xs"
                  placeholder="(unset)"
                />
                <button
                  type="button"
                  onClick={() => setCatalogFilters({ frontCardImage: null, frontSanityImageRef: null })}
                  className="rounded border px-3 py-2 text-sm"
                >
                  Clear
                </button>
              </div>
              {String(catalogFilters.frontCardImage ?? catalogFilters.frontSanityImageRef ?? "").trim() ? (
                <div className="mt-2">
                  {renderSelectedSanityThumb(String(catalogFilters.frontCardImage ?? catalogFilters.frontSanityImageRef).trim())}
                </div>
              ) : null}
              <div className="mt-1 text-xs text-neutral-500">If set, /api/catalog/plans will prefer this over Supabase media ids.</div>
            </label>

            <label className="block text-sm sm:col-span-2">
              <div className="text-xs text-neutral-500">Plan card image</div>
              <select
                value={String(catalogFilters.planImageMediaId ?? "")}
                onChange={(e) => setCatalogFilters({ planImageMediaId: e.target.value || null })}
                className="mt-1 w-full rounded border px-3 py-2"
              >
                <option value="">(auto)</option>
                {mediaRows.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.kind} • {m.file_path}
                  </option>
                ))}
              </select>
              <div className="mt-1 text-xs text-neutral-500">Used when View = Plan on /house-plans.</div>
            </label>

            <label className="block text-sm sm:col-span-2">
              <div className="text-xs text-neutral-500">Plan card image (Sanity ref)</div>
              <div className="mt-1 flex items-center gap-2">
                <input
                  value={String(catalogFilters.planCardImage ?? catalogFilters.planSanityImageRef ?? "")}
                  readOnly
                  className="w-full rounded border px-3 py-2 font-mono text-xs"
                  placeholder="(unset)"
                />
                <button
                  type="button"
                  onClick={() => setCatalogFilters({ planCardImage: null, planSanityImageRef: null })}
                  className="rounded border px-3 py-2 text-sm"
                >
                  Clear
                </button>
              </div>
              {String(catalogFilters.planCardImage ?? catalogFilters.planSanityImageRef ?? "").trim() ? (
                <div className="mt-2">
                  {renderSelectedSanityThumb(String(catalogFilters.planCardImage ?? catalogFilters.planSanityImageRef).trim())}
                </div>
              ) : null}
              <div className="mt-1 text-xs text-neutral-500">If set, /api/catalog/plans will prefer this over Supabase media ids.</div>
            </label>

            <div className="rounded border p-3 sm:col-span-2">
              <div className="text-xs font-semibold text-neutral-600">Gallery images (Sanity refs)</div>
              {Array.isArray(catalogFilters.galleryImages) && catalogFilters.galleryImages.length > 0 ? (
                <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-6">
                  {catalogFilters.galleryImages.map((ref: any) => {
                    const id = String(ref || "").trim();
                    if (!id) return null;
                    return (
                      <div key={id} className="space-y-1">
                        {renderSelectedSanityThumb(id)}
                        <button
                          type="button"
                          onClick={() =>
                            setCatalogFilters({
                              galleryImages: (Array.isArray(catalogFilters.galleryImages) ? catalogFilters.galleryImages : []).filter(
                                (x: any) => String(x) !== String(ref)
                              ),
                            })
                          }
                          className="w-full rounded border px-2 py-1 text-[11px]"
                        >
                          Remove
                        </button>
                      </div>
                    );
                  })}
                </div>
              ) : null}
              <div className="mt-2 flex flex-wrap gap-2">
                {(Array.isArray(catalogFilters.galleryImages) ? catalogFilters.galleryImages : []).map((ref: any) => (
                  <div key={String(ref)} className="flex items-center gap-2 rounded border px-2 py-1">
                    <span className="font-mono text-[11px]">{String(ref)}</span>
                    <button
                      type="button"
                      onClick={() =>
                        setCatalogFilters({
                          galleryImages: (Array.isArray(catalogFilters.galleryImages) ? catalogFilters.galleryImages : []).filter(
                            (x: any) => String(x) !== String(ref)
                          ),
                        })
                      }
                      className="rounded border px-2 py-1 text-[11px]"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                {(Array.isArray(catalogFilters.galleryImages) ? catalogFilters.galleryImages : []).length === 0 ? (
                  <div className="text-xs text-neutral-500">(none)</div>
                ) : null}
              </div>
              <div className="mt-2 text-xs text-neutral-500">Use the Sanity search grid below to add images to the gallery.</div>
            </div>

            <div className="rounded border p-3 sm:col-span-2">
              <div className="text-xs font-semibold text-neutral-600">Floorplan images (Sanity refs)</div>
              {Array.isArray(catalogFilters.floorplanImages) && catalogFilters.floorplanImages.length > 0 ? (
                <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-6">
                  {catalogFilters.floorplanImages.map((ref: any) => {
                    const id = String(ref || "").trim();
                    if (!id) return null;
                    return (
                      <div key={id} className="space-y-1">
                        {renderSelectedSanityThumb(id)}
                        <button
                          type="button"
                          onClick={() =>
                            setCatalogFilters({
                              floorplanImages: (Array.isArray(catalogFilters.floorplanImages) ? catalogFilters.floorplanImages : []).filter(
                                (x: any) => String(x) !== String(ref)
                              ),
                            })
                          }
                          className="w-full rounded border px-2 py-1 text-[11px]"
                        >
                          Remove
                        </button>
                      </div>
                    );
                  })}
                </div>
              ) : null}
              <div className="mt-2 flex flex-wrap gap-2">
                {(Array.isArray(catalogFilters.floorplanImages) ? catalogFilters.floorplanImages : []).map((ref: any) => (
                  <div key={String(ref)} className="flex items-center gap-2 rounded border px-2 py-1">
                    <span className="font-mono text-[11px]">{String(ref)}</span>
                    <button
                      type="button"
                      onClick={() =>
                        setCatalogFilters({
                          floorplanImages: (Array.isArray(catalogFilters.floorplanImages) ? catalogFilters.floorplanImages : []).filter(
                            (x: any) => String(x) !== String(ref)
                          ),
                        })
                      }
                      className="rounded border px-2 py-1 text-[11px]"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                {(Array.isArray(catalogFilters.floorplanImages) ? catalogFilters.floorplanImages : []).length === 0 ? (
                  <div className="text-xs text-neutral-500">(none)</div>
                ) : null}
              </div>
              <div className="mt-2 text-xs text-neutral-500">Use the Sanity search grid below to add images to floorplans.</div>
            </div>

            <div className="rounded border p-3 sm:col-span-2">
              <div className="text-xs font-semibold text-neutral-600">Pick from Sanity (Phase 1)</div>
              <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3">
                <input
                  value={sanityQ}
                  onChange={(e) => setSanityQ(e.target.value)}
                  placeholder="Search Sanity images…"
                  className="rounded border px-3 py-2 text-sm sm:col-span-2"
                />
                <button
                  type="button"
                  onClick={() => searchSanityImages(sanityQ)}
                  className="rounded bg-black px-3 py-2 text-sm font-semibold text-white"
                >
                  {sanityLoading ? "Searching…" : "Search"}
                </button>
              </div>
              {sanityError ? <div className="mt-2 text-sm text-red-600">{sanityError}</div> : null}

              {sanityResults.length > 0 ? (
                <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {sanityResults.map((a) => (
                    <div key={a._id} className="rounded border">
                      <div className="aspect-[4/3] w-full overflow-hidden bg-neutral-50">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={a.url} alt={String(a.title || a.originalFilename || a._id)} className="h-full w-full object-cover" loading="lazy" />
                      </div>
                      <div className="p-2">
                        <div className="truncate text-[11px] font-semibold">{String(a.title || a.originalFilename || a._id)}</div>
                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setCatalogFilters({ frontCardImage: a._id || null, frontSanityImageRef: null })}
                            className="rounded border px-2 py-1 text-xs"
                          >
                            Set Front Card
                          </button>
                          <button
                            type="button"
                            onClick={() => setCatalogFilters({ planCardImage: a._id || null, planSanityImageRef: null })}
                            className="rounded border px-2 py-1 text-xs"
                          >
                            Set Plan Card
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setCatalogFilters({
                                galleryImages: Array.from(
                                  new Set([
                                    ...((Array.isArray(catalogFilters.galleryImages) ? catalogFilters.galleryImages : []) as any[]),
                                    a._id,
                                  ])
                                ).filter(Boolean),
                              })
                            }
                            className="rounded border px-2 py-1 text-xs"
                          >
                            Add Gallery
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setCatalogFilters({
                                floorplanImages: Array.from(
                                  new Set([
                                    ...((Array.isArray(catalogFilters.floorplanImages) ? catalogFilters.floorplanImages : []) as any[]),
                                    a._id,
                                  ])
                                ).filter(Boolean),
                              })
                            }
                            className="rounded border px-2 py-1 text-xs"
                          >
                            Add Floorplan
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>

            {numFilterField("Bedrooms (min)", catalogFilters.bedroomsMin ?? null, (v) => setCatalogFilters({ bedroomsMin: v }))}
            {numFilterField("Bedrooms (max)", catalogFilters.bedroomsMax ?? null, (v) => setCatalogFilters({ bedroomsMax: v }))}

            {numFilterField("Baths (min)", catalogFilters.bathsMin ?? null, (v) => setCatalogFilters({ bathsMin: v }))}
            {numFilterField("Baths (max)", catalogFilters.bathsMax ?? null, (v) => setCatalogFilters({ bathsMax: v }))}

            {numFilterField("Garages (min)", catalogFilters.garagesMin ?? null, (v) => setCatalogFilters({ garagesMin: v }))}
            {numFilterField("Stories (min)", catalogFilters.storiesMin ?? null, (v) => setCatalogFilters({ storiesMin: v }))}

            {numFilterField("Max Sq Ft", catalogFilters.maxSqft ?? null, (v) => setCatalogFilters({ maxSqft: v }))}
            {numFilterField("Max Width (ft)", catalogFilters.maxWidth ?? null, (v) => setCatalogFilters({ maxWidth: v }))}

            {numFilterField("Max Depth (ft)", catalogFilters.maxDepth ?? null, (v) => setCatalogFilters({ maxDepth: v }))}
            <div className="sm:col-span-2">
              <div className="text-xs text-neutral-500">Styles</div>
              <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3">
                {(
                  [
                    "Craftsman",
                    "Farmhouse",
                    "Accessory",
                    "Traditional",
                    "2 Story",
                    "Cottage",
                    "Narrow Lot",
                    "Contemporary",
                    "Small Home",
                    "Multi-Family",
                  ] as const
                ).map((label) => {
                  const selected = Array.isArray(catalogFilters.styles)
                    ? catalogFilters.styles.includes(label)
                    : String(catalogFilters.styles ?? "")
                        .split(",")
                        .map((t) => t.trim())
                        .filter(Boolean)
                        .includes(label);

                  return (
                    <label key={label} className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={selected}
                        onChange={(e) => {
                          const current = Array.isArray(catalogFilters.styles)
                            ? catalogFilters.styles
                            : String(catalogFilters.styles ?? "")
                                .split(",")
                                .map((t) => t.trim())
                                .filter(Boolean);
                          const set = new Set(current);
                          if (e.target.checked) set.add(label);
                          else set.delete(label);
                          setCatalogFilters({ styles: Array.from(set) });
                        }}
                      />
                      <span>{label}</span>
                    </label>
                  );
                })}
              </div>
              <div className="mt-1 text-xs text-neutral-500">Matches the “Styles” filter on /house-plans.</div>
            </div>

            <label className="block text-sm">
              <div className="text-xs text-neutral-500">Big Windows for Scenic Views</div>
              <select
                value={String(catalogFilters.bigWindows ?? "")}
                onChange={(e) => setCatalogFilters({ bigWindows: e.target.value || null })}
                className="mt-1 w-full rounded border px-3 py-2"
              >
                <option value="">(none)</option>
                <option value="Back">Back</option>
                <option value="Side">Side</option>
                <option value="Front">Front</option>
                <option value="Angle">Angle</option>
              </select>
              <div className="mt-1 text-xs text-neutral-500">Matches the “Big Windows” filter on /house-plans.</div>
            </label>

            <div className="sm:col-span-2">
              <div className="text-xs text-neutral-500">Flags</div>
              <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3">
                {boolFilterField("Office", Boolean(catalogFilters.office), (v) => setCatalogFilters({ office: v }))}
                {boolFilterField("Casita", Boolean(catalogFilters.casita), (v) => setCatalogFilters({ casita: v }))}
                {boolFilterField("RV Garage", Boolean(catalogFilters.rv), (v) => setCatalogFilters({ rv: v }))}
                {boolFilterField("Side-load garage", Boolean(catalogFilters.sideLoad), (v) => setCatalogFilters({ sideLoad: v }))}
                {boolFilterField("Bonus Room", Boolean(catalogFilters.bonusRoom), (v) => setCatalogFilters({ bonusRoom: v }))}
                {boolFilterField("Basement", Boolean(catalogFilters.basement), (v) => setCatalogFilters({ basement: v }))}
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {props.mode === "edit" ? (
        <div className="mt-6 rounded border p-4">
          <div className="text-sm font-semibold">SEO</div>
          <div className="mt-3 grid grid-cols-1 gap-3">
            {field("SEO Title", plan.seo_title ?? "", (v) => setPlan((p) => ({ ...p, seo_title: v || null })))}
            <div className="text-xs text-neutral-500">
              Default (auto): <span className="font-mono">{defaultTitle(plan.name)}</span>
            </div>
            {textArea("SEO Description", plan.seo_description ?? "", (v) => setPlan((p) => ({ ...p, seo_description: v || null })))}
            <div className="text-xs text-neutral-500">
              Default (auto): <span className="font-mono">{defaultDescription(plan.name, plan.description)}</span>
            </div>

            <label className="block text-sm">
              <div className="text-xs text-neutral-500">OG Image</div>
              <select
                value={plan.og_media_id ?? ""}
                onChange={(e) => setPlan((p) => ({ ...p, og_media_id: e.target.value || null }))}
                className="mt-1 w-full rounded border px-3 py-2"
              >
                <option value="">(auto)</option>
                {mediaRows.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.kind} • {m.file_path}
                  </option>
                ))}
              </select>
              <div className="mt-1 text-xs text-neutral-500">
                Auto picks hero/first image when unset.
              </div>
            </label>

            <div>
              <button
                type="button"
                onClick={() => setPlan((p) => ({ ...p, seo_title: null, seo_description: null, og_media_id: null }))}
                className="rounded border px-3 py-2 text-sm"
              >
                Reset to defaults
              </button>
            </div>

            <div className="rounded border bg-white p-4">
              <div className="text-xs text-neutral-500">Preview</div>
              <div className="mt-2 text-sm text-green-800">{snippetUrl(plan.slug)}</div>
              <div className="mt-1 text-lg font-semibold text-blue-800">
                {((plan.seo_title || "").trim() || defaultTitle(plan.name)).slice(0, 70)}
              </div>
              <div className="mt-1 text-sm text-neutral-700">
                {((plan.seo_description || "").trim() || defaultDescription(plan.name, plan.description)).slice(0, 160)}
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {props.mode === "edit" ? (
        <div className="mt-6 rounded border p-4">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold">Stats</div>
            <div className="flex items-center gap-2 text-sm">
              <button
                type="button"
                className={statsRange === "30d" ? "rounded border px-2 py-1" : "rounded px-2 py-1 underline"}
                onClick={() => setStatsRange("30d")}
              >
                30d
              </button>
              <button
                type="button"
                className={statsRange === "total" ? "rounded border px-2 py-1" : "rounded px-2 py-1 underline"}
                onClick={() => setStatsRange("total")}
              >
                lifetime
              </button>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded border p-3">
              <div className="text-xs text-neutral-500">Views</div>
              <div className="text-lg font-semibold">{statsLoading ? "…" : String(stats?.views ?? 0)}</div>
            </div>
            <div className="rounded border p-3">
              <div className="text-xs text-neutral-500">Favorites</div>
              <div className="text-lg font-semibold">{statsLoading ? "…" : String(stats?.favorites ?? 0)}</div>
            </div>
            <div className="rounded border p-3">
              <div className="text-xs text-neutral-500">Purchases</div>
              <div className="text-lg font-semibold">{statsLoading ? "…" : String(stats?.purchases ?? 0)}</div>
            </div>
            <div className="rounded border p-3">
              <div className="text-xs text-neutral-500">Conversion</div>
              <div className="text-lg font-semibold">
                {statsLoading ? "…" : `${(((stats?.conversionRate ?? 0) as number) * 100).toFixed(2)}%`}
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {props.mode === "edit" ? (
        <div className="mt-6 rounded border">
          <div className="flex items-center justify-between border-b px-4 py-3">
            <div className="text-sm font-semibold">Media</div>
            <div className="text-xs text-neutral-500">{mediaLoading ? "Loading..." : `${mediaRows.length} items`}</div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="text-xs text-neutral-500">
                <tr>
                  <th className="px-4 py-2 text-left">Kind</th>
                  <th className="px-4 py-2 text-left">file_path</th>
                  <th className="px-4 py-2 text-left">alt</th>
                  <th className="px-4 py-2 text-left">caption</th>
                  <th className="px-4 py-2 text-right">sort</th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {mediaRows.map((m, idx) => (
                  <tr key={m.id} className="border-t">
                    <td className="px-4 py-2">{m.kind}</td>
                    <td className="px-4 py-2 font-mono text-xs">{m.file_path}</td>
                    <td className="px-4 py-2">
                      <input
                        value={m.alt ?? ""}
                        onChange={(e) =>
                          setMediaRows((prev) => prev.map((x) => (x.id === m.id ? { ...x, alt: e.target.value } : x)))
                        }
                        className="w-full rounded border px-2 py-1 text-xs"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        value={m.caption ?? ""}
                        onChange={(e) =>
                          setMediaRows((prev) => prev.map((x) => (x.id === m.id ? { ...x, caption: e.target.value } : x)))
                        }
                        className="w-full rounded border px-2 py-1 text-xs"
                      />
                    </td>
                    <td className="px-4 py-2 text-right">{m.sort_order}</td>
                    <td className="px-4 py-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          className="underline text-xs"
                          disabled={idx === 0}
                          onClick={async () => {
                            const above = mediaRows[idx - 1];
                            if (!above) return;
                            await fetch(`/api/admin/media/${m.id}`, {
                              method: "PATCH",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ sort_order: above.sort_order - 1 }),
                            });
                            await reloadMedia();
                          }}
                        >
                          Up
                        </button>
                        <button
                          type="button"
                          className="underline text-xs"
                          disabled={idx === mediaRows.length - 1}
                          onClick={async () => {
                            const below = mediaRows[idx + 1];
                            if (!below) return;
                            await fetch(`/api/admin/media/${m.id}`, {
                              method: "PATCH",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ sort_order: below.sort_order + 1 }),
                            });
                            await reloadMedia();
                          }}
                        >
                          Down
                        </button>
                        <button
                          type="button"
                          className="underline text-xs"
                          onClick={async () => {
                            await fetch(`/api/admin/media/${m.id}`, {
                              method: "PATCH",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ alt: (m.alt ?? "").trim() || null, caption: (m.caption ?? "").trim() || null }),
                            });
                            await reloadMedia();
                          }}
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          className="underline text-xs text-red-700"
                          onClick={async () => {
                            setError(null);
                            try {
                              const res = await fetch(`/api/admin/media/${m.id}`, { method: "DELETE" });
                              const j = await res.json();
                              if (!res.ok) throw new Error(j.error || "Failed");
                              if (plan.og_media_id === m.id) {
                                setPlan((p) => ({ ...p, og_media_id: null }));
                              }
                              await reloadMedia();
                            } catch (e: any) {
                              setError(e?.message || "Failed");
                            }
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}

      <div className="mt-4 flex items-center gap-3">
        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="rounded bg-black px-3 py-2 text-sm font-semibold text-white disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save"}
        </button>
        {success ? <div className="text-sm text-green-700">{success}</div> : null}
        {error ? <div className="text-sm text-red-600">{error}</div> : null}
      </div>
    </div>
  );
}

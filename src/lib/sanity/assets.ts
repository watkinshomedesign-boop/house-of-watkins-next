import { getServerSanityClient, hasSanity } from "@/lib/sanity/serverClient";

export type SanityAssetTypeFilter = "all" | "images" | "videos";

export type SanityAssetListItem = {
  _id: string;
  _type: "sanity.imageAsset" | "sanity.fileAsset";
  url: string;
  originalFilename: string | null;
  title?: string | null;
  mimeType?: string | null;
  size?: number | null;
  assetId?: string | null;
  _createdAt?: string;
  metadata?: {
    dimensions?: {
      width?: number;
      height?: number;
      aspectRatio?: number;
    };
  };
};

export type ListSanityAssetsParams = {
  q?: string;
  type?: SanityAssetTypeFilter;
  limit?: number;
  offset?: number;
};

function normalizeQ(q: string | undefined) {
  const s = String(q || "").trim();
  return s ? s : "";
}

export async function listSanityAssets(params: ListSanityAssetsParams) {
  if (!hasSanity()) {
    return {
      items: [] as SanityAssetListItem[],
      total: 0,
      limit: params.limit ?? 60,
      offset: params.offset ?? 0,
      sanityConfigured: false as const,
    };
  }

  const q = normalizeQ(params.q);
  const type = (params.type || "all") as SanityAssetTypeFilter;
  const limit = Math.min(Math.max(1, Math.floor(Number(params.limit ?? 60))), 120);
  const offset = Math.max(0, Math.floor(Number(params.offset ?? 0)));

  const baseTypeFilter =
    type === "images" ? "_type == 'sanity.imageAsset'" : type === "videos" ? "mimeType match 'video/*'" : "true";

  const searchFilter = q
    ? "(originalFilename match $qWildcard || _id match $qWildcard || title match $qWildcard || assetId match $qWildcard)"
    : "true";

  const filter = `(_type in ['sanity.imageAsset','sanity.fileAsset']) && (${baseTypeFilter}) && (${searchFilter})`;

  const query = `{
    "items": *[${filter}] | order(_createdAt desc) [$offset...$offsetPlusLimit] {
      _id,
      _type,
      url,
      originalFilename,
      title,
      mimeType,
      size,
      assetId,
      _createdAt,
      metadata{dimensions}
    },
    "total": count(*[${filter}])
  }`;

  const client = getServerSanityClient();
  const res = await client.fetch(
    query,
    {
      qWildcard: q ? `*${q}*` : "*",
      offset,
      offsetPlusLimit: offset + limit,
    },
    { next: { revalidate: 60 } }
  );

  return {
    items: (res?.items ?? []) as SanityAssetListItem[],
    total: Number(res?.total ?? 0),
    limit,
    offset,
    sanityConfigured: true as const,
  };
}

export async function getSanityAssetsByIds(ids: string[]) {
  const unique = Array.from(new Set((ids ?? []).map((x) => String(x || "").trim()).filter(Boolean)));
  if (!hasSanity() || unique.length === 0) return {} as Record<string, SanityAssetListItem>;

  const client = getServerSanityClient();
  const query = `*[_type in ['sanity.imageAsset','sanity.fileAsset'] && _id in $ids] {
    _id,
    _type,
    url,
    originalFilename,
    title,
    mimeType,
    size,
    assetId,
    _createdAt,
    metadata{dimensions}
  }`;

  const items = (await client.fetch(query, { ids: unique }, { next: { revalidate: 60 } })) as SanityAssetListItem[];
  const map: Record<string, SanityAssetListItem> = {};
  for (const a of items ?? []) map[String(a._id)] = a;
  return map;
}

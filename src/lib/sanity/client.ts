import { createClient } from "@sanity/client";

function fetchWithTimeout(fetchImpl: typeof fetch, timeoutMs: number): typeof fetch {
  return async (input: RequestInfo | URL, init?: RequestInit) => {
    if (!timeoutMs || timeoutMs <= 0) return fetchImpl(input, init);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const mergedInit: RequestInit = {
        ...init,
        signal: init?.signal ?? controller.signal,
      };
      return await fetchImpl(input, mergedInit);
    } finally {
      clearTimeout(timeout);
    }
  };
}

type SanityConfig = {
  projectId: string;
  dataset: string;
  apiVersion: string;
};

export function getSanityConfig(): SanityConfig | null {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
  const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2025-01-01";

  if (!projectId || !dataset) return null;

  return { projectId, dataset, apiVersion };
}

export function getSanityClient(options?: {
  token?: string;
  useCdn?: boolean;
  perspective?: "published" | "previewDrafts" | "drafts";
}) {
  const config = getSanityConfig();
  if (!config) {
    throw new Error(
      "Sanity is not configured. Set NEXT_PUBLIC_SANITY_PROJECT_ID and NEXT_PUBLIC_SANITY_DATASET in .env.local.",
    );
  }

  const timeoutMs = Number(process.env.SANITY_FETCH_TIMEOUT_MS ?? "8000");

  const client = createClient({
    projectId: config.projectId,
    dataset: config.dataset,
    apiVersion: config.apiVersion,
    useCdn: options?.useCdn ?? true,
    token: options?.token,
    perspective: options?.perspective,
  });

  const originalFetch = (client as any).fetch?.bind(client);
  if (typeof originalFetch === "function") {
    (client as any).fetch = (query: any, params?: any, requestOptions?: any) => {
      const wrappedFetch = fetchWithTimeout(fetch, timeoutMs);
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), timeoutMs);
      const mergedOptions = {
        ...(requestOptions ?? {}),
        signal: requestOptions?.signal ?? controller.signal,
        fetch: wrappedFetch,
      };
      return Promise.resolve(originalFetch(query, params, mergedOptions)).finally(() => clearTimeout(timeout));
    };
  }

  return client;
}

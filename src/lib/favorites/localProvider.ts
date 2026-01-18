import type { FavoritesProviderApi, FavoritesUser } from "@/lib/favorites/provider";

const STORAGE_KEY = "moss_favorites_v1";

function read(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((x) => typeof x === "string");
  } catch {
    return [];
  }
}

function write(slugs: string[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(slugs));
  } catch {
    // ignore
  }
}

export class LocalFavoritesProvider implements FavoritesProviderApi {
  async getUser(): Promise<FavoritesUser | null> {
    return null;
  }

  async listFavorites(): Promise<string[]> {
    return read();
  }

  async addFavorite(planSlug: string): Promise<void> {
    const slugs = new Set(read());
    slugs.add(planSlug);
    write(Array.from(slugs));
  }

  async removeFavorite(planSlug: string): Promise<void> {
    const slugs = read().filter((s) => s !== planSlug);
    write(slugs);
  }
}

export function clearLocalFavorites() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

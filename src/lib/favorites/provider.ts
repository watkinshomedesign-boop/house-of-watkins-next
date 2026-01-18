export type FavoritesUser = {
  id: string;
  email?: string;
  name?: string;
};

export interface FavoritesProviderApi {
  getUser(): Promise<FavoritesUser | null>;
  listFavorites(): Promise<string[]>;
  addFavorite(planSlug: string): Promise<void>;
  removeFavorite(planSlug: string): Promise<void>;
}

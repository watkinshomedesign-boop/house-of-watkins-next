export type Post = {
  slug: string;
  title: string;
  excerpt?: string;
  category: string;
  coverImage: unknown;
  publishedAt: string;
  readTimeMinutes: number;
  author?: string;
  content: unknown;
  isPopular?: boolean;
};

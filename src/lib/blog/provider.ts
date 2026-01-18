import type { Post } from "@/lib/blog/types";

export interface BlogProvider {
  listPosts(): Promise<Post[]>;
  getPost(slug: string): Promise<Post | null>;
  listCategories(): Promise<string[]>;
  listPopularPosts(limit?: number): Promise<Post[]>;
}

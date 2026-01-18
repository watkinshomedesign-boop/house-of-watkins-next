import {
  getAllPosts,
  getCategories,
  getPopularPosts,
  getPostBySlug,
} from "@/content/blog/posts";
import type { BlogProvider } from "@/lib/blog/provider";

export class LocalBlogProvider implements BlogProvider {
  async listPosts() {
    return getAllPosts();
  }

  async getPost(slug: string) {
    return getPostBySlug(slug) ?? null;
  }

  async listCategories() {
    return getCategories();
  }

  async listPopularPosts(limit = 3) {
    return getPopularPosts(limit);
  }
}

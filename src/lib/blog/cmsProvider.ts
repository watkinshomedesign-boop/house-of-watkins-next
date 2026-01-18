import type { BlogProvider } from "@/lib/blog/provider";

export class CmsBlogProvider implements BlogProvider {
  async listPosts() {
    return [];
  }

  async getPost(_slug: string) {
    return null;
  }

  async listCategories() {
    return [];
  }

  async listPopularPosts(_limit = 3) {
    return [];
  }
}

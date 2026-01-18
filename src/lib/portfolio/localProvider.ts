import type { PortfolioProvider } from "@/lib/portfolio/provider";
import type { PortfolioProject } from "@/lib/portfolio/types";
import { getAllProjects, getProjectBySlug } from "@/content/portfolio/projects";

export class LocalPortfolioProvider implements PortfolioProvider {
  async listProjects(): Promise<PortfolioProject[]> {
    return getAllProjects();
  }

  async getProjectBySlug(slug: string): Promise<PortfolioProject | null> {
    return getProjectBySlug(slug) ?? null;
  }
}

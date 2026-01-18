import type { PortfolioProject } from "@/lib/portfolio/types";

export interface PortfolioProvider {
  listProjects(): Promise<PortfolioProject[]>;
  getProjectBySlug(slug: string): Promise<PortfolioProject | null>;
}

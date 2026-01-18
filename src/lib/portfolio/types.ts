export type PortfolioImage = {
  image: unknown;
  alt?: string;
  caption?: string;
};

export type PortfolioProject = {
  title: string;
  slug: string;
  status: "draft" | "published";
  order?: number;
  coverImage: PortfolioImage;
  gallery: PortfolioImage[];
  videoFileUrl?: string;
  videoUrl?: string;
  planDetailsUrl?: string;
  oldSlugs?: string[];
};

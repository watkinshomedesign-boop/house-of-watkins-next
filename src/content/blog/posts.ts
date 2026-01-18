export type BlogContentBlock =
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "quote"; text: string }
  | { type: "image"; src: string; alt: string };

export type BlogPost = {
  slug: string;
  title: string;
  excerpt?: string;
  category: string;
  coverImage: string;
  publishedAt: string;
  readTimeMinutes: number;
  author?: string;
  content: BlogContentBlock[];
};

export const posts: BlogPost[] = [
  {
    slug: "block-editor-demo-complete-guide-to-modern-home",
    title: "Block Editor Demo: Complete Guide to Modern Home Design",
    excerpt:
      "Discover how a block-based approach helps you structure content clearly, from hero images to callouts and galleries.",
    category: "Design Ideas",
    coverImage: "/placeholders/whats-included-interior.svg",
    publishedAt: "2025-12-17",
    readTimeMinutes: 1,
    author: "House of Watkins",
    content: [
      {
        type: "p",
        text: "This is a demo post showing how a WordPress-like block editor can translate to clean, readable article pages.",
      },
      { type: "h2", text: "Why blocks work" },
      {
        type: "p",
        text: "Blocks keep layout flexible while staying consistent with your brand. You can add headings, lists, images, quotes, and columns without rewriting templates.",
      },
      {
        type: "ul",
        items: [
          "Reusable content building blocks",
          "Easy reordering",
          "Media-friendly",
          "Schema-driven structure",
        ],
      },
      {
        type: "quote",
        text: "A great layout is a system — blocks help you scale it.",
      },
      {
        type: "image",
        src: "/placeholders/plan-hero.svg",
        alt: "Plan placeholder",
      },
    ],
  },
  {
    slug: "five-essential-building-tips-before-breaking-ground",
    title: "5 Essential Building Tips Before Breaking Ground",
    excerpt:
      "Planning to build your dream home? Here are the essential tips every homeowner should know before construction starts.",
    category: "Building Tips",
    coverImage: "/placeholders/floorplan.svg",
    publishedAt: "2025-12-17",
    readTimeMinutes: 1,
    author: "House of Watkins",
    content: [
      { type: "p", text: "A smooth build starts long before day one." },
      { type: "h2", text: "Start with a realistic timeline" },
      {
        type: "p",
        text: "Permits, site prep, and trades can shift schedules. Build slack into every milestone.",
      },
      { type: "h2", text: "Clarify decisions early" },
      {
        type: "p",
        text: "Lock key choices (roofing, windows, HVAC) early so your budget and lead times stay stable.",
      },
      {
        type: "ul",
        items: [
          "Confirm setbacks and local rules",
          "Ask for product lead times",
          "Plan for weather delays",
        ],
      },
    ],
  },
  {
    slug: "ten-modern-farmhouse-design-ideas-for-your-dream-home",
    title: "10 Modern Farmhouse Design Ideas for Your Dream Home",
    excerpt:
      "Discover the perfect blend of rustic charm and contemporary style with these modern farmhouse ideas.",
    category: "Design Ideas",
    coverImage: "/placeholders/whats-included-house-cta.svg",
    publishedAt: "2025-12-17",
    readTimeMinutes: 1,
    author: "House of Watkins",
    content: [
      {
        type: "p",
        text: "Modern farmhouse doesn’t have to mean one look — it’s a toolkit of textures, shapes, and proportions.",
      },
      { type: "h2", text: "Keep the exterior simple" },
      {
        type: "p",
        text: "Strong rooflines and clean window grids read timeless and modern.",
      },
      { type: "h2", text: "Warm neutrals + natural materials" },
      {
        type: "p",
        text: "Use wood, stone, and matte finishes to add depth without noise.",
      },
    ],
  },
];

export function getAllPosts(): BlogPost[] {
  return [...posts].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return posts.find((p) => p.slug === slug);
}

export function getCategories(): string[] {
  const set = new Set<string>();
  for (const p of posts) set.add(p.category);
  return Array.from(set).sort((a, b) => a.localeCompare(b));
}

export function getPopularPosts(limit = 3): BlogPost[] {
  return getAllPosts().slice(0, limit);
}

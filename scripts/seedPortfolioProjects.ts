import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { getSanityClient } from "../src/lib/sanity/client";

type SeedPortfolioProject = {
  title: string;
  slug: string;
};

function slugify(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function main() {
  const token = process.env.SANITY_API_WRITE_TOKEN;
  if (!token) {
    throw new Error(
      "Missing SANITY_API_WRITE_TOKEN in .env.local. Create a Sanity API token with write access and set SANITY_API_WRITE_TOKEN=...",
    );
  }

  const client = getSanityClient({ token, useCdn: false, perspective: "published" });

  const titles = [
    "Boardwalk",
    "Oak Ridge",
    "Wolf Ridge",
    "Shadow Lake",
    "High Desert",
    "Beverly Woods",
    "English Meadow",
    "Westwood",
  ];

  const projects: SeedPortfolioProject[] = titles.map((t) => ({ title: t, slug: slugify(t) }));

  for (const p of projects) {
    if (!p.title || !p.slug) {
      throw new Error(`Invalid project seed: ${JSON.stringify(p)}`);
    }
  }

  const results: { id: string; slug: string }[] = [];

  for (const p of projects) {
    const _id = `portfolioProject.${p.slug}`;

    await client.createOrReplace({
      _id,
      _type: "portfolioProject",
      title: p.title,
      slug: { _type: "slug", current: p.slug },
      status: "draft",
      // Intentionally omit coverImage/gallery so you can upload in Studio.
    } as any);

    results.push({ id: _id, slug: p.slug });
  }

  console.log(`Upserted ${results.length} portfolio projects:`);
  for (const r of results) {
    console.log(`- ${r.slug} (${r.id})`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

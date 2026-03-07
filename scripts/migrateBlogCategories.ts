import dotenv from "dotenv";
import { getSanityClient } from "../src/lib/sanity/client";

dotenv.config({ path: ".env.local" });

/**
 * One-time migration: reassign all blog post categories to the new 6-category system.
 *
 * Env vars:
 * - NEXT_PUBLIC_SANITY_PROJECT_ID
 * - NEXT_PUBLIC_SANITY_DATASET
 * - SANITY_API_WRITE_TOKEN (preferred) OR SANITY_API_TOKEN
 *
 * Usage:
 *   node --import tsx scripts/migrateBlogCategories.ts          # dry-run
 *   node --import tsx scripts/migrateBlogCategories.ts --apply  # apply changes
 */

const TITLE_TO_NEW_CATEGORY: Record<string, string> = {
  // Home Building (6)
  "Building During Uncertainty: Why the Families Who Plan Carefully Now Come Out Ahead": "Home Building",
  "How Much Does a Barndominium Cost Per Square Foot in 2026?": "Home Building",
  "Mastering the Budget for Your Custom Home": "Home Building",
  "What Bad House Plans Actually Cost Builders (And How to Stop Paying for Them)": "Home Building",
  "The 5 Biggest Mistakes People Make When Buying House Plans Online": "Home Building",
  "Building This Spring? What the U.S.\u2013Iran Conflict Means for Your Custom Home": "Home Building",

  // Smart Luxury (3)
  "Design Efficiency: How Smart Floor Plans Cut Building Costs Without Cutting Quality": "Smart Luxury",
  "Designing for Resilience: How to Adapt to Rising Energy Costs and Regional Needs": "Smart Luxury",
  "Designing for Resilience: How to adapt to Rising Energy Costs and Regional Needs": "Smart Luxury",
  "What Is a Value-Engineered House Plan. And How It Saves You Tens of Thousands": "Smart Luxury",

  // ADUs & In-Laws (2)
  "Eco-Friendly Features for Your ADU": "ADUs & In-Laws",
  "The ADU Boom Is Here. Is Your Property Ready?": "ADUs & In-Laws",

  // Design Tips (5)
  "Designing for Arid Climates: What Western Homebuilders Get Wrong (And How to Get It Right)": "Design Tips",
  "Rainy Climate, Beautiful Homes: How Great Architects Design Houses That Handle Water": "Design Tips",
  "Should You Include a Basement in Your New Home Design?": "Design Tips",
  "Your Home Is Either Working for Your Health, Or Against It": "Design Tips",
  "How Sunlight Can Make or Break Your Home. And Why Most Plans Get It Wrong": "Design Tips",
};

function getSanityWriteClient() {
  const token = process.env.SANITY_API_WRITE_TOKEN ?? process.env.SANITY_API_TOKEN;
  if (!token) {
    throw new Error(
      "Missing SANITY_API_WRITE_TOKEN (or SANITY_API_TOKEN) in .env.local. Create a Sanity API token with write access and set SANITY_API_WRITE_TOKEN=...",
    );
  }
  return getSanityClient({ token, useCdn: false, perspective: "published" });
}

async function main() {
  const apply = process.argv.includes("--apply");
  const client = getSanityWriteClient();

  console.log(`\n📝 Blog Category Migration ${apply ? "(APPLYING)" : "(DRY RUN)"}\n`);

  // Fetch all posts
  const posts: { _id: string; title: string; category: string }[] = await client.fetch(
    `*[_type == "post" && defined(slug.current)]{ _id, title, category }`,
  );

  console.log(`Found ${posts.length} posts in Sanity.\n`);

  let matched = 0;
  let skipped = 0;
  let alreadyCorrect = 0;
  const unmatched: string[] = [];

  for (const post of posts) {
    const newCategory = TITLE_TO_NEW_CATEGORY[post.title];
    if (!newCategory) {
      unmatched.push(`  ⚠️  No mapping for: "${post.title}" (current: ${post.category})`);
      skipped++;
      continue;
    }

    if (post.category === newCategory) {
      console.log(`  ✅ Already correct: "${post.title}" → ${newCategory}`);
      alreadyCorrect++;
      continue;
    }

    console.log(`  🔄 "${post.title}": "${post.category}" → "${newCategory}"`);
    matched++;

    if (apply) {
      await client.patch(post._id).set({ category: newCategory }).commit();
      console.log(`     ✅ Updated.`);
    }
  }

  console.log(`\n--- Summary ---`);
  console.log(`  Total posts:      ${posts.length}`);
  console.log(`  To update:        ${matched}`);
  console.log(`  Already correct:  ${alreadyCorrect}`);
  console.log(`  Unmatched:        ${skipped}`);

  if (unmatched.length) {
    console.log(`\nUnmatched posts (no title mapping found — will keep current category):`);
    unmatched.forEach((l) => console.log(l));
  }

  if (!apply && matched > 0) {
    console.log(`\n👉 Run with --apply to commit changes:\n   node --import tsx scripts/migrateBlogCategories.ts --apply\n`);
  }

  if (apply) {
    console.log(`\n✅ Migration complete.\n`);
  }
}

main().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});

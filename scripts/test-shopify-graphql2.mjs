import { config } from "dotenv";
config({ path: ".env.local" });

const SHOPIFY_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN || "vterik-w0.myshopify.com";
const SHOPIFY_TOKEN = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN || "";

async function gql(query, variables) {
  const res = await fetch(`https://${SHOPIFY_DOMAIN}/admin/api/2024-01/graphql.json`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Shopify-Access-Token": SHOPIFY_TOKEN },
    body: JSON.stringify({ query, variables }),
  });
  return res.json();
}

// Search for "Home & Garden" in taxonomy
const r1 = await gql(`{
  taxonomy {
    categories(first: 250) {
      edges {
        node {
          id
          name
          fullName
          level
        }
      }
    }
  }
}`);

if (r1.errors) {
  console.log("Error:", JSON.stringify(r1.errors, null, 2));
} else {
  const cats = r1.data?.taxonomy?.categories?.edges || [];
  const homeGarden = cats.filter(e => e.node.fullName?.toLowerCase().includes("home") || e.node.name?.toLowerCase().includes("home"));
  console.log(`Total categories returned: ${cats.length}`);
  console.log("\nHome-related categories:");
  for (const e of homeGarden) {
    console.log(`  ${e.node.id} — ${e.node.fullName} (level ${e.node.level})`);
  }
}

// Test: update a product's category with productUpdate mutation
// First get one product ID
const r2 = await gql(`{ products(first: 1) { edges { node { id title } } } }`);
const testProduct = r2.data?.products?.edges?.[0]?.node;
console.log(`\nTest product: ${testProduct?.id} — ${testProduct?.title}`);

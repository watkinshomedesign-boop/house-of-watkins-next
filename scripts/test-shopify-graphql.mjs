import { config } from "dotenv";
config({ path: ".env.local" });

const SHOPIFY_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN || "vterik-w0.myshopify.com";
const SHOPIFY_TOKEN = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN || "";

// Test 1: Query taxonomy categories to find "Home & Garden" node ID
const query1 = `{
  taxonomy {
    categories(first: 50, level: 1) {
      edges {
        node {
          id
          name
          fullName
        }
      }
    }
  }
}`;

const res1 = await fetch(`https://${SHOPIFY_DOMAIN}/admin/api/2024-01/graphql.json`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "X-Shopify-Access-Token": SHOPIFY_TOKEN,
  },
  body: JSON.stringify({ query: query1 }),
});
const data1 = await res1.json();
if (data1.errors) {
  console.log("Errors:", JSON.stringify(data1.errors, null, 2));
} else {
  const cats = data1.data?.taxonomy?.categories?.edges || [];
  console.log("Level 1 taxonomy categories:");
  for (const e of cats) {
    const n = e.node;
    console.log(`  ${n.id} — ${n.name}`);
  }
}

// Test 2: Get a sample product to see its current status and category
const query2 = `{
  products(first: 2) {
    edges {
      node {
        id
        title
        status
        category {
          id
          name
          fullName
        }
      }
    }
  }
}`;

const res2 = await fetch(`https://${SHOPIFY_DOMAIN}/admin/api/2024-01/graphql.json`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "X-Shopify-Access-Token": SHOPIFY_TOKEN,
  },
  body: JSON.stringify({ query: query2 }),
});
const data2 = await res2.json();
if (data2.errors) {
  console.log("\nProduct query errors:", JSON.stringify(data2.errors, null, 2));
} else {
  const prods = data2.data?.products?.edges || [];
  console.log("\nSample products:");
  for (const e of prods) {
    const p = e.node;
    console.log(`  ${p.title}: status=${p.status}, category=${p.category?.fullName || "NONE"}`);
  }
}

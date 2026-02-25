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

// Test: set category on one product
const productGid = "gid://shopify/Product/7926796222553";
const categoryGid = "gid://shopify/TaxonomyCategory/hg";

const mutation = `mutation productUpdate($input: ProductInput!) {
  productUpdate(input: $input) {
    product {
      id
      title
      category {
        id
        name
        fullName
      }
    }
    userErrors {
      field
      message
    }
  }
}`;

const r = await gql(mutation, {
  input: {
    id: productGid,
    category: categoryGid,
  },
});

if (r.errors) {
  console.log("GraphQL errors:", JSON.stringify(r.errors, null, 2));
}
const result = r.data?.productUpdate;
if (result?.userErrors?.length) {
  console.log("User errors:", JSON.stringify(result.userErrors, null, 2));
} else {
  console.log("Success:", JSON.stringify(result?.product, null, 2));
}

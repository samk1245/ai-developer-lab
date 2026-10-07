const BASE_URL = "http://localhost:5000";

async function check(name, url) {
  const response = await fetch(url);
  const body = await response.json();
  if (!response.ok || body.success !== true) {
    throw new Error(`${name} failed: HTTP ${response.status}`);
  }
  console.log(`PASS: ${name}`);
}

async function main() {
  await check("Health API", `${BASE_URL}/api/health`);
  const productsResponse = await fetch(`${BASE_URL}/api/products?tenantId=tenant-a`);
  const productsBody = await productsResponse.json();
  if (!productsResponse.ok || productsBody.success !== true) {`r`n    throw new Error("Products API failed");
  }
  const products = productsBody.data || productsBody.products || [];`r`n  for (const product of products) {`r`n    if (product.tenantId && product.tenantId !== "tenant-a") {`r`n      throw new Error("Tenant isolation failed");
    }
  }
  console.log("PASS: Tenant isolation");
  console.log("All API smoke tests passed.");
}

main().catch((error) => {
  console.error("Smoke tests failed:", error.message);
  process.exit(1);
});



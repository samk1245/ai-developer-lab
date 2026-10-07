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
  await check("Products API", `${BASE_URL}/api/products?tenantId=tenant-a`);
  console.log("All API smoke tests passed.");
}

main().catch((error) => {
  console.error("Smoke tests failed:", error.message);
  process.exit(1);
});

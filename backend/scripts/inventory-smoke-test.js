const assert = require("node:assert/strict");

const BASE_URL = process.env.API_URL || "http://localhost:5000";
const TENANT_ID = process.env.TENANT_ID || "tenant-a";

async function checkEndpoint(path, label) {
  const response = await fetch(`${BASE_URL}${path}`);
  const data = await response.json();

  assert.equal(response.status, 200, `${label}: HTTP ${response.status}`);
  assert.notEqual(data.success, false, `${label}: API reported failure`);

  console.log(`PASS ${label}`);
  return data;
}

async function main() {
  await checkEndpoint("/api/health", "API health");

  const summary = await checkEndpoint(
    `/api/inventory/summary?tenantId=${encodeURIComponent(TENANT_ID)}`,
    "Inventory summary"
  );

  const inventory = await checkEndpoint(
    `/api/inventory?tenantId=${encodeURIComponent(TENANT_ID)}`,
    "Inventory listing"
  );

  assert.ok(
    summary.summary || Array.isArray(summary.lowStockProducts) ||
    Array.isArray(summary.outOfStockProducts) || summary.totalProducts !== undefined,
    "Inventory summary response has no recognized inventory fields"
  );

  assert.ok(
    Array.isArray(inventory.products) || Array.isArray(inventory.inventory),
    "Inventory listing response must contain a products or inventory array"
  );

  console.log("All inventory smoke tests passed.");
}

main().catch(error => {
  console.error("SMOKE TEST FAILED:", error.message);
  process.exitCode = 1;
});

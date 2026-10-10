import { useCallback, useEffect, useState } from "react";
import { apiRequest } from "../api";

const money = value => new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0
}).format(Number(value) || 0);

const panel = {
  background: "#fff",
  border: "1px solid #e5e7eb",
  borderRadius: 14,
  padding: 20
};

export default function Inventory() {
  const [summary, setSummary] = useState(null);
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [stockStatus, setStockStatus] = useState("all");
  const [sort, setSort] = useState("name");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatedAt, setUpdatedAt] = useState(null);

  const loadInventory = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams({
        tenantId: "tenant-a",
        search,
        category,
        stockStatus,
        sort
      });

      const [summaryData, inventoryData] = await Promise.all([
        apiRequest("/inventory/summary?tenantId=tenant-a"),
        apiRequest(`/inventory?${params.toString()}`)
      ]);

      if (summaryData.success === false || inventoryData.success === false) {
        throw new Error("Inventory data could not be loaded.");
      }

      setSummary(summaryData.summary || null);
      setProducts(inventoryData.products || []);
      setUpdatedAt(new Date());
    } catch (err) {
      setError(err.message || "Could not connect to the inventory API.");
    } finally {
      setLoading(false);
    }
  }, [search, category, stockStatus, sort]);

  useEffect(() => {
    loadInventory();
  }, [loadInventory]);

  const categories = summary?.categorySummary || [];

  return (
    <main style={{
      maxWidth: 1250,
      margin: "30px auto",
      padding: "0 20px 40px",
      color: "#111827",
      fontFamily: "Inter, Arial, sans-serif"
    }}>
      <header style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 16,
        marginBottom: 25
      }}>
        <div>
          <p style={{ color: "#6366f1", fontWeight: 700, marginBottom: 6 }}>
            OPERATIONS / INVENTORY
          </p>
          <h1 style={{ fontSize: 30, margin: 0 }}>Inventory Dashboard</h1>
          <p style={{ color: "#6b7280", marginBottom: 0 }}>
            Stock health, inventory value and product availability
          </p>
        </div>
        <button onClick={loadInventory} disabled={loading} style={{
          background: "#4f46e5",
          color: "#fff",
          border: 0,
          borderRadius: 9,
          padding: "12px 18px",
          cursor: loading ? "wait" : "pointer",
          fontWeight: 700
        }}>
          {loading ? "Refreshing..." : "↻ Refresh data"}
        </button>
      </header>

      {error && (
        <div role="alert" style={{
          ...panel,
          background: "#fef2f2",
          borderColor: "#fecaca",
          color: "#991b1b",
          marginBottom: 20
        }}>
          <strong>Inventory data unavailable</strong>
          <p style={{ marginBottom: 0 }}>{error}</p>
          <button onClick={loadInventory} style={{ marginTop: 12, padding: 8 }}>
            Try again
          </button>
        </div>
      )}

      <section style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
        gap: 16,
        marginBottom: 24
      }}>
        {[
          ["Total products", summary?.totalProducts, "#eef2ff", "#4338ca"],
          ["Units in stock", summary?.totalUnits, "#ecfdf5", "#047857"],
          ["Inventory value", summary?.totalStockValue == null ? null : money(summary.totalStockValue), "#eff6ff", "#1d4ed8"],
          ["Low-stock items", summary?.lowStockCount, "#fff7ed", "#c2410c"],
          ["Out of stock", summary?.outOfStockCount, "#fef2f2", "#b91c1c"]
        ].map(([label, value, background, color]) => (
          <article key={label} style={panel}>
            <div style={{ color: "#6b7280", fontSize: 13, fontWeight: 600 }}>
              {label}
            </div>
            <div style={{
              fontSize: 27,
              fontWeight: 800,
              color,
              marginTop: 12,
              overflowWrap: "anywhere"
            }}>
              {value == null ? "—" : typeof value === "number" ? value.toLocaleString("en-IN") : value}
            </div>
          </article>
        ))}
      </section>

      <section style={{ ...panel, marginBottom: 24 }}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 12,
          alignItems: "center",
          marginBottom: 18
        }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 19 }}>Category breakdown</h2>
            <p style={{ color: "#6b7280", margin: "5px 0 0", fontSize: 13 }}>
              Stock value and units grouped by category
            </p>
          </div>
          <span style={{ color: "#6b7280", fontSize: 13 }}>
            {categories.length} categories
          </span>
        </div>

        {categories.length === 0 ? (
          <p style={{ color: "#6b7280" }}>
            {loading ? "Loading categories..." : "No category data available."}
          </p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
              <thead>
                <tr style={{ background: "#f9fafb" }}>
                  {["Category", "Products", "Units", "Stock value"].map(label => (
                    <th key={label} style={{ padding: 12, fontSize: 13 }}>{label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {categories.map(item => (
                  <tr key={item.category} style={{ borderTop: "1px solid #e5e7eb" }}>
                    <td style={{ padding: 12, fontWeight: 600 }}>{item.category}</td>
                    <td style={{ padding: 12 }}>{item.productCount}</td>
                    <td style={{ padding: 12 }}>{item.units}</td>
                    <td style={{ padding: 12 }}>{money(item.stockValue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section style={panel}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 12,
          alignItems: "center",
          marginBottom: 18
        }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 19 }}>Product stock</h2>
            <p style={{ color: "#6b7280", margin: "5px 0 0", fontSize: 13 }}>
              Search, filter and sort inventory
            </p>
          </div>
          <strong>{products.length} results</strong>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: 12,
          marginBottom: 18
        }}>
          <input
            aria-label="Search products"
            placeholder="Search products..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ padding: 12, border: "1px solid #d1d5db", borderRadius: 8, minWidth: 0 }}
          />
          <select aria-label="Stock status" value={stockStatus}
            onChange={e => setStockStatus(e.target.value)}
            style={{ padding: 12, border: "1px solid #d1d5db", borderRadius: 8 }}>
            <option value="all">All stock statuses</option>
            <option value="available">Available stock</option>
            <option value="low">Low stock (1–5)</option>
            <option value="out">Out of stock</option>
          </select>
          <select aria-label="Sort products" value={sort}
            onChange={e => setSort(e.target.value)}
            style={{ padding: 12, border: "1px solid #d1d5db", borderRadius: 8 }}>
            <option value="name">Name A–Z</option>
            <option value="priceAsc">Price: low to high</option>
            <option value="priceDesc">Price: high to low</option>
            <option value="stockAsc">Stock: low to high</option>
            <option value="stockDesc">Stock: high to low</option>
          </select>
          <select aria-label="Product category" value={category}
            onChange={e => setCategory(e.target.value)}
            style={{ padding: 12, border: "1px solid #d1d5db", borderRadius: 8 }}>
            <option value="all">All categories</option>
            {categories.map(item => (
              <option key={item.category} value={item.category}>{item.category}</option>
            ))}
          </select>
        </div>

        {loading && products.length === 0 ? (
          <p>Loading products...</p>
        ) : !error && products.length === 0 ? (
          <div style={{ textAlign: "center", padding: 35, color: "#6b7280" }}>
            <h3 style={{ color: "#111827" }}>No matching products</h3>
            <p>Try changing your search or filters.</p>
            <button onClick={() => {
              setSearch("");
              setCategory("all");
              setStockStatus("all");
              setSort("name");
            }}>Clear filters</button>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
              <thead>
                <tr style={{ background: "#f9fafb" }}>
                  {["Product", "Category", "Price", "Stock", "Status"].map(label => (
                    <th key={label} style={{ padding: 13, fontSize: 13 }}>{label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {products.map(product => {
                  const stock = Number(product.stock) || 0;
                  const status = stock <= 0
                    ? { label: "Out of stock", color: "#b91c1c", bg: "#fef2f2" }
                    : stock <= 5
                      ? { label: "Low stock", color: "#c2410c", bg: "#fff7ed" }
                      : { label: "In stock", color: "#047857", bg: "#ecfdf5" };

                  return (
                    <tr key={product._id} style={{ borderTop: "1px solid #e5e7eb" }}>
                      <td style={{ padding: 13, minWidth: 180 }}>
                        <strong>{product.name}</strong>
                        {product.description && (
                          <div style={{
                            color: "#6b7280",
                            fontSize: 12,
                            marginTop: 4,
                            maxWidth: 250
                          }}>
                            {product.description}
                          </div>
                        )}
                      </td>
                      <td style={{ padding: 13 }}>{product.category || "Uncategorized"}</td>
                      <td style={{ padding: 13, whiteSpace: "nowrap" }}>{money(product.price)}</td>
                      <td style={{ padding: 13, fontWeight: 700 }}>{stock}</td>
                      <td style={{ padding: 13 }}>
                        <span style={{
                          display: "inline-block",
                          padding: "5px 9px",
                          borderRadius: 20,
                          fontSize: 12,
                          fontWeight: 700,
                          color: status.color,
                          background: status.bg,
                          whiteSpace: "nowrap"
                        }}>
                          {status.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <p style={{ color: "#9ca3af", fontSize: 12, marginTop: 18 }}>
          {updatedAt ? `Last updated: ${updatedAt.toLocaleTimeString()}` : "Waiting for inventory data"}
        </p>
      </section>
    </main>
  );
}

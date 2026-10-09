import { useCallback, useEffect, useState } from "react";

const API = "http://localhost:5000/api/inventory/summary?tenantId=tenant-a";

const cardStyle = {
  background: "#fff",
  border: "1px solid #e5e7eb",
  borderRadius: 14,
  padding: 22,
  boxShadow: "0 3px 12px rgba(15,23,42,0.04)"
};

export default function Inventory() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatedAt, setUpdatedAt] = useState("");

  const loadInventory = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(API);
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.message || "Could not load inventory");
      }
      setData(result);
      setUpdatedAt(new Date().toLocaleTimeString());
    } catch (err) {
      setError(err.message || "Unable to connect to the inventory API");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInventory();
  }, [loadInventory]);

  const summary = data?.summary || {};
  const metrics = [
    { label: "Total Products", value: summary.totalProducts ?? 0, color: "#2563eb", icon: "▦" },
    { label: "Units in Stock", value: summary.totalUnitsInStock ?? 0, color: "#059669", icon: "▤" },
    { label: "Low Stock", value: summary.lowStockCount ?? 0, color: "#d97706", icon: "!" },
    { label: "Out of Stock", value: summary.outOfStockCount ?? 0, color: "#dc2626", icon: "×" }
  ];

  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    textAlign: "left"
  };

  const renderProducts = (products, emptyText) => {
    if (!products?.length) {
      return <p style={{ color: "#64748b", padding: "12px 0" }}>{emptyText}</p>;
    }

    return (
      <div style={{ overflowX: "auto" }}>
        <table style={tableStyle}>
          <thead>
            <tr>
              {["Product", "Category", "Stock", "Price"].map(label => (
                <th key={label} style={{ padding: 12, background: "#f8fafc", color: "#475569", fontSize: 13 }}>
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr key={product._id || `${product.name}-${index}`}>
                <td style={{ padding: 12, borderBottom: "1px solid #f1f5f9", fontWeight: 600 }}>
                  {product.name}
                </td>
                <td style={{ padding: 12, borderBottom: "1px solid #f1f5f9" }}>
                  {product.category || "Uncategorized"}
                </td>
                <td style={{ padding: 12, borderBottom: "1px solid #f1f5f9" }}>
                  <span style={{
                    background: product.stock === 0 ? "#fee2e2" : "#fef3c7",
                    color: product.stock === 0 ? "#b91c1c" : "#92400e",
                    padding: "4px 9px",
                    borderRadius: 20,
                    fontSize: 12,
                    fontWeight: 700
                  }}>
                    {product.stock} units
                  </span>
                </td>
                <td style={{ padding: 12, borderBottom: "1px solid #f1f5f9" }}>
                  ₹{Number(product.price || 0).toLocaleString("en-IN")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <main style={{
      minHeight: "100vh",
      background: "#f8fafc",
      color: "#0f172a",
      padding: "32px 20px",
      fontFamily: "Inter, Segoe UI, Arial, sans-serif"
    }}>
      <div style={{ maxWidth: 1150, margin: "0 auto" }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
          flexWrap: "wrap",
          marginBottom: 28
        }}>
          <div>
            <p style={{ color: "#2563eb", fontSize: 12, fontWeight: 800, letterSpacing: 2 }}>
              STORE OPERATIONS
            </p>
            <h1 style={{ fontSize: 32, margin: "8px 0" }}>Inventory Dashboard</h1>
            <p style={{ color: "#64748b", margin: 0 }}>
              Stock health and inventory alerts · Tenant A
            </p>
          </div>
          <button
            onClick={loadInventory}
            disabled={loading}
            style={{
              background: "#2563eb",
              color: "#fff",
              border: 0,
              borderRadius: 10,
              padding: "12px 18px",
              fontWeight: 700,
              cursor: loading ? "wait" : "pointer"
            }}
          >
            {loading ? "Refreshing..." : "↻ Refresh data"}
          </button>
        </div>

        {updatedAt && (
          <p style={{ color: "#64748b", fontSize: 12, marginBottom: 18 }}>
            Last updated: {updatedAt}
          </p>
        )}

        {error && (
          <div role="alert" style={{
            background: "#fef2f2",
            color: "#b91c1c",
            border: "1px solid #fecaca",
            borderRadius: 12,
            padding: 16,
            marginBottom: 20
          }}>
            <strong>Inventory data unavailable.</strong> {error}
            <p style={{ marginBottom: 0 }}>Check that the backend and MongoDB are running, then refresh.</p>
          </div>
        )}

        <section style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
          gap: 16,
          marginBottom: 28
        }}>
          {metrics.map(metric => (
            <article key={metric.label} style={cardStyle}>
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}>
                <span style={{ color: "#64748b", fontSize: 14 }}>{metric.label}</span>
                <span style={{
                  background: `${metric.color}18`,
                  color: metric.color,
                  borderRadius: 10,
                  width: 36,
                  height: 36,
                  display: "grid",
                  placeItems: "center",
                  fontSize: 22,
                  fontWeight: 800
                }}>{metric.icon}</span>
              </div>
              <div style={{ fontSize: 34, fontWeight: 800, marginTop: 18 }}>
                {loading && !data ? "—" : metric.value.toLocaleString("en-IN")}
              </div>
            </article>
          ))}
        </section>

        <section style={{ ...cardStyle, marginBottom: 22 }}>
          <div style={{ marginBottom: 12 }}>
            <h2 style={{ margin: "0 0 6px", fontSize: 20 }}>Low-stock alerts</h2>
            <p style={{ margin: 0, color: "#64748b", fontSize: 13 }}>
              Products with 1–{data?.threshold ?? 5} units remaining
            </p>
          </div>
          {loading && !data
            ? <p>Loading inventory...</p>
            : renderProducts(data?.lowStockProducts, "All stocked products are above the alert threshold.")}
        </section>

        <section style={cardStyle}>
          <div style={{ marginBottom: 12 }}>
            <h2 style={{ margin: "0 0 6px", fontSize: 20 }}>Out-of-stock products</h2>
            <p style={{ margin: 0, color: "#64748b", fontSize: 13 }}>
              Products that need replenishment
            </p>
          </div>
          {loading && !data
            ? <p>Loading inventory...</p>
            : renderProducts(data?.outOfStockProducts, "No out-of-stock products found.")}
        </section>
      </div>
    </main>
  );
}

import { useCallback, useEffect, useState } from "react";

const API = "http://localhost:5000/api/inventory/summary?tenantId=tenant-a";

const cardStyle = {
  background: "#fff",
  border: "1px solid #e2e8f0",
  borderRadius: 16,
  padding: 22,
  boxShadow: "0 4px 16px rgba(15,23,42,0.04)"
};

function money(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(Number(value) || 0);
}

export default function Inventory() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatedAt, setUpdatedAt] = useState(null);

  const loadInventory = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(API);
      const result = await response.json();

      if (!response.ok || result.success === false) {
        throw new Error(result.message || "Unable to load inventory");
      }

      setData(result);
      setUpdatedAt(new Date());
    } catch (err) {
      setError(err.message || "Could not connect to the inventory API");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInventory();
  }, [loadInventory]);

  const summary = data?.summary || {};
  const lowStock = data?.lowStockProducts || [];
  const outOfStock = data?.outOfStockProducts || [];

  const stats = [
    {
      label: "Total Products",
      value: summary.totalProducts ?? summary.total ?? "—",
      detail: "Products in this tenant",
      color: "#2563eb",
      icon: "▦"
    },
    {
      label: "Inventory Value",
      value: summary.inventoryValue != null
        ? money(summary.inventoryValue)
        : "—",
      detail: "Estimated stock value",
      color: "#7c3aed",
      icon: "₹"
    },
    {
      label: "Low Stock",
      value: summary.lowStockCount ?? lowStock.length,
      detail: "Products need attention",
      color: "#d97706",
      icon: "!"
    },
    {
      label: "Out of Stock",
      value: summary.outOfStockCount ?? outOfStock.length,
      detail: "Products unavailable",
      color: "#dc2626",
      icon: "×"
    }
  ];

  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    textAlign: "left"
  };

  const cellStyle = {
    padding: "13px 15px",
    borderBottom: "1px solid #edf2f7",
    fontSize: 14
  };

  function ProductTable({ products, emptyText }) {
    if (!products.length) {
      return (
        <div style={{ padding: 24, color: "#64748b", fontSize: 14 }}>
          {emptyText}
        </div>
      );
    }

    return (
      <div style={{ overflowX: "auto" }}>
        <table style={tableStyle}>
          <thead>
            <tr style={{ background: "#f8fafc", color: "#64748b" }}>
              <th style={cellStyle}>Product</th>
              <th style={cellStyle}>Price</th>
              <th style={cellStyle}>Stock</th>
              <th style={cellStyle}>Status</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => {
              const stock = Number(product.stock ?? 0);
              const empty = stock <= 0;

              return (
                <tr key={product._id || product.id || product.name}>
                  <td style={cellStyle}>
                    <strong style={{ color: "#0f172a" }}>
                      {product.name || "Unnamed product"}
                    </strong>
                    <div style={{ color: "#94a3b8", fontSize: 12, marginTop: 4 }}>
                      {product.category || "General"}
                    </div>
                  </td>
                  <td style={cellStyle}>{money(product.price)}</td>
                  <td style={cellStyle}>{stock}</td>
                  <td style={cellStyle}>
                    <span style={{
                      display: "inline-block",
                      padding: "5px 9px",
                      borderRadius: 20,
                      background: empty ? "#fee2e2" : "#fef3c7",
                      color: empty ? "#b91c1c" : "#92400e",
                      fontSize: 12,
                      fontWeight: 700
                    }}>
                      {empty ? "Out of stock" : "Low stock"}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <main style={{
      minHeight: "100vh",
      background: "#f1f5f9",
      padding: "32px 20px",
      fontFamily: "Inter, Segoe UI, Arial, sans-serif",
      color: "#0f172a"
    }}>
      <div style={{ maxWidth: 1180, margin: "0 auto" }}>
        <header style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 16,
          marginBottom: 28
        }}>
          <div>
            <div style={{
              color: "#2563eb",
              fontSize: 12,
              fontWeight: 800,
              letterSpacing: 2,
              marginBottom: 8
            }}>
              STORE MANAGEMENT
            </div>
            <h1 style={{ margin: 0, fontSize: 30, letterSpacing: -1 }}>
              Inventory Dashboard
            </h1>
            <p style={{ margin: "9px 0 0", color: "#64748b" }}>
              Monitor stock levels and identify products that need attention.
            </p>
          </div>
          <button
            onClick={loadInventory}
            disabled={loading}
            style={{
              border: 0,
              borderRadius: 10,
              padding: "12px 18px",
              background: loading ? "#94a3b8" : "#2563eb",
              color: "#fff",
              fontWeight: 700,
              cursor: loading ? "wait" : "pointer"
            }}
          >
            {loading ? "Refreshing..." : "↻ Refresh Data"}
          </button>
        </header>

        {error && (
          <div role="alert" style={{
            ...cardStyle,
            marginBottom: 22,
            borderColor: "#fecaca",
            background: "#fef2f2",
            color: "#b91c1c"
          }}>
            <strong>Inventory data unavailable</strong>
            <p style={{ marginBottom: 12 }}>{error}</p>
            <button onClick={loadInventory}>Try again</button>
          </div>
        )}

        <section style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 18,
          marginBottom: 26
        }}>
          {stats.map((stat) => (
            <article key={stat.label} style={cardStyle}>
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}>
                <span style={{ color: "#64748b", fontSize: 14, fontWeight: 600 }}>
                  {stat.label}
                </span>
                <span style={{
                  display: "grid",
                  placeItems: "center",
                  width: 38,
                  height: 38,
                  borderRadius: 11,
                  background: `${stat.color}15`,
                  color: stat.color,
                  fontSize: 21,
                  fontWeight: 800
                }}>
                  {stat.icon}
                </span>
              </div>
              <div style={{
                marginTop: 20,
                fontSize: 29,
                fontWeight: 800,
                overflowWrap: "anywhere"
              }}>
                {loading && !data ? "..." : stat.value}
              </div>
              <p style={{ margin: "8px 0 0", color: "#94a3b8", fontSize: 13 }}>
                {stat.detail}
              </p>
            </article>
          ))}
        </section>

        <section style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: 20
        }}>
          <article style={cardStyle}>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 12
            }}>
              <h2 style={{ margin: 0, fontSize: 18 }}>Low-stock alerts</h2>
              <span style={{
                background: "#fef3c7",
                color: "#92400e",
                borderRadius: 20,
                padding: "5px 10px",
                fontSize: 12,
                fontWeight: 800
              }}>
                {lowStock.length} items
              </span>
            </div>
            <p style={{ color: "#64748b", fontSize: 13, marginBottom: 20 }}>
              Restock these products soon.
            </p>
            {loading && !data ? (
              <p>Loading inventory...</p>
            ) : (
              <ProductTable
                products={lowStock}
                emptyText="No low-stock products reported."
              />
            )}
          </article>

          <article style={cardStyle}>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 12
            }}>
              <h2 style={{ margin: 0, fontSize: 18 }}>Out of stock</h2>
              <span style={{
                background: "#fee2e2",
                color: "#b91c1c",
                borderRadius: 20,
                padding: "5px 10px",
                fontSize: 12,
                fontWeight: 800
              }}>
                {outOfStock.length} items
              </span>
            </div>
            <p style={{ color: "#64748b", fontSize: 13, marginBottom: 20 }}>
              These products currently have no stock.
            </p>
            {loading && !data ? (
              <p>Loading inventory...</p>
            ) : (
              <ProductTable
                products={outOfStock}
                emptyText="No out-of-stock products reported."
              />
            )}
          </article>
        </section>

        <footer style={{
          marginTop: 22,
          color: "#94a3b8",
          fontSize: 12,
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 10
        }}>
          <span>Tenant: tenant-a</span>
          <span>
            {updatedAt ? `Last updated: ${updatedAt.toLocaleTimeString()}` : "Waiting for data"}
          </span>
        </footer>
      </div>
    </main>
  );
}

import { useEffect, useMemo, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const TENANT_ID = import.meta.env.VITE_TENANT_ID || "tenant-a";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [stockFilter, setStockFilter] = useState("all");
  const [sort, setSort] = useState("default");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadProducts = () => {
    setLoading(true);
    setError("");

    fetch(`${API_URL}/api/products?tenantId=${TENANT_ID}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load products");
        return res.json();
      })
      .then((data) => {
        setProducts(data.products || data.data || []);
      })
      .catch(() => {
        setError("Unable to load products. Make sure the backend is running.");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    const keyword = search.trim().toLowerCase();

    if (keyword) {
      result = result.filter((product) =>
        `${product.name || ""} ${product.description || ""}`
          .toLowerCase()
          .includes(keyword)
      );
    }

    if (stockFilter === "in-stock") {
      result = result.filter((product) => Number(product.stock) > 0);
    }

    if (stockFilter === "out-of-stock") {
      result = result.filter((product) => Number(product.stock) <= 0);
    }

    if (sort === "low-high") {
      result.sort((a, b) => Number(a.price || 0) - Number(b.price || 0));
    }

    if (sort === "high-low") {
      result.sort((a, b) => Number(b.price || 0) - Number(a.price || 0));
    }

    return result;
  }, [products, search, stockFilter, sort]);

  return (
    <div style={{
      maxWidth: 1150,
      margin: "40px auto",
      padding: "20px",
      fontFamily: "Arial"
    }}>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 15,
        flexWrap: "wrap"
      }}>
        <div>
          <h1 style={{ marginBottom: 5 }}>Products</h1>
          <p style={{ color: "#666" }}>
            {filteredProducts.length} product(s) available
          </p>
        </div>

        <button
          onClick={loadProducts}
          style={{
            padding: "10px 16px",
            border: "1px solid #d1d5db",
            background: "white",
            borderRadius: 7,
            cursor: "pointer"
          }}
        >
          ? Refresh
        </button>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "2fr 1fr 1fr",
        gap: 12,
        margin: "25px 0"
      }}>
        <input
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: 12,
            border: "1px solid #d1d5db",
            borderRadius: 7
          }}
        />

        <select
          value={stockFilter}
          onChange={(e) => setStockFilter(e.target.value)}
          style={{
            padding: 12,
            border: "1px solid #d1d5db",
            borderRadius: 7
          }}
        >
          <option value="all">All Stock</option>
          <option value="in-stock">In Stock</option>
          <option value="out-of-stock">Out of Stock</option>
        </select>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          style={{
            padding: 12,
            border: "1px solid #d1d5db",
            borderRadius: 7
          }}
        >
          <option value="default">Sort: Default</option>
          <option value="low-high">Price: Low to High</option>
          <option value="high-low">Price: High to Low</option>
        </select>
      </div>

      {loading && (
        <div style={{ textAlign: "center", padding: 50 }}>
          <h2>Loading products...</h2>
        </div>
      )}

      {!loading && error && (
        <div style={{
          padding: 25,
          borderRadius: 10,
          background: "#fef2f2",
          color: "#b91c1c",
          textAlign: "center"
        }}>
          <h3>Unable to load products</h3>
          <p>{error}</p>
          <button onClick={loadProducts}>Try Again</button>
        </div>
      )}

      {!loading && !error && filteredProducts.length === 0 && (
        <div style={{
          padding: 50,
          textAlign: "center",
          border: "1px solid #e5e7eb",
          borderRadius: 10
        }}>
          <h2>No products found</h2>
          <p style={{ color: "#666" }}>
            Try changing your search or filters.
          </p>
        </div>
      )}

      {!loading && !error && filteredProducts.length > 0 && (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: 20
        }}>
          {filteredProducts.map((product) => {
            const stock = Number(product.stock || 0);
            const available = stock > 0;

            return (
              <article
                key={product._id || product.id}
                style={{
                  border: "1px solid #e5e7eb",
                  borderRadius: 12,
                  padding: 20,
                  background: "white",
                  boxShadow: "0 3px 12px rgba(0,0,0,0.06)"
                }}
              >
                <div style={{
                  height: 150,
                  borderRadius: 9,
                  background: "#f3f4f6",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 50
                }}>
                  ???
                </div>

                <h2>{product.name}</h2>

                <p style={{
                  color: "#6b7280",
                  minHeight: 45
                }}>
                  {product.description || "Quality product available now."}
                </p>

                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: 15
                }}>
                  <strong style={{ fontSize: 21 }}>
                    ?{Number(product.price || 0).toLocaleString("en-IN")}
                  </strong>

                  <span style={{
                    color: available ? "#15803d" : "#dc2626",
                    fontSize: 14,
                    fontWeight: 600
                  }}>
                    {available ? `${stock} in stock` : "Out of stock"}
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

import { useEffect, useMemo, useState } from "react";
import { apiRequest } from "../api";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("featured");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadProducts() {
    try {
      setLoading(true);
      setError("");
      const data = await apiRequest("/products?tenantId=tenant-a");
      setProducts(Array.isArray(data.products) ? data.products : []);
    } catch (err) {
      setError(err.message || "Products could not be loaded.");
    } finally {
      setLoading(false);
    }
  }

  useState(() => {
    loadProducts();
  }, []);

  const categories = useMemo(
    () => ["All", ...new Set(products.map(p => p.category).filter(Boolean))],
    [products]
  );

  const visibleProducts = useMemo(() => {
    let result = products.filter(p =>
      `${p.name || ""} ${p.description || ""} ${p.category || ""}`
        .toLowerCase().includes(search.toLowerCase())
    );

    if (category !== "All") {
      result = result.filter(p => p.category === category);
    }

    if (sort === "price-low") result.sort((a, b) => a.price - b.price);
    if (sort === "price-high") result.sort((a, b) => b.price - a.price);
    if (sort === "name") result.sort((a, b) => a.name.localeCompare(b.name));

    return result;
  }, [products, search, category, sort]);

  function addToCart(product) {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existing = cart.find(item => item.productId === product._id);

    if (existing) {
      if (existing.quantity >= product.stock) {
        alert("Available stock limit reached.");
        return;
      }
      existing.quantity += 1;
    } else {
      cart.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity: 1
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    alert(`${product.name} added to cart`);
  }

  return (
    <main className="catalog-page">
      <section className="catalog-heading">
        <div>
          <span className="catalog-eyebrow">THE EVERYDAY STORE</span>
          <h1>Find your next favourite.</h1>
          <p>Explore products, compare prices and shop with ease.</p>
        </div>
        <span className="catalog-count">{visibleProducts.length} products</span>
      </section>

      <section className="catalog-toolbar">
        <input
          aria-label="Search products"
          placeholder="Search products, categories..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select aria-label="Filter by category" value={category}
          onChange={e => setCategory(e.target.value)}>
          {categories.map(c => <option key={c}>{c}</option>)}
        </select>
        <select aria-label="Sort products" value={sort}
          onChange={e => setSort(e.target.value)}>
          <option value="featured">Recommended</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="name">Name: A to Z</option>
        </select>
        <button className="catalog-refresh" onClick={loadProducts}>Refresh</button>
      </section>

      {loading ? <p className="catalog-message">Loading products...</p> :
        error ? <div className="catalog-message">
          <p>{error}</p><button onClick={loadProducts}>Try again</button>
        </div> :
        visibleProducts.length === 0 ? <div className="catalog-message">
          <h2>No products found</h2>
          <p>Try another search or category.</p>
          <button onClick={() => { setSearch(""); setCategory("All"); }}>
            Clear filters
          </button>
        </div> :
        <section className="catalog-grid">
          {visibleProducts.map(product => (
            <article className="catalog-card" key={product._id}>
              <div className="catalog-image">
                {product.image ?
                  <img src={product.image} alt={product.name} loading="lazy" /> :
                  <span>🛍️</span>}
                <span className={`stock-pill ${product.stock > 0 ? "in-stock" : "out-stock"}`}>
                  {product.stock > 0 ? "In stock" : "Out of stock"}
                </span>
              </div>
              <div className="catalog-card-body">
                <span className="catalog-category">{product.category || "General"}</span>
                <h2>{product.name}</h2>
                <p className="catalog-description">
                  {product.description || "A great addition to your everyday essentials."}
                </p>
                <div className="catalog-card-bottom">
                  <strong>₹{Number(product.price || 0).toLocaleString("en-IN")}</strong>
                  <button disabled={!(product.stock > 0)}
                    onClick={() => addToCart(product)}>
                    {product.stock > 0 ? "Add to cart +" : "Unavailable"}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </section>
      }
    </main>
  );
}


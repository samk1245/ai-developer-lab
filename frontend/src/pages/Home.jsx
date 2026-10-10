import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

const products = [
  { id: 1, name: "Wireless Headphones", category: "Electronics", price: 1499, oldPrice: 2499, icon: "🎧", color: "#e8efff", rating: "4.5" },
  { id: 2, name: "Smart Watch", category: "Electronics", price: 1999, oldPrice: 3299, icon: "⌚", color: "#e8f7f0", rating: "4.3" },
  { id: 3, name: "Everyday Backpack", category: "Fashion", price: 899, oldPrice: 1499, icon: "🎒", color: "#fff0df", rating: "4.4" },
  { id: 4, name: "Running Sneakers", category: "Fashion", price: 1799, oldPrice: 2799, icon: "👟", color: "#f3eaff", rating: "4.6" },
  { id: 5, name: "Desk Lamp", category: "Home", price: 699, oldPrice: 999, icon: "💡", color: "#fff6cf", rating: "4.2" },
  { id: 6, name: "Travel Coffee Mug", category: "Home", price: 499, oldPrice: 799, icon: "☕", color: "#e4f4fa", rating: "4.1" },
  { id: 7, name: "Gaming Controller", category: "Electronics", price: 1299, oldPrice: 1999, icon: "🎮", color: "#ffe9e9", rating: "4.7" },
  { id: 8, name: "Sunglasses", category: "Fashion", price: 599, oldPrice: 999, icon: "🕶️", color: "#e9edf2", rating: "4.0" }
];

const categories = [
  { name: "All", icon: "✦" },
  { name: "Electronics", icon: "⌘" },
  { name: "Fashion", icon: "♧" },
  { name: "Home", icon: "⌂" }
];

export default function Home() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const filtered = useMemo(() => products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === "All" || product.category === category;
    return matchesSearch && matchesCategory;
  }), [search, category]);

  return (
    <main className="store-home">
      <div className="store-promo">
        <span>✦</span> YOUR EVERYDAY MARKETPLACE
        <span className="promo-right">Discover something you’ll love →</span>
      </div>

      <header className="store-header">
        <Link to="/" className="store-brand">
          <span className="brand-mark">s</span>
          <span>shop<span className="brand-accent">nest</span><small>SHOP SMART. LIVE BETTER.</small></span>
        </Link>

        <form className="store-search" onSubmit={(e) => {
          e.preventDefault();
          document.getElementById("featured-products")?.scrollIntoView({ behavior: "smooth" });
        }}>
          <span>⌕</span>
          <input
            aria-label="Search products"
            placeholder="Search for products, brands and more..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>

        <div className="store-actions">
          <Link to="/login" className="store-account"><span>♙</span><span>Account<small>Sign in</small></span></Link>
          <Link to="/cart" className="store-cart"><span>🛒</span><span>Cart</span></Link>
        </div>
      </header>

      <nav className="store-nav">
        <Link to="/products" className="nav-all">☰ &nbsp; All Products</Link>
        <a href="#featured-products">Today's Picks</a>
        <a href="#categories">Categories</a>
        <Link to="/products">Best Sellers</Link>
        <Link to="/register">Create Account</Link>
        <span className="nav-promise">✓ Quality picks, everyday value</span>
      </nav>

      <section className="store-hero">
        <div className="hero-copy">
          <span className="hero-label">THE SMARTER WAY TO SHOP</span>
          <h1>Good finds.<br /><span>Great prices.</span></h1>
          <p>Explore everyday essentials, the latest tech and little things that make life better.</p>
          <div className="hero-buttons">
            <a href="#featured-products" className="shop-button">Explore products <span>→</span></a>
            <Link to="/register" className="hero-secondary">Join for free</Link>
          </div>
          <div className="hero-trust"><span>✓ Curated picks</span><span>✓ Easy browsing</span><span>✓ One place to shop</span></div>
        </div>
        <div className="hero-art">
          <div className="hero-orbit orbit-one"></div>
          <div className="hero-orbit orbit-two"></div>
          <div className="hero-main-emoji">🛍️</div>
          <div className="float-card float-top"><span>✨</span><div><b>Fresh finds</b><small>Worth discovering</small></div></div>
          <div className="float-card float-bottom"><span>🏷️</span><div><b>Great value</b><small>More to explore</small></div></div>
          <div className="hero-sparkle sparkle-one">✦</div>
          <div className="hero-sparkle sparkle-two">✧</div>
        </div>
      </section>

      <section className="store-benefits">
        <div><span className="benefit-icon">🚚</span><div><b>Convenient shopping</b><small>Browse from anywhere</small></div></div>
        <div><span className="benefit-icon">🔒</span><div><b>Account access</b><small>Your shopping in one place</small></div></div>
        <div><span className="benefit-icon">🎯</span><div><b>Easy discovery</b><small>Find what you need faster</small></div></div>
        <div><span className="benefit-icon">💬</span><div><b>Simple experience</b><small>Clean, easy navigation</small></div></div>
      </section>

      <section id="categories" className="store-section">
        <div className="section-heading">
          <div><span className="section-eyebrow">EXPLORE YOUR INTERESTS</span><h2>Shop by category</h2><p>A little something for every part of your day.</p></div>
          <Link to="/products" className="view-link">View all products →</Link>
        </div>
        <div className="category-grid">
          {[
            { name: "Electronics", icon: "🎧", desc: "Tech for everyday life", color: "#e8efff" },
            { name: "Fashion", icon: "👟", desc: "Style your own way", color: "#fff0e5" },
            { name: "Home", icon: "🪴", desc: "Make space feel yours", color: "#e5f6ed" }
          ].map((item) => (
            <button key={item.name} className="category-card" onClick={() => {
              setCategory(item.name);
              document.getElementById("featured-products")?.scrollIntoView({ behavior: "smooth" });
            }}>
              <span className="category-art" style={{ background: item.color }}>{item.icon}</span>
              <span className="category-info"><b>{item.name}</b><small>{item.desc}</small></span>
              <span className="category-arrow">↗</span>
            </button>
          ))}
        </div>
      </section>

      <section id="featured-products" className="store-section featured-section">
        <div className="section-heading">
          <div><span className="section-eyebrow">HANDPICKED FOR YOU</span><h2>Popular picks</h2><p>Discover products to match your everyday needs.</p></div>
          <Link to="/products" className="view-link">Browse catalogue →</Link>
        </div>

        <div className="product-filters">
          {categories.map((item) => (
            <button key={item.name} onClick={() => setCategory(item.name)} className={category === item.name ? "filter-chip active" : "filter-chip"}>
              {item.icon} &nbsp;{item.name}
            </button>
          ))}
          <span className="result-count">{filtered.length} products</span>
        </div>

        {filtered.length ? (
          <div className="store-product-grid">
            {filtered.map((product) => (
              <article className="store-product-card" key={product.id}>
                <div className="product-art" style={{ background: product.color }}>
                  <span className="product-badge">POPULAR</span>
                  <span className="product-emoji">{product.icon}</span>
                  <span className="product-wish" aria-label="Product highlight">♡</span>
                </div>
                <div className="product-details">
                  <span className="product-category">{product.category}</span>
                  <h3>{product.name}</h3>
                  <div className="product-rating"><span>★</span> {product.rating} <small>Sample rating</small></div>
                  <div className="product-price"><b>₹{product.price.toLocaleString("en-IN")}</b><del>₹{product.oldPrice.toLocaleString("en-IN")}</del><span>{Math.round((1 - product.price / product.oldPrice) * 100)}% off</span></div>
                  <Link className="product-cta" to="/products">Explore product <span>→</span></Link>
                </div>
              </article>
            ))}
          </div>
        ) : <div className="store-empty"><span>⌕</span><h3>No matching products</h3><p>Try another search or category.</p><button onClick={() => { setSearch(""); setCategory("All"); }}>Clear filters</button></div>}
        <p className="sample-note">Preview products are illustrative. Open Products to browse the catalogue connected to your application.</p>
      </section>

      <section className="store-join">
        <div><span className="section-eyebrow">YOUR NEXT GREAT FIND STARTS HERE</span><h2>Shopping, made simpler.</h2><p>Create an account to get started with your shopping experience.</p></div>
        <Link to="/register" className="shop-button">Create your account <span>→</span></Link>
      </section>

      <footer className="store-footer">
        <Link to="/" className="footer-brand">shop<span>nest</span></Link>
        <p>Your everyday marketplace.</p>
        <div><Link to="/products">Products</Link><Link to="/login">Login</Link><Link to="/register">Register</Link><Link to="/orders">Orders</Link></div>
        <small>© {new Date().getFullYear()} ShopNest · Multi-Tenant E-Commerce</small>
      </footer>
    </main>
  );
}

import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "16px 30px",
      background: "#111827",
      color: "white",
      boxShadow: "0 2px 8px rgba(0,0,0,0.15)"
    }}>
      <Link to="/" style={{
        color: "white",
        textDecoration: "none",
        fontSize: "20px",
        fontWeight: "700"
      }}>
        Multi-Tenant E-Commerce
      </Link>

      <div style={{
        display: "flex",
        gap: "18px",
        alignItems: "center",
        flexWrap: "wrap"
      }}>
        <Link to="/" style={{ color: "white", textDecoration: "none" }}>Home</Link>
        <Link to="/dashboard" style={{ color: "white", textDecoration: "none" }}>Dashboard</Link>
        <Link to="/products" style={{ color: "white", textDecoration: "none" }}>Products</Link>
        <Link to="/cart" style={{ color: "white", textDecoration: "none" }}>Cart</Link>
        <Link to="/orders" style={{ color: "white", textDecoration: "none" }}>Orders</Link>
        <Link to="/checkout" style={{
          color: "white",
          textDecoration: "none",
          background: "#2563eb",
          padding: "8px 14px",
          borderRadius: "6px"
        }}>
          Checkout
        </Link>
      </div>
    </nav>
  );
}

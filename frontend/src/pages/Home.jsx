import { Link } from "react-router-dom";

export default function Home() {
  return (
    <main style={{
      minHeight: "75vh",
      fontFamily: "Arial",
      background: "linear-gradient(135deg, #eff6ff 0%, #ffffff 55%, #f5f3ff 100%)"
    }}>
      <section style={{
        maxWidth: 1100,
        margin: "0 auto",
        padding: "80px 25px",
        textAlign: "center"
      }}>
        <div style={{
          display: "inline-block",
          padding: "7px 14px",
          borderRadius: 30,
          background: "#dbeafe",
          color: "#1d4ed8",
          fontSize: 13,
          fontWeight: 700,
          marginBottom: 20
        }}>
          MULTI-TENANT COMMERCE PLATFORM
        </div>

        <h1 style={{
          fontSize: "clamp(36px, 6vw, 62px)",
          margin: "0 auto 20px",
          lineHeight: 1.05,
          color: "#111827"
        }}>
          One Platform.
          <br />
          Multiple Stores.
        </h1>

        <p style={{
          maxWidth: 680,
          margin: "0 auto 35px",
          color: "#4b5563",
          fontSize: 18,
          lineHeight: 1.7
        }}>
          A modern e-commerce platform designed for multiple tenants,
          product management, cart, checkout and order tracking.
        </p>

        <div style={{
          display: "flex",
          justifyContent: "center",
          gap: 14,
          flexWrap: "wrap"
        }}>
          <Link to="/products" style={{
            padding: "14px 24px",
            background: "#2563eb",
            color: "white",
            textDecoration: "none",
            borderRadius: 8,
            fontWeight: 700
          }}>
            Explore Products
          </Link>

          <Link to="/register" style={{
            padding: "14px 24px",
            background: "#111827",
            color: "white",
            textDecoration: "none",
            borderRadius: 8,
            fontWeight: 700
          }}>
            Create Account
          </Link>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 18,
          marginTop: 65
        }}>
          {[
            ["??", "Multi-Tenant", "Separate stores with isolated data"],
            ["??", "Secure Auth", "Protected authentication system"],
            ["??", "Smart Cart", "Simple shopping experience"],
            ["??", "Order Tracking", "Manage and track customer orders"]
          ].map(([icon, title, text]) => (
            <div key={title} style={{
              padding: 24,
              background: "rgba(255,255,255,0.9)",
              border: "1px solid #e5e7eb",
              borderRadius: 12
            }}>
              <div style={{ fontSize: 30 }}>{icon}</div>
              <h3>{title}</h3>
              <p style={{
                color: "#6b7280",
                fontSize: 14,
                lineHeight: 1.5
              }}>
                {text}
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

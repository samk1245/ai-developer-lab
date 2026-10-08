export default function Footer() {
  return (
    <footer style={{
      marginTop: "50px",
      padding: "30px 20px",
      background: "#111827",
      color: "#d1d5db",
      textAlign: "center",
      fontFamily: "Arial"
    }}>
      <h3 style={{ color: "white", marginBottom: 8 }}>
        Multi-Tenant E-Commerce
      </h3>

      <p style={{ margin: 0 }}>
        Secure • Scalable • Multi-Tenant Shopping Platform
      </p>

      <p style={{
        marginTop: 15,
        fontSize: 13,
        color: "#9ca3af"
      }}>
        © {new Date().getFullYear()} Multi-Tenant E-Commerce. All rights reserved.
      </p>
    </footer>
  );
}

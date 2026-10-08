export default function NotFound() {
  return (
    <div style={{
      minHeight: "70vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      padding: "30px",
      fontFamily: "Arial"
    }}>
      <div>
        <div style={{ fontSize: "80px", fontWeight: "800" }}>404</div>
        <h1>Page Not Found</h1>
        <p style={{ color: "#666" }}>
          The page you are looking for does not exist.
        </p>
        <a
          href="/"
          style={{
            display: "inline-block",
            marginTop: "15px",
            padding: "12px 20px",
            background: "#2563eb",
            color: "white",
            textDecoration: "none",
            borderRadius: "6px"
          }}
        >
          Back to Home
        </a>
      </div>
    </div>
  );
}

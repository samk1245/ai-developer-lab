import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Checkout() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    pincode: ""
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    const order = {
      id: "ORD-" + Date.now(),
      customer: form,
      status: "Confirmed",
      total: 259999,
      createdAt: new Date().toISOString(),
      items: [
        {
          name: "Gaming Laptop",
          quantity: 1,
          price: 259999
        }
      ]
    };

    const existingOrders =
      JSON.parse(localStorage.getItem("orders") || "[]");

    localStorage.setItem(
      "orders",
      JSON.stringify([order, ...existingOrders])
    );

    setTimeout(() => {
      setLoading(false);
      navigate("/orders");
    }, 600);
  };

  return (
    <div style={{
      maxWidth: 850,
      margin: "40px auto",
      padding: 20,
      fontFamily: "Arial"
    }}>
      <h1>Checkout</h1>
      <p style={{ color: "#666" }}>
        Enter your delivery details to place your order.
      </p>

      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 300px",
        gap: 30,
        marginTop: 30
      }}>
        <form onSubmit={handleSubmit}>
          {[
            ["name", "Full Name"],
            ["email", "Email"],
            ["phone", "Phone"],
            ["address", "Address"],
            ["city", "City"],
            ["pincode", "Pincode"]
          ].map(([name, label]) => (
            <div key={name} style={{ marginBottom: 16 }}>
              <label style={{ fontWeight: 600 }}>{label}</label>

              <input
                name={name}
                type={name === "email" ? "email" : "text"}
                value={form[name]}
                onChange={handleChange}
                required
                style={{
                  display: "block",
                  width: "100%",
                  boxSizing: "border-box",
                  padding: 12,
                  marginTop: 6,
                  border: "1px solid #d1d5db",
                  borderRadius: 6
                }}
              />
            </div>
          ))}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: 14,
              border: "none",
              borderRadius: 7,
              background: loading ? "#9ca3af" : "#2563eb",
              color: "white",
              fontSize: 16,
              fontWeight: 700,
              cursor: loading ? "not-allowed" : "pointer"
            }}
          >
            {loading ? "Placing Order..." : "Place Order"}
          </button>
        </form>

        <div style={{
          border: "1px solid #e5e7eb",
          borderRadius: 10,
          padding: 20,
          height: "fit-content",
          background: "#f9fafb"
        }}>
          <h2>Order Summary</h2>

          <div style={{
            display: "flex",
            justifyContent: "space-between",
            margin: "20px 0"
          }}>
            <span>Gaming Laptop × 1</span>
            <strong>?2,59,999</strong>
          </div>

          <hr />

          <div style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 20,
            fontSize: 18
          }}>
            <strong>Total</strong>
            <strong>?2,59,999</strong>
          </div>
        </div>
      </div>
    </div>
  );
}

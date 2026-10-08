import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../api";

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const cart = JSON.parse(localStorage.getItem("cart") || "[]");

    if (!cart.length) {
      alert("Cart is empty");
      navigate("/cart");
      return;
    }

    try {
      setLoading(true);

      const data = await apiRequest("/orders", {
        method: "POST",
        body: JSON.stringify({
          tenantId: "tenant-a",
          userId: "demo-user",
          customer: form,
          items: cart.map(item => ({
            productId: item.productId,
            quantity: item.quantity
          }))
        })
      });

      const existingOrders = JSON.parse(
        localStorage.getItem("orders") || "[]"
      );

      localStorage.setItem(
        "orders",
        JSON.stringify([data.order, ...existingOrders])
      );

      localStorage.removeItem("cart");

      alert("Order placed successfully!");
      navigate("/orders");
    } catch (error) {
      alert(error.message || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      maxWidth: 700,
      margin: "40px auto",
      padding: 20,
      fontFamily: "Arial"
    }}>
      <h1>Checkout</h1>

      <form onSubmit={handleSubmit}>
        {[
          ["name", "Full Name"],
          ["email", "Email"],
          ["phone", "Phone"],
          ["address", "Address"],
          ["city", "City"],
          ["pincode", "Pincode"]
        ].map(([name, label]) => (
          <div key={name} style={{ marginBottom: 15 }}>
            <label>{label}</label>

            <input
              name={name}
              value={form[name]}
              onChange={handleChange}
              required
              style={{
                display: "block",
                width: "100%",
                padding: 10,
                marginTop: 5,
                boxSizing: "border-box"
              }}
            />
          </div>
        ))}

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "12px 20px",
            cursor: loading ? "not-allowed" : "pointer"
          }}
        >
          {loading ? "Placing Order..." : "Place Order"}
        </button>
      </form>
    </div>
  );
}

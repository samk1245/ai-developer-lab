import { useState } from "react";

export default function Checkout() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    pincode: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Checkout data:", form);
    alert("Checkout form submitted");
  };

  return (
    <div style={{ maxWidth: 700, margin: "40px auto", padding: 20 }}>
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
                marginTop: 5
              }}
            />
          </div>
        ))}

        <button type="submit">
          Place Order
        </button>
      </form>
    </div>
  );
}

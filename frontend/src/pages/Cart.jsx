import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Cart() {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);

  function loadCart() {
    setCart(JSON.parse(localStorage.getItem("cart") || "[]"));
  }

  function removeItem(productId) {
    const updated = cart.filter(item => item.productId !== productId);
    localStorage.setItem("cart", JSON.stringify(updated));
    setCart(updated);
  }

  function changeQuantity(productId, change) {
    const updated = cart
      .map(item =>
        item.productId === productId
          ? { ...item, quantity: item.quantity + change }
          : item
      )
      .filter(item => item.quantity > 0);

    localStorage.setItem("cart", JSON.stringify(updated));
    setCart(updated);
  }

  useEffect(() => {
    loadCart();
  }, []);

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div style={{ padding: "30px", fontFamily: "Arial" }}>
      <h1>Shopping Cart</h1>

      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          {cart.map(item => (
            <div
              key={item.productId}
              style={{
                border: "1px solid #ddd",
                padding: "15px",
                margin: "10px 0"
              }}
            >
              <h3>{item.name}</h3>
              <p>₹{item.price}</p>

              <button onClick={() => changeQuantity(item.productId, -1)}>
                -
              </button>

              <span style={{ margin: "0 15px" }}>
                {item.quantity}
              </span>

              <button onClick={() => changeQuantity(item.productId, 1)}>
                +
              </button>

              <button
                onClick={() => removeItem(item.productId)}
                style={{ marginLeft: "20px" }}
              >
                Remove
              </button>
            </div>
          ))}

          <h2>Total: ₹{total.toLocaleString("en-IN")}</h2>

          <button onClick={() => navigate("/checkout")}>
            Proceed to Checkout
          </button>
        </>
      )}
    </div>
  );
}

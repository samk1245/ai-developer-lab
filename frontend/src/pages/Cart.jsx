import { useEffect, useState } from "react";
import { apiRequest } from "../api";

export default function Cart() {
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
          ? {...item, quantity: item.quantity + change}
          : item
      )
      .filter(item => item.quantity > 0);

    localStorage.setItem("cart", JSON.stringify(updated));
    setCart(updated);
  }

  async function checkout() {
    if (cart.length === 0) {
      alert("Cart is empty");
      return;
    }

    try {
      const data = await apiRequest("/orders", {
        method: "POST",
        body: JSON.stringify({
          tenantId: "tenant-a",
          items: cart.map(item => ({
            productId: item.productId,
            quantity: item.quantity
          }))
        })
      });

      alert(data.message || "Order placed successfully");

      localStorage.removeItem("cart");
      setCart([]);
    } catch (error) {
      alert(error.message);
    }
  }

  useEffect(() => {
    loadCart();
  }, []);

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div style={{padding:"30px"}}>
      <h1>Shopping Cart</h1>

      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          {cart.map(item => (
            <div
              key={item.productId}
              style={{
                border:"1px solid #ddd",
                padding:"15px",
                margin:"10px 0"
              }}
            >
              <h3>{item.name}</h3>
              <p>?{item.price}</p>

              <button onClick={() => changeQuantity(item.productId, -1)}>
                -
              </button>

              <span style={{margin:"0 15px"}}>
                {item.quantity}
              </span>

              <button onClick={() => changeQuantity(item.productId, 1)}>
                +
              </button>

              <button
                onClick={() => removeItem(item.productId)}
                style={{marginLeft:"20px"}}
              >
                Remove
              </button>
            </div>
          ))}

          <h2>Total: ?{total}</h2>

          <button onClick={checkout}>
            Checkout / Place Order
          </button>
        </>
      )}
    </div>
  );
}

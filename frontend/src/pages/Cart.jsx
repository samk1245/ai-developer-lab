import { useEffect, useState } from "react";
import { apiRequest } from "../api";

export default function Cart() {
  const [cart, setCart] = useState(null);

  async function loadCart() {
    try {
      const data = await apiRequest("/cart?tenantId=tenant-a");
      setCart(data.cart || data);
    } catch (error) {
      alert(error.message);
    }
  }

  useEffect(() => {
    loadCart();
  }, []);

  return (
    <div style={{padding:"30px"}}>
      <h1>Shopping Cart</h1>

      {!cart && <p>Your cart is empty.</p>}

      {cart?.items?.map((item, index) => (
        <div key={index}>
          Product: {item.productId} | Quantity: {item.quantity}
        </div>
      ))}
    </div>
  );
}

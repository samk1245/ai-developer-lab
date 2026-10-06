import { useEffect, useState } from "react";
import { apiRequest } from "../api";

export default function Products() {
  const [products, setProducts] = useState([]);

  async function loadProducts() {
    try {
      const data = await apiRequest("/products?tenantId=tenant-a");
      setProducts(data.products || data);
    } catch (error) {
      alert(error.message);
    }
  }

  function addToCart(product) {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");

    const existing = cart.find(item => item.productId === product._id);

    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity: 1
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    alert(`${product.name} added to cart`);
  }

  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <div style={{padding:"30px"}}>
      <h1>Products</h1>

      {products.length === 0 && <p>No products found.</p>}

      {products.map(product => (
        <div
          key={product._id}
          style={{
            border:"1px solid #ddd",
            padding:"20px",
            margin:"15px 0",
            borderRadius:"10px"
          }}
        >
          <h2>{product.name}</h2>
          <p>{product.description}</p>
          <p><b>Price:</b> ?{product.price}</p>
          <p><b>Stock:</b> {product.stock}</p>

          <button onClick={() => addToCart(product)}>
            Add to Cart
          </button>
        </div>
      ))}
    </div>
  );
}

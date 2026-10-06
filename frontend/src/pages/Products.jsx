import { useEffect, useState } from "react";
import { apiRequest } from "../api";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");

  async function loadProducts() {
    try {
      const data = await apiRequest("/products?tenantId=tenant-a");
      setProducts(data.products || data);
    } catch (error) {
      alert(error.message);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  async function addProduct(e) {
    e.preventDefault();

    try {
      await apiRequest("/products", {
        method: "POST",
        body: JSON.stringify({
          tenantId: "tenant-a",
          name,
          description: "E-Commerce product",
          price: Number(price),
          stock: Number(stock),
          category: "General"
        })
      });

      setName("");
      setPrice("");
      setStock("");
      await loadProducts();
      alert("Product added!");
    } catch (error) {
      alert(error.message);
    }
  }

  return (
    <div style={{padding:"30px"}}>
      <h1>Products</h1>

      <form onSubmit={addProduct}>
        <input placeholder="Product name" value={name}
          onChange={e => setName(e.target.value)} />

        <input placeholder="Price" type="number" value={price}
          onChange={e => setPrice(e.target.value)} />

        <input placeholder="Stock" type="number" value={stock}
          onChange={e => setStock(e.target.value)} />

        <button type="submit">Add Product</button>
      </form>

      <hr />

      {products.map(product => (
        <div key={product._id} style={{
          border:"1px solid #ccc",
          padding:"15px",
          margin:"10px 0"
        }}>
          <h3>{product.name}</h3>
          <p>?{product.price}</p>
          <p>Stock: {product.stock}</p>
          <button>Add to Cart</button>
        </div>
      ))}
    </div>
  );
}

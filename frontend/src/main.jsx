import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";
import Checkout from "./pages/Checkout";
import NotFound from "./pages/NotFound";

function Home() {
  return (
    <div style={{
      minHeight: "80vh",
      padding: "70px 30px",
      textAlign: "center",
      fontFamily: "Arial",
      background: "linear-gradient(135deg, #eff6ff, #ffffff)"
    }}>
      <h1 style={{ fontSize: "44px", marginBottom: "15px" }}>
        Multi-Tenant E-Commerce
      </h1>

      <p style={{
        fontSize: "18px",
        color: "#555",
        maxWidth: "650px",
        margin: "0 auto 30px"
      }}>
        A scalable multi-tenant shopping platform with authentication,
        products, cart, checkout and order management.
      </p>

      <div style={{
        display: "flex",
        justifyContent: "center",
        gap: "15px",
        flexWrap: "wrap"
      }}>
        <Link to="/products" style={{
          padding: "13px 22px",
          background: "#2563eb",
          color: "white",
          textDecoration: "none",
          borderRadius: "7px"
        }}>
          Browse Products
        </Link>

        <Link to="/dashboard" style={{
          padding: "13px 22px",
          background: "#111827",
          color: "white",
          textDecoration: "none",
          borderRadius: "7px"
        }}>
          Open Dashboard
        </Link>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/products" element={<Products />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

createRoot(document.getElementById("root")).render(<App />);

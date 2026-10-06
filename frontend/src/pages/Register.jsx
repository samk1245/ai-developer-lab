import { useState } from "react";
import { apiRequest } from "../api";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    tenantId: "tenant-a",
  });

  async function register(e) {
    e.preventDefault();

    try {
      await apiRequest("/auth/register", {
        method: "POST",
        body: JSON.stringify(form),
      });

      alert("Registration successful!");
      window.location.href = "/login";
    } catch (error) {
      alert(error.message);
    }
  }

  return (
    <div style={{padding:"40px", maxWidth:"400px", margin:"auto"}}>
      <h2>Create Account</h2>

      <form onSubmit={register}>
        {["name", "email", "password"].map((field) => (
          <input
            key={field}
            type={field === "password" ? "password" : "text"}
            placeholder={field}
            value={form[field]}
            onChange={(e) =>
              setForm({...form, [field]: e.target.value})
            }
            style={{
              display:"block",
              width:"100%",
              padding:"10px",
              margin:"10px 0"
            }}
          />
        ))}

        <button type="submit">Register</button>
      </form>
    </div>
  );
}

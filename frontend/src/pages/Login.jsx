import { useState } from "react";
import { apiRequest } from "../api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function login(e) {
    e.preventDefault();

    try {
      const data = await apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      localStorage.setItem("token", data.token);
      alert("Login successful!");
      window.location.href = "/dashboard";
    } catch (error) {
      alert(error.message);
    }
  }

  return (
    <div style={{padding:"40px", maxWidth:"400px", margin:"auto"}}>
      <h2>Login</h2>

      <form onSubmit={login}>
        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{display:"block", width:"100%", padding:"10px", margin:"10px 0"}}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{display:"block", width:"100%", padding:"10px", margin:"10px 0"}}
        />

        <button type="submit">Login</button>
      </form>
    </div>
  );
}

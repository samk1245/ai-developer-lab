import { useEffect, useState } from "react";
import { apiRequest } from "../api";

export default function Dashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    apiRequest("/auth/me")
      .then((data) => setUser(data.user))
      .catch(() => {
        localStorage.removeItem("token");
        window.location.href = "/login";
      });
  }, []);

  function logout() {
    localStorage.removeItem("token");
    window.location.href = "/login";
  }

  return (
    <div style={{padding:"40px"}}>
      <h1>Dashboard</h1>

      {user && (
        <>
          <h3>Welcome, {user.name}</h3>
          <p>Email: {user.email}</p>
          <p>Tenant: {user.tenantId}</p>
        </>
      )}

      <button onClick={logout}>Logout</button>
    </div>
  );
}

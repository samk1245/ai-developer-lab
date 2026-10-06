import { useEffect, useState } from "react";
import { apiRequest } from "../api";

export default function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    apiRequest("/orders?tenantId=tenant-a")
      .then(data => setOrders(data.orders || data || []))
      .catch(error => alert(error.message));
  }, []);

  return (
    <div style={{padding:"30px"}}>
      <h1>My Orders</h1>

      {orders.length === 0 && <p>No orders found.</p>}

      {orders.map(order => (
        <div
          key={order._id}
          style={{
            border:"1px solid #ddd",
            padding:"20px",
            margin:"15px 0",
            borderRadius:"10px"
          }}
        >
          <h3>Order ID: {order._id}</h3>
          <p>Status: {order.status || "Placed"}</p>
          <p>Total: ?{order.totalAmount || order.total || 0}</p>
        </div>
      ))}
    </div>
  );
}

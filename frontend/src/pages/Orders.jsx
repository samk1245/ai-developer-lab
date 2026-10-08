import { useEffect, useState } from "react";
import { apiRequest } from "../api";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrders() {
      try {
        const data = await apiRequest(
          "/orders?tenantId=tenant-a&userId=demo-user"
        );

        setOrders(data.orders || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadOrders();
  }, []);

  if (loading) {
    return <div style={{ padding: 40 }}>Loading orders...</div>;
  }

  return (
    <div style={{
      maxWidth: 1000,
      margin: "40px auto",
      padding: 20,
      fontFamily: "Arial"
    }}>
      <h1>My Orders</h1>

      {orders.length === 0 ? (
        <div style={{
          padding: 30,
          textAlign: "center",
          border: "1px solid #e5e7eb",
          borderRadius: 10,
          marginTop: 25
        }}>
          <h2>No orders yet</h2>
          <p>Your placed orders will appear here.</p>
        </div>
      ) : (
        <div style={{
          display: "grid",
          gap: 18,
          marginTop: 25
        }}>
          {orders.map(order => (
            <div
              key={order._id}
              style={{
                border: "1px solid #e5e7eb",
                borderRadius: 10,
                padding: 20
              }}
            >
              <div style={{
                display: "flex",
                justifyContent: "space-between"
              }}>
                <strong>Order #{order._id.slice(-8)}</strong>

                <span>
                  {order.status}
                </span>
              </div>

              <p>
                {new Date(order.createdAt).toLocaleString()}
              </p>

              {order.items.map((item, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: 10
                  }}
                >
                  <span>
                    {item.name} × {item.quantity}
                  </span>

                  <strong>
                    ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                  </strong>
                </div>
              ))}

              <hr />

              <p>
                <strong>Customer:</strong> {order.customer.name}
              </p>

              <h3>
                Total: ₹{order.totalAmount.toLocaleString("en-IN")}
              </h3>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

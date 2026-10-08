export default function Orders() {
  const orders = JSON.parse(
    localStorage.getItem("orders") || "[]"
  );

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
          <p style={{ color: "#666" }}>
            Your placed orders will appear here.
          </p>
        </div>
      ) : (
        <div style={{
          display: "grid",
          gap: 18,
          marginTop: 25
        }}>
          {orders.map((order) => (
            <div
              key={order.id}
              style={{
                border: "1px solid #e5e7eb",
                borderRadius: 10,
                padding: 20,
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
              }}
            >
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 10
              }}>
                <strong>{order.id}</strong>

                <span style={{
                  background: "#dcfce7",
                  color: "#166534",
                  padding: "5px 10px",
                  borderRadius: 20,
                  fontSize: 13
                }}>
                  {order.status}
                </span>
              </div>

              <p style={{ color: "#666" }}>
                {new Date(order.createdAt).toLocaleString()}
              </p>

              {order.items.map((item, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: 12
                  }}
                >
                  <span>
                    {item.name} × {item.quantity}
                  </span>
                  <strong>
                    ?{item.price.toLocaleString("en-IN")}
                  </strong>
                </div>
              ))}

              <hr style={{ margin: "18px 0" }} />

              <div style={{
                display: "flex",
                justifyContent: "space-between"
              }}>
                <strong>Customer</strong>
                <span>{order.customer.name}</span>
              </div>

              <div style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: 8
              }}>
                <strong>Total</strong>
                <strong>
                  ?{order.total.toLocaleString("en-IN")}
                </strong>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

import { useEffect, useState } from "react";
import "./AdminOrders.css";
import API_URL from "../config";

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================================
  // GET TOKEN
  // =========================================

  function getToken() {
    return localStorage.getItem("token");
  }

  // =========================================
  // FETCH ORDERS
  // =========================================

  async function fetchOrders() {
    try {
      setLoading(true);
      setError("");

      const token = getToken();

      const response = await fetch(
        `${API_URL}/api/admin/orders`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch orders"
        );
      }

      setOrders(data);
    } catch (error) {
      console.error("Admin orders error:", error);
      setError(
        error.message || "Failed to fetch orders"
      );
    } finally {
      setLoading(false);
    }
  }

  // =========================================
  // INITIAL LOAD
  // =========================================

  useEffect(() => {
    async function loadInitialOrders() {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");

        const response = await fetch(
          `${API_URL}/api/admin/orders`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to fetch orders"
          );
        }

        setOrders(data);
      } catch (error) {
        console.error(
          "Initial admin orders error:",
          error
        );

        setError(
          error.message || "Failed to fetch orders"
        );
      } finally {
        setLoading(false);
      }
    }

    loadInitialOrders();
  }, []);

  // =========================================
  // UPDATE ORDER STATUS
  // =========================================

  async function updateStatus(orderId, status) {
    try {
      setError("");

      const response = await fetch(
        `${API_URL}/api/admin/orders/${orderId}`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
          },

          body: JSON.stringify({
            status,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to update order"
        );
      }

      await fetchOrders();
    } catch (error) {
      console.error(
        "Update order error:",
        error
      );

      setError(
        error.message || "Failed to update order"
      );
    }
  }

  // =========================================
  // LOADING
  // =========================================

  if (loading) {
    return (
      <div className="admin-orders-page">
        <h2>Loading orders...</h2>
      </div>
    );
  }

  // =========================================
  // PAGE
  // =========================================

  return (
    <div className="admin-orders-page">
      <div className="admin-orders-container">

        {/* Header */}

        <div className="admin-orders-header">
          <span>ADMIN PANEL</span>

          <h1>Order Management</h1>

          <p>
            View and manage customer orders.
          </p>
        </div>

        {/* Error */}

        {error && (
          <div className="admin-orders-error">
            {error}
          </div>
        )}

        {/* No Orders */}

        {orders.length === 0 ? (
          <div className="no-orders">
            <div>📦</div>

            <h2>No orders yet</h2>

            <p>
              Customer orders will appear here.
            </p>
          </div>
        ) : (
          <div className="admin-orders-list">

            {orders.map((order) => (
              <div
                className="admin-order-card"
                key={order._id}
              >

                {/* Order Header */}

                <div className="admin-order-top">

                  <div>
                    <span>ORDER ID</span>

                    <strong>
                      {order._id}
                    </strong>
                  </div>

                  <select
                    value={order.status}
                    onChange={(e) =>
                      updateStatus(
                        order._id,
                        e.target.value
                      )
                    }
                  >
                    <option value="Placed">
                      Placed
                    </option>

                    <option value="Confirmed">
                      Confirmed
                    </option>

                    <option value="Shipped">
                      Shipped
                    </option>

                    <option value="Delivered">
                      Delivered
                    </option>

                    <option value="Cancelled">
                      Cancelled
                    </option>
                  </select>

                </div>

                {/* Customer */}

                <div className="customer-info">
                  <h3>Customer</h3>

                  <p>
                    {order.user?.username ||
                      "Unknown User"}
                  </p>

                  <p>
                    {order.user?.email || ""}
                  </p>
                </div>

                {/* Items */}

                <div className="admin-order-items">

                  <h3>Items</h3>

                  {order.items?.map(
                    (item, index) => (
                      <div
                        className="admin-order-item"
                        key={`${order._id}-${
                          item.product?._id ||
                          index
                        }`}
                      >

                        <img
                          src={item.image}
                          alt={item.name}
                        />

                        <div>
                          <strong>
                            {item.name}
                          </strong>

                          <p>
                            Quantity:{" "}
                            {item.quantity}
                          </p>

                          <p>
                            ₹
                            {Number(
                              item.price || 0
                            ).toLocaleString(
                              "en-IN"
                            )}
                          </p>
                        </div>

                        <strong>
                          ₹
                          {(
                            Number(
                              item.price || 0
                            ) *
                            Number(
                              item.quantity || 0
                            )
                          ).toLocaleString(
                            "en-IN"
                          )}
                        </strong>

                      </div>
                    )
                  )}

                </div>

                {/* Shipping */}

                <div className="shipping-info">

                  <h3>
                    Shipping Address
                  </h3>

                  <p>
                    {
                      order.shippingAddress
                        ?.name
                    }
                  </p>

                  <p>
                    {
                      order.shippingAddress
                        ?.phone
                    }
                  </p>

                  <p>
                    {
                      order.shippingAddress
                        ?.address
                    }
                  </p>

                  <p>
                    {
                      order.shippingAddress
                        ?.city
                    }
                    ,{" "}
                    {
                      order.shippingAddress
                        ?.state
                    }
                  </p>

                  <p>
                    {
                      order.shippingAddress
                        ?.pincode
                    }
                  </p>

                </div>

                {/* Footer */}

                <div className="admin-order-footer">

                  <div>
                    <span>Total</span>

                    <strong>
                      ₹
                      {Number(
                        order.totalAmount || 0
                      ).toLocaleString(
                        "en-IN"
                      )}
                    </strong>
                  </div>

                  <div>
                    <span>Ordered</span>

                    <strong>
                      {new Date(
                        order.createdAt
                      ).toLocaleDateString(
                        "en-IN"
                      )}
                    </strong>
                  </div>

                </div>

              </div>
            ))}

          </div>
        )}

      </div>
    </div>
  );
}

export default AdminOrders;
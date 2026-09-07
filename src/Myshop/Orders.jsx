import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Orders.css";
import API_URL from "../config";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ========================================
  // FETCH MY ORDERS
  // ========================================

  useEffect(() => {
    async function fetchOrders() {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error(
            "Please login to view your orders."
          );
        }

        const response = await fetch(
          `${API_URL}/api/orders/my`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const text = await response.text();

        let data;

        try {
          data = JSON.parse(text);
        } catch {
          throw new Error(
            "Backend returned an invalid response."
          );
        }

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Failed to load orders"
          );
        }

        setOrders(
          Array.isArray(data) ? data : []
        );
      } catch (error) {
        console.error(
          "Orders error:",
          error
        );

        setError(
          error.message ||
            "Unable to load orders"
        );
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, []);

  // ========================================
  // LOADING
  // ========================================

  if (loading) {
    return (
      <div className="orders-page">
        <div className="orders-container">
          <div className="orders-message">
            <h2>
              Loading your orders...
            </h2>
          </div>
        </div>
      </div>
    );
  }

  // ========================================
  // ERROR
  // ========================================

  if (error) {
    return (
      <div className="orders-page">
        <div className="orders-container">
          <div className="orders-message">
            <h2>
              Unable to load orders
            </h2>

            <p>{error}</p>

            <Link
              to="/products"
              className="shop-orders-button"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ========================================
  // PAGE
  // ========================================

  return (
    <div className="orders-page">
      <div className="orders-container">

        {/* Header */}

        <div className="orders-header">
          <h1>My Orders</h1>

          <p>
            View your recent orders and
            their status.
          </p>
        </div>

        {/* No orders */}

        {orders.length === 0 ? (
          <div className="orders-message">
            <div className="orders-icon">
              📦
            </div>

            <h2>
              No orders yet
            </h2>

            <p>
              You haven't placed any
              orders yet.
            </p>

            <Link
              to="/products"
              className="shop-orders-button"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="orders-list">

            {orders.map((order) => (
              <div
                className="order-card"
                key={order._id}
              >

                {/* Order Header */}

                <div className="order-top">

                  <div>
                    <span className="order-label">
                      ORDER ID
                    </span>

                    <strong>
                      {order._id}
                    </strong>
                  </div>

                  <span
                    className={`order-status ${
                      order.status
                        ?.toLowerCase()
                        .replace(/\s+/g, "-") || ""
                    }`}
                  >
                    {order.status}
                  </span>

                </div>

                {/* Order Items */}

                <div className="order-items">

                  {order.items?.map(
                    (item, index) => (
                      <div
                        className="order-item"
                        key={
                          item.product?._id ||
                          item.product ||
                          `${order._id}-${index}`
                        }
                      >

                        <img
                          src={item.image}
                          alt={item.name}
                        />

                        <div className="order-item-info">

                          <h3>
                            {item.name}
                          </h3>

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

                {/* Order Footer */}

                <div className="order-footer">

                  <div>
                    <span>
                      Total
                    </span>

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
                    <span>
                      Ordered on
                    </span>

                    <strong>
                      {new Date(
                        order.createdAt
                      ).toLocaleDateString(
                        "en-IN"
                      )}
                    </strong>
                  </div>

                  {/* View Details */}

                  <Link
                    to={`/orders/${order._id}`}
                    className="view-order-button"
                  >
                    View Details →
                  </Link>

                </div>

              </div>
            ))}

          </div>
        )}

      </div>
    </div>
  );
}

export default Orders;
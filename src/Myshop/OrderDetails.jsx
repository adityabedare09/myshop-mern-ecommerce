import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "./OrderDetails.css";
import API_URL from "../config";

function OrderDetails() {
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadOrder() {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error(
            "Please login to view this order."
          );
        }

        const response = await fetch(
          `${API_URL}/api/orders/${id}`,
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
              `Failed to load order (${response.status})`
          );
        }

        setOrder(data);
      } catch (error) {
        console.error(
          "Order details error:",
          error
        );

        setError(
          error.message ||
            "Unable to load this order."
        );
      } finally {
        setLoading(false);
      }
    }

    loadOrder();
  }, [id]);

  // Loading
  if (loading) {
    return (
      <div className="order-details-page">
        <div className="order-details-container">
          <p className="order-loading">
            Loading order...
          </p>
        </div>
      </div>
    );
  }

  // Error
  if (error || !order) {
    return (
      <div className="order-details-page">
        <div className="order-error-card">
          <h1>Order Not Found</h1>

          <p>
            {error ||
              "Unable to load this order."}
          </p>

          <Link to="/orders">
            ← Back to My Orders
          </Link>
        </div>
      </div>
    );
  }

  const statusSteps = [
    "Placed",
    "Confirmed",
    "Shipped",
    "Delivered",
  ];

  const currentStep =
    statusSteps.indexOf(order.status);

  const isCancelled =
    order.status === "Cancelled";

  return (
    <div className="order-details-page">
      <div className="order-details-container">

        {/* Header */}

        <div className="order-details-header">
          <Link
            to="/orders"
            className="back-orders"
          >
            ← Back to My Orders
          </Link>

          <h1>Order Details</h1>

          <p>
            Order ID: {order._id}
          </p>
        </div>

        {/* Status */}

        <div className="order-status-card">
          <div className="status-heading">

            <div>
              <h2>Order Status</h2>

              <p>
                {order.status}
              </p>
            </div>

            <span
              className={`status-pill ${
                isCancelled
                  ? "cancelled"
                  : ""
              }`}
            >
              {order.status}
            </span>
          </div>

          {!isCancelled && (
            <div className="status-timeline">
              {statusSteps.map(
                (step, index) => {
                  const completed =
                    currentStep >= 0 &&
                    index <= currentStep;

                  return (
                    <div
                      className={`status-step ${
                        completed
                          ? "completed"
                          : ""
                      }`}
                      key={step}
                    >
                      <div className="status-dot">
                        {completed
                          ? "✓"
                          : ""}
                      </div>

                      <span>{step}</span>
                    </div>
                  );
                }
              )}
            </div>
          )}

          {isCancelled && (
            <div className="cancelled-message">
              This order has been cancelled.
            </div>
          )}
        </div>

        {/* Items */}

        <div className="order-details-card">
          <h2>Products</h2>

          <div className="order-details-items">
            {(order.items || []).map(
              (item, index) => (
                <div
                  className="order-details-item"
                  key={`${item.product?._id || item.product || index}`}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                  />

                  <div className="order-details-item-info">
                    <h3>{item.name}</h3>

                    <p>
                      Quantity:{" "}
                      {item.quantity}
                    </p>

                    <p>
                      Price: ₹
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
        </div>

        {/* Shipping */}

        <div className="order-details-card">
          <h2>Shipping Address</h2>

          <div className="shipping-details">
            <p>
              <strong>Name:</strong>{" "}
              {order.shippingAddress?.name}
            </p>

            <p>
              <strong>Phone:</strong>{" "}
              {order.shippingAddress?.phone}
            </p>

            <p>
              <strong>Address:</strong>{" "}
              {order.shippingAddress?.address}
            </p>

            <p>
              <strong>City:</strong>{" "}
              {order.shippingAddress?.city}
            </p>

            <p>
              <strong>State:</strong>{" "}
              {order.shippingAddress?.state}
            </p>

            <p>
              <strong>Pincode:</strong>{" "}
              {order.shippingAddress?.pincode}
            </p>
          </div>
        </div>

        {/* Summary */}

        <div className="order-summary-card">
          <div>
            <span>
              Order Date
            </span>

            <strong>
              {new Date(
                order.createdAt
              ).toLocaleDateString(
                "en-IN"
              )}
            </strong>
          </div>

          <div>
            <span>
              Total Amount
            </span>

            <strong className="order-total">
              ₹
              {Number(
                order.totalAmount || 0
              ).toLocaleString(
                "en-IN"
              )}
            </strong>
          </div>
        </div>

      </div>
    </div>
  );
}

export default OrderDetails;
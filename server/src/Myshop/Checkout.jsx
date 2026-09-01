import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Checkout.css";

function Checkout({ cartItems, clearCart }) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: ""
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Calculate total
  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  function handleChange(e) {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value
    });
  }

  async function handlePlaceOrder(e) {
    e.preventDefault();

    setError("");

    const token = localStorage.getItem("token");

    if (!token) {
      setError("Please login before placing an order.");
      return;
    }

    if (cartItems.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/orders",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },

          body: JSON.stringify({
            items: cartItems.map((item) => ({
              product: item._id,
              quantity: item.quantity
            })),

            shippingAddress: formData
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to place order"
        );
      }

      // Clear cart after successful order
      clearCart();

      // Go to orders page
      navigate("/orders");

    } catch (error) {
      console.error("Order error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="checkout-page">

      <div className="checkout-container">

        <div className="checkout-header">
          <h1>Checkout</h1>
          <p>Enter your delivery details and place your order.</p>
        </div>

        {error && (
          <div className="checkout-error">
            {error}
          </div>
        )}

        <div className="checkout-layout">

          {/* Shipping form */}
          <div className="checkout-form-card">

            <h2>Shipping Address</h2>

            <form onSubmit={handlePlaceOrder}>

              <div className="checkout-grid">

                <div className="checkout-group">
                  <label>Full Name</label>

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter your name"
                  />
                </div>

                <div className="checkout-group">
                  <label>Phone</label>

                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    placeholder="Enter phone number"
                  />
                </div>

                <div className="checkout-group full-width">
                  <label>Address</label>

                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    placeholder="Enter your full address"
                  />
                </div>

                <div className="checkout-group">
                  <label>City</label>

                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    placeholder="Enter city"
                  />
                </div>

                <div className="checkout-group">
                  <label>State</label>

                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    required
                    placeholder="Enter state"
                  />
                </div>

                <div className="checkout-group">
                  <label>Pincode</label>

                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    required
                    placeholder="Enter pincode"
                  />
                </div>

              </div>

              <button
                type="submit"
                className="place-order-button"
                disabled={loading}
              >
                {loading
                  ? "Placing Order..."
                  : "Place Order"}
              </button>

            </form>
          </div>


          {/* Order summary */}
          <div className="checkout-summary">

            <h2>Order Summary</h2>

            {cartItems.map((item) => (
              <div
                className="checkout-item"
                key={item._id}
              >
                <div>
                  <strong>{item.name}</strong>
                  <p>
                    {item.quantity} × ₹
                    {item.price.toLocaleString("en-IN")}
                  </p>
                </div>

                <strong>
                  ₹{(
                    item.price * item.quantity
                  ).toLocaleString("en-IN")}
                </strong>
              </div>
            ))}

            <div className="checkout-total">
              <span>Total</span>

              <strong>
                ₹{total.toLocaleString("en-IN")}
              </strong>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

export default Checkout;
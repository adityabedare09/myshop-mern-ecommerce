import { Link } from "react-router-dom";
import "./Cart.css";

function Cart({
  cartItems,
  removeFromCart,
  increaseQuantity,
  decreaseQuantity
}) {

  // Calculate total
  const total = cartItems.reduce(
    (sum, product) =>
      sum + product.price * product.quantity,
    0
  );

  return (
    <div className="cart-page">

      <div className="cart-container">

        <div className="cart-header">
          <h1>Your Cart 🛒</h1>

          <p>
            {cartItems.length} item(s) in your cart
          </p>
        </div>


        {cartItems.length === 0 ? (

          <div className="empty-cart">

            <div className="empty-cart-icon">
              🛒
            </div>

            <h2>Your cart is empty</h2>

            <p>
              Add some products to your cart and
              come back here.
            </p>

          </div>

        ) : (

          <div className="cart-layout">

            {/* Cart Items */}

            <div className="cart-items">

              {cartItems.map((product) => (

                <div
                  className="cart-item"
                  key={product._id}
                >

                  <div className="cart-product-image">

                    <img
                      src={product.image}
                      alt={product.name}
                    />

                  </div>


                  <div className="cart-product-info">

                    <h2>
                      {product.name}
                    </h2>

                    <p className="cart-price">
                      ₹{product.price.toLocaleString("en-IN")}
                    </p>


                    <div className="quantity-section">

                      <span>Quantity</span>

                      <div className="quantity-controls">

                        <button
                          onClick={() =>
                            decreaseQuantity(product._id)
                          }
                        >
                          −
                        </button>

                        <span>
                          {product.quantity}
                        </span>

                        <button
                          onClick={() =>
                            increaseQuantity(product._id)
                          }
                        >
                          +
                        </button>

                      </div>

                    </div>


                    <button
                      className="remove-button"
                      onClick={() =>
                        removeFromCart(product._id)
                      }
                    >
                      Remove
                    </button>

                  </div>


                  <div className="cart-item-total">

                    <span>
                      ₹
                      {(
                        product.price *
                        product.quantity
                      ).toLocaleString("en-IN")}
                    </span>

                  </div>

                </div>

              ))}

            </div>


            {/* Order Summary */}

            <div className="cart-summary">

              <h2>Order Summary</h2>

              <div className="summary-row">

                <span>Subtotal</span>

                <span>
                  ₹{total.toLocaleString("en-IN")}
                </span>

              </div>

              <div className="summary-row">

                <span>Delivery</span>

                <span className="free">
                  FREE
                </span>

              </div>

              <div className="summary-divider"></div>

              <div className="summary-total">

                <span>Total</span>

                <span>
                  ₹{total.toLocaleString("en-IN")}
                </span>

              </div>

              <Link
                to="/checkout"
                className="checkout-button"
              >
                Proceed to Checkout →
              </Link>

            </div>

          </div>

        )}

      </div>

    </div>
  );
}

export default Cart;
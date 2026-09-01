import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

import "./ProductDetails.css";

function ProductDetails({ addToCart }) {
  // Gets the product _id from /products/:id
  const { id } = useParams();

  // Stores the product received from Express
  const [product, setProduct] = useState(null);

  // Loading state
  const [loading, setLoading] = useState(true);

  // Error message
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true);
        setError("");

        console.log("Fetching product:", id);

        const response = await fetch(
          `http://localhost:5000/api/products/${id}`
        );

        console.log("Response status:", response.status);

        if (!response.ok) {
          throw new Error(`Server returned ${response.status}`);
        }

        const data = await response.json();

        console.log("Product received:", data);

        setProduct(data);
      } catch (error) {
        console.error("Product fetch error:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [id]);

  // Loading
  if (loading) {
    return (
      <div className="not-found">
        <h2>Loading product...</h2>
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div className="not-found">
        <h1>Unable to load product</h1>

        <p>{error}</p>

        <Link to="/products">
          ← Back to Products
        </Link>
      </div>
    );
  }

  // No product
  if (!product) {
    return (
      <div className="not-found">
        <h1>Product Not Found</h1>

        <Link to="/products">
          ← Back to Products
        </Link>
      </div>
    );
  }

  return (
    <div className="details-page">
      <div className="details-container">

        {/* Product Image */}
        <div className="details-image">
          <img
            src={product.image}
            alt={product.name}
          />
        </div>

        {/* Product Information */}
        <div className="details-content">

          <span className="details-category">
            {product.category || "Electronics"}
          </span>

          <h1>{product.name}</h1>

          <div className="details-rating">
            ⭐⭐⭐⭐⭐
            <span>
              {" "}
              {product.rating ?? 0}
            </span>
          </div>

          <h2 className="details-price">
            ₹{Number(product.price).toLocaleString("en-IN")}
          </h2>

          <p className="details-description">
            {product.description}
          </p>

          <p>
            <strong>Brand:</strong>{" "}
            {product.brand || "MyShop"}
          </p>

          <p>
            <strong>Stock:</strong>{" "}
            {product.stock ?? 0}
          </p>

          <div className="details-features">
            <div>
              🚚
              <span>Fast Delivery</span>
            </div>

            <div>
              🔒
              <span>Secure Payment</span>
            </div>

            <div>
              ↩️
              <span>Easy Returns</span>
            </div>
          </div>

          <button
            className="cart-button"
            onClick={() => addToCart(product)}
          >
            Add to Cart 🛒
          </button>

          <Link
            to="/products"
            className="back-products"
          >
            ← Continue Shopping
          </Link>

        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
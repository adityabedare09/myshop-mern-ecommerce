import { Link } from "react-router-dom";
import "./ProductCard.css";

function ProductCard({ product, addToCart }) {
  return (
    <div className="product-card">

      <div className="product-image">
        <img
          src={product.image}
          alt={product.name}
        />
      </div>

      <div className="product-content">

        <h2>{product.name}</h2>

        <p className="product-description">
          {product.description}
        </p>

        <div className="product-bottom">

          <span className="product-price">
            ₹{product.price.toLocaleString("en-IN")}
          </span>

          <Link
            to={`/products/${product._id}`}
            className="product-link"
          >
            View Details
          </Link>

        </div>

        <button
          className="cart-button"
          onClick={() => addToCart(product)}
        >
          Add to Cart 🛒
        </button>

      </div>

    </div>
  );
}

export default ProductCard;
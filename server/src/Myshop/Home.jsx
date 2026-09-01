import { Link } from "react-router-dom";
import "./Home.css";

function Home() {
  return (
    <div className="home">

      {/* Hero Section */}
      <section className="hero">

        <div className="hero-content">

          <span className="hero-badge">
            ✨ New Collection Available
          </span>

          <h1>
            Shop Smarter.
            <br />
            Live Better.
          </h1>

          <p>
            Discover quality electronics, accessories and
            everyday essentials at prices you'll love.
          </p>

          <div className="hero-buttons">

            <Link to="/products" className="btn-primary">
              Shop Now →
            </Link>

            <Link to="/products" className="btn-secondary">
              Explore Products
            </Link>

          </div>

        </div>

        <div className="hero-image">
          <div className="hero-product">
            🛍️
          </div>
        </div>

      </section>


      {/* Features */}
      <section className="features">

        <div className="feature">
          <div className="feature-icon">🚚</div>
          <div>
            <h3>Fast Delivery</h3>
            <p>Quick and reliable delivery</p>
          </div>
        </div>

        <div className="feature">
          <div className="feature-icon">🔒</div>
          <div>
            <h3>Secure Payment</h3>
            <p>100% secure checkout</p>
          </div>
        </div>

        <div className="feature">
          <div className="feature-icon">⭐</div>
          <div>
            <h3>Quality Products</h3>
            <p>Products you can trust</p>
          </div>
        </div>

        <div className="feature">
          <div className="feature-icon">💬</div>
          <div>
            <h3>24/7 Support</h3>
            <p>We're here to help</p>
          </div>
        </div>

      </section>


      {/* Categories */}
      <section className="categories">

        <div className="section-heading">
          <span>EXPLORE</span>
          <h2>Shop by Category</h2>
          <p>
            Find everything you need in one place.
          </p>
        </div>

        <div className="category-grid">

          <Link to="/products" className="category-card">
            <div className="category-icon">💻</div>
            <h3>Electronics</h3>
            <p>Latest technology</p>
          </Link>

          <Link to="/products" className="category-card">
            <div className="category-icon">📱</div>
            <h3>Smartphones</h3>
            <p>Stay connected</p>
          </Link>

          <Link to="/products" className="category-card">
            <div className="category-icon">🎧</div>
            <h3>Accessories</h3>
            <p>Upgrade your setup</p>
          </Link>

          <Link to="/products" className="category-card">
            <div className="category-icon">⌚</div>
            <h3>Wearables</h3>
            <p>Smart lifestyle</p>
          </Link>

        </div>

      </section>


      {/* Promotional Section */}
      <section className="promo">

        <div>
          <span>LIMITED TIME OFFER</span>

          <h2>
            Upgrade Your
            <br />
            Tech Setup
          </h2>

          <p>
            Get amazing products at special prices.
          </p>

          <Link to="/products" className="promo-button">
            Shop Deals →
          </Link>
        </div>

        <div className="promo-icon">
          💻
        </div>

      </section>

    </div>
  );
}

export default Home;
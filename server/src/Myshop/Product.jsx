import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import ProductCard from "../components/ProductCard";
import "../components/Product.css";

function Products({ addToCart }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ========================================
  // SEARCH QUERY
  // ========================================

  const [searchParams] = useSearchParams();

  const searchQuery =
    searchParams.get("search")?.toLowerCase().trim() || "";


  // ========================================
  // FETCH PRODUCTS
  // ========================================

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          "http://localhost:5000/api/products"
        );

        if (!response.ok) {
          throw new Error(
            "Failed to fetch products"
          );
        }

        const data = await response.json();

        setProducts(data);

      } catch (error) {
        console.error(
          "Products error:",
          error
        );

        setError(
          "Unable to load products."
        );

      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);


  // ========================================
  // FILTER PRODUCTS
  // ========================================

  const filteredProducts = products.filter(
    (product) => {

      // Show everything when there is no search
      if (!searchQuery) {
        return true;
      }

      const name =
        product.name?.toLowerCase() || "";

      const category =
        product.category?.toLowerCase() || "";

      const brand =
        product.brand?.toLowerCase() || "";

      const description =
        product.description?.toLowerCase() || "";

      return (
        name.includes(searchQuery) ||
        category.includes(searchQuery) ||
        brand.includes(searchQuery) ||
        description.includes(searchQuery)
      );
    }
  );


  // ========================================
  // LOADING
  // ========================================

  if (loading) {
    return (
      <div className="products-page">
        <h2>
          Loading products...
        </h2>
      </div>
    );
  }


  // ========================================
  // ERROR
  // ========================================

  if (error) {
    return (
      <div className="products-page">
        <h2>
          {error}
        </h2>
      </div>
    );
  }


  // ========================================
  // PAGE
  // ========================================

  return (
    <div className="products-page">

      {/* =====================================
          HEADER
      ====================================== */}

      <div className="products-header">

        <h1>
          {searchQuery
            ? `Search Results for "${searchQuery}"`
            : "Our Products"}
        </h1>

        <p>
          {searchQuery
            ? `${filteredProducts.length} product${
                filteredProducts.length !== 1
                  ? "s"
                  : ""
              } found`
            : "Discover our latest products at the best prices."}
        </p>

      </div>


      {/* =====================================
          PRODUCTS
      ====================================== */}

      {filteredProducts.length === 0 ? (

        <div className="no-products-message">

          <div className="no-products-icon">
            🔍
          </div>

          <h2>
            No products found
          </h2>

          <p>
            {searchQuery
              ? `We couldn't find anything matching "${searchQuery}".`
              : "There are no products available right now."}
          </p>

        </div>

      ) : (

        <div className="products-container">

          {filteredProducts.map(
            (product) => (

              <ProductCard
                key={product._id}
                product={product}
                addToCart={addToCart}
              />

            )
          )}

        </div>

      )}

    </div>
  );
}

export default Products;
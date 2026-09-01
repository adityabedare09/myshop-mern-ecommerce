import { useEffect, useState } from "react";
import "./AdminProducts.css";

function AdminProducts() {
  // =========================================
  // STATE
  // =========================================

  // Products from MongoDB
  const [products, setProducts] = useState([]);

  // Product form
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    image: "",
    description: "",
    category: "",
    brand: "",
    rating: "",
    stock: ""
  });

  // Product currently being edited
  const [editingId, setEditingId] = useState(null);

  // Messages
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Loading state
  const [loading, setLoading] = useState(true);


  // =========================================
  // GET TOKEN
  // =========================================

  function getToken() {
    return localStorage.getItem("token");
  }


  // =========================================
  // INITIAL LOAD PRODUCTS
  // =========================================

  useEffect(() => {
    async function loadInitialProducts() {
      try {
        setLoading(true);
        setError("");

        const token = getToken();

        const response = await fetch(
          "http://localhost:5000/api/admin/products",
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to fetch products"
          );
        }

        setProducts(data);

      } catch (error) {
        console.error(
          "Initial products error:",
          error
        );

        setError(error.message);

      } finally {
        setLoading(false);
      }
    }

    loadInitialProducts();
  }, []);


  // =========================================
  // RELOAD PRODUCTS
  // =========================================

  async function reloadProducts() {
    try {
      const token = getToken();

      const response = await fetch(
        "http://localhost:5000/api/admin/products",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch products"
        );
      }

      setProducts(data);

    } catch (error) {
      console.error(
        "Reload products error:",
        error
      );

      setError(error.message);
    }
  }


  // =========================================
  // HANDLE INPUT
  // =========================================

  function handleChange(e) {
    const { name, value } = e.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value
    }));
  }


  // =========================================
  // ADD / UPDATE PRODUCT
  // =========================================

  async function handleSubmit(e) {
    e.preventDefault();

    setMessage("");
    setError("");

    try {
      const token = getToken();

      const url = editingId
        ? `http://localhost:5000/api/admin/products/${editingId}`
        : "http://localhost:5000/api/admin/products";

      const method = editingId
        ? "PUT"
        : "POST";

      const response = await fetch(url, {
        method,

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },

        body: JSON.stringify({
          name: formData.name,
          price: Number(formData.price),
          image: formData.image,
          description: formData.description,
          category: formData.category,
          brand: formData.brand,
          rating: Number(formData.rating) || 0,
          stock: Number(formData.stock)
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Product operation failed"
        );
      }

      setMessage(
        editingId
          ? "Product updated successfully!"
          : "Product added successfully!"
      );

      // Clear form
      resetForm();

      // Refresh products
      await reloadProducts();

    } catch (error) {
      console.error(
        "Product save error:",
        error
      );

      setError(error.message);
    }
  }


  // =========================================
  // EDIT PRODUCT
  // =========================================

  function handleEdit(product) {
    setEditingId(product._id);

    setFormData({
      name: product.name || "",
      price: product.price ?? "",
      image: product.image || "",
      description: product.description || "",
      category: product.category || "",
      brand: product.brand || "",
      rating: product.rating ?? "",
      stock: product.stock ?? ""
    });

    setMessage("");
    setError("");

    // Scroll to top so admin can see the form
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }


  // =========================================
  // DELETE PRODUCT
  // =========================================

  async function handleDelete(productId) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) {
      return;
    }

    setMessage("");
    setError("");

    try {
      const token = getToken();

      const response = await fetch(
        `http://localhost:5000/api/admin/products/${productId}`,
        {
          method: "DELETE",

          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to delete product"
        );
      }

      setMessage(
        "Product deleted successfully!"
      );

      await reloadProducts();

    } catch (error) {
      console.error(
        "Delete product error:",
        error
      );

      setError(error.message);
    }
  }


  // =========================================
  // RESET FORM
  // =========================================

  function resetForm() {
    setEditingId(null);

    setFormData({
      name: "",
      price: "",
      image: "",
      description: "",
      category: "",
      brand: "",
      rating: "",
      stock: ""
    });
  }


  // =========================================
  // PAGE
  // =========================================

  return (
    <div className="admin-products-page">

      {/* =====================================
          HEADER
      ====================================== */}

      <div className="admin-products-header">

        <div>
          <span className="admin-label">
            ADMIN PANEL
          </span>

          <h1>
            Product Management
          </h1>

          <p>
            Add, update and remove products from
            your store.
          </p>
        </div>

      </div>


      {/* =====================================
          MESSAGES
      ====================================== */}

      {message && (
        <div className="admin-success">
          {message}
        </div>
      )}

      {error && (
        <div className="admin-error">
          {error}
        </div>
      )}


      {/* =====================================
          PRODUCT FORM
      ====================================== */}

      <div className="admin-form-card">

        <div className="form-header">

          <h2>
            {editingId
              ? "Edit Product"
              : "Add New Product"}
          </h2>

          <p>
            {editingId
              ? "Update the product information."
              : "Enter the details for a new product."}
          </p>

        </div>


        <form onSubmit={handleSubmit}>

          <div className="form-grid">

            {/* Product Name */}
            <div className="form-group">

              <label>
                Product Name
              </label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter product name"
                required
              />

            </div>


            {/* Price */}
            <div className="form-group">

              <label>
                Price
              </label>

              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="Enter price"
                min="0"
                required
              />

            </div>


            {/* Category */}
            <div className="form-group">

              <label>
                Category
              </label>

              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="e.g. Laptops"
                required
              />

            </div>


            {/* Brand */}
            <div className="form-group">

              <label>
                Brand
              </label>

              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                placeholder="e.g. Dell"
                required
              />

            </div>


            {/* Image URL */}
            <div className="form-group full-width">

              <label>
                Image URL
              </label>

              <input
                type="url"
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
                required
              />

            </div>


            {/* Description */}
            <div className="form-group full-width">

              <label>
                Description
              </label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter product description"
                rows="4"
                required
              />

            </div>


            {/* Rating */}
            <div className="form-group">

              <label>
                Rating
              </label>

              <input
                type="number"
                name="rating"
                value={formData.rating}
                onChange={handleChange}
                min="0"
                max="5"
                step="0.1"
                placeholder="0 - 5"
              />

            </div>


            {/* Stock */}
            <div className="form-group">

              <label>
                Stock
              </label>

              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                min="0"
                placeholder="Available quantity"
                required
              />

            </div>

          </div>


          {/* Form buttons */}
          <div className="form-actions">

            <button
              type="submit"
              className="save-product-button"
            >
              {editingId
                ? "Update Product"
                : "Add Product"}
            </button>

            {editingId && (
              <button
                type="button"
                className="cancel-button"
                onClick={resetForm}
              >
                Cancel
              </button>
            )}

          </div>

        </form>

      </div>


      {/* =====================================
          PRODUCTS LIST
      ====================================== */}

      <div className="products-list-card">

        <div className="products-list-header">

          <div>

            <h2>
              All Products
            </h2>

            <p>
              {products.length} products
            </p>

          </div>

        </div>


        {/* Loading */}
        {loading ? (

          <p className="admin-loading">
            Loading products...
          </p>

        ) : products.length === 0 ? (

          /* No products */
          <p className="admin-loading">
            No products found.
          </p>

        ) : (

          /* Product table */
          <div className="admin-products-table">

            {/* Table header */}
            <div className="table-header">

              <span>
                Product
              </span>

              <span>
                Category
              </span>

              <span>
                Price
              </span>

              <span>
                Stock
              </span>

              <span>
                Actions
              </span>

            </div>


            {/* Products */}
            {products.map((product) => (

              <div
                className="table-row"
                key={product._id}
              >

                {/* Product */}
                <div className="admin-product-info">

                  <img
                    src={product.image}
                    alt={product.name}
                  />

                  <div>

                    <strong>
                      {product.name}
                    </strong>

                    <span>
                      {product.brand}
                    </span>

                  </div>

                </div>


                {/* Category */}
                <span>
                  {product.category}
                </span>


                {/* Price */}
                <strong>
                  ₹
                  {Number(product.price).toLocaleString("en-IN")}
                </strong>


                {/* Stock */}
                <span>
                  {product.stock}
                </span>


                {/* Actions */}
                <div className="product-actions">

                  <button
                    type="button"
                    className="edit-button"
                    onClick={() =>
                      handleEdit(product)
                    }
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    className="delete-button"
                    onClick={() =>
                      handleDelete(product._id)
                    }
                  >
                    Delete
                  </button>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>
  );
}

export default AdminProducts;
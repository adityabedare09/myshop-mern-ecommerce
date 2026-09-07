import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

import Home from "./Myshop/Home";
import Products from "./Myshop/Product";
import ProductDetails from "./Myshop/ProductDetails";
import Cart from "./Myshop/Cart";
import Login from "./Myshop/Login";
import Register from "./Myshop/Register";
import Profile from "./Myshop/Profile";
import Checkout from "./Myshop/Checkout";
import Orders from "./Myshop/Orders";
import OrderDetails from "./Myshop/OrderDetails";

import AdminDashboard from "./admin/AdminDashboard";
import AdminProducts from "./admin/AdminProducts";
import AdminOrders from "./admin/AdminOrders";
import AdminUsers from "./admin/AdminUsers";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const [cartItems, setCartItems] = useState([]);

  // Clear entire cart
  function clearCart() {
    setCartItems([]);
  }

  // Add product to cart
  function addToCart(product) {
    console.log("ADDING PRODUCT:", product._id, product.name);

    setCartItems((currentItems) => {
      const existingProduct = currentItems.find(
        (item) => item._id === product._id
      );

      if (existingProduct) {
        return currentItems.map((item) =>
          item._id === product._id
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item
        );
      }

      return [
        ...currentItems,
        {
          ...product,
          quantity: 1,
        },
      ];
    });
  }

  // Remove product completely
  function removeFromCart(productId) {
    setCartItems((currentItems) =>
      currentItems.filter((product) => product._id !== productId)
    );
  }

  // Increase quantity
  function increaseQuantity(productId) {
    setCartItems((currentItems) =>
      currentItems.map((product) =>
        product._id === productId
          ? {
              ...product,
              quantity: product.quantity + 1,
            }
          : product
      )
    );
  }

  // Decrease quantity
  function decreaseQuantity(productId) {
    setCartItems((currentItems) =>
      currentItems.map((product) =>
        product._id === productId && product.quantity > 1
          ? {
              ...product,
              quantity: product.quantity - 1,
            }
          : product
      )
    );
  }

  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />

        <Route
          path="/products"
          element={<Products addToCart={addToCart} />}
        />

        <Route
          path="/products/:id"
          element={<ProductDetails addToCart={addToCart} />}
        />

        <Route
          path="/cart"
          element={
            <Cart
              cartItems={cartItems}
              removeFromCart={removeFromCart}
              increaseQuantity={increaseQuantity}
              decreaseQuantity={decreaseQuantity}
            />
          }
        />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/Profile" element={<Profile />} />

        <Route
          path="/checkout"
          element={
            <Checkout
              cartItems={cartItems}
              clearCart={clearCart}
            />
          }
        />

        {/* Protected user routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/orders" element={<Orders />} />
          <Route path="/orders/:id" element={<OrderDetails />} />
        </Route>

        {/* Protected admin routes */}
        <Route element={<ProtectedRoute adminOnly />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/products" element={<AdminProducts />} />
          <Route path="/admin/orders" element={<AdminOrders />} />
          <Route path="/admin/users" element={<AdminUsers />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
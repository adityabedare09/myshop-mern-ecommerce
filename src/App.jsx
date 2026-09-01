
import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Register from "./Myshop/Register";
import Home from "./Myshop/Home";
import Products from "./Myshop/Product";
import ProductDetails from "./Myshop/ProductDetails";
import Cart from "./Myshop/Cart";
import Login from "./Myshop/Login";
import Profile from "./Myshop/Profile";
import AdminDashboard from "./admin/AdminDashboard";
import AdminProducts from "./admin/AdminProducts";
import Checkout from "./Myshop/Checkout";
import Orders from "./Myshop/Orders";
import AdminOrders from "./Admin/AdminOrders";
import AdminUsers from "./admin/AdminUsers";
import ProtectedRoute from "./components/ProtectedRoute";
import OrderDetails from "./Myshop/OrderDetails";

function App() {
  const [cartItems, setCartItems] = useState([]);

  function clearCart() {
    setCartItems([]);
  }

  // Add product
  function addToCart(product) {
    console.log("ADDING PRODUCT:", product._id, product.name);

    const existingProduct = cartItems.find(
      (item) => item._id === product._id
    );

    if (existingProduct) {
      setCartItems(
        cartItems.map((item) =>
          item._id === product._id
            ? {
              ...item,
              quantity: item.quantity + 1
            }
            : item
        )
      );
    } else {
      setCartItems([
        ...cartItems,
        {
          ...product,
          quantity: 1
        }
      ]);
    }
  }

  // Remove product completely
  function removeFromCart(productId) {
    setCartItems(
      cartItems.filter(
        (product) => product._id !== productId
      )
    );
  }

  // Increase quantity
  function increaseQuantity(productId) {
    setCartItems(
      cartItems.map((product) =>
        product._id === productId
          ? {
            ...product,
            quantity: product.quantity + 1
          }
          : product
      )
    );
  }

  // Decrease quantity
  function decreaseQuantity(productId) {
    setCartItems(
      cartItems.map((product) =>
        product._id === productId && product.quantity > 1
          ? {
            ...product,
            quantity: product.quantity - 1
          }
          : product
      )
    );
  }

  return (
    <BrowserRouter>

      <Navbar />

      <Routes>

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/products"
          element={
            <Products addToCart={addToCart} />
          }
        />

        <Route
          path="/products/:id"
          element={
            <ProductDetails
              addToCart={addToCart}
            />
          }
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

        <Route
          path="/login"
          element={<Login />}
        />
        <Route
          path="/register"
          element={<Register />}
        />
        <Route
          path="/Profile"
          element={<Profile />}
        />
        <Route
          path="/admin"
          element={<AdminDashboard />}
        />
        <Route
          path="/admin/products"
          element={<AdminProducts />}
        />
        <Route
          path="/checkout"
          element={
            <Checkout
              cartItems={cartItems}
              clearCart={clearCart}
            />
          }
        />
        <Route
          path="/orders"
          element={<Orders />}
        />
        <Route
          path="/admin/orders"
          element={<AdminOrders />}
        />
        <Route
          path="/admin/users"
          element={<AdminUsers />}
        />
        <Route element={<ProtectedRoute />}>
          <Route
            path="/orders"
            element={<Orders />}
          />
        </Route>
        <Route element={<ProtectedRoute adminOnly />}>
          <Route
            path="/admin"
            element={<AdminDashboard />}
          />

          <Route
            path="/admin/products"
            element={<AdminProducts />}
          />

          <Route
            path="/admin/orders"
            element={<AdminOrders />}
          />

          <Route
            path="/admin/users"
            element={<AdminUsers />}
          />
        </Route>
        <Route
          element={<ProtectedRoute />}
        >
          <Route
            path="/orders/:id"
            element={<OrderDetails />}
          />
        </Route>
      </Routes>


    </BrowserRouter>
  );
}

export default App;
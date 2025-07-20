import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { AuthProvider } from "./contexts/AuthContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import AdminAddProduct from "./pages/AdminAddProduct"; // Admin page
import ProtectedRouteAdmin from "./components/ProtectedRouteAdmin"; // 🔥 Import Protected Route
import Shop from "./pages/Shop"; // Import Shop page
import ProductDetails from "./pages/ProductDetails"; // Import Product Details page
import Cart from "./pages/Cart"; // Import Cart page
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import { CartProvider } from "./contexts/CartContext";

const App = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="flex flex-col min-h-screen">
            {/* Header selalu tampil */}
            <Header />

            {/* Konten utama */}
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/product/:id" element={<ProductDetails />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/orders" element={<Orders />} />
                {/* 🔒 Route khusus admin */}
                <Route
                  path="/admin/add-product"
                  element={
                    <ProtectedRouteAdmin>
                      <AdminAddProduct />
                    </ProtectedRouteAdmin>
                  }
                />
              </Routes>
            </main>

            {/* Footer selalu tampil */}
            <Footer />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;

import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { logoutUser } from "../firebase/auth";
import { fetchCart } from "../firebase/firestore"; // ✅ Import fetchCart
import { FiMenu, FiX, FiShoppingCart, FiClock } from "react-icons/fi";

const Header = () => {
  const { user, role } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0); // ✅ jumlah cart
  const navigate = useNavigate();

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  const handleLogout = async () => {
    try {
      await logoutUser();
      setDropdownOpen(false);
      setMobileMenuOpen(false);
      navigate("/login");
    } catch (err) {
      console.error("Logout gagal:", err);
    }
  };

  const handleLinkClick = () => {
    if (mobileMenuOpen) setMobileMenuOpen(false);
  };

  // ✅ Load jumlah cart ketika user login
  useEffect(() => {
    const loadCartCount = async () => {
      if (user) {
        const cart = await fetchCart(user.uid);
        const totalItems = cart.reduce((acc, item) => acc + item.qty, 0);
        setCartCount(totalItems);
      } else {
        setCartCount(0);
      }
    };

    loadCartCount();
  }, [user]);

  return (
    <header className="bg-gradient-to-r from-blue-900 via-purple-500 to-amber-300 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link
          to="/"
          onClick={handleLinkClick}
          className="font-bold text-2xl text-white tracking-wide hover:text-amber-200 transition"
        >
          Yubascell
        </Link>

        {/* Hamburger Menu Button (Mobile) */}
        <button
          className="text-3xl text-white md:hidden focus:outline-none"
          onClick={toggleMobileMenu}
        >
          {mobileMenuOpen ? <FiX /> : <FiMenu />}
        </button>

        {/* Navigation (Desktop) */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link
            to="/"
            onClick={handleLinkClick}
            className="text-white hover:text-amber-200 transition font-medium"
          >
            Home
          </Link>
          <Link
            to="/shop"
            onClick={handleLinkClick}
            className="text-white hover:text-amber-200 transition font-medium"
          >
            Shop
          </Link>
          <Link
            to="/orders"
            onClick={handleLinkClick}
            className="text-white hover:text-amber-200 transition font-medium"
          >
            History
          </Link>

          {/* 🛒 Cart Icon with Badge */}
          <Link
            to="/cart"
            onClick={handleLinkClick}
            className="text-white hover:text-amber-200 transition relative"
          >
            <FiShoppingCart size={22} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-3 bg-amber-500 text-white text-xs font-bold rounded-full px-1.5 py-0.5 shadow-md">
                {cartCount}
              </span>
            )}
          </Link>

          {role === "admin" && (
            <Link
              to="/admin/add-product"
              onClick={handleLinkClick}
              className="text-white hover:text-amber-300 transition font-medium"
            >
              Tambah Produk
            </Link>
          )}

          {/* User Avatar + Dropdown */}
          {user ? (
            <div className="relative">
              <button
                onClick={toggleDropdown}
                className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow hover:ring-2 hover:ring-amber-300 transition focus:outline-none"
              >
                <img
                  src={
                    user.photoURL ||
                    `https://ui-avatars.com/api/?name=${user.email}&background=3B82F6&color=fff`
                  }
                  alt="User Avatar"
                  className="w-full h-full object-cover"
                />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-3 w-52 bg-white rounded-lg shadow-xl animate-fade-down transition">
                  <div className="px-4 py-3 text-gray-700 border-b text-sm">
                    👤 {user.email}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 hover:text-red-700 font-medium transition"
                  >
                    🔓 Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="ml-4 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 shadow hover:shadow-md transition-all"
            >
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;

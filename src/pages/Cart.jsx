import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  fetchCart,
  updateCartItem,
  removeCartItem,
} from "../firebase/firestore";
import { useAuth } from "../contexts/AuthContext";

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState([]); // ✅ Untuk item yang dipilih
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const loadCart = async () => {
      if (!user) {
        navigate("/login");
        return;
      }

      try {
        const userCart = await fetchCart(user.uid);
        setCart(userCart);
      } catch (error) {
        console.error("❌ Gagal ambil cart:", error);
      }
      setLoading(false);
    };

    loadCart();
  }, [user, navigate]);

  const handleQtyChange = async (id, delta) => {
    const item = cart.find((i) => i.id === id);
    if (!item) return;

    const newQty = item.qty + delta;

    if (newQty <= 0) {
      await removeCartItem(user.uid, id);
      setCart(cart.filter((i) => i.id !== id));
      setSelectedItems(selectedItems.filter((sid) => sid !== id));
    } else {
      await updateCartItem(user.uid, id, newQty);
      setCart(cart.map((i) => (i.id === id ? { ...i, qty: newQty } : i)));
    }
  };

  const toggleSelectItem = (id) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  const selectedTotalPrice = cart
    .filter((item) => selectedItems.includes(item.id))
    .reduce((acc, item) => acc + item.price * item.qty, 0);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-500">
        Loading...
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="text-center mt-10 py-32">
        <p className="text-gray-500">🛒 Keranjang kosong.</p>
        <Link
          to="/shop"
          className="inline-block mt-4 px-5 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition"
        >
          Belanja Sekarang
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-3 sm:px-4 py-12">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        🛒 Keranjang Belanja
      </h1>

      <div className="grid gap-4">
        {cart.map((item) => (
          <div
            key={item.id}
            className="flex items-center bg-white rounded-lg shadow p-3 sm:p-4"
          >
            {/* ✅ Checkbox */}
            <input
              type="checkbox"
              checked={selectedItems.includes(item.id)}
              onChange={() => toggleSelectItem(item.id)}
              className="mr-3 sm:mr-4"
            />

            {/* 🖼️ Gambar */}
            <img
              src={item.image}
              alt={item.name}
              className="w-20 h-20 sm:w-32 sm:h-32 object-cover rounded"
            />

            {/* 📄 Info */}
            <div className="flex-1 ml-3 sm:ml-5">
              <h2 className="text-base sm:text-lg font-bold text-gray-800">
                {item.name}
              </h2>
              <p className="text-gray-600 text-sm sm:text-base">
                Rp {item.price.toLocaleString()}
              </p>
              <div className="flex items-center mt-2 space-x-2">
                <button
                  onClick={() => handleQtyChange(item.id, -1)}
                  className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
                >
                  -
                </button>
                <span className="mx-2 font-semibold">{item.qty}</span>
                <button
                  onClick={() => handleQtyChange(item.id, 1)}
                  className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
                >
                  +
                </button>
              </div>
            </div>

            {/* 🗑️ Hapus */}
            <button
              onClick={() => handleQtyChange(item.id, -item.qty)}
              className="ml-3 sm:ml-5 px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              🗑
            </button>
          </div>
        ))}
      </div>

      {/* 🏷️ Total & Checkout */}
      <div className="mt-8 text-right">
        <p className="text-xl font-bold text-gray-800">
          Total: Rp {selectedTotalPrice.toLocaleString()}
        </p>
        <button
          onClick={() =>
            navigate("/checkout", {
              state: cart.filter((item) => selectedItems.includes(item.id)), // ⬅️ Kirim hanya item yang dipilih
            })
          }
          disabled={selectedItems.length === 0} // ⬅️ Disable kalau belum pilih item
          className={`mt-4 px-6 py-3 rounded-lg font-medium transition ${
            selectedItems.length === 0
              ? "bg-gray-400 text-white cursor-not-allowed"
              : "bg-green-600 text-white hover:bg-green-700"
          }`}
        >
          ✅ Checkout
        </button>
      </div>
    </div>
  );
};

export default Cart;

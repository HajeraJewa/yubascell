import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { placeOrder, clearCart } from "../firebase/firestore";
import { FiArrowLeft } from "react-icons/fi"; // ✅ Icon Panah

const Checkout = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const selectedItems = location.state || []; // ⬅️ Ambil item yang dicentang dari Cart

  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("transfer");

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else if (selectedItems.length === 0) {
      // Jika tidak ada item terpilih, balik ke Cart
      navigate("/cart");
    }
  }, [user, selectedItems, navigate]);

  const totalPrice = selectedItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );

  const handleOrder = async () => {
    if (!address.trim()) {
      alert("📦 Alamat wajib diisi!");
      return;
    }

    const order = {
      userId: user.uid,
      items: selectedItems,
      total: totalPrice,
      address,
      paymentMethod,
      status: "pending",
      createdAt: new Date(),
    };

    try {
      await placeOrder(order);
      await clearCart(user.uid, selectedItems); // ⬅️ Hapus hanya item yang di-checkout
      alert("✅ Pesanan berhasil! Lihat di Riwayat Pesanan.");
      navigate("/orders");
    } catch (err) {
      console.error("❌ Gagal membuat pesanan:", err);
      alert("❌ Gagal membuat pesanan. Coba lagi.");
    }
  };

  return (
    <div className="container mx-auto px-3 sm:px-4 py-10">
      <button
        onClick={() => navigate(-1)}
        className="fixed top-4 left-4 bg-white rounded-full shadow p-2 text-gray-600 hover:bg-gray-100 hover:text-amber-600 transition z-50"
        aria-label="Kembali"
      >
        <FiArrowLeft size={22} />
      </button>
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        🛒 Checkout
      </h1>

      <div className="space-y-4">
        {selectedItems.map((item) => (
          <div
            key={item.id}
            className="flex justify-between items-center bg-white p-4 rounded-lg shadow"
          >
            <div className="flex items-center gap-3">
              <img
                src={item.image}
                alt={item.name}
                className="w-16 h-16 object-cover rounded"
              />
              <div>
                <h2 className="font-bold text-gray-800">{item.name}</h2>
                <p className="text-gray-600">
                  {item.qty} x Rp {item.price.toLocaleString()}
                </p>
              </div>
            </div>
            <p className="font-semibold text-gray-800">
              Rp {(item.price * item.qty).toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-6 bg-white p-6 rounded-lg shadow space-y-4">
        <p className="text-xl font-bold text-gray-800">
          Total: Rp {totalPrice.toLocaleString()}
        </p>

        <div>
          <label className="block font-semibold mb-1">Alamat Pengiriman</label>
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg"
            placeholder="Masukkan alamat lengkap..."
            rows="3"
            required
          ></textarea>
        </div>

        <div>
          <label className="block font-semibold mb-1">Metode Pembayaran</label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg"
          >
            <option value="transfer">Transfer Bank</option>
            <option value="cod">Cash on Delivery (COD)</option>
          </select>
        </div>

        <button
          onClick={handleOrder}
          className="w-full bg-green-600 text-white p-3 rounded-lg font-medium hover:bg-green-700 transition"
        >
          ✅ Konfirmasi Pesanan
        </button>
      </div>
    </div>
  );
};

export default Checkout;

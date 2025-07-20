import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { addToCart } from "../firebase/firestore";
import { FiArrowLeft } from "react-icons/fi"; // ✅ Icon Panah
import { useAuth } from "../contexts/AuthContext";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const docRef = doc(db, "products", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProduct(docSnap.data());
        } else {
          console.log("❌ Produk tidak ditemukan");
        }
      } catch (error) {
        console.error("❌ Error ambil produk:", error);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    setLoading(true);
    try {
      await addToCart(user.uid, { ...product, id });
      alert("✅ Produk berhasil ditambahkan ke keranjang!");
    } catch (error) {
      console.error("❌ Gagal tambah ke keranjang:", error);
      alert("❌ Gagal tambah ke keranjang!");
    }
    setLoading(false);
  };

  if (!product) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-500">
        Loading...
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 relative">
      {/* ⬅️ Tombol Kembali di Atas */}
      <button
        onClick={() => navigate(-1)}
        className="fixed top-4 left-4 bg-white rounded-full shadow p-2 text-gray-600 hover:bg-gray-100 hover:text-amber-600 transition z-50"
        aria-label="Kembali"
      >
        <FiArrowLeft size={22} />
      </button>

      <div className="flex flex-col md:flex-row gap-8 mt-8">
        {/* 🖼️ Gambar Produk */}
        <div className="flex-1">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-[300px] sm:h-[400px] md:h-[500px] object-cover"
            />
          </div>
        </div>

        {/* 📄 Detail Produk */}
        <div className="flex-1">
          <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
              {product.name}
            </h1>
            <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
              {product.description}
            </p>
            <p className="text-2xl font-semibold text-purple-700">
              Rp {product.price.toLocaleString()}
            </p>

            {/* 🛒 Tombol */}
            <button
              onClick={handleAddToCart}
              disabled={loading}
              className="w-full px-5 py-3 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 transition"
            >
              {loading ? "⏳ Menambahkan..." : "➕ Tambah ke Keranjang"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;

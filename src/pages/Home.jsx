import React, { useEffect, useState } from "react";
import { fetchProducts, addToCart } from "../firebase/firestore"; // ✅ gunakan addToCart
import ProductCard from "../components/ProductCard";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Home = () => {
  const [products, setProducts] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const loadProducts = async () => {
      const allProducts = await fetchProducts();
      const filtered = allProducts.filter(
        (product) => product.category?.toLowerCase() === "aksesoris"
      );
      setProducts(filtered);
    };

    loadProducts();
  }, []);

  const handleShopClick = () => {
    navigate("/shop");
  };

  const handleAddToCart = async (product) => {
    if (!user) {
      alert("🚨 Login dulu untuk menambah ke keranjang!");
      navigate("/login");
      return;
    }

    try {
      await addToCart(user.uid, { ...product, qty: 1 }); // ✅ qty default 1
      alert(`✅ ${product.name} berhasil ditambahkan ke keranjang!`);
    } catch (error) {
      console.error("❌ Gagal tambah ke keranjang:", error);
      alert("Gagal menambahkan ke keranjang.");
    }
  };

  return (
    <div>
      {/* 🌟 Hero Section */}
      <section
        className="relative h-[350px] sm:h-[450px] md:h-[550px] flex flex-col justify-center items-center text-center"
        style={{
          backgroundImage: "linear-gradient(to right, #3B82F6, #8B5CF6)",
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="relative z-10 px-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white drop-shadow-lg">
            Selamat Datang di <span className="text-amber-300">Yubascell</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl mt-3 sm:mt-5 text-gray-100 max-w-md mx-auto">
            Gadget & Aksesoris Berkualitas Tinggi dengan Harga Terbaik.
          </p>
          <button
            onClick={handleShopClick}
            className="mt-5 sm:mt-7 px-6 sm:px-8 py-3 sm:py-4 bg-amber-400 text-white rounded-full text-base sm:text-lg font-semibold hover:bg-amber-500 transition"
          >
            Belanja Sekarang
          </button>
        </div>
      </section>

      {/* 🛒 Produk Grid */}
      <section className="container mx-auto px-3 sm:px-4 py-10 sm:py-12">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-10 text-center text-amber-500">
          Produk Aksesoris Terbaru
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.length > 0 ? (
            products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart} // ✅ fungsi baru
              />
            ))
          ) : (
            <div className="col-span-full text-center text-gray-500">
              🔄 Memuat produk kategori Aksesoris...
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;

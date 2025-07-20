import React, { useEffect, useState } from "react";
import { fetchProducts } from "../firebase/firestore";
import { Link } from "react-router-dom";
import { FiSearch } from "react-icons/fi"; // ✅ Import icon search

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const loadProducts = async () => {
      const allProducts = await fetchProducts();
      setProducts(allProducts);
      setFilteredProducts(allProducts);

      // ✅ Unique categories
      const uniqueCategories = [
        "All",
        ...new Set(allProducts.map((p) => p.category || "Uncategorized")),
      ];
      setCategories(uniqueCategories);
    };

    loadProducts();
  }, []);

  // ✅ Filter by category & search
  useEffect(() => {
    let temp = products;

    if (selectedCategory !== "All") {
      temp = temp.filter((p) => p.category === selectedCategory);
    }

    if (searchTerm.trim() !== "") {
      temp = temp.filter((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredProducts(temp);
  }, [products, selectedCategory, searchTerm]);

  return (
    <div className="w-full px-4 py-10 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-2">
        🛍️ Shop
      </h1>

      {/* 🔎 Search & Categories */}
      <div className="bg-white rounded-xl shadow-md p-3 mb-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Search Box */}
        <div className="relative col-span-2">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 pr-10"
          />
          <FiSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
        </div>

        {/* Categories */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
        >
          {categories.map((cat, index) => (
            <option key={index} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* 📦 Product List */}
      {filteredProducts.length === 0 ? (
        <p className="text-center text-gray-500">🚫 Produk tidak ditemukan.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white border rounded-xl p-4 shadow hover:shadow-lg transition-all duration-300"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover rounded-lg mb-3"
              />
              <h2 className="font-bold text-lg text-gray-800">
                {product.name}
              </h2>
              <p className="text-gray-600 mt-1">
                Rp {product.price.toLocaleString()}
              </p>
              <Link
                to={`/product/${product.id}`}
                className="mt-4 block w-full text-center bg-amber-500 text-white py-2 rounded-lg hover:bg-amber-600 transition"
              >
                View Details
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Shop;

import React from "react";
import { FiPlus } from "react-icons/fi";

const ProductCard = ({ product, onAddToCart }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition">
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
        <p className="text-gray-600 mt-2">{product.description}</p>
        <div className="flex justify-between items-center mt-4">
          <span className="text-xl font-bold text-purple-600">
            Rp {product.price.toLocaleString()}
          </span>
          <button
            onClick={() => onAddToCart(product)} // ✅ Tambahkan ke cart
            className="p-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition"
          >
            <FiPlus size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

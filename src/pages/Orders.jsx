import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { fetchOrders } from "../firebase/firestore";
import { useNavigate } from "react-router-dom";

const Orders = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const loadOrders = async () => {
      if (!user) {
        navigate("/login");
        return;
      }
      const userOrders = await fetchOrders(user.uid);
      setOrders(userOrders);
    };

    loadOrders();
  }, [user, navigate]);

  const formatDate = (createdAt) => {
    if (!createdAt) return "-";
    if (createdAt.toDate) {
      return createdAt.toDate().toLocaleString(); // Firestore Timestamp
    }
    return new Date(createdAt).toLocaleString(); // String atau Date
  };

  return (
    <div className="container mx-auto px-3 sm:px-4 py-12">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        📦 Riwayat Pesanan
      </h1>

      {orders.length === 0 ? (
        <p className="text-center text-gray-500">Belum ada pesanan.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white p-4 rounded-lg shadow space-y-3"
            >
              <p className="font-semibold text-gray-800">
                Tanggal: {formatDate(order.createdAt)}
              </p>
              <p className="text-gray-600">Alamat: {order.address || "-"}</p>
              <p className="text-gray-600">
                Metode: {order.paymentMethod || "COD"}
              </p>
              <p className="font-bold text-green-700">
                Total: Rp {order.total?.toLocaleString() || "0"}
              </p>
              <p className="text-sm text-gray-500">
                Status: {order.status || "Menunggu Pembayaran"}
              </p>

              {/* 🛒 List Produk */}
              <div className="border-t pt-3">
                <h2 className="font-semibold mb-2 text-gray-700">
                  Daftar Produk:
                </h2>
                <ul className="list-disc pl-5 space-y-1">
                  {order.items?.map((item, idx) => (
                    <li key={idx} className="text-gray-600">
                      {item.name} - {item.qty}x Rp {item.price.toLocaleString()}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;

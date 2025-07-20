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

  return (
    <div className="container mx-auto px-3 sm:px-4 py-12">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        📦 Riwayat Pesanan
      </h1>

      {orders.length === 0 ? (
        <p className="text-center text-gray-500">Belum ada pesanan.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white p-4 rounded-lg shadow space-y-2"
            >
              <p className="font-semibold text-gray-800">
                Tanggal: {order.createdAt.toDate().toLocaleString()}
              </p>
              <p className="text-gray-600">Alamat: {order.address}</p>
              <p className="text-gray-600">Metode: {order.paymentMethod}</p>
              <p className="font-bold text-green-700">
                Total: Rp {order.total.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500">Status: {order.status}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;

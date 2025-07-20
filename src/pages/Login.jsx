import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../firebase/auth";
import { auth, db } from "../firebase/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await loginUser(email, password);

      // ✅ Cek role user setelah login
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          const role = userDoc.exists() ? userDoc.data().role : "user";

          if (role === "admin") {
            navigate("/"); // 🔥 Admin langsung ke dashboard
          } else {
            navigate("/"); // 🏠 User ke home
          }
        }
      });
    } catch (err) {
      setError("⚠️ Login gagal: " + err.message);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-orange-300">
      <main className="flex-1 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
            🔑 Login to Yubascell
          </h2>

          {error && (
            <div className="mb-4 text-red-600 text-sm text-center">{error}</div>
          )}

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
              required
            />
            <button
              type="submit"
              className="p-3 bg-gradient-to-r from-purple-500 to-orange-400 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-orange-500 transition-colors"
            >
              Login
            </button>
          </form>

          <p className="mt-4 text-center text-sm text-gray-600">
            Belum punya akun?{" "}
            <a
              href="/register"
              className="text-blue-500 hover:underline font-medium"
            >
              Daftar di sini
            </a>
          </p>
        </div>
      </main>
    </div>
  );
};

export default Login;

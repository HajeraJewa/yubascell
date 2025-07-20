import React, { createContext, useContext, useEffect, useState } from "react";
import { fetchCart } from "../firebase/firestore";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cartCount, setCartCount] = useState(0);

  const loadCartCount = async () => {
    if (user) {
      const cart = await fetchCart(user.uid);
      const totalItems = cart.reduce((acc, item) => acc + item.qty, 0);
      setCartCount(totalItems);
    } else {
      setCartCount(0);
    }
  };

  useEffect(() => {
    loadCartCount();
  }, [user]);

  return (
    <CartContext.Provider value={{ cartCount, setCartCount, reloadCart: loadCartCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);

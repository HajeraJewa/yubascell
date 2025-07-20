import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  query,
  where, 
} from "firebase/firestore";
import app from "./firebaseConfig";

const db = getFirestore(app);

// 🔥 Fetch semua produk
export const fetchProducts = async () => {
  const querySnapshot = await getDocs(collection(db, "products"));
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// 🔥 Tambah produk (admin)
export const addProduct = async (product) => {
  return await addDoc(collection(db, "products"), product);
};

// 📝 Ambil semua pesanan user
export const fetchOrders = async (userId) => {
  const ordersRef = collection(db, "orders");
  const q = query(ordersRef, where("userId", "==", userId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

// 🛒 Tambah ke cart
export const addToCart = async (userId, product) => {
  const cartRef = doc(db, "carts", userId);
  const cartSnap = await getDoc(cartRef);

  let cartItems = [];
  if (cartSnap.exists()) {
    cartItems = cartSnap.data().items || [];
  }

  const index = cartItems.findIndex((item) => item.id === product.id);

  if (index >= 0) {
    cartItems[index].qty += 1; // Tambah qty jika sudah ada
  } else {
    cartItems.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      qty: 1,
    });
  }

  await setDoc(cartRef, { items: cartItems }, { merge: true });
};

// 🛒 Ambil cart
export const fetchCart = async (userId) => {
  const cartRef = doc(db, "carts", userId);
  const cartSnap = await getDoc(cartRef);
  if (cartSnap.exists()) {
    return cartSnap.data().items || [];
  }
  return [];
};

// 🛒 Update qty item di cart
export const updateCartItem = async (userId, productId, qty) => {
  const cartRef = doc(db, "carts", userId);
  const cartSnap = await getDoc(cartRef);

  if (cartSnap.exists()) {
    let cartItems = cartSnap.data().items || [];
    const index = cartItems.findIndex((item) => item.id === productId);

    if (index >= 0) {
      if (qty > 0) {
        cartItems[index].qty = qty;
      } else {
        cartItems.splice(index, 1); // Hapus kalau qty 0
      }
      await setDoc(cartRef, { items: cartItems }, { merge: true });
    }
  }
};

// 🛒 Hapus item
export const removeCartItem = async (userId, productId) => {
  const cartRef = doc(db, "carts", userId);
  const cartSnap = await getDoc(cartRef);

  if (cartSnap.exists()) {
    const filteredItems = cartSnap
      .data()
      .items.filter((item) => item.id !== productId);
    await setDoc(cartRef, { items: filteredItems }, { merge: true });
  }
};

// ✅ Checkout
export const placeOrder = async (order) => {
  return await addDoc(collection(db, "orders"), order);
};

// ✅ Kosongkan cart
export const clearCart = async (userId) => {
  await deleteDoc(doc(db, "carts", userId));
};

export default db;

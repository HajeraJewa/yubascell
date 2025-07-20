import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  arrayUnion,
  deleteDoc,
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

// 🛒 Tambah item ke cart user
export const addToCart = async (userId, product) => {
  const cartRef = doc(db, "carts", userId);
  const cartSnap = await getDoc(cartRef);

  if (cartSnap.exists()) {
    const cartData = cartSnap.data();
    const existingItem = cartData.items.find((item) => item.id === product.id);

    if (existingItem) {
      existingItem.qty += product.qty;
    } else {
      cartData.items.push(product);
    }

    await updateDoc(cartRef, { items: cartData.items });
  } else {
    await setDoc(cartRef, { items: [product] });
  }
};

// 🛒 Fetch cart user
export const fetchCart = async (userId) => {
  const cartRef = doc(db, "carts", userId);
  const cartSnap = await getDoc(cartRef);
  if (cartSnap.exists()) {
    return cartSnap.data().items;
  } else {
    return [];
  }
};

// 🛒 Update qty produk dalam cart
export const updateCartItem = async (userId, productId, qty) => {
  const cartRef = doc(db, "carts", userId);
  const cartSnap = await getDoc(cartRef);

  let cart = {};
  if (cartSnap.exists()) {
    cart = cartSnap.data();
  }

  if (cart[productId]) {
    cart[productId].qty += qty;
  } else {
    cart[productId] = { qty, productId };
  }

  await setDoc(cartRef, cart, { merge: true }); // ✅ merge data lama
};

// 🛒 Hapus produk dari cart
export const removeCartItem = async (userId, productId) => {
  const cartRef = doc(db, "carts", userId);
  const cartSnap = await getDoc(cartRef);

  if (cartSnap.exists()) {
    const cartData = cartSnap.data();
    const filteredItems = cartData.items.filter(
      (item) => item.id !== productId
    );
    await updateDoc(cartRef, { items: filteredItems });
  }
};

// ✅ Simpan order baru
export const placeOrder = async (order) => {
  return await addDoc(collection(db, "orders"), order);
};

// ✅ Kosongkan cart setelah checkout
export const clearCart = async (userId) => {
  await deleteDoc(doc(db, "carts", userId));
};

// Ambil semua pesanan user
export const fetchOrders = async (userId) => {
  const ordersRef = collection(db, "orders");
  const querySnapshot = await getDocs(ordersRef);
  return querySnapshot.docs
    .filter((doc) => doc.data().userId === userId)
    .map((doc) => ({ id: doc.id, ...doc.data() }));
};

export default db;

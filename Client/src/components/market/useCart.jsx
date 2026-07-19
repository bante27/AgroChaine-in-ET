import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../../contexts/AuthContext";

export const useCart = (openAuthModal) => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState(() => {
    try {
      const storedCart = sessionStorage.getItem("cartItems");
      return storedCart ? JSON.parse(storedCart) : [];
    } catch {
      return [];
    }
  });
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    sessionStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = useCallback(
    (product) => {
      if (!user) {
        openAuthModal(); //  if not logged in → open auth modal
        return;
      }
      setCartItems((prevItems) => {
        const existingItem = prevItems.find((item) => item._id === product._id);
        if (existingItem) {
          return prevItems.map((item) =>
            item._id === product._id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        } else {
          return [...prevItems, { ...product, quantity: 1 }];
        }
      });
      setIsCartOpen(true);
      toast.success(`${product.title} added to cart ✅`);
    },
    [user, openAuthModal]
  );

  const removeFromCart = useCallback((product) => {
    setCartItems((prev) => prev.filter((item) => item._id !== product._id));
    toast.success(`${product.title} removed from cart`);
  }, []);

  const updateQuantity = useCallback((product, delta) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item._id === product._id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  }, []);

  return {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    isCartOpen,
    setIsCartOpen,
  };
};

export default useCart;

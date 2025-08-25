// src/components/market/CartSidebar.jsx
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2, Plus, Minus, ShoppingCart } from "lucide-react";
import Button from "../common/Button";

const getItemId = (item) => item._id || item.id;

const CartSidebar = ({
  isCartOpen,
  setIsCartOpen,
  cartItems = [],
  updateQuantity,
  removeFromCart,
  shippingFee = 0,
  onCheckout,
}) => {
  const subtotal = cartItems.reduce(
    (acc, item) => acc + (Number(item.price) || 0) * (Number(item.quantity) || 0),
    0
  );
  const total = subtotal + Number(shippingFee || 0);

  const handleDec = (item) => updateQuantity(getItemId(item), Math.max((item.quantity || 1) - 1, 1));
  const handleInc = (item) => updateQuantity(getItemId(item), (item.quantity || 1) + 1);
  const handleRemove = (item) => removeFromCart(getItemId(item));

  const generateDelivery = () => {
    const today = new Date();
    const minDate = new Date(today.getTime() + 3 * 86400000);
    const maxDate = new Date(today.getTime() + 25 * 86400000);
    return `${minDate.toLocaleDateString()} - ${maxDate.toLocaleDateString()}`;
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-40"
            onClick={() => setIsCartOpen(false)}
          />

          {/* Sidebar */}
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-y-0 right-0 z-50 bg-white shadow-lg rounded-l-xl
                       w-[90%] sm:w-[350px] md:w-[380px] max-w-full flex flex-col max-h-screen"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-3 border-b sticky top-0 bg-white z-10">
              <div className="flex items-center gap-2">
                <ShoppingCart className="text-blue-600" size={22} />
                <h2 className="text-base font-bold text-gray-900">Your Cart</h2>
                {cartItems.length > 0 && (
                  <span className="ml-2 text-xs font-bold bg-blue-600 text-white px-2 py-0.5 rounded-full">
                    {cartItems.length}
                  </span>
                )}
              </div>
              <button onClick={() => setIsCartOpen(false)} className="text-gray-500 hover:text-gray-700">
                <X size={22} />
              </button>
            </div>

            {/* Scrollable Cart Items */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {cartItems.length === 0 ? (
                <div className="flex items-center justify-center h-full text-gray-500 text-sm">
                  Your cart is empty.
                </div>
              ) : (
                cartItems.map((item) => (
                  <div key={getItemId(item)} className="flex items-center gap-3 border rounded p-2">
                    <img
                      src={item.images?.[0] ? (String(item.images[0]).startsWith("http") ? item.images[0] : `http://localhost:5000${item.images[0]}`) : "https://via.placeholder.com/50"}
                      alt={item.title}
                      className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate text-sm">{item.title}</h3>
                      <p className="text-gray-700 text-xs">Price: {Number(item.price).toLocaleString()} ETB</p>
                      <div className="flex items-center border rounded text-xs mt-1">
                        <button onClick={() => handleDec(item)} className="px-1 py-0.5 text-gray-700 hover:bg-gray-100" disabled={(item.quantity || 1) <= 1}>
                          <Minus size={12} />
                        </button>
                        <span className="px-2 py-0.5 font-medium text-gray-900 text-center">{item.quantity}</span>
                        <button onClick={() => handleInc(item)} className="px-1 py-0.5 text-gray-700 hover:bg-gray-100">
                          <Plus size={12} />
                        </button>
                      </div>
                    </div>
                    <button onClick={() => handleRemove(item)} className="text-red-500 hover:text-red-700 p-1">
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {cartItems.length > 0 && (
              <div className="p-3 border-t bg-white space-y-2 text-xs sm:text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Delivery</span>
                  <span className="font-medium text-gray-900">{generateDelivery()}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span>{subtotal.toLocaleString()} ETB</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Shipping</span>
                  <span>{Number(shippingFee).toLocaleString()} ETB</span>
                </div>
                <div className="flex justify-between font-semibold text-gray-900">
                  <span>Total</span>
                  <span>{total.toLocaleString()} ETB</span>
                </div>
                <Button onClick={onCheckout} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md">
                  Checkout ({cartItems.length})
                </Button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartSidebar;

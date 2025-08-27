// src/components/market/CheckoutModal.jsx
import React, { useState } from "react";
import Button from "../common/Button";
import toast from "react-hot-toast";
import axios from "axios";

const SERVICE_FEE_PERCENT = 5; // Match backend

const CheckoutModal = ({
  isOpen,
  onClose,
  cartItems,
  shippingFee,
  token,
  onLogin,
  onOrderSuccess,
}) => {
  if (!isOpen) return null;

  const [paymentMethod, setPaymentMethod] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [loading, setLoading] = useState(false);

  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 7);

  const subtotal = cartItems.reduce(
    (acc, i) => acc + (i.price || 0) * i.quantity,
    0
  );
  const serviceFee = (SERVICE_FEE_PERCENT / 100) * subtotal;
  const total = subtotal + serviceFee + shippingFee;

  const handleOrder = async () => {
    if (!token) {
      toast.error("Please login to place the order");
      onLogin?.();
      return;
    }
    if (!deliveryAddress.trim()) {
      toast.error("Please enter a delivery address");
      return;
    }
    if (!paymentMethod) {
      toast.error("Please select a payment method");
      return;
    }

    try {
      setLoading(true);

      for (let item of cartItems) {
        // ✅ Always use productId (string) from DB, not _id
        const payload = {
          productId: String(item.productId),   // use productId only
          quantity: Number(item.quantity),
          deliveryAddress: String(deliveryAddress.trim()),
        };

        const response = await axios.post(
          "http://localhost:5000/api/transactions/buy",
          payload,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.data.success) {
          const txn = response.data.transaction;
          toast.success(
            `Purchased "${item.title}" successfully!\n
Total: ${txn.totalPrice + (txn.platformFeeBuyer || 0)} ETB\n
Platform Fee: ${txn.platformFeeBuyer || 0} ETB\n
Net to Seller: ${txn.netSellerAmount || 0} ETB\n
Delivery: ${deliveryDate.toLocaleDateString()} via ${paymentMethod}`
          );
        } else {
          toast.error(response.data.error || `Failed to purchase ${item.title}`);
        }
      }

      onOrderSuccess?.();
      onClose();
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error(error.response?.data?.error || "Server error during purchase");
    } finally {
      setLoading(false);
    }
  };

  const paymentOptions = [
    "CBE Bank",
    "Abay Bank",
    "Dashen Bank",
    "Awash Bank",
    "Abyssinia Bank",
    "Berhan Bank",
    "Telebirr",
    "M-Pesa",
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-sm sm:max-w-md md:max-w-lg flex flex-col max-h-[90vh] overflow-hidden">

        {/* Header */}
        <div className="p-3 sm:p-4 border-b flex justify-between items-center">
          <h2 className="text-base sm:text-lg font-bold text-gray-900">Checkout</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 text-xs sm:text-sm">

          {/* Cart Items */}
          {cartItems.map((item) => (
            <div key={item.productId} className="flex items-center justify-between border-b pb-2">
              <img
                src={
                  item.images?.[0]
                    ? `http://localhost:5000${item.images[0]}`
                    : "https://via.placeholder.com/50"
                }
                alt={item.title}
                className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded"
              />
              <div className="flex-1 px-2">
                <p className="font-medium text-gray-800 truncate">{item.title}</p>
                <p className="text-gray-600 text-xs">
                  {item.quantity} × {item.price} ETB
                </p>
              </div>
              <p className="font-semibold text-gray-900 text-xs sm:text-sm">
                {item.price * item.quantity} ETB
              </p>
            </div>
          ))}

          {/* Totals */}
          <div className="space-y-1 text-gray-800 text-xs sm:text-sm">
            <div className="flex justify-between"><span>Subtotal</span><span>{subtotal} ETB</span></div>
            <div className="flex justify-between"><span>Platform Fee ({SERVICE_FEE_PERCENT}%)</span><span>{serviceFee} ETB</span></div>
            <div className="flex justify-between"><span>Shipping</span><span>{shippingFee} ETB</span></div>
            <div className="flex justify-between font-bold text-sm sm:text-base"><span>Total</span><span>{total} ETB</span></div>
          </div>

          {/* Delivery Date */}
          <p className="text-gray-700 text-xs">
            Delivery Date: <span className="font-semibold">{deliveryDate.toLocaleDateString()}</span>
          </p>

          {/* Delivery Address */}
          {token && (
            <div>
              <label className="block text-gray-800 font-semibold text-xs sm:text-sm mb-1">Delivery Address</label>
              <input
                type="text"
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                placeholder="Enter your delivery address"
                className="w-full border border-gray-300 rounded px-2 py-1 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          )}

          {/* Payment Methods */}
          {token ? (
            <div>
              <h3 className="font-semibold mb-2 text-gray-800">Choose Payment Method</h3>
              <div className="grid grid-cols-2 gap-2">
                {paymentOptions.map((method) => (
                  <button
                    key={method}
                    onClick={() => setPaymentMethod(method)}
                    className={`border rounded-lg py-2 px-1 text-xs sm:text-sm truncate ${
                      paymentMethod === method
                        ? "bg-green-600 text-gray-400"
                        : "bg-gray-50 text-gray-800 hover:bg-gray-100"
                    }`}
                  >
                    {method}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-red-600 text-xs">Please login to access order.</p>
          )}
        </div>

        {/* Footer Buttons */}
        <div className="p-3 sm:p-4 border-t flex gap-2">
          <Button
            onClick={handleOrder}
            className={`bg-sky-500 hover:bg-green-700 text-white text-xs sm:text-sm w-full ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Processing..." : token ? "Place Order" : "Login to Continue"}
          </Button>
          <Button
            onClick={onClose}
            className="bg-sky-950 hover:bg-gray-500 text-white text-xs sm:text-sm w-full"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;

import React, { useState } from "react";
import Button from "../common/Button";
import toast from "react-hot-toast";
import axios from "axios";

const SERVICE_FEE_PERCENT = 5;

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

    try {
      setLoading(true);

      for (let item of cartItems) {
        const payload = {
          productId: String(item.productId),
          quantity: Number(item.quantity),
          deliveryAddress: deliveryAddress.trim(),
        };

        const { data } = await axios.post(
          "http://localhost:5000/api/transactions/buy",
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (data.success) {
          const txn = data.transaction;
          toast.success(
            `Purchased "${item.title}" successfully!\n
Total: ${txn.totalPrice + (txn.platformFeeBuyer || 0)} ETB\n
Platform Fee: ${txn.platformFeeBuyer || 0} ETB\n
Net to Seller: ${txn.netSellerAmount || 0} ETB\n
Delivery: ${txn.deliveryAddress || deliveryDate.toLocaleDateString()}`
          );
        } else {
          toast.error(data.error || `Failed to purchase ${item.title}`);
        }
      }

      onOrderSuccess?.();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.error || "Server error during purchase"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div
        className="w-full max-w-xl rounded-3xl overflow-hidden shadow-2xl border border-white/20 bg-white/30 backdrop-blur-md"
        style={{
          backgroundImage: "linear-gradient(to right, #dcdcdcbb, #f0f0f0cc)",
        }}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-white/30">
          <h2 className="text-2xl font-bold text-gray-900 drop-shadow-sm">Checkout</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 text-xl transition"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 max-h-[70vh]">
          {/* Cart Items */}
          {cartItems.map((item) => (
            <div
              key={item.productId}
              className="flex items-center justify-between bg-white/40 border border-white/20 rounded-xl p-3 shadow hover:shadow-md transition"
            >
              <img
                src={item.images?.[0] || "https://via.placeholder.com/50"}
                alt={item.title}
                className="w-16 h-16 object-cover rounded-lg"
              />
              <div className="flex-1 px-4">
                <p className="font-semibold text-gray-800 truncate">{item.title}</p>
                <p className="text-gray-600 text-sm">
                  {item.quantity} × {item.price} ETB
                </p>
              </div>
              <p className="font-bold text-gray-800">
                {item.price * item.quantity} ETB
              </p>
            </div>
          ))}

          {/* Totals */}
          <div className="space-y-2 text-gray-800 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{subtotal} ETB</span>
            </div>
            <div className="flex justify-between">
              <span>Platform Fee ({SERVICE_FEE_PERCENT}%)</span>
              <span>{serviceFee.toFixed(2)} ETB</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>{shippingFee} ETB</span>
            </div>
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>{total.toFixed(2)} ETB</span>
            </div>
          </div>

          <p className="text-gray-700 text-sm">
            Delivery Date:{" "}
            <span className="font-semibold">
              {deliveryDate.toLocaleDateString()}
            </span>
          </p>

          {/* Delivery Address */}
          {token && (
            <div>
              <label className="block text-gray-800 font-semibold mb-1">
                Delivery Address
              </label>
              <input
                type="text"
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                placeholder="Enter your delivery address"
                className="w-full rounded-xl border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          {!token && (
            <p className="text-red-600 text-sm font-medium">
              Please login to place the order.
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row gap-3 p-5 border-t border-white/30 bg-white/10">
          <Button
            onClick={handleOrder}
            className={`w-full text-white font-semibold ${
              loading
                ? "opacity-60 cursor-not-allowed bg-blue-500"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
            disabled={loading}
          >
            {loading
              ? "Processing..."
              : token
              ? "Place Order"
              : "Login to Continue"}
          </Button>
          <Button
            onClick={onClose}
            className="w-full text-white bg-gray-500 hover:bg-gray-600"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;

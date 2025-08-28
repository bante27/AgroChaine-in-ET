import React, { useState } from "react";
import Button from "../common/Button";
import toast from "react-hot-toast";
import axios from "axios";

const SERVICE_FEE_PERCENT = 5;

const CheckoutModal = ({ isOpen, onClose, cartItems, shippingFee, token, onLogin, onOrderSuccess }) => {
  if (!isOpen) return null;

  const [paymentMethod, setPaymentMethod] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [loading, setLoading] = useState(false);

  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 7);

  const subtotal = cartItems.reduce((acc, i) => acc + (i.price || 0) * i.quantity, 0);
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
        const payload = {
          productId: String(item.productId),
          quantity: Number(item.quantity),
          deliveryAddress: deliveryAddress.trim(),
        };
        const response = await axios.post(
          "http://localhost:5000/api/transactions/buy",
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
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
      console.error(error);
      toast.error(error.response?.data?.error || "Server error during purchase");
    } finally {
      setLoading(false);
    }
  };

  const paymentOptions = [
    "CBE Bank", "Abay Bank", "Dashen Bank", "Awash Bank",
    "Abyssinia Bank", "Berhan Bank", "Telebirr", "M-Pesa",
  ];

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-2">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg flex flex-col max-h-[90vh] overflow-hidden">
        
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-bold text-gray-900">Checkout</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 text-sm">

          {/* Cart Items */}
          {cartItems.map((item) => (
            <div key={item.productId} className="flex items-center justify-between bg-gray-50 rounded-lg p-2 shadow-sm">
              <img
                src={item.images?.[0] ? `http://localhost:5000${item.images[0]}` : "https://via.placeholder.com/50"}
                alt={item.title}
                className="w-12 h-12 object-cover rounded"
              />
              <div className="flex-1 px-2">
                <p className="font-medium text-gray-800 truncate">{item.title}</p>
                <p className="text-gray-600 text-xs">{item.quantity} × {item.price} ETB</p>
              </div>
              <p className="font-semibold text-gray-900 text-sm">{item.price * item.quantity} ETB</p>
            </div>
          ))}

          {/* Totals */}
          <div className="space-y-1 text-gray-800">
            <div className="flex justify-between"><span>Subtotal</span><span>{subtotal} ETB</span></div>
            <div className="flex justify-between"><span>Platform Fee ({SERVICE_FEE_PERCENT}%)</span><span>{serviceFee} ETB</span></div>
            <div className="flex justify-between"><span>Shipping</span><span>{shippingFee} ETB</span></div>
            <div className="flex justify-between font-bold text-base"><span>Total</span><span>{total} ETB</span></div>
          </div>

          <p className="text-gray-700 text-sm">
            Delivery Date: <span className="font-semibold">{deliveryDate.toLocaleDateString()}</span>
          </p>

          {/* Delivery Address */}
          {token && (
            <div>
              <label className="block text-gray-800 font-semibold mb-1">Delivery Address</label>
              <input
                type="text"
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                placeholder="Enter your delivery address"
                className="w-full border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
              />
            </div>
          )}

          {/* Payment Options */}
          {token ? (
            <div>
              <h3 className="font-semibold mb-2 text-gray-800">Choose Payment Method</h3>
              <div className="grid grid-cols-2 gap-2">
                {paymentOptions.map((method) => (
                  <button
                    key={method}
                    onClick={() => setPaymentMethod(method)}
                    className={`truncate rounded-lg py-2 text-sm ${
                      paymentMethod === method
                        ? "bg-green-600 text-white"
                        : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                    }`}
                  >
                    {method}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-red-600 text-sm">Please login to access order.</p>
          )}
        </div>

        {/* Footer Buttons */}
        <div className="flex gap-2 p-4 border-t">
          <Button
            onClick={handleOrder}
            className={`w-full text-white ${loading ? "opacity-70 cursor-not-allowed" : "bg-sky-600 hover:bg-green-600"}`}
            disabled={loading}
          >
            {loading ? "Processing..." : token ? "Place Order" : "Login to Continue"}
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

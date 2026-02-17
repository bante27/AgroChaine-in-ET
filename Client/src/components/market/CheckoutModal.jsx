import React, { useState, useEffect } from "react";
import Button from "../common/Button";
import toast from "react-hot-toast";
import axios from "axios";
import { motion } from "framer-motion";
import { API_URL } from '../../utils/apiConfig';
import { useLanguage } from "../../contexts/LanguageContext";


const SERVICE_FEE_PERCENT = 5;

const CheckoutModal = ({
  isOpen,
  onClose,
  cartItems,
  shippingFee = 0,
  token,
  onLogin,
  onOrderSuccess,
}) => {
  const { t, language, transliterateName } = useLanguage();
  if (!isOpen) return null;

  const [itemQuantities, setItemQuantities] = useState({});
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [loading, setLoading] = useState(false);

  // Initialize quantities
  useEffect(() => {
    const initialQuantities = cartItems.reduce(
      (acc, item) => ({ ...acc, [item.productId]: item.quantity || 1 }),
      {}
    );
    setItemQuantities(initialQuantities);
  }, [cartItems]);

  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 7);

  // Compute totals
  const subtotal = cartItems.reduce(
    (acc, item) => acc + (item.price || 0) * (itemQuantities[item.productId] || 1),
    0
  );
  const serviceFee = (SERVICE_FEE_PERCENT / 100) * subtotal;
  const total = subtotal + serviceFee + shippingFee;

  const handleQuantityChange = (productId, value) => {
    const qty = Math.max(1, Number(value) || 1);
    setItemQuantities({ ...itemQuantities, [productId]: qty });
  };

  // Handles order submission
  const handleOrder = async () => {
    if (!token) {
      toast.error(t('marketplace.toast.loginRequired'), {
        style: { background: "#ef4444", color: "#fff", borderRadius: "8px" },
      });
      onLogin?.();
      return;
    }

    if (!deliveryAddress.trim()) {
      toast.error(t('marketplace.checkout.addressPlaceholder'), {
        style: { background: "#ef4444", color: "#fff", borderRadius: "8px" },
      });
      return;
    }

    if (!cartItems || cartItems.length === 0) {
      toast.error(t('marketplace.checkout.emptyCart'), {
        style: { background: "#ef4444", color: "#fff", borderRadius: "8px" },
      });
      return;
    }

    try {
      setLoading(true);

      // Prepare orders array
      const orders = cartItems.map((item) => ({
        productId: String(item.productId),
        quantity: itemQuantities[item.productId] || 1,
      }));

      // Validate orders before sending
      const invalidOrder = orders.find(
        (o) => !o.productId || !o.quantity || o.quantity <= 0
      );
      if (invalidOrder) {
        toast.error(t('marketplace.checkout.invalidItems'), {
          style: { background: "#ef4444", color: "#fff", borderRadius: "8px" },
        });
        setLoading(false);
        return;
      }

      const payload = { orders, deliveryAddress: deliveryAddress.trim() };

      const { data } = await axios.post(
        `${API_URL}/api/transactions/buy`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        toast.success(
          `${t('marketplace.toast.orderSuccess')} ${total.toFixed(2)} ETB`,
          {
            style: { background: "#10b981", color: "#fff", borderRadius: "8px" },
          }
        );
        onOrderSuccess?.();
        onClose();
      } else {
        toast.error(data.error || t('marketplace.toast.orderError'), {
          style: { background: "#ef4444", color: "#fff", borderRadius: "8px" },
        });
      }
    } catch (error) {
      console.error("Order Error:", error.response?.data || error.message);

      // Check if error is related to verification
      const errorMessage = error.response?.data?.error || "";
      let displayMessage;

      if (errorMessage.includes("Government ID verification") ||
        errorMessage.includes("verification pending") ||
        errorMessage.includes("not completed")) {
        displayMessage = t('marketplace.toast.verificationRequired');
      } else {
        displayMessage = errorMessage || t('marketplace.checkout.serverError');
      }

      toast.error(displayMessage, {
        style: { background: "#ef4444", color: "#fff", borderRadius: "8px" },
        duration: 5000, // Show for 5 seconds for verification errors
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        className="w-full max-w-xl rounded-2xl overflow-hidden shadow-2xl bg-white border border-gray-200"
        initial={{ y: 50 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-gray-50">
          <h2 className="text-2xl font-bold text-emerald-800 font-inter">{t('marketplace.checkout.title')}</h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-800 text-2xl transition"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {cartItems.map((item) => (
            <div
              key={item.productId}
              className="flex items-center justify-between bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition"
            >
              <img
                src={item.images?.[0] || "https://via.placeholder.com/50"}
                alt={item.title}
                className="w-20 h-20 object-cover rounded-lg"
              />
              <div className="flex-1 px-4">
                <p className="font-semibold text-gray-900 truncate">
                  {language === 'am' ? transliterateName(item.title) : item.title}
                </p>
                <div className="flex items-center gap-3 mt-2">
                  <input
                    type="number"
                    min="1"
                    value={itemQuantities[item.productId] || 1}
                    onChange={(e) => handleQuantityChange(item.productId, e.target.value)}
                    className="w-16 rounded-lg border border-gray-300 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <span className="text-gray-700 text-sm">× {item.price} ETB</span>
                </div>
              </div>
              <p className="font-bold text-emerald-700">
                {(item.price * (itemQuantities[item.productId] || 1)).toFixed(2)} ETB
              </p>
            </div>
          ))}

          {/* Totals */}
          <div className="space-y-3 text-gray-900 text-sm mt-4 bg-gray-50 p-4 rounded-xl shadow-inner">
            <div className="flex justify-between">
              <span className="font-medium">{t('marketplace.checkout.subtotal')}</span>
              <span>{subtotal.toFixed(2)} ETB</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">{t('marketplace.checkout.platformFee')} ({SERVICE_FEE_PERCENT}%)</span>
              <span>{serviceFee.toFixed(2)} ETB</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">{t('marketplace.checkout.shipping')}</span>
              <span>{shippingFee.toFixed(2)} ETB</span>
            </div>
            <div className="flex justify-between font-bold text-lg border-t border-gray-300 pt-2">
              <span>{t('marketplace.checkout.total')}</span>
              <span>{total.toFixed(2)} ETB</span>
            </div>
          </div>

          <p className="text-gray-700 text-sm mt-4">
            {t('marketplace.checkout.deliveryDate')}:{" "}
            <span className="font-semibold">{deliveryDate.toLocaleDateString()}</span>
          </p>

          {token && (
            <div className="mt-4">
              <label className="block text-gray-900 font-semibold mb-2">{t('marketplace.checkout.address')}</label>
              <input
                type="text"
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                placeholder={t('marketplace.checkout.addressPlaceholder')}
                className="w-full rounded-xl border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition duration-200"
              />
            </div>
          )}

          {!token && (
            <p className="text-red-600 text-sm font-medium mt-4">
              {t('marketplace.toast.loginRequired')}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row gap-4 p-6 border-t border-gray-200 bg-gray-50">
          <Button
            onClick={handleOrder}
            className={`w-full text-white font-semibold py-3 rounded-xl ${loading
              ? "opacity-60 cursor-not-allowed bg-emerald-500"
              : "bg-emerald-600 hover:bg-emerald-700"
              }`}
            disabled={loading}
          >
            {loading ? t('marketplace.checkout.processing') : token ? t('marketplace.checkout.placeOrder') : t('nav.login')}
          </Button>
          <Button
            onClick={onClose}
            className="w-full text-white bg-gray-500 hover:bg-gray-600 py-3 rounded-xl"
          >
            {t('marketplace.checkout.cancel')}
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CheckoutModal;

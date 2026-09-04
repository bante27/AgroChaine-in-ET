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
  onPlaceOrder,  // renamed from onOrderSuccess to match parent prop
}) => {
  const { t, language, transliterateName } = useLanguage();
  
  const [itemQuantities, setItemQuantities] = useState({});
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [loading, setLoading] = useState(false);

  // Initialize quantities when modal opens or cart changes
  useEffect(() => {
    if (cartItems && cartItems.length > 0) {
      const initialQuantities = cartItems.reduce(
        (acc, item) => ({ ...acc, [item.productId]: item.quantity || 1 }),
        {}
      );
      setItemQuantities(initialQuantities);
    }
  }, [cartItems, isOpen]);

  if (!isOpen) return null;

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
    setItemQuantities((prev) => ({ ...prev, [productId]: qty }));
  };

  const handleOrder = async () => {
    // 1. Auth Check
    if (!token) {
      toast.error(t('marketplace.toast.loginRequired'), {
        style: { background: "#ef4444", color: "#fff", borderRadius: "8px" },
      });
      onLogin?.();
      return;
    }

    // 2. Address Check
    if (!deliveryAddress.trim()) {
      toast.error(t('marketplace.checkout.addressPlaceholder'), {
        style: { background: "#ef4444", color: "#fff", borderRadius: "8px" },
      });
      return;
    }

    // 3. Cart Integrity Check
    if (!cartItems || cartItems.length === 0) {
      toast.error(t('marketplace.checkout.emptyCart'), {
        style: { background: "#ef4444", color: "#fff", borderRadius: "8px" },
      });
      return;
    }

    try {
      setLoading(true);

      // Prepare payload with explicit string IDs
      const orders = cartItems.map((item) => ({
        productId: String(item.productId),
        quantity: itemQuantities[item.productId] || 1,
      }));

      const payload = { 
        orders, 
        deliveryAddress: deliveryAddress.trim() 
      };

      // Axios Call
      const response = await axios.post(
        `${API_URL}/api/transactions/buy`,
        payload,
        { 
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          } 
        }
      );

      if (response.data.success) {
        toast.success(
          `${t('marketplace.toast.orderSuccess')} ${total.toFixed(2)} ETB`,
          { style: { background: "#10b981", color: "#fff", borderRadius: "8px" } }
        );
        // Call the parent's onPlaceOrder (which clears cart and redirects)
        onPlaceOrder?.();
        onClose(); // close modal after success
      }
    } catch (error) {
      console.error("Order Execution Failed:", error.response?.data || error.message);
      
      const serverError = error.response?.data?.error;
      
      // Smart error messaging
      let displayMessage = t('marketplace.checkout.serverError');
      
      if (serverError) {
        if (serverError.includes("balance")) {
          displayMessage = "Insufficient Wallet Balance!";
        } else if (serverError.includes("stock")) {
          displayMessage = "One or more items went out of stock.";
        } else {
          displayMessage = serverError;
        }
      }

      toast.error(displayMessage, {
        style: { background: "#ef4444", color: "#fff", borderRadius: "8px" },
        duration: 4000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
    >
      <motion.div
        className="w-full max-w-xl rounded-2xl overflow-hidden shadow-2xl bg-white border border-gray-200"
        initial={{ y: 50, scale: 0.95 }}
        animate={{ y: 0, scale: 1 }}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-2xl font-bold text-emerald-900">{t('marketplace.checkout.title')}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition text-xl">✕</button>
        </div>

        {/* Product List */}
        <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
          {cartItems.map((item) => (
            <div key={item.productId} className="flex items-center gap-4 bg-gray-50 p-3 rounded-xl border border-gray-100">
              <img
                src={item.images?.[0] || "/placeholder-product.png"}
                alt={item.title}
                className="w-16 h-16 object-cover rounded-lg shadow-sm"
              />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-800 truncate">
                  {language === 'am' ? transliterateName(item.title) : item.title}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="number"
                    min="1"
                    value={itemQuantities[item.productId] || 1}
                    onChange={(e) => handleQuantityChange(item.productId, e.target.value)}
                    className="w-12 rounded border border-gray-300 px-1 py-0.5 text-center text-sm focus:ring-1 focus:ring-emerald-500 outline-none"
                  />
                  <span className="text-gray-500 text-sm">@ {item.price} ETB</span>
                </div>
              </div>
              <p className="font-bold text-emerald-700 whitespace-nowrap">
                {(item.price * (itemQuantities[item.productId] || 1)).toFixed(2)} ETB
              </p>
            </div>
          ))}

          {/* Pricing Breakdown */}
          <div className="mt-6 pt-4 border-t border-gray-100 space-y-2">
            <div className="flex justify-between text-gray-600 text-sm">
              <span>{t('marketplace.checkout.subtotal')}</span>
              <span>{subtotal.toFixed(2)} ETB</span>
            </div>
            <div className="flex justify-between text-gray-600 text-sm">
              <span>{t('marketplace.checkout.platformFee')} ({SERVICE_FEE_PERCENT}%)</span>
              <span>{serviceFee.toFixed(2)} ETB</span>
            </div>
            {shippingFee > 0 && (
              <div className="flex justify-between text-gray-600 text-sm">
                <span>{t('marketplace.checkout.shipping')}</span>
                <span>{shippingFee.toFixed(2)} ETB</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-xl text-emerald-900 pt-2 border-t border-dashed">
              <span>{t('marketplace.checkout.total')}</span>
              <span>{total.toFixed(2)} ETB</span>
            </div>
          </div>

          {/* Delivery Address Input */}
          <div className="mt-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {t('marketplace.checkout.address')}
            </label>
            <textarea
              rows="2"
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
              placeholder={t('marketplace.checkout.addressPlaceholder')}
              className="w-full rounded-xl border border-gray-300 px-4 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row gap-3">
          <Button
            onClick={handleOrder}
            disabled={loading}
            className={`flex-1 py-3 rounded-xl font-bold text-white transition ${
              loading ? "bg-emerald-400 cursor-wait" : "bg-emerald-600 hover:bg-emerald-700 active:scale-95"
            }`}
          >
            {loading ? t('marketplace.checkout.processing') : t('marketplace.checkout.placeOrder')}
          </Button>
          <Button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl font-bold bg-white border border-gray-300 text-gray-700 hover:bg-gray-100"
          >
            {t('marketplace.checkout.cancel')}
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CheckoutModal;
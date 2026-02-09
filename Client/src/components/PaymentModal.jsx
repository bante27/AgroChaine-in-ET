import React, { useState } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import { Smartphone, Banknote, Wallet } from "lucide-react";
import Button from "./Button";
import toast from "react-hot-toast";
import { API_URL } from '../utils/apiConfig';


const PaymentModal = ({ isOpen, onClose, onPaymentSuccess }) => {
  const { t } = useLanguage();
  const [amount, setAmount] = useState("");
  const [selectedMethod, setSelectedMethod] = useState("cbe");
  const [loading, setLoading] = useState(false);

  const paymentMethods = [
    { value: "cbe", label: "Commercial Bank of Ethiopia", icon: Banknote, active: "border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300" },
    { value: "dashen", label: "Dashen Bank", icon: Banknote, active: "border-purple-500 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300" },
    { value: "abyssinia", label: "Abyssinia Bank", icon: Banknote, active: "border-teal-500 bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300" },
    { value: "telebirr", label: "Telebirr", icon: Wallet, active: "border-yellow-500 bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300" },
    { value: "safaricom", label: "Safaricom M-Pesa", icon: Smartphone, active: "border-green-500 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300" },
    { value: "Awash", label: "Awash Bank", icon: Wallet, active: "border-red-500 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300" },
    { value: "zemen", label: "Zemen Bank", icon: Wallet, active: "border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300" },
    { value: "Abay", label: "Abay Bank", icon: Wallet, active: "border-green-500 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300" }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) {
      toast.error(t('nav.payment.enterAmount'));
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error(t('marketplace.toast.loginRequired'));

      const response = await fetch(`${API_URL}/api/users/add-balance`, {
        method: "POST",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount: parseFloat(amount), paymentMethod: selectedMethod }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || t('nav.payment.paymentFailed'));
      }

      const data = await response.json();
      toast.success(`+${amount} ETB ${t('nav.payment.addedVia')} ${selectedMethod.toUpperCase()}`);
      onPaymentSuccess(data.balance);
      onClose();
    } catch (error) {
      toast.error(error.message || t('nav.payment.paymentError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center px-2 sm:px-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-4 w-full max-w-md sm:max-w-sm shadow-xl border border-gray-200 dark:border-gray-700"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 text-center">
              {t('nav.payment.title')}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('nav.payment.amount')}
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-gray-100 text-sm"
                  placeholder={t('nav.payment.enterAmount')}
                  min="1"
                  step="0.01"
                  required
                />
              </div>

              {/* Payment Methods */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('nav.payment.method')}
                </label>
                <div className="flex flex-wrap gap-2">
                  {paymentMethods.map((method) => (
                    <button
                      key={method.value}
                      type="button"
                      onClick={() => setSelectedMethod(method.value)}
                      className={`flex-1 min-w-[45%] sm:min-w-[30%] flex flex-col items-center p-3 rounded-lg border-2 text-xs sm:text-sm transition-all ${selectedMethod === method.value
                        ? method.active
                        : "border-gray-200 dark:border-gray-600 hover:border-gray-400 text-gray-900 dark:text-gray-100"
                        }`}
                    >
                      <method.icon className="h-5 w-5 mb-1" />
                      {method.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm font-medium transition-colors disabled:bg-blue-400"
                disabled={loading}
              >
                {loading ? t('nav.payment.processing') : t('nav.payment.payNow')}
              </Button>
            </form>

            <Button
              variant="outline"
              className="w-full mt-3 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 py-2 rounded-lg text-sm"
              onClick={onClose}
            >
              {t('nav.payment.cancel')}
            </Button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PaymentModal;

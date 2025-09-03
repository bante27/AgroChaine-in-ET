import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Smartphone, Banknote, Wallet } from "lucide-react";
import Button from "./Button";
import toast from "react-hot-toast";

const PaymentModal = ({ isOpen, onClose, onPaymentSuccess }) => {
  const [amount, setAmount] = useState("");
  const [selectedMethod, setSelectedMethod] = useState("cbe");
  const [loading, setLoading] = useState(false);

  const paymentMethods = [
    { value: "cbe", label: "Commercial Bank of Ethiopia", icon: Banknote, color: "blue" },
    { value: "dashen", label: "Dashen Bank", icon: Banknote, color: "purple" },
    { value: "abyssinia", label: "Abyssinia Bank", icon: Banknote, color: "teal" },
    { value: "telebirr", label: "Telebirr", icon: Wallet, color: "yellow" },
    { value: "safaricom", label: "Safaricom M-Pesa", icon: Smartphone, color: "green" },
    { value: "dashen", label: "Dashen Bank", icon: Banknote, color: "purple" },
    
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) {
      toast.error("Please enter a valid amount greater than 0 ETB");
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Authentication required. Please log in.");

      const response = await fetch("http://157.245.187.246:5000/api/users/add-balance", {
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
        throw new Error(errorData.message || "Payment request failed");
      }

      const data = await response.json();
      toast.success(`+${amount} ETB added via ${selectedMethod.toUpperCase()}`);
      onPaymentSuccess(data.balance);
      onClose();
    } catch (error) {
      toast.error(error.message || "Payment failed. Try again.");
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
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-4 w-full max-w-sm shadow-xl border border-gray-200 dark:border-gray-700"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 text-center">
              Add Balance
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Amount (ETB)
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-gray-100 text-sm"
                  placeholder="Enter amount"
                  min="1"
                  step="0.01"
                  required
                />
              </div>

              {/* Payment Methods */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Payment Method
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {paymentMethods.map((method) => (
                    <button
                      key={method.value}
                      type="button"
                      onClick={() => setSelectedMethod(method.value)}
                      className={`flex flex-col items-center p-3 rounded-lg border-2 text-xs sm:text-sm transition-all ${
                        selectedMethod === method.value
                          ? `border-${method.color}-500 bg-${method.color}-50 dark:bg-${method.color}-900/30 text-${method.color}-700 dark:text-${method.color}-300`
                          : "border-gray-200 dark:border-gray-600 hover:border-gray-400 text-gray-900 dark:text-gray-100"
                      }`}
                    >
                      <method.icon
                        className={`h-5 w-5 mb-1 ${
                          selectedMethod === method.value
                            ? `text-${method.color}-600 dark:text-${method.color}-400`
                            : `text-${method.color}-500 dark:text-${method.color}-400`
                        }`}
                      />
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
                {loading ? "Processing..." : "Pay Now"}
              </Button>
            </form>

            <Button
              variant="outline"
              className="w-full mt-3 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 py-2 rounded-lg text-sm"
              onClick={onClose}
            >
              Cancel
            </Button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PaymentModal;

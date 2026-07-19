import React, { useState } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { Smartphone, Banknote, Wallet, X, CheckCircle2, ShieldCheck } from "lucide-react";
import Button from "./Button";
import toast from "react-hot-toast";
import axios from "axios";
import { API_URL } from '../utils/apiConfig';

const PaymentModal = ({ isOpen, onClose, onPaymentSuccess }) => {
  const { t } = useLanguage();
  const [amount, setAmount] = useState("");
  const [selectedMethod, setSelectedMethod] = useState("telebirr");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const paymentMethods = [
    { value: "cbe", label: "CBE", icon: Banknote },
    { value: "telebirr", label: "Telebirr", icon: Wallet },
    { value: "abyssinia", label: "BoA", icon: Banknote },
    { value: "dashen", label: "Dashen", icon: Banknote },
    { value: "safaricom", label: "M-Pesa", icon: Smartphone },
    { value: "awash", label: "Awash", icon: Wallet }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!amount || parseFloat(amount) <= 0) {
      toast.error(t('nav.payment.enterAmount') || "Enter a valid amount");
      return;
    }

    setLoading(true);

    try {
      const token = sessionStorage.getItem("token");
      if (!token) {
        toast.error(t('marketplace.toast.loginRequired') || "Please login again");
        return;
      }

      const response = await axios.post(
        `${API_URL}/api/users/add-balance`,
        { 
          amount: parseFloat(amount), 
          paymentMethod: selectedMethod.toLowerCase() 
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      toast.success(`${amount} ETB Added!`);
      if (onPaymentSuccess) onPaymentSuccess(response.data.balance);
      setAmount("");
      onClose();

    } catch (error) {
      console.error('Payment error:', error);
      
      if (error.response?.status === 401) {
        // 401 Fix: Force the user to refresh their token
        toast.error("Session Expired: Please Log Out and Log In again.");
      } else if (error.response?.status === 404) {
        toast.error("Server Route Not Found (404). Check Backend.");
      } else {
        const errorMsg = error.response?.data?.message || error.response?.data?.error || "Payment Failed";
        toast.error(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-[2px] z-[100] flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 w-full max-w-[360px] rounded-2xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-800">
        
        <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            {t('nav.payment.title') || "Add Balance"}
          </h2>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full text-gray-400">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-5">
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase text-gray-400 ml-1">
              {t('nav.payment.amount') || "Amount (ETB)"}
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-3.5 rounded-xl bg-gray-100 dark:bg-gray-800 border-2 border-transparent focus:border-blue-500 outline-none text-xl font-bold dark:text-white"
              placeholder="0.00"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase text-gray-400 ml-1">
              {t('nav.payment.method') || "Select Bank"}
            </label>
            <div className="grid grid-cols-2 gap-2">
              {paymentMethods.map((method) => {
                const isSelected = selectedMethod === method.value;
                return (
                  <button
                    key={method.value}
                    type="button"
                    onClick={() => setSelectedMethod(method.value)}
                    className={`flex items-center gap-2 p-3 rounded-xl border-2 transition-all ${
                      isSelected 
                      ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20" 
                      : "border-transparent bg-gray-100 dark:bg-gray-800"
                    }`}
                  >
                    <method.icon size={16} className={isSelected ? "text-blue-600" : "text-gray-400"} />
                    <span className={`text-xs font-bold ${isSelected ? "text-blue-700 dark:text-blue-400" : "text-gray-500"}`}>
                      {method.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 transition-all"
          >
            {loading ? "Processing..." : (t('nav.payment.payNow') || "Deposit Now")}
          </button>

          <div className="flex items-center justify-center gap-1.5 text-[10px] text-gray-400 uppercase font-medium">
            <ShieldCheck size={12} className="text-green-500" />
            {t('nav.payment.secure') || "Secured by TLS Encryption"}
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentModal;
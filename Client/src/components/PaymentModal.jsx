import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, Banknote, Smartphone } from 'lucide-react';
import Button from './Button';
import toast from 'react-hot-toast';

const PaymentModal = ({ isOpen, onClose, onPaymentSuccess }) => {
  const [amount, setAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('chapa');
  const [loading, setLoading] = useState(false);

  const paymentMethods = [
    { value: 'chapa', label: 'Chapa', icon: CreditCard, color: 'blue' },
    { value: 'telebirr', label: 'Telebirr', icon: Smartphone, color: 'green' },
    { value: 'bank', label: 'Bank Transfer (CBE)', icon: Banknote, color: 'purple' },
    { value: 'card', label: 'Credit/Debit Card', icon: CreditCard, color: 'yellow' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch('http://localhost:5000/api/users/add-balance', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: parseFloat(amount)
        })
      });

      if (!response.ok) {
        throw new Error('Payment request failed');
      }

      const data = await response.json();
      toast.success(data.message || `Successfully added ${amount} ETB via ${selectedMethod.toUpperCase()}`);
      onPaymentSuccess(data.balance);
      onClose();
    } catch (error) {
      toast.error(error.message || 'Payment failed. Please try again.');
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
          className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.3, type: 'spring' }}
            className="bg-white dark:bg-gray-900 rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl border border-gray-200/50 dark:border-gray-800/50"
            onClick={e => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Add Balance</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Amount (ETB)</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-gray-200"
                  placeholder="Enter amount"
                  min="1"
                  step="0.01"
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Payment Method</label>
                <div className="grid grid-cols-2 gap-3">
                  {paymentMethods.map((method) => (
                    <button
                      key={method.value}
                      type="button"
                      onClick={() => setSelectedMethod(method.value)}
                      className={`flex flex-col items-center p-3 rounded-xl border-2 transition-all duration-200 ${
                        selectedMethod === method.value
                          ? `border-${method.color}-500 bg-${method.color}-100/50 dark:bg-${method.color}-900/30`
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                    >
                      <method.icon className={`h-6 w-6 text-${method.color}-600 mb-2`} />
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-200">{method.label}</span>
                    </button>
                  ))}
                </div>
              </div>
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Pay Now'}
              </Button>
            </form>
            <Button
              variant="outline"
              className="w-full mt-3 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
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
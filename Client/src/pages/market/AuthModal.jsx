//A component for the login/register modal.
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import Button from '../../components/common/Button';

const CartSidebar = ({ isOpen, onClose, cartItems, navigate }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed top-0 right-0 w-80 h-full bg-white shadow-lg z-50 overflow-y-auto p-6"
        >
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
            <X className="h-6 w-6" />
          </button>
          <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
          {cartItems.length === 0 ? (
            <p className="text-gray-600">Your cart is empty</p>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item, i) => (
                <div key={i} className="flex space-x-4">
                  <img
                    src={item.images && item.images[0] ? `http://localhost:5000${item.images[0]}` : 'https://via.placeholder.com/300'}
                    alt={item.title}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div>
                    <p className="font-semibold">{item.title}</p>
                    <p>{item.price} ETB x {item.quantity}</p>
                  </div>
                </div>
              ))}
              <Button onClick={() => navigate('/checkout')} className="w-full bg-green-600 hover:bg-green-700">
                Checkout
              </Button>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CartSidebar;
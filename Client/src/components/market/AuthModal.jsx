import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import Button from "../common/Button";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../contexts/LanguageContext";

const AuthModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const redirectToLogin = () => {
    onClose();          // close modal
    navigate("/Login"); // redirect to main login page
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-xl w-full max-w-xs sm:max-w-sm p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Header */}
            <h2 className="text-xl sm:text-2xl font-bold mb-4 text-black text-center">
              {t('marketplace.auth.title')}
            </h2>
            <p className="text-gray-600 mb-6 text-center text-sm">
              {t('marketplace.auth.subtitle')}
            </p>

            {/* Buttons */}
            <div className="flex flex-col gap-3">
              <Button
                onClick={redirectToLogin} // redirect to login page
                className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm"
              >
                {t('marketplace.auth.login')}
              </Button>
              <Button
                onClick={redirectToLogin} // redirect to login/registration page
                variant="outline"
                className="w-full text-sm"
              >
                {t('marketplace.auth.register')}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;

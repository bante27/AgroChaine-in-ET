import { useState, useEffect, useRef } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import Button from "./Button";

const ProductUploadModal = ({ isOpen, onClose, onSubmit }) => {
  const { t } = useLanguage();
  const [product, setProduct] = useState({
    title: "",
    price: "",
    originAddress: "",
    quantity: "",
    description: "",
    type: "",
    images: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const modalRef = useRef(null);

  // Handle click outside to close modal
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 6) {
      toast.error(t('dashboard.productUpload.maxImages'));
      return;
    }
    setProduct({ ...product, images: files });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !product.title ||
      !product.price ||
      !product.originAddress ||
      !product.type ||
      !product.quantity
    ) {
      toast.error(t('dashboard.productUpload.fillRequired'));
      return;
    }
    setIsLoading(true);
    try {
      const formData = new FormData();
      Object.entries(product).forEach(([key, value]) => {
        if (key === "images") {
          value.forEach((image) => formData.append("images", image));
        } else if (value) {
          formData.append(key, value);
        }
      });

      await onSubmit(formData);
      setProduct({
        title: "",
        price: "",
        originAddress: "",
        quantity: "",
        description: "",
        type: "",
        images: [],
      });
      toast.success(t('dashboard.productUpload.uploadSuccess'));
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.error || t('dashboard.productUpload.uploadFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/50 backdrop-blur-sm">
      <motion.div
        ref={modalRef}
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 30 }}
        transition={{ duration: 0.3, type: "spring" }}
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-4 sm:p-6 w-full max-w-[95vw] sm:max-w-lg overflow-y-auto max-h-[90vh]"
      >
        <h2 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white mb-4 text-center">
          {t('dashboard.productUpload.title')}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
          {/* Product Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('dashboard.productUpload.productTitle')}
            </label>
            <input
              type="text"
              value={product.title}
              onChange={(e) => setProduct({ ...product, title: e.target.value })}
              placeholder={t('dashboard.productUpload.enterTitle')}
              required
              disabled={isLoading}
              className="w-full rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('dashboard.productUpload.type')}
            </label>
            <select
              value={product.type}
              onChange={(e) => setProduct({ ...product, type: e.target.value })}
              required
              disabled={isLoading}
              className="w-full rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">{t('dashboard.productUpload.selectType')}</option>
              <option value="vegetable">{t('dashboard.productUpload.types.vegetable')}</option>
              <option value="fruit">{t('dashboard.productUpload.types.fruit')}</option>
              <option value="grain">{t('dashboard.productUpload.types.grain')}</option>
              <option value="dairy">{t('dashboard.productUpload.types.dairy')}</option>
              <option value="other">{t('dashboard.productUpload.types.other')}</option>
            </select>
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('dashboard.productUpload.price')}
            </label>
            <input
              type="number"
              value={product.price}
              onChange={(e) => setProduct({ ...product, price: e.target.value })}
              placeholder="0.00"
              required
              disabled={isLoading}
              className="w-full rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              min="0"
              step="0.01"
            />
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('dashboard.productUpload.quantity')}
            </label>
            <input
              type="number"
              value={product.quantity}
              onChange={(e) => setProduct({ ...product, quantity: e.target.value })}
              placeholder="0"
              required
              disabled={isLoading}
              className="w-full rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              min="0"
              step="0.01"
            />
          </div>

          {/* Origin Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('dashboard.productUpload.originAddress')}
            </label>
            <input
              type="text"
              value={product.originAddress}
              onChange={(e) => setProduct({ ...product, originAddress: e.target.value })}
              placeholder={t('dashboard.productUpload.enterAddress')}
              required
              disabled={isLoading}
              className="w-full rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Images */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('dashboard.productUpload.images')}
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              disabled={isLoading}
              className="w-full text-sm text-gray-600 dark:text-gray-300 file:mr-3 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-green-600 file:text-white hover:file:bg-green-700 cursor-pointer"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('dashboard.productUpload.description')}
            </label>
            <textarea
              value={product.description}
              onChange={(e) => setProduct({ ...product, description: e.target.value })}
              placeholder={t('dashboard.productUpload.describeProduct')}
              disabled={isLoading}
              rows={4}
              className="w-full rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-3">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-green-500 hover:text-green-600"
            >
              {t('dashboard.productUpload.cancel')}
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold"
            >
              {isLoading ? t('dashboard.productUpload.uploading') : t('dashboard.productUpload.upload')}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default ProductUploadModal;
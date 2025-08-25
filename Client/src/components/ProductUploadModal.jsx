// src/components/ProductUploadModal.jsx
import { useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import Button from "./Button";

const ProductUploadModal = ({ isOpen, onClose, onSubmit }) => {
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

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 6) {
      toast.error("Maximum 6 images allowed");
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
      toast.error("Please fill in all required fields");
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
      toast.success("Product uploaded successfully");
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.error || "Product upload failed");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 sm:p-2">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 30 }}
        transition={{ duration: 0.3, type: "spring" }}
        className="bg-white dark:bg-gray-900 rounded-2xl p-6 sm:p-4 w-full sm:max-w-sm md:max-w-md lg:max-w-lg shadow-2xl border border-gray-200 dark:border-gray-700 overflow-y-auto max-h-[90vh]"
      >
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-4 text-center">
          Upload Product
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3" encType="multipart/form-data">
          {/* Product Title */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
              Product Title
            </label>
            <input
              type="text"
              value={product.title}
              onChange={(e) => setProduct({ ...product, title: e.target.value })}
              className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 px-3 py-2 text-sm focus:ring-2 focus:ring-green-500"
              placeholder="Enter product title"
              required
              disabled={isLoading}
            />
          </div>

          {/* Type */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
              Type
            </label>
            <select
              value={product.type}
              onChange={(e) => setProduct({ ...product, type: e.target.value })}
              className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 text-sm focus:ring-2 focus:ring-green-500"
              required
              disabled={isLoading}
            >
              <option value="">Select Type</option>
              <option value="vegetable">Vegetable</option>
              <option value="fruit">Fruit</option>
              <option value="grain">Grain</option>
              <option value="dairy">Dairy</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Price */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
              Price (ETB)
            </label>
            <input
              type="number"
              value={product.price}
              onChange={(e) => setProduct({ ...product, price: e.target.value })}
              className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 text-sm focus:ring-2 focus:ring-green-500"
              placeholder="0.00"
              required
              disabled={isLoading}
            />
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
              Quantity (kg)
            </label>
            <input
              type="number"
              value={product.quantity}
              onChange={(e) => setProduct({ ...product, quantity: e.target.value })}
              className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 text-sm focus:ring-2 focus:ring-green-500"
              placeholder="0"
              required
              disabled={isLoading}
            />
          </div>

          {/* Origin Address */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
              Origin Address
            </label>
            <input
              type="text"
              value={product.originAddress}
              onChange={(e) => setProduct({ ...product, originAddress: e.target.value })}
              className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 text-sm focus:ring-2 focus:ring-green-500"
              placeholder="Enter origin address"
              required
              disabled={isLoading}
            />
          </div>

          {/* Images */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
              Images (max 6)
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="w-full text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl p-2 file:mr-2 file:py-1 file:px-2 file:rounded-lg file:border-0 file:bg-green-600 file:text-white hover:file:bg-green-700"
              disabled={isLoading}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
              Description
            </label>
            <textarea
              value={product.description}
              onChange={(e) => setProduct({ ...product, description: e.target.value })}
              className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 resize-none"
              rows={3}
              placeholder="Describe your product..."
              disabled={isLoading}
            />
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-2 pt-2">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? "Uploading..." : "Upload"}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default ProductUploadModal;

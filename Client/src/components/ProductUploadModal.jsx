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
    <div className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center z-50 p-4 sm:p-2">
      <motion.div
        initial={{ opacity: 0, scale: 0.85, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.85, y: 30 }}
        transition={{ duration: 0.35, type: "spring" }}
        className="bg-gradient-to-br from-gray-900 to-black rounded-3xl p-8 sm:p-6 w-full sm:max-w-md md:max-w-lg shadow-[0_0_20px_rgba(0,0,0,0.9)] border border-gray-800 overflow-y-auto max-h-[90vh]"
      >
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-6 text-center tracking-wide drop-shadow-lg">
          Upload Product
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5" encType="multipart/form-data">
          {/* Product Title */}
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1 tracking-wide uppercase">
              Product Title
            </label>
            <input
              type="text"
              value={product.title}
              onChange={(e) => setProduct({ ...product, title: e.target.value })}
              placeholder="Enter product title"
              required
              disabled={isLoading}
              className="w-full rounded-2xl bg-gray-900 border border-gray-700 text-white placeholder-gray-500 px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-green-500 shadow-inner transition"
            />
          </div>

          {/* Type */}
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1 tracking-wide uppercase">
              Type
            </label>
            <select
              value={product.type}
              onChange={(e) => setProduct({ ...product, type: e.target.value })}
              required
              disabled={isLoading}
              className="w-full rounded-2xl bg-gray-900 border border-gray-700 text-white px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-green-500 shadow-inner transition"
            >
              <option value="" className="text-gray-500">Select Type</option>
              <option value="vegetable">Vegetable</option>
              <option value="fruit">Fruit</option>
              <option value="grain">Grain</option>
              <option value="dairy">Dairy</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Price */}
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1 tracking-wide uppercase">
              Price (ETB)
            </label>
            <input
              type="number"
              value={product.price}
              onChange={(e) => setProduct({ ...product, price: e.target.value })}
              placeholder="0.00"
              required
              disabled={isLoading}
              className="w-full rounded-2xl bg-gray-900 border border-gray-700 text-white px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-green-500 shadow-inner transition"
              min="0"
              step="0.01"
            />
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1 tracking-wide uppercase">
              Quantity (kg)
            </label>
            <input
              type="number"
              value={product.quantity}
              onChange={(e) => setProduct({ ...product, quantity: e.target.value })}
              placeholder="0"
              required
              disabled={isLoading}
              className="w-full rounded-2xl bg-gray-900 border border-gray-700 text-white px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-green-500 shadow-inner transition"
              min="0"
              step="0.01"
            />
          </div>

          {/* Origin Address */}
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1 tracking-wide uppercase">
              Origin Address
            </label>
            <input
              type="text"
              value={product.originAddress}
              onChange={(e) => setProduct({ ...product, originAddress: e.target.value })}
              placeholder="Enter origin address"
              required
              disabled={isLoading}
              className="w-full rounded-2xl bg-gray-900 border border-gray-700 text-white px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-green-500 shadow-inner transition"
            />
          </div>

          {/* Images */}
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1 tracking-wide uppercase">
              Images (max 6)
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              disabled={isLoading}
              className="w-full rounded-2xl bg-gray-900 border border-gray-700 text-white px-4 py-2 text-sm font-semibold cursor-pointer shadow-inner file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-green-600 file:text-white file:font-bold file:hover:bg-green-700 transition"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1 tracking-wide uppercase">
              Description
            </label>
            <textarea
              value={product.description}
              onChange={(e) => setProduct({ ...product, description: e.target.value })}
              placeholder="Describe your product..."
              disabled={isLoading}
              rows={4}
              className="w-full rounded-2xl bg-gray-900 border border-gray-700 text-white px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-green-500 shadow-inner resize-none transition"
            />
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 border-gray-600 text-gray-400 hover:text-green-500 hover:border-green-500 transition font-semibold"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-extrabold transition"
            >
              {isLoading ? "Uploading..." : "Upload"}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default ProductUploadModal;

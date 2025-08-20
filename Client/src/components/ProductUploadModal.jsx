// src/components/ProductUploadModal.jsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import Button from './Button';

const ProductUploadModal = ({ isOpen, onClose, onSubmit }) => {
  const [product, setProduct] = useState({
    title: '', price: '', originAddress: '', quantity: '', description: '', type: '', images: [],
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 6) {
      toast.error('Maximum 6 images allowed');
      return;
    }
    setProduct({ ...product, images: files });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!product.title || !product.price || !product.originAddress || !product.type || !product.quantity) {
      toast.error('Please fill in all required fields');
      return;
    }
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', product.title);
      formData.append('price', product.price);
      formData.append('originAddress', product.originAddress);
      formData.append('type', product.type);
      formData.append('quantity', product.quantity);
      if (product.description) formData.append('description', product.description);
      product.images.forEach((image) => formData.append('images', image));
      await onSubmit(formData);
      setProduct({ title: '', price: '', originAddress: '', quantity: '', description: '', type: '', images: [] });
      toast.success('Product uploaded successfully');
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Product upload failed');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 50 }}
        transition={{ duration: 0.4, type: 'spring' }}
        className="bg-gradient-to-br from-slate-900 via-green-900 to-slate-900 rounded-2xl sm:rounded-3xl p-4 sm:p-8 w-full max-w-sm sm:max-w-2xl shadow-2xl border border-white/10 max-h-[80vh] sm:max-h-[90vh] overflow-y-auto"
      >
        <h2 className="text-xl sm:text-3xl font-bold text-white mb-4 sm:mb-6 text-center">Upload Product</h2>
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6" encType="multipart/form-data">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-200 mb-1 sm:mb-2">Product Title</label>
              <input
                type="text"
                value={product.title}
                onChange={(e) => setProduct({ ...product, title: e.target.value })}
                className="w-full rounded-xl border-0 bg-white/10 backdrop-blur-sm text-white placeholder-gray-300 px-3 sm:px-4 py-2 sm:py-3 focus:ring-2 focus:ring-green-500 focus:bg-white/20 transition-all"
                placeholder="Enter product title"
                required
                disabled={isLoading}
              />
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-200 mb-1 sm:mb-2">Type</label>
              <select
                value={product.type}
                onChange={(e) => setProduct({ ...product, type: e.target.value })}
                className="w-full rounded-xl border-0 bg-white/10 backdrop-blur-sm text-white px-3 sm:px-4 py-2 sm:py-3 focus:ring-2 focus:ring-green-500 focus:bg-white/20 transition-all"
                required
                disabled={isLoading}
              >
                <option value="" className="bg-gray-800">Select Type</option>
                <option value="vegetable" className="bg-gray-800">Vegetable</option>
                <option value="fruit" className="bg-gray-800">Fruit</option>
                <option value="grain" className="bg-gray-800">Grain</option>
                <option value="other" className="bg-gray-800">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-200 mb-1 sm:mb-2">Price (ETB)</label>
              <input
                type="number"
                value={product.price}
                onChange={(e) => setProduct({ ...product, price: e.target.value })}
                className="w-full rounded-xl border-0 bg-white/10 backdrop-blur-sm text-white placeholder-gray-300 px-3 sm:px-4 py-2 sm:py-3 focus:ring-2 focus:ring-green-500 focus:bg-white/20 transition-all"
                placeholder="0.00"
                required
                disabled={isLoading}
              />
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-200 mb-1 sm:mb-2">Quantity (kg)</label>
              <input
                type="number"
                value={product.quantity}
                onChange={(e) => setProduct({ ...product, quantity: e.target.value })}
                className="w-full rounded-xl border-0 bg-white/10 backdrop-blur-sm text-white placeholder-gray-300 px-3 sm:px-4 py-2 sm:py-3 focus:ring-2 focus:ring-green-500 focus:bg-white/20 transition-all"
                placeholder="0"
                required
                disabled={isLoading}
              />
            </div>
          </div>
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-gray-200 mb-1 sm:mb-2">Origin Address</label>
            <input
              type="text"
              value={product.originAddress}
              onChange={(e) => setProduct({ ...product, originAddress: e.target.value })}
              className="w-full rounded-xl border-0 bg-white/10 backdrop-blur-sm text-white placeholder-gray-300 px-3 sm:px-4 py-2 sm:py-3 focus:ring-2 focus:ring-green-500 focus:bg-white/20 transition-all"
              placeholder="Enter origin address"
              required
              disabled={isLoading}
            />
          </div>
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-gray-200 mb-1 sm:mb-2">Images (up to 6)</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="w-full text-gray-300 bg-white/10 rounded-xl p-2 sm:p-3 file:mr-2 sm:file:mr-4 file:py-1 sm:file:py-2 file:px-2 sm:file:px-4 file:rounded-lg file:border-0 file:bg-green-600 file:text-white hover:file:bg-green-700"
              disabled={isLoading}
            />
          </div>
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-gray-200 mb-1 sm:mb-2">Description</label>
            <textarea
              value={product.description}
              onChange={(e) => setProduct({ ...product, description: e.target.value })}
              className="w-full rounded-xl border-0 bg-white/10 backdrop-blur-sm text-white placeholder-gray-300 px-3 sm:px-4 py-2 sm:py-3 focus:ring-2 focus:ring-green-500 focus:bg-white/20 transition-all resize-none"
              rows="3 sm:rows-4"
              placeholder="Describe your product..."
              disabled={isLoading}
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 pt-2 sm:pt-4">
            <Button variant="outline" onClick={onClose} disabled={isLoading} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} variant="success" className="flex-1">
              {isLoading ? 'Uploading...' : 'Upload Product'}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default ProductUploadModal;
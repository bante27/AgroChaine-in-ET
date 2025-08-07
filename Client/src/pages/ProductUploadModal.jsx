import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Button from './common/Button';
//This component is updated to handle image uploads and send all data to the backend.
const ProductUploadModal = ({ isOpen, onClose, onSubmit }) => {
  const [product, setProduct] = useState({
    name: '',
    price: '',
    origin: '',
    quantity: '',
    type: '',
    description: '',
    productImage: null
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(product);
    setProduct({ name: '', price: '', origin: '', quantity: '', type: '', description: '', productImage: null });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }} className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Upload Product</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Product Name</label>
            <input type="text" name="name" value={product.name} onChange={handleChange} className="mt-1 w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 transition" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Price (ETB)</label>
            <input type="number" name="price" value={product.price} onChange={handleChange} className="mt-1 w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 transition" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Origin (Place)</label>
            <input type="text" name="origin" value={product.origin} onChange={handleChange} className="mt-1 w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 transition" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Quantity (kg)</label>
            <input type="number" name="quantity" value={product.quantity} onChange={handleChange} className="mt-1 w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 transition" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Type (e.g., Grain, Vegetable)</label>
            <input type="text" name="type" value={product.type} onChange={handleChange} className="mt-1 w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 transition" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea name="description" value={product.description} onChange={handleChange} className="mt-1 w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 transition" rows="4" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Product Image</label>
            <input type="file" name="productImage" accept="image/*" onChange={handleChange} className="mt-1 w-full text-gray-600" required />
          </div>
          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={onClose} type="button">Cancel</Button>
            <Button type="submit">Upload</Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default ProductUploadModal;
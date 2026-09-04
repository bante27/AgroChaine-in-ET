import React, { useState } from "react";
import { X, Upload } from "lucide-react";
import Button from "./common/Button";
import toast from "react-hot-toast";

const ProductUploadModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    originAddress: "",
    type: "",
    quantity: "",
    description: "",
    comment: "",
  });
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const resetForm = () => {
    setFormData({
      title: "",
      price: "",
      originAddress: "",
      type: "",
      quantity: "",
      description: "",
      comment: "",
    });
    setImages([]);
    setImagePreviews([]);
    setErrors({});
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    if (files.length > 5) {
      toast.error("Maximum 5 images");
      return;
    }
    setImages(files);
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title required";
    if (!formData.price) newErrors.price = "Price required";
    else if (isNaN(formData.price) || Number(formData.price) <= 0)
      newErrors.price = "Positive number";
    if (!formData.originAddress.trim())
      newErrors.originAddress = "Origin required";
    if (!formData.type) newErrors.type = "Type required";
    if (!formData.quantity) newErrors.quantity = "Quantity required";
    else if (isNaN(formData.quantity) || Number(formData.quantity) <= 0)
      newErrors.quantity = "Positive number";
    if (images.length === 0) newErrors.images = "At least 1 image";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Fill all required fields");
      return;
    }

    setLoading(true);
    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("price", formData.price);
      data.append("originAddress", formData.originAddress);
      data.append("type", formData.type);
      data.append("quantity", formData.quantity);
      if (formData.description) data.append("description", formData.description);
      if (formData.comment) data.append("comment", formData.comment);
      images.forEach((img) => data.append("images", img));

      await onSubmit(data);
      handleClose();
    } catch (error) {
      toast.error(error.response?.data?.error || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Add Product
          </h2>
          <button
            onClick={handleClose}
            className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-1">Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className={`w-full px-3 py-2 rounded-lg border ${
                errors.title ? "border-red-500" : "border-gray-300 dark:border-gray-600"
              } bg-white dark:bg-gray-800`}
              placeholder="Product name"
            />
            {errors.title && (
              <p className="text-red-500 text-xs mt-1">{errors.title}</p>
            )}
          </div>

          {/* Price & Quantity */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Price (ETB) *</label>
              <input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className={`w-full px-3 py-2 rounded-lg border ${
                  errors.price ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                }`}
                placeholder="0.00"
              />
              {errors.price && <p className="text-red-500 text-xs">{errors.price}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Quantity (KG) *</label>
              <input
                type="number"
                step="0.1"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                className={`w-full px-3 py-2 rounded-lg border ${
                  errors.quantity ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                }`}
                placeholder="0"
              />
              {errors.quantity && <p className="text-red-500 text-xs">{errors.quantity}</p>}
            </div>
          </div>

          {/* Type & Origin */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Type *</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className={`w-full px-3 py-2 rounded-lg border ${
                  errors.type ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                } bg-white dark:bg-gray-800`}
              >
                <option value="">Select</option>
                <option value="Fruit">Fruit</option>
                <option value="Vegetable">Vegetable</option>
                <option value="Grain">Grain</option>
                <option value="Dairy">Dairy</option>
                <option value="Meat">Meat</option>
                <option value="Other">Other</option>
              </select>
              {errors.type && <p className="text-red-500 text-xs">{errors.type}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Origin *</label>
              <input
                type="text"
                value={formData.originAddress}
                onChange={(e) => setFormData({ ...formData, originAddress: e.target.value })}
                className={`w-full px-3 py-2 rounded-lg border ${
                  errors.originAddress ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                }`}
                placeholder="City, Country"
              />
              {errors.originAddress && (
                <p className="text-red-500 text-xs">{errors.originAddress}</p>
              )}
            </div>
          </div>

          {/* Description (optional) */}
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600"
              placeholder="Optional"
            />
          </div>

          {/* Comment (optional) */}
          <div>
            <label className="block text-sm font-medium mb-1">Comment</label>
            <textarea
              rows={1}
              value={formData.comment}
              onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600"
              placeholder="Optional note"
            />
          </div>

          {/* Images */}
          <div>
            <label className="block text-sm font-medium mb-2">Images * (max 5)</label>
            <div
              className={`flex items-center justify-center w-full h-28 border-2 border-dashed rounded-lg cursor-pointer ${
                errors.images ? "border-red-500 bg-red-50" : "border-gray-300 hover:border-emerald-500"
              }`}
            >
              <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer">
                <Upload className="w-6 h-6 text-gray-400 mb-1" />
                <span className="text-xs text-gray-500">Upload</span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>
            {errors.images && <p className="text-red-500 text-xs mt-1">{errors.images}</p>}
            {imagePreviews.length > 0 && (
              <div className="flex gap-2 mt-3 flex-wrap">
                {imagePreviews.map((src, idx) => (
                  <div key={idx} className="w-14 h-14 rounded border overflow-hidden">
                    <img src={src} alt="preview" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 py-2 rounded-lg font-medium bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2 rounded-lg font-medium text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50"
            >
              {loading ? "Uploading..." : "Publish"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductUploadModal;
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import LiveChat from '../components/LiveChat';

//govIdFront
import {
  BarChart3,
  TrendingUp,
  Users,
  Package,
  ArrowUpRight,
  Activity,
  DollarSign,
  Upload,
  ShoppingCart,
  Camera,
  User,
  LogOut,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

// Enhanced Card Component with better styling
const Card = ({ children, hover, className = '' }) => (
  <motion.div 
    className={`bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 ${
      hover ? 'hover:shadow-2xl hover:scale-[1.02] transition-all duration-300' : ''
    } ${className}`}
    whileHover={hover ? { y: -4 } : {}}
    transition={{ duration: 0.3 }}
  >
    {children}
  </motion.div>
);

// Enhanced Button Component
const Button = ({ children, variant = 'default', size = 'default', className = '', ...props }) => {
  const baseStyles = 'font-semibold rounded-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-offset-2 transform hover:scale-105 active:scale-95';
  const variants = {
    default: 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 focus:ring-blue-500 shadow-lg hover:shadow-xl',
    outline: 'bg-white/80 backdrop-blur-sm border-2 border-gray-200 text-gray-700 hover:bg-white hover:border-blue-300 focus:ring-blue-500 shadow-md hover:shadow-lg',
    success: 'bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800 focus:ring-green-500 shadow-lg hover:shadow-xl',
  };
  const sizes = {
    default: 'px-6 py-3 text-sm',
    small: 'px-4 py-2 text-xs',
    large: 'px-8 py-4 text-base',
  };
  return (
    <button className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {children}
    </button>
  );
};

// Enhanced Verification Modal
const VerificationModal = ({ isOpen, onClose, onVerify, verificationStatus }) => {
  const [govIdFront, setGovIdFront] = useState(null);
  const [govIdBack, setGovIdBack] = useState(null);
  const [name, setName] = useState('');

  const [isFrontCameraActive, setIsFrontCameraActive] = useState(false);
  const [isBackCameraActive, setIsBackCameraActive] = useState(false);

  const videoFrontRef = useRef(null);
  const canvasFrontRef = useRef(null);

  const videoBackRef = useRef(null);
  const canvasBackRef = useRef(null);

  const [isLoading, setIsLoading] = useState(false);

  // Start/stop camera for front
  useEffect(() => {
    let stream;
    if (isFrontCameraActive) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((s) => {
          stream = s;
          if (videoFrontRef.current) videoFrontRef.current.srcObject = stream;
        })
        .catch(() => toast.error('Failed to access camera'));
    }
    return () => stream && stream.getTracks().forEach((t) => t.stop());
  }, [isFrontCameraActive]);

  // Start/stop camera for back
  useEffect(() => {
    let stream;
    if (isBackCameraActive) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((s) => {
          stream = s;
          if (videoBackRef.current) videoBackRef.current.srcObject = stream;
        })
        .catch(() => toast.error('Failed to access camera'));
    }
    return () => stream && stream.getTracks().forEach((t) => t.stop());
  }, [isBackCameraActive]);

  const dataURLtoFile = (dataUrl, filename) => {
    const arr = dataUrl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) u8arr[n] = bstr.charCodeAt(n);
    return new File([u8arr], filename, { type: mime });
  };

  const captureFrontImage = () => {
    if (videoFrontRef.current && canvasFrontRef.current) {
      const ctx = canvasFrontRef.current.getContext('2d');
      ctx.drawImage(videoFrontRef.current, 0, 0, 300, 200);
      const imageData = canvasFrontRef.current.toDataURL('image/jpeg');
      setGovIdFront(dataURLtoFile(imageData, 'id_front.jpg'));
      setIsFrontCameraActive(false);
      toast.success('Front ID captured');
    }
  };

  const captureBackImage = () => {
    if (videoBackRef.current && canvasBackRef.current) {
      const ctx = canvasBackRef.current.getContext('2d');
      ctx.drawImage(videoBackRef.current, 0, 0, 300, 200);
      const imageData = canvasBackRef.current.toDataURL('image/jpeg');
      setGovIdBack(dataURLtoFile(imageData, 'id_back.jpg'));
      setIsBackCameraActive(false);
      toast.success('Back ID captured');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!govIdFront || !govIdBack || !name) {
      toast.error('Please provide name and both ID images');
      return;
    }
    setIsLoading(true);
    try {
      // ✅ Send as FormData so backend multer can read files
      const formData = new FormData();
      formData.append('govIdFront', govIdFront);
      formData.append('govIdBack', govIdBack);
      formData.append('name', name);

      await onVerify(formData); // onVerify must send FormData directly
      setVerificationStatus('pending');
      toast.success('Verification submitted, pending review');
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 50 }}
        transition={{ duration: 0.4, type: "spring" }}
        className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 rounded-3xl p-8 w-full max-w-lg shadow-2xl border border-white/10"
      >
        <h2 className="text-3xl font-bold text-white mb-6 text-center">Verify Your Account</h2>
        {verificationStatus === 'pending' && <p className="text-yellow-400 mb-6 font-medium text-center bg-yellow-400/10 rounded-lg p-3">Verification pending...</p>}
        {verificationStatus === 'verified' && <p className="text-green-400 mb-6 font-medium text-center bg-green-400/10 rounded-lg p-3">Verified successfully!</p>}
        {verificationStatus !== 'verified' && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-200 mb-2">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border-0 bg-white/10 backdrop-blur-sm text-white placeholder-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:bg-white/20 transition-all"
                placeholder="Enter your full name"
                required
              />
            </div>

            {/* FRONT ID */}
            <div>
              <label className="block text-sm font-semibold text-gray-200 mb-2">National ID (Front)</label>
              {isFrontCameraActive ? (
                <div className="space-y-4">
                  <video ref={videoFrontRef} autoPlay className="w-full h-48 bg-gray-800 rounded-xl object-cover" />
                  <canvas ref={canvasFrontRef} width="300" height="200" className="hidden" />
                  <Button onClick={captureFrontImage} className="w-full" disabled={isLoading}>
                    <Camera className="h-5 w-5 mr-2" />
                    Capture Front
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setGovIdFront(e.target.files[0])}
                    className="w-full text-gray-300 bg-white/10 rounded-xl p-3 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                    disabled={isLoading}
                  />
                  <Button
                    onClick={() => setIsFrontCameraActive(true)}
                    variant="outline"
                    className="w-full flex items-center justify-center space-x-2"
                    disabled={isLoading}
                  >
                    <Camera className="h-5 w-5" />
                    <span>Scan with Camera</span>
                  </Button>
                </div>
              )}
            </div>

            {/* BACK ID */}
            <div>
              <label className="block text-sm font-semibold text-gray-200 mb-2">National ID (Back)</label>
              {isBackCameraActive ? (
                <div className="space-y-4">
                  <video ref={videoBackRef} autoPlay className="w-full h-48 bg-gray-800 rounded-xl object-cover" />
                  <canvas ref={canvasBackRef} width="300" height="200" className="hidden" />
                  <Button onClick={captureBackImage} className="w-full" disabled={isLoading}>
                    <Camera className="h-5 w-5 mr-2" />
                    Capture Back
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setGovIdBack(e.target.files[0])}
                    className="w-full text-gray-300 bg-white/10 rounded-xl p-3 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                    required
                    disabled={isLoading}
                  />
                  <Button
                    onClick={() => setIsBackCameraActive(true)}
                    variant="outline"
                    className="w-full flex items-center justify-center space-x-2"
                    disabled={isLoading}
                  >
                    <Camera className="h-5 w-5" />
                    <span>Scan with Camera</span>
                  </Button>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button variant="outline" onClick={onClose} disabled={isLoading} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading} className="flex-1">
                {isLoading ? 'Submitting...' : 'Submit Verification'}
              </Button>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
};

// Enhanced Product Upload Modal
const ProductUploadModal = ({ isOpen, onClose, onSubmit }) => {
  const [product, setProduct] = useState({
    title: '',
    price: '',
    originAddress: '',
    quantity: '',
    description: '',
    type: '',
    images: [],
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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 50 }}
        transition={{ duration: 0.4, type: "spring" }}
        className="bg-gradient-to-br from-slate-900 via-green-900 to-slate-900 rounded-3xl p-8 w-full max-w-2xl shadow-2xl border border-white/10 max-h-[90vh] overflow-y-auto"
      >
        <h2 className="text-3xl font-bold text-white mb-6 text-center">Upload Product</h2>
        <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-200 mb-2">Product Title</label>
              <input
                type="text"
                value={product.title}
                onChange={(e) => setProduct({ ...product, title: e.target.value })}
                className="w-full rounded-xl border-0 bg-white/10 backdrop-blur-sm text-white placeholder-gray-300 px-4 py-3 focus:ring-2 focus:ring-green-500 focus:bg-white/20 transition-all"
                placeholder="Enter product title"
                required
                disabled={isLoading}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-200 mb-2">Type</label>
              <select
                value={product.type}
                onChange={(e) => setProduct({ ...product, type: e.target.value })}
                className="w-full rounded-xl border-0 bg-white/10 backdrop-blur-sm text-white px-4 py-3 focus:ring-2 focus:ring-green-500 focus:bg-white/20 transition-all"
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
              <label className="block text-sm font-semibold text-gray-200 mb-2">Price (ETB)</label>
              <input
                type="number"
                value={product.price}
                onChange={(e) => setProduct({ ...product, price: e.target.value })}
                className="w-full rounded-xl border-0 bg-white/10 backdrop-blur-sm text-white placeholder-gray-300 px-4 py-3 focus:ring-2 focus:ring-green-500 focus:bg-white/20 transition-all"
                placeholder="0.00"
                required
                disabled={isLoading}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-200 mb-2">Quantity (kg)</label>
              <input
                type="number"
                value={product.quantity}
                onChange={(e) => setProduct({ ...product, quantity: e.target.value })}
                className="w-full rounded-xl border-0 bg-white/10 backdrop-blur-sm text-white placeholder-gray-300 px-4 py-3 focus:ring-2 focus:ring-green-500 focus:bg-white/20 transition-all"
                placeholder="0"
                required
                disabled={isLoading}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-200 mb-2">Origin Address</label>
            <input
              type="text"
              value={product.originAddress}
              onChange={(e) => setProduct({ ...product, originAddress: e.target.value })}
              className="w-full rounded-xl border-0 bg-white/10 backdrop-blur-sm text-white placeholder-gray-300 px-4 py-3 focus:ring-2 focus:ring-green-500 focus:bg-white/20 transition-all"
              placeholder="Enter origin address"
              required
              disabled={isLoading}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-200 mb-2">Images (up to 6)</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="w-full text-gray-300 bg-white/10 rounded-xl p-3 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-green-600 file:text-white hover:file:bg-green-700"
              disabled={isLoading}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-200 mb-2">Description</label>
            <textarea
              value={product.description}
              onChange={(e) => setProduct({ ...product, description: e.target.value })}
              className="w-full rounded-xl border-0 bg-white/10 backdrop-blur-sm text-white placeholder-gray-300 px-4 py-3 focus:ring-2 focus:ring-green-500 focus:bg-white/20 transition-all resize-none"
              rows="4"
              placeholder="Describe your product..."
              disabled={isLoading}
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
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

// Enhanced Profile Image Upload Modal
const ProfileImageUploadModal = ({ isOpen, onClose, onImageSave }) => {
  const [profileImage, setProfileImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      toast.success('Image selected');
    }
  };

  const handleSave = async () => {
    if (profileImage) {
      setIsLoading(true);
      try {
        await onImageSave(profileImage);
        toast.success('Profile image updated');
        onClose();
      } catch (error) {
        toast.error(error.response?.data?.error || 'Failed to update profile image');
      } finally {
        setIsLoading(false);
      }
    } else {
      toast.error('Please select an image');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 50 }}
        transition={{ duration: 0.4, type: "spring" }}
        className="bg-gradient-to-br from-white to-gray-50 rounded-3xl p-8 w-full max-w-md shadow-2xl border border-gray-200"
      >
        <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Update Profile Picture</h2>
        <div className="flex flex-col items-center space-y-6">
          <div className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-gray-200 group shadow-lg">
            {profileImage ? (
              <img src={URL.createObjectURL(profileImage)} alt="Profile Preview" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 text-gray-400">
                <User className="w-20 h-20" />
              </div>
            )}
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer"
              onClick={() => fileInputRef.current.click()}
            >
              <Camera className="w-10 h-10 text-white" />
            </div>
          </div>
          <p className="text-sm text-gray-600 text-center">Click the camera icon to upload an image.</p>
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <Button variant="outline" onClick={onClose} disabled={isLoading} className="flex-1">
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isLoading || !profileImage} className="flex-1">
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

// Enhanced Marketplace Component
const Marketplace = ({ token, onAddToCart }) => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/products', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProducts(response.data.items || []);
      } catch (error) {
        setError(error.response?.data?.error || 'Failed to load products');
        toast.error(error.response?.data?.error || 'Failed to load products');
      }
    };
    if (token) fetchProducts();
  }, [token]);

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-center py-10 text-2xl text-red-400 bg-red-400/10 rounded-2xl p-8 border border-red-400/20">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Marketplace</h2>
          <p className="text-xl text-gray-300">Discover fresh products from local farmers</p>
        </motion.div>
        
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {products.length === 0 ? (
            <div className="col-span-full text-center py-20">
              <Package className="h-20 w-20 text-gray-400 mx-auto mb-4" />
              <p className="text-xl text-gray-400">No products available at the moment.</p>
            </div>
          ) : (
            products.map((product, index) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card hover className="h-full flex flex-col">
                  <div className="relative overflow-hidden rounded-xl mb-4">
                    {product.images && product.images.length > 0 ? (
                      <img
                        src={`http://localhost:5000${product.images[0]}`}
                        alt={product.title}
                        className="w-full h-48 object-cover transition-transform duration-300 hover:scale-110"
                        onError={(e) => (e.target.src = 'https://via.placeholder.com/300')}
                      />
                    ) : (
                      <div className="w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center">
                        <Package className="h-16 w-16 text-gray-400" />
                      </div>
                    )}
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1">
                      <span className="text-sm font-semibold text-gray-800 capitalize">{product.type}</span>
                    </div>
                  </div>
                  
                  <div className="flex-1 space-y-3">
                    <h3 className="text-xl font-bold text-gray-900">{product.title}</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-green-600">{product.price} ETB</span>
                        <span className="text-sm text-gray-500">per kg</span>
                      </div>
                      <p className="text-sm text-gray-600 flex items-center">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                        {product.originAddress}
                      </p>
                      <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
                    </div>
                  </div>
                  
                  <Button
                    onClick={() => onAddToCart(product)}
                    className="mt-6 w-full flex items-center justify-center space-x-2"
                    variant="success"
                  >
                    <ShoppingCart className="h-5 w-5" />
                    <span>Add to Cart</span>
                  </Button>
                </Card>
              </motion.div>
            ))
          )}
        </motion.div>
      </div>
    </div>
  );
};

// Main Dashboard Component
const Dashboard = () => {
  const { user, isAuthenticated, loading, logout, setUser } = useAuth();
  const navigate = useNavigate();
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [showProfileImageModal, setShowProfileImageModal] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState(user?.verified ? 'verified' : 'unverified');
  const [currentView, setCurrentView] = useState('main');
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [profileData, setProfileData] = useState({
    fullName: '',
    username: '',
    phone: '',
    address: '',
    location: '',
  });
  const [error, setError] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      if (!isAuthenticated && !loading) {
        axios
          .get('http://localhost:5000/api/users/profile', {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((response) => {
            setUser(response.data.user);
            setIsAuthenticated(true);
          })
          .catch(() => {
            localStorage.removeItem('token');
            navigate('/login', { replace: true });
          })
          .finally(() => setLoading(false));
      }
    } else if (!isAuthenticated && !loading) {
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, loading, navigate, setUser]);

  useEffect(() => {
    if (user) {
      setProfileData({
        fullName: user.fullName || '',
        username: user.username || '',
        phone: user.phone || '',
        address: user.address || '',
        location: user.location || '',
      });
      setVerificationStatus(user.verified ? 'verified' : 'unverified');
    }
  }, [user]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/products', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProducts(response.data.items || []);
      } catch (error) {
        setError(error.response?.data?.error || 'Failed to load products');
        toast.error(error.response?.data?.error || 'Failed to load products');
      }
    };
    if (isAuthenticated && user) fetchProducts();
  }, [isAuthenticated, user]);

  const stats = [
    {
      title: 'Total Revenue',
      value: user?.transactionHistory?.reduce((sum, tx) => sum + (tx.amount || 0), 0) || '0 ETB',
      change: '+0%',
      trend: 'up',
      icon: DollarSign,
      color: 'blue',
    },
    {
      title: 'Active Products',
      value: user?.soldProducts?.length || '0',
      change: '+0',
      trend: 'up',
      icon: Package,
      color: 'green',
    },
    {
      title: 'Total Orders',
      value: user?.transactionHistory?.length || '0',
      change: '+0',
      trend: 'up',
      icon: BarChart3,
      color: 'purple',
    },
    {
      title: 'Customer Rating',
      value: user?.customerRating || '0',
      change: '0',
      trend: 'neutral',
      icon: Users,
      color: 'yellow',
    },
  ];

  const recentActivities = user?.transactionHistory?.length
    ? user.transactionHistory.map((tx, index) => ({
        id: index,
        type: tx.type || 'transaction',
        description: tx.description || `Transaction #${index + 1}`,
        amount: tx.amount ? `${tx.amount} ETB` : null,
        time: new Date(tx.date || Date.now()).toLocaleString(),
        status: tx.status || 'completed',
      }))
    : [
        {
          id: 1,
          type: 'info',
          description: 'No recent transactions',
          amount: null,
          time: new Date().toLocaleString(),
          status: 'info',
        },
      ];

  const quickActions = [
    { title: 'Add Product', description: 'List a new product for sale', action: () => handleSellClick() },
    { title: 'View Orders', description: 'Check your recent orders', action: () => console.log('View Orders') },
    { title: 'Generate QR', description: 'Create QR codes for products', action: () => console.log('Generate QR') },
  ];

  const handleVerify = async (data) => {
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('govIdFront', data.govIdFront);
      formData.append('govIdBack', data.govIdBack);
      formData.append('frontId', data.govIdFront);
      formData.append('backId', data.govIdBack);

      setVerificationStatus('pending');
      setShowVerificationModal(false);
      const userData = await axios.get('http://localhost:5000/api/users/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(userData.data.user);
      toast.success('Government ID uploaded, pending verification');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Verification failed');
    }
  };

  const handleProductSubmit = async (productData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:5000/api/products', productData, {
        headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` },
      });
      setProducts([...products, response.data.product]);
      setShowProductModal(false);
      setCurrentView('Marketplace');
      toast.success('Product uploaded successfully');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Product upload failed');
    }
  };

  const handleProfileImageSave = async (imageFile) => {
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('profilePic', imageFile);
      await axios.post('http://localhost:5000/api/users/profile-pic', formData, {
        headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` },
      });

      const userData = await axios.get('http://localhost:5000/api/users/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(userData.data.user);
      toast.success('Profile image updated');
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.error || 'Failed to update profile image');
    }
  };

  const saveProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        'http://localhost:5000/api/users/profile',
        {
          fullName: profileData.fullName,
          username: profileData.username,
          phone: profileData.phone,
          address: profileData.address,
          location: profileData.location,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const userData = await axios.get('http://localhost:5000/api/users/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(userData.data.user);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to update profile');
    }
  };

  const handleBuyClick = () => {
    if (verificationStatus !== 'verified') {
      setShowVerificationModal(true);
    } else {
      setCurrentView('Marketplace');
    }
  };

  const handleSellClick = () => {
    if (verificationStatus !== 'verified') {
      setShowVerificationModal(true);
    } else {
      setShowProductModal(true);
    }
  };

  const handleAddToCart = (product) => {
    setCart([...cart, product]);
    toast.success(`${product.title} added to cart!`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-center py-10 text-2xl text-red-400 bg-red-400/10 rounded-2xl p-8 border border-red-400/20">
          {error}
        </div>
      </div>
    );
  }

  if (currentView === 'Marketplace') {
    return <Marketplace token={localStorage.getItem('token')} onAddToCart={handleAddToCart} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative">
      {/* Enhanced Profile Section */}
      <div className="fixed right-0 top-18 z-50 w-sm max-w-sm">
        <motion.div
          className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-6 border border-white/20"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, type: "spring" }}
        >
          {/* Profile Header */}
          <div
            className="flex items-center space-x-4 cursor-pointer group"
            onClick={() => setIsProfileOpen(!isProfileOpen)}
          >
            <div className="relative w-16 h-16 rounded-2xl overflow-hidden border-3 border-white/30 group-hover:border-blue-400 transition-all duration-300 shadow-lg">
              {user?.profilePic ? (
                <img
                  src={`http://localhost:5000${user.profilePic}`}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold text-xl">
                  {user?.fullName?.[0] || 'U'}
                </div>
              )}
              <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowProfileImageModal(true);
                }}
              >
                <Camera className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-white truncate">{profileData.fullName}</h3>
              <p className="text-sm text-gray-300 truncate">@{profileData.username}</p>
              <div className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold mt-1 ${
                verificationStatus === 'verified'
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                  : verificationStatus === 'pending'
                  ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                  : 'bg-red-500/20 text-red-400 border border-red-500/30'
              }`}>
                {verificationStatus.charAt(0).toUpperCase() + verificationStatus.slice(1)}
              </div>
            </div>
            <motion.div
              animate={{ rotate: isProfileOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronDown className="h-6 w-6 text-white" />
            </motion.div>
          </div>

          {/* Dropdown Content */}
          <AnimatePresence>
            {isProfileOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="overflow-hidden mt-6"
              >
                <div className="space-y-4">
                  {/* Input Fields */}
                  {[
                    { label: 'Full Name', key: 'fullName', type: 'text', icon: User },
                    { label: 'Username', key: 'username', type: 'text', icon: User },
                    { label: 'Phone', key: 'phone', type: 'tel', icon: User },
                    { label: 'Address', key: 'address', type: 'text', icon: User },
                    { label: 'Location', key: 'location', type: 'text', icon: User }
                  ].map((field) => (
                    <div key={field.key}>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">{field.label}</label>
                      <div className="relative">
                        <input
                          type={field.type}
                          value={profileData[field.key]}
                          onChange={(e) =>
                            setProfileData({ ...profileData, [field.key]: e.target.value })
                          }
                          className="w-full rounded-xl border-0 bg-white/10 backdrop-blur-sm text-white placeholder-gray-300 px-4 py-3 pl-10 focus:ring-2 focus:ring-blue-500 focus:bg-white/20 transition-all"
                          placeholder={`Enter ${field.label.toLowerCase()}`}
                        />
                        <field.icon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-900" />
                      </div>
                    </div>
                  ))}

                  {/* Action Buttons */}
                  <div className="space-y-3 pt-4">
                    <Button
                      onClick={saveProfile}
                      className="w-full"
                      size="large"
                    >
                      Save Changes
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full flex items-center justify-center space-x-2"
                      onClick={logout}
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
{/* end of profile */}

      {/* Main Content */}
      <div className="p-4 md:p-8 lg:p-12 max-w-7xl mx-auto">
        {/* Welcome Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8 }} 
          className="mb-12 text-center"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Welcome back, {user?.fullName || 'User'}!
          </h1>
          <p className="text-xl md:text-2xl text-gray-300">Your agricultural marketplace awaits discovery</p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-12 flex flex-col sm:flex-row gap-6 justify-center"
        >
          <Button onClick={handleBuyClick} size="large" className="flex items-center justify-center space-x-3 min-w-[200px]">
            <ShoppingCart className="h-6 w-6" />
            <span>Buy Products</span>
          </Button>
          <Button onClick={handleSellClick} variant="success" size="large" className="flex items-center justify-center space-x-3 min-w-[200px]">
            <Upload className="h-6 w-6" />
            <span>Sell Products</span>
          </Button>
        </motion.div>

        {/* Stats Grid */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 + 0.5 }}
            >
              <Card hover className="text-center">
                <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${
                  stat.color === 'blue' ? 'from-blue-500 to-blue-600' :
                  stat.color === 'green' ? 'from-green-500 to-green-600' :
                  stat.color === 'purple' ? 'from-purple-500 to-purple-600' :
                  'from-yellow-500 to-yellow-600'
                } mb-4 shadow-lg`}>
                  <stat.icon className="h-8 w-8 text-white" />
                </div>
                <p className="text-sm font-semibold text-gray-600 mb-2">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
                <div className={`flex items-center justify-center text-sm ${
                  stat.trend === 'up' ? 'text-green-600' : 
                  stat.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {stat.trend === 'up' && <ArrowUpRight className="h-4 w-4 mr-1" />}
                  {stat.change}
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="lg:col-span-2"
          >
            <Card>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Recent Activity</h2>
                <Button variant="outline" size="small">
                  View All
                </Button>
              </div>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl hover:from-gray-100 hover:to-gray-200 transition-all duration-300 border border-gray-200"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg">
                        <Activity className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{activity.description}</p>
                        <p className="text-sm text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      {activity.amount && <p className="font-bold text-gray-900">{activity.amount}</p>}
                      <span
                        className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                          activity.status === 'completed'
                            ? 'bg-green-100 text-green-800 border border-green-200'
                            : activity.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                            : 'bg-blue-100 text-blue-800 border border-blue-200'
                        }`}
                      >
                        {activity.status}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <Card>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
              <div className="space-y-4">
                {quickActions.map((action, index) => (
                  <motion.button
                    key={index}
                    onClick={action.action}
                    className="w-full text-left p-4 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-blue-50 hover:to-blue-100 rounded-xl transition-all duration-300 border border-gray-200 hover:border-blue-300 group"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <h3 className="font-bold text-gray-900 mb-2 group-hover:text-blue-700 transition-colors">{action.title}</h3>
                    <p className="text-sm text-gray-600 group-hover:text-blue-600 transition-colors">{action.description}</p>
                  </motion.button>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Sales Overview */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          className="mt-12"
        >
          <Card>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
              <h2 className="text-2xl font-bold text-gray-900">Sales Overview</h2>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="small">7 Days</Button>
                <Button variant="outline" size="small">30 Days</Button>
                <Button size="small">90 Days</Button>
              </div>
            </div>
            <div className="h-80 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl flex items-center justify-center border border-gray-200">
              <div className="text-center">
                <div className="inline-flex p-6 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl mb-4 shadow-lg">
                  <TrendingUp className="h-12 w-12 text-white" />
                </div>
                <p className="text-xl text-gray-600 font-semibold">Sales Analytics Coming Soon</p>
                <p className="text-gray-500 mt-2">Advanced charts and insights will be available here</p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Modals */}
      <VerificationModal
        isOpen={showVerificationModal}
        onClose={() => setShowVerificationModal(false)}
        onVerify={handleVerify}
        verificationStatus={verificationStatus}
      />
      <ProductUploadModal
        isOpen={showProductModal}
        onClose={() => setShowProductModal(false)}
        onSubmit={handleProductSubmit}
      />
      <ProfileImageUploadModal
        isOpen={showProfileImageModal}
        onClose={() => setShowProfileImageModal(false)}
        onImageSave={handleProfileImageSave}
      />

      {/* Live Chat Component */}
      <LiveChat />
    </div>
  );
};

export default Dashboard;
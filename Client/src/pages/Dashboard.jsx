
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Package,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  DollarSign,
  Upload,
  ShoppingCart,
  Camera
} from 'lucide-react';
import axios from 'axios';
// import * as cocoSsd from '@tensorflow-models/coco-ssd';

// Mock Auth Context (replace with real auth in production)
const useAuth = () => ({
  user: { name: "Test User", id: "user123" }
});

// Card Component
const Card = ({ children, hover }) => (
  <div className={`bg-white rounded-2xl shadow-lg p-6 ${hover ? 'hover:shadow-xl transition-shadow' : ''}`}>
    {children}
  </div>
);

// Button Component
const Button = ({ children, variant = 'default', size = 'default', className = '', ...props }) => {
  const baseStyles = 'font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
  const variants = {
    default: 'bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-500',
    outline: 'bg-transparent border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-emerald-500'
  };
  const sizes = {
    default: 'px-4 py-2 text-sm',
    small: 'px-3 py-1.5 text-xs'
  };
  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

// Verification Modal with Camera Scanning
const VerificationModal = ({ isOpen, onClose, onVerify, verificationStatus }) => {
  const [nationalIdFront, setNationalIdFront] = useState(null);
  const [nationalIdBack, setNationalIdBack] = useState(null);
  const [name, setName] = useState('');
  const [cameraStream, setCameraStream] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (isCameraActive) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
          setCameraStream(stream);
          if (videoRef.current) videoRef.current.srcObject = stream;
        })
        .catch(err => console.error('Camera access error:', err));
    }
    return () => {
      if (cameraStream) cameraStream.getTracks().forEach(track => track.stop());
    };
  }, [isCameraActive]);

  const captureImage = async () => {
    if (videoRef.current && canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      ctx.drawImage(videoRef.current, 0, 0, 300, 200);
      const imageData = canvasRef.current.toDataURL('image/jpeg');
      const model = await cocoSsd.load();
      const img = new Image();
      img.src = imageData;
      const predictions = await model.detect(img);
      const hasIdCard = predictions.some(pred => pred.class === 'book' || pred.class === 'paper');
      if (hasIdCard) {
        setNationalIdFront(dataURLtoFile(imageData, 'id_front.jpg'));
        setIsCameraActive(false);
      } else {
        alert('Please position a valid ID card in the camera view');
      }
    }
  };

  const dataURLtoFile = (dataUrl, filename) => {
    const arr = dataUrl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) u8arr[n] = bstr.charCodeAt(n);
    return new File([u8arr], filename, { type: mime });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (nationalIdFront && nationalIdBack && name) {
      const extractedName = await mockOCR(nationalIdFront); // Mock OCR
      if (extractedName.toLowerCase() === name.toLowerCase()) {
        const formData = new FormData();
        formData.append('name', name);
        formData.append('nationalIdFront', nationalIdFront);
        formData.append('nationalIdBack', nationalIdBack);
        onVerify(formData);
      } else {
        alert('Name on ID does not match entered name');
      }
    }
  };

  const mockOCR = async (image) => name; // Replace with real OCR API

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Verify Your Account</h2>
        {verificationStatus === 'pending' && <p className="text-yellow-600 mb-4 font-medium">Verification pending...</p>}
        {verificationStatus === 'verified' && <p className="text-emerald-600 mb-4 font-medium">Verified successfully!</p>}
        {verificationStatus !== 'verified' && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="border border-gray-700 rounded-md p-2 block text-sm font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 w-full rounded-lg border-gray-600 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">National ID (Front)</label>
              {isCameraActive ? (
                <>
                  <video ref={videoRef} autoPlay className="w-full h-48 bg-gray-100 rounded-lg" />
                  <canvas ref={canvasRef} width="300" height="200" className="hidden" />
                  <Button onClick={captureImage} className="mt-2">Capture ID</Button>
                </>
              ) : (
                <>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setNationalIdFront(e.target.files[0])}
                    className="mt-1 w-full text-gray-600"
                  />
                  <Button onClick={() => setIsCameraActive(true)} className="mt-2 flex items-center space-x-2">
                    <Camera className="h-4 w-4" />
                    <span>Scan with Camera</span>
                  </Button>
                </>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">National ID (Back)</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setNationalIdBack(e.target.files[0])}
                className="mt-1 w-full text-gray-600"
                required
              />
            </div>
            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={onClose}>Cancel</Button>
              <Button type="submit">Submit</Button>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
};

// Product Upload Modal
const ProductUploadModal = ({ isOpen, onClose, onSubmit }) => {
  const [product, setProduct] = useState({
    name: '', price: '', origin: '', quantity: '', description: '', type: '', image: null
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(product).forEach(([key, value]) => {
      if (value) formData.append(key, value);
    });
    onSubmit(formData);
    setProduct({ name: '', price: '', origin: '', quantity: '', description: '', type: '', image: null });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Upload Product</h2>
        <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
          <div>
            <label className="block text-sm font-medium text-gray-700">Product Name</label>
            <input
              type="text"
              value={product.name}
              onChange={(e) => setProduct({ ...product, name: e.target.value })}
              className="mt-1 w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Type</label>
            <select
              value={product.type}
              onChange={(e) => setProduct({ ...product, type: e.target.value })}
              className="mt-1 w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
              required
            >
              <option value="">Select Type</option>
              <option value="vegetable">Vegetable</option>
              <option value="fruit">Fruit</option>
              <option value="grain">Grain</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Price (ETB)</label>
            <input
              type="number"
              value={product.price}
              onChange={(e) => setProduct({ ...product, price: e.target.value })}
              className="mt-1 w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Origin</label>
            <input
              type="text"
              value={product.origin}
              onChange={(e) => setProduct({ ...product, origin: e.target.value })}
              className="mt-1 w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Quantity (kg)</label>
            <input
              type="number"
              value={product.quantity}
              onChange={(e) => setProduct({ ...product, quantity: e.target.value })}
              className="mt-1 w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setProduct({ ...product, image: e.target.files[0] })}
              className="mt-1 w-full text-gray-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={product.description}
              onChange={(e) => setProduct({ ...product, description: e.target.value })}
              className="mt-1 w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
              rows="4"
            />
          </div>
          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit">Upload</Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

// Marketplace Component
const Marketplace = ({ products, onAddToCart }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 py-8 px-4">
      <h2 className="text-3xl font-bold text-gray-900 mb-8">Marketplace</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <Card key={product._id} hover>
            {product.image && <img src={`http://localhost:5000${product.image}`} alt={product.name} className="w-full h-48 object-cover rounded-t-lg mb-4" />}
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.name}</h3>
            <p className="text-sm text-gray-600">Type: {product.type}</p>
            <p className="text-sm text-gray-600">Price: {product.price} ETB/kg</p>
            <p className="text-sm text-gray-600">Origin: {product.origin}</p>
            <p className="text-sm text-gray-600">Quantity: {product.quantity} kg</p>
            <p className="text-sm text-gray-600 mt-2 line-clamp-2">{product.description}</p>
            <Button onClick={() => onAddToCart(product)} className="mt-4 w-full flex items-center justify-center space-x-2">
              <ShoppingCart className="h-4 w-4" />
              <span>Add to Cart</span>
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
};

// Main Dashboard Component
const Dashboard = () => {
  const { user } = useAuth();
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState('unverified');
  const [currentView, setCurrentView] = useState('dashboard');
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/products')
      .then(response => setProducts(response.data))
      .catch(error => console.error('Error fetching products:', error));
  }, []);

  const stats = [
    { title: 'Total Revenue', value: '$12,345', change: '+12.5%', trend: 'up', icon: DollarSign, color: 'emerald' },
    { title: 'Active Products', value: '24', change: '+3', trend: 'up', icon: Package, color: 'blue' },
    { title: 'Total Orders', value: '156', change: '+8.2%', trend: 'up', icon: BarChart3, color: 'purple' },
    { title: 'Customer Rating', value: '4.8', change: '-0.1', trend: 'down', icon: Users, color: 'orange' }
  ];

  const recentActivities = [
    { id: 1, type: 'sale', description: 'New order for Organic Tomatoes', amount: '$45.00', time: '2 hours ago', status: 'completed' },
    { id: 2, type: 'product', description: 'Added new product: Fresh Carrots', amount: null, time: '4 hours ago', status: 'pending' },
    { id: 3, type: 'payment', description: 'Payment received from John Doe', amount: '$120.00', time: '6 hours ago', status: 'completed' },
    { id: 4, type: 'review', description: 'New 5-star review received', amount: null, time: '1 day ago', status: 'completed' }
  ];

  const quickActions = [
    { title: 'Add Product', description: 'List a new product for sale', action: () => setShowProductModal(true) },
    { title: 'View Orders', description: 'Check your recent orders', action: () => console.log('View Orders') },
    { title: 'Update Profile', description: 'Edit your profile information', action: () => console.log('Update Profile') },
    { title: 'Generate QR', description: 'Create QR codes for products', action: () => console.log('Generate QR') }
  ];

  const handleVerify = async (data) => {
    try {
      const response = await axios.post('http://localhost:5000/api/verify', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setVerificationStatus('pending');
      setTimeout(() => {
        setVerificationStatus('verified');
        setShowVerificationModal(false);
      }, 3000);
    } catch (error) {
      alert('Verification failed: ' + (error.response?.data?.message || 'Server error'));
    }
  };

  const handleBuyClick = () => {
    if (verificationStatus !== 'verified') setShowVerificationModal(true);
    else setCurrentView('marketplace');
  };

  const handleSellClick = () => {
    if (verificationStatus !== 'verified') setShowVerificationModal(true);
    else setShowProductModal(true);
  };

  const handleProductSubmit = async (productData) => {
    try {
      const response = await axios.post('http://localhost:5000/api/products', productData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setProducts([...products, response.data]);
      setShowProductModal(false);
    } catch (error) {
      alert('Product upload failed: ' + (error.response?.data?.message || 'Server error'));
    }
  };

  const handleAddToCart = (product) => {
    setCart([...cart, product]);
    alert(`${product.name} added to cart!`);
  };

  if (currentView === 'marketplace') return <Marketplace products={products} onAddToCart={handleAddToCart} />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 py-8 px-4">
      <div className="container mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Welcome back, {user?.name || 'User'}!</h1>
          <p className="text-lg text-gray-600">Your agricultural marketplace dashboard awaits.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8 flex flex-col sm:flex-row sm:space-x-4 space-y-3 sm:space-y-0"
        >
          <Button onClick={handleBuyClick} className="flex items-center justify-center space-x-2 bg-gray-700 hover:bg-emerald-700">
            <ShoppingCart className="h-5 w-5" />
            <span>Buy Products</span>
          </Button>
          <Button onClick={handleSellClick} className="flex items-center justify-center space-x-2 bg-rose-600 hover:bg-blue-700">
            <Upload className="h-5 w-5" />
            <span>Sell Products</span>
          </Button>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card hover>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <div className={`flex items-center mt-2 text-sm ${stat.trend === 'up' ? 'text-emerald-600' : 'text-red-600'}`}>
                      {stat.trend === 'up' ? <ArrowUpRight className="h-4 w-4 mr-1" /> : <ArrowDownRight className="h-4 w-4 mr-1" />}
                      {stat.change}
                    </div>
                  </div>
                  <div className={`p-3 rounded-full bg-${stat.color}-100`}>
                    <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="lg:col-span-2"
          >
            <Card>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
                <Button variant="outline" size="small">View All</Button>
              </div>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-emerald-100 rounded-full">
                        <Activity className="h-4 w-4 text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      {activity.amount && <p className="text-sm font-semibold text-gray-900">{activity.amount}</p>}
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${activity.status === 'completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {activity.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Card>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
              <div className="space-y-3">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={action.action}
                    className="w-full text-left p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <h3 className="font-medium text-gray-900 mb-1">{action.title}</h3>
                    <p className="text-sm text-gray-600">{action.description}</p>
                  </button>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-8"
        >
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Sales Overview</h2>
              <div className="flex space-x-2">
                <Button variant="outline" size="small">7 Days</Button>
                <Button variant="outline" size="small">30 Days</Button>
                <Button size="small">90 Days</Button>
              </div>
            </div>
            <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <TrendingUp className="h-12 w-12 text-emerald-600 mx-auto mb-4" />
                <p className="text-gray-600">Sales chart will be integrated here</p>
              </div>
            </div>
          </Card>
        </motion.div>

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
      </div>
    </div>
  );
};

export default Dashboard;

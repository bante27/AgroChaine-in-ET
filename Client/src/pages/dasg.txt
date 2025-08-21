import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import LiveChat from '../components/LiveChat';
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
  LogOut,
} from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import Card from '../components/Card';
import Button from '../components/Button';
import VerificationModal from '../components/VerificationModal';
import ProductUploadModal from '../components/ProductUploadModal';
import ProfileImageUploadModal from '../components/ProfileImageUploadModal';

const Dashboard = () => {
  const { user, isAuthenticated, loading, logout, setUser } = useAuth();
  const navigate = useNavigate();
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [showProfileImageModal, setShowProfileImageModal] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState(user?.verified ? 'verified' : 'unverified');
  const [profileData, setProfileData] = useState({
    fullName: '',
    username: '',
    phone: '',
    address: '',
    location: '',
  });
  const [error, setError] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);

  // Fetch user profile on mount or when token changes
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && !loading) {
      axios
        .get('http://localhost:5000/api/users/profile', {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setUser(response.data.user);
          setProfileData({
            fullName: response.data.user.fullName || '',
            username: response.data.user.username || '',
            phone: response.data.user.phone || '',
            address: response.data.user.address || '',
            location: response.data.user.location || '',
          });
          setVerificationStatus(response.data.user.verified ? 'verified' : 'unverified');
        })
        .catch(() => {
          localStorage.removeItem('token');
          navigate('/login', { replace: true });
        });
    } else if (!token && !isAuthenticated && !loading) {
      navigate('/login', { replace: true });
    }
  }, [loading, navigate, setUser]);

  // Update profileData when user changes
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
      value: user?.productsForSale?.length || '0',
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
    {
      title: 'Add Product',
      description: 'List a new product for sale',
      action: () => handleSellClick(),
    },
    {
      title: 'View Orders',
      description: 'Check your recent orders',
      action: () => navigate('/orders'),
    },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleVerify = async (data) => {
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('govIdFront', data.govIdFront);
      formData.append('govIdBack', data.govIdBack);
      await axios.post('http://localhost:5000/api/users/verify', formData, {
        headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` },
      });
      setVerificationStatus('pending');
      setShowVerificationModal(false);
      await axios.patch(
        'http://localhost:5000/api/users/profile',
        { fullName: data.name },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const userData = await axios.get('http://localhost:5000/api/users/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(userData.data.user);
      setProfileData((prev) => ({ ...prev, fullName: data.name }));
      toast.success('Government ID uploaded, pending verification');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Verification failed');
    }
  };

  const handleProductSubmit = async (productData) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/products', productData, {
        headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` },
      });
      setShowProductModal(false);
      toast.success('Product uploaded successfully');
      navigate('/marketplace'); // Navigate to Marketplace to show updated products
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
    if (verificationStatus == 'verified') {
      setShowVerificationModal(true);
    } else {
      navigate('/marketplace');
    }
  };

  const handleSellClick = () => {
    if (verificationStatus == 'verified') {
      setShowVerificationModal(true);
    } else {
      setShowProductModal(true);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white/90 via-blue-800 to-slate-900 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-8 sm:w-10 h-8 sm:h-10 border-4 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white/90 via-blue-800 to-slate-900 flex items-center justify-center">
        <div className="text-center py-6 sm:py-10 text-lg sm:text-2xl text-red-400 bg-red-400/10 rounded-2xl p-4 sm:p-8 border border-red-400/20">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white/90">
      {/* Profile Section */}
      <div ref={profileRef} className="fixed top-4 sm:top-6 right-2 sm:right-4 z-50">
        <button
          onClick={() => setIsProfileOpen(!isProfileOpen)}
          className="flex items-center justify-center w-8 sm:w-10 h-8 sm:h-10 rounded-full overflow-hidden border border-gray-300 shadow-md hover:shadow-lg transition"
        >
          {user?.profilePic ? (
            <img src={`http://localhost:5000${user.profilePic}`} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <span className="text-xs sm:text-sm font-semibold text-white bg-gradient-to-br from-blue-600 to-green-600 w-full h-full flex items-center justify-center">
              {user?.fullName?.[0] || 'U'}
            </span>
          )}
        </button>

        <AnimatePresence>
          {isProfileOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 mt-2 sm:mt-3 w-64 sm:w-80 max-w-xs bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 overflow-hidden"
            >
              <div className="flex items-center space-x-2 sm:space-x-3 p-2 sm:p-4 border-b border-gray-200">
                <div className="relative w-12 sm:w-14 h-12 sm:h-14 rounded-full overflow-hidden border-2 border-white/30 group">
                  {user?.profilePic ? (
                    <img src={`http://localhost:5000${user.profilePic}`} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-md sm:text-lg font-semibold text-white bg-gradient-to-br from-blue-600 to-green-600 w-full h-full flex items-center justify-center">
                      {user?.fullName?.[0] || 'U'}
                    </span>
                  )}
                  <div
                    className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowProfileImageModal(true);
                    }}
                  >
                    <Camera className="w-5 sm:w-6 h-5 sm:h-6 text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-sm sm:text-base font-semibold text-gray-900">
                    {profileData.fullName || 'Complete Your Profile'}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500">@{profileData.username || 'username'}</p>
                  <span
                    className={`inline-block text-xs mt-1 px-1 sm:px-2 py-0.5 rounded-full ${
                      verificationStatus === 'verified'
                        ? 'bg-green-500/20 text-green-600 border border-green-500/30'
                        : verificationStatus === 'pending'
                        ? 'bg-yellow-500/20 text-yellow-600 border border-yellow-500/30'
                        : 'bg-red-500/20 text-red-600 border border-red-500/30'
                    }`}
                  >
                    {verificationStatus.charAt(0).toUpperCase() + verificationStatus.slice(1)}
                  </span>
                </div>
              </div>
              <div className="p-2 sm:p-4 space-y-2 sm:space-y-3 max-h-48 sm:max-h-64 overflow-y-auto">
                {[
                  { label: 'Full Name', key: 'fullName', type: 'text' },
                  { label: 'Username', key: 'username', type: 'text' },
                  { label: 'Phone', key: 'phone', type: 'tel' },
                  { label: 'Address', key: 'address', type: 'text' },
                  { label: 'Location', key: 'location', type: 'text' },
                ].map((field) => (
                  <div key={field.key}>
                    <label className="block text-xs font-medium text-gray-500 mb-1">{field.label}</label>
                    <input
                      type={field.type}
                      value={profileData[field.key]}
                      onChange={(e) => setProfileData({ ...profileData, [field.key]: e.target.value })}
                      className="w-full rounded-lg border-0 bg-gray-100 text-gray-900 placeholder-gray-400 px-2 sm:px-3 py-1 sm:py-2 text-sm focus:ring-2 focus:ring-blue-500"
                      placeholder={`Enter ${field.label.toLowerCase()}`}
                    />
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-200 p-2 sm:p-3 space-y-2">
                <Button onClick={saveProfile} className="w-full text-xs sm:text-sm bg-blue-600 hover:bg-blue-700">
                  Save Changes
                </Button>
                <Button
                  variant="outline"
                  className="w-full text-xs sm:text-sm flex items-center justify-center space-x-1 sm:space-x-2 border-gray-300 text-gray-700 hover:bg-gray-100"
                  onClick={logout}
                >
                  <LogOut className="h-3 sm:h-4 w-3 sm:w-4" />
                  <span>Logout</span>
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="p-2 sm:p-4 md:p-8 lg:p-12 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-6 sm:mb-12 text-center"
        >
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-2 sm:mb-4 bg-gradient-to-r from-blue-950 to-purple-950 bg-clip-text text-transparent">
            Welcome back, {user?.fullName || 'User'}!
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600">Explore your agricultural marketplace</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-6 sm:mb-12 flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center"
        >
          <Button
            onClick={handleBuyClick}
            size="large"
            className="flex items-center justify-center space-x-2 min-w-[120px] bg-blue-600 hover:bg-blue-700"
          >
            <ShoppingCart className="h-4 sm:h-5 w-4 sm:w-5" />
            <span>Buy Products</span>
          </Button>
          <Button
            onClick={handleSellClick}
            variant="success"
            size="large"
            className="flex items-center justify-center space-x-2 min-w-[120px] bg-green-600 hover:bg-green-700"
          >
            <Upload className="h-4 sm:h-5 w-4 sm:w-5" />
            <span>Sell Products</span>
          </Button>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-12"
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
              <Card hover className="text-center bg-white/80 backdrop-blur-sm">
                <div
                  className={`inline-flex p-3 sm:p-4 rounded-xl bg-gradient-to-br ${
                    stat.color === 'blue'
                      ? 'from-blue-500 to-blue-600'
                      : stat.color === 'green'
                      ? 'from-green-500 to-green-600'
                      : stat.color === 'purple'
                      ? 'from-purple-500 to-purple-600'
                      : 'from-yellow-500 to-yellow-600'
                  } mb-3 sm:mb-4 shadow-lg`}
                >
                  <stat.icon className="h-6 sm:h-8 w-6 sm:w-8 text-white" />
                </div>
                <p className="text-sm font-semibold text-gray-600 mb-1">{stat.title}</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
                <div
                  className={`flex items-center justify-center text-sm ${
                    stat.trend === 'up' ? 'text-green-600' : stat.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                  }`}
                >
                  {stat.trend === 'up' && <ArrowUpRight className="h-4 w-4 mr-1" />}
                  {stat.change}
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="lg:col-span-2"
          >
            <Card>
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Recent Activity</h2>
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
                        <p className="text-base font-semibold text-gray-900">{activity.description}</p>
                        <p className="text-sm text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      {activity.amount && <p className="text-base font-bold text-gray-900">{activity.amount}</p>}
                      <span
                        className={`inline-flex px-2 py-1 text-sm font-semibold rounded-full ${
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

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <Card>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Quick Actions</h2>
              <div className="space-y-4">
                {quickActions.map((action, index) => (
                  <motion.button
                    key={index}
                    onClick={action.action}
                    className="w-full text-left p-4 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-blue-50 hover:to-blue-100 rounded-xl transition-all duration-300 border border-gray-200 hover:border-blue-300 group"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <h3 className="text-base font-bold text-gray-900 mb-2 group-hover:text-blue-700 transition-colors">
                      {action.title}
                    </h3>
                    <p className="text-sm text-gray-600 group-hover:text-blue-600 transition-colors">{action.description}</p>
                  </motion.button>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          className="mt-6 sm:mt-12"
        >
          <Card>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-2 sm:gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Sales Overview</h2>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="small">7 Days</Button>
                <Button variant="outline" size="small">30 Days</Button>
                <Button size="small">90 Days</Button>
              </div>
            </div>
            <div className="h-48 sm:h-80 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl flex items-center justify-center border border-gray-200">
              <div className="text-center">
                <div className="inline-flex p-4 sm:p-6 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl mb-4 shadow-lg">
                  <TrendingUp className="h-8 sm:h-12 w-8 sm:w-12 text-white" />
                </div>
                <p className="text-base sm:text-xl text-gray-600 font-semibold">Sales Analytics Coming Soon</p>
                <p className="text-sm text-gray-500 mt-2">Advanced charts and insights will be available here</p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

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

      <LiveChat />
    </div>
  );
};

export default Dashboard;
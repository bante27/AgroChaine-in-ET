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
  Moon,
  Sun,
  Wallet,
} from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import Card from '../components/Card';
import Button from '../components/Button';
import VerificationModal from '../components/VerificationModal';
import ProductUploadModal from '../components/ProductUploadModal';
import ProfileImageUploadModal from '../components/ProfileImageUploadModal';
import PaymentModal from '../components/PaymentModal';
import Orders from './Orders';

const Dashboard = () => {
  const { user, isAuthenticated, loading, logout, setUser } = useAuth();
  const navigate = useNavigate();
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [showProfileImageModal, setShowProfileImageModal] = useState(false);
  const [showOrdersSection, setShowOrdersSection] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
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
  const [theme, setTheme] = useState('light');
  const profileRef = useRef(null);

  // Theme management
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    setTheme(savedTheme);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Fetch user profile
  const fetchUserProfile = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const response = await axios.get('http://localhost:5000/api/users/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data.user);
        setProfileData({
          fullName: response.data.user.fullName || '',
          username: response.data.user.username || '',
          phone: response.data.user.phone || '',
          address: response.data.user.address || '',
          location: response.data.user.location || '',
        });
        setVerificationStatus(response.data.user.verified ? 'verified' : 'unverified');
      } catch {
        localStorage.removeItem('token');
        navigate('/login', { replace: true });
      }
    }
  };

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login', { replace: true });
    } else if (!loading) {
      fetchUserProfile();
    }
  }, [loading, isAuthenticated, navigate, setUser]);

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
      value: `${user?.transactionHistory?.filter(tx => tx.sellerUserId === user.userId).reduce((sum, tx) => sum + (tx.totalPrice || 0), 0) || 0} ETB`,
      change: '+12%',
      trend: 'up',
      icon: DollarSign,
      color: 'emerald',
      gradient: 'from-emerald-500 to-teal-600',
    },
    {
      title: 'Sold Products',
      value: user?.soldProducts?.length || 0,
      change: '+5',
      trend: 'up',
      icon: Package,
      color: 'blue',
      gradient: 'from-blue-500 to-indigo-600',
    },
    {
      title: 'Total Orders',
      value: user?.transactionHistory?.length || 0,
      change: '+3',
      trend: 'up',
      icon: BarChart3,
      color: 'purple',
      gradient: 'from-purple-500 to-violet-600',
    },
    {
      title: 'Customer Rating',
      value: `${user?.customerRating || 4.5}/5`,
      change: '+0.2',
      trend: 'up',
      icon: Users,
      color: 'amber',
      gradient: 'from-amber-500 to-orange-600',
    },
  ];

  const recentActivities = user?.transactionHistory?.length
    ? user.transactionHistory.map((tx, index) => ({
        id: index,
        type: tx.buyerUserId === user.userId ? 'purchase' : 'sale',
        description: `${tx.buyerUserId === user.userId ? 'Purchased' : 'Sold'} ${tx.quantity} of product (ID: ${tx.productId})`,
        amount: `${tx.totalPrice} ETB`,
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
      icon: Upload,
      color: 'green',
    },
    {
      title: 'View Orders',
      description: 'Check your recent orders',
      action: () => setShowOrdersSection(true),
      icon: ShoppingCart,
      color: 'blue',
    },
    {
      title: 'Add Balance',
      description: 'Top up your wallet',
      action: () => setShowPaymentModal(true),
      icon: Wallet,
      color: 'purple',
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
      fetchUserProfile();
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
      navigate('/marketplace');
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
      fetchUserProfile();
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
        profileData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchUserProfile();
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to update profile');
    }
  };

  const handleBuyClick = () => {
    if (verificationStatus !== 'verified') {
      setShowVerificationModal(true);
    } else {
      navigate('/marketplace');
    }
  };

  const handleSellClick = () => {
    if (verificationStatus !== 'verified') {
      setShowVerificationModal(true);
    } else {
      setShowProductModal(true);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50/90 to-blue-50/90 dark:from-gray-900/90 dark:to-blue-950/90 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50/90 to-blue-50/90 dark:from-gray-900/90 dark:to-blue-950/90 flex items-center justify-center">
        <div className="text-center py-10 text-2xl text-red-500 bg-red-100/50 dark:bg-red-900/50 rounded-2xl p-8 border border-red-200 dark:border-red-800 shadow-lg">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50/90 to-blue-50/90 dark:from-gray-900/90 dark:to-blue-950/90">
      {/* Profile Section */}
      <div ref={profileRef} className="fixed top-4 sm:top-6 right-4 z-50">
        <button
          onClick={() => setIsProfileOpen(!isProfileOpen)}
          className="flex items-center justify-center w-10 h-10 rounded-full overflow-hidden border border-gray-300 dark:border-gray-700 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105"
        >
          {user?.profilePic ? (
            <img src={`http://localhost:5000${user.profilePic}`} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <span className="text-sm font-semibold text-white bg-gradient-to-br from-blue-600 to-indigo-600 w-full h-full flex items-center justify-center">
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
              className="absolute right-0 mt-2 w-80 max-w-xs bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 dark:border-gray-700/20 overflow-hidden"
            >
              <div className="flex items-center space-x-3 p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-950/50 dark:to-indigo-950/50">
                <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-white/30 dark:border-gray-700/30 group">
                  {user?.profilePic ? (
                    <img src={`http://localhost:5000${user.profilePic}`} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-lg font-semibold text-white bg-gradient-to-br from-blue-600 to-indigo-600 w-full h-full flex items-center justify-center">
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
                    <Camera className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                    {profileData.fullName || 'Complete Your Profile'}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">@{profileData.username || 'username'}</p>
                  <span
                    className={`inline-block text-xs mt-1 px-2 py-0.5 rounded-full ${
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
              <div className="p-4 space-y-3 max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-gray-100 dark:scrollbar-track-gray-800">
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Email</label>
                  <p className="w-full rounded-lg bg-gray-100/80 dark:bg-gray-800/80 text-gray-900 dark:text-gray-200 px-3 py-2 text-sm shadow-inner">
                    {user?.email || 'No email registered'}
                  </p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Available Balance</label>
                  <div className="flex items-center space-x-2 w-full rounded-lg bg-gray-100/80 dark:bg-gray-800/80 text-gray-900 dark:text-gray-200 px-3 py-2 text-sm shadow-inner">
                    <Wallet className="h-4 w-4 text-blue-500 dark:text-blue-400" />
                    <p>{user?.balance?.toFixed(2) || '0.00'} ETB</p>
                  </div>
                </div>
                {[
                  { label: 'Full Name', key: 'fullName', type: 'text' },
                  { label: 'Username', key: 'username', type: 'text' },
                  { label: 'Phone', key: 'phone', type: 'tel' },
                  { label: 'Address', key: 'address', type: 'text' },
                  { label: 'Location', key: 'location', type: 'text' },
                ].map((field) => (
                  <div key={field.key}>
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">{field.label}</label>
                    <input
                      type={field.type}
                      value={profileData[field.key]}
                      onChange={(e) => setProfileData({ ...profileData, [field.key]: e.target.value })}
                      className="w-full rounded-lg border-0 bg-gray-100/80 dark:bg-gray-800/80 text-gray-900 dark:text-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 shadow-inner"
                      placeholder={`Enter ${field.label.toLowerCase()}`}
                    />
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700 p-3 space-y-2 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-950/50 dark:to-indigo-950/50">
                <Button onClick={saveProfile} className="w-full text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2 shadow-md hover:shadow-lg transition-all">
                  Save Changes
                </Button>
                <Button
                  onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                  variant="outline"
                  className="w-full text-sm flex items-center justify-center space-x-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 bg-gray-100/50 dark:bg-gray-800/50 hover:bg-gray-200/50 dark:hover:bg-gray-700/50 rounded-lg py-2 shadow-md hover:shadow-lg transition-all"
                >
                  {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                  <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
                </Button>
                <Button
                  variant="outline"
                  className="w-full text-sm flex items-center justify-center space-x-2 border-red-300 dark:border-red-600 text-red-700 dark:text-red-200 bg-red-100/50 dark:bg-red-800/50 hover:bg-red-200/50 dark:hover:bg-red-700/50 rounded-lg py-2 shadow-md hover:shadow-lg transition-all"
                  onClick={logout}
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="p-4 sm:p-6 md:p-8 lg:p-12 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, type: 'spring' }}
          className="mb-12 text-center"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 mb-4">
            Welcome back, {user?.fullName || 'User'}!
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300">Your modern agricultural marketplace dashboard</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, type: 'spring' }}
          className="mb-12 flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center"
        >
          <Button
            onClick={handleBuyClick}
            size="large"
            className="flex items-center justify-center space-x-3 min-w-[160px] bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105"
          >
            <ShoppingCart className="h-5 w-5" />
            <span>Buy Products</span>
          </Button>
          <Button
            onClick={handleSellClick}
            size="large"
            className="flex items-center justify-center space-x-3 min-w-[160px] bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105"
          >
            <Upload className="h-5 w-5" />
            <span>Sell Products</span>
          </Button>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 + 0.5, type: 'spring' }}
            >
              <Card className="group relative overflow-hidden bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-gray-200/20 dark:border-gray-700/20">
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-10 group-hover:opacity-20 transition-opacity`}></div>
                <div
                  className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${stat.gradient} mb-4 shadow-md group-hover:shadow-lg transition-all`}
                >
                  <stat.icon className="h-8 w-8 text-white" />
                </div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{stat.title}</p>
                <p className="text-2xl font-extrabold text-gray-900 dark:text-white mb-2">{stat.value}</p>
                <div
                  className={`flex items-center text-sm font-medium ${
                    stat.trend === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                  }`}
                >
                  {stat.trend === 'up' ? <ArrowUpRight className="h-4 w-4 mr-1" /> : null}
                  {stat.change}
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 mb-12">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.6, type: 'spring' }}
            className="lg:col-span-2"
          >
            <Card className="p-6 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/20 dark:border-gray-700/20">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Recent Activity</h2>
                <Button
                  variant="outline"
                  className="text-sm border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800/50 rounded-lg shadow-sm"
                >
                  View All
                </Button>
              </div>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-gray-100/50 dark:bg-gray-800/50 rounded-xl hover:bg-gray-200/50 dark:hover:bg-gray-700/50 transition-all border border-gray-200/20 dark:border-gray-700/20 shadow-sm hover:shadow-md"
                  >
                    <div className="flex items-center space-x-4 mb-3 sm:mb-0">
                      <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl shadow-md">
                        <Activity className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{activity.description}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{activity.time}</p>
                      </div>
                    </div>
                    <div className="text-left sm:text-right w-full sm:w-auto">
                      {activity.amount && <p className="font-bold text-gray-900 dark:text-white">{activity.amount}</p>}
                      <span
                        className={`inline-flex px-3 py-1 text-sm font-medium rounded-full mt-2 sm:mt-0 shadow-sm ${
                          activity.status === 'completed'
                            ? 'bg-green-100/50 text-green-700 dark:bg-green-900/50 dark:text-green-300'
                            : activity.status === 'pending'
                            ? 'bg-yellow-100/50 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300'
                            : 'bg-blue-100/50 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300'
                        }`}
                      >
                        {activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.8, type: 'spring' }}
          >
            <Card className="p-6 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/20 dark:border-gray-700/20">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Quick Actions</h2>
              <div className="space-y-4">
                {quickActions.map((action, index) => (
                  <motion.button
                    key={index}
                    onClick={action.action}
                    className={`w-full text-left p-4 rounded-xl transition-all duration-300 border border-gray-200/20 dark:border-gray-700/20 hover:border-${action.color}-300/50 dark:hover:border-${action.color}-700/50 group bg-gradient-to-r from-gray-50/30 to-gray-100/30 dark:from-gray-900/30 dark:to-gray-800/30 hover:from-${action.color}-50/30 hover:to-${action.color}-100/30 dark:hover:from-${action.color}-900/30 dark:hover:to-${action.color}-800/30 shadow-sm hover:shadow-md`}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg bg-${action.color}-100/30 dark:bg-${action.color}-900/30 group-hover:bg-${action.color}-200/30 dark:group-hover:bg-${action.color}-800/30 transition-colors shadow-sm`}>
                        <action.icon className={`h-5 w-5 text-${action.color}-600 group-hover:text-${action.color}-700 dark:group-hover:text-${action.color}-500`} />
                      </div>
                      <div>
                        <h3 className={`text-base font-bold text-gray-900 dark:text-white group-hover:text-${action.color}-700 dark:group-hover:text-${action.color}-300 transition-colors`}>
                          {action.title}
                        </h3>
                        <p className={`text-sm text-gray-600 dark:text-gray-400 group-hover:text-${action.color}-600 dark:group-hover:text-${action.color}-400 transition-colors`}>
                          {action.description}
                        </p>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0, type: 'spring' }}
        >
          <Card className="p-6 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/20 dark:border-gray-700/20">
            <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Sales Overview</h2>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  className="text-sm border-gray-300 dark:border-gray-600 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 rounded-lg shadow-sm"
                >
                  7 Days
                </Button>
                <Button
                  variant="outline"
                  className="text-sm border-gray-300 dark:border-gray-600 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 rounded-lg shadow-sm"
                >
                  30 Days
                </Button>
                <Button className="text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm">90 Days</Button>
              </div>
            </div>
            <div className="h-64 sm:h-80 bg-gray-100/50 dark:bg-gray-800/50 rounded-2xl flex items-center justify-center border border-gray-200/20 dark:border-gray-700/20 overflow-hidden shadow-inner">
              <div className="text-center p-6">
                <div className="inline-flex p-6 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl mb-6 shadow-2xl">
                  <TrendingUp className="h-12 w-12 text-white" />
                </div>
                <p className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-2">Sales Analytics Coming Soon</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Advanced insights and interactive charts will be available</p>
              </div>
            </div>
          </Card>
        </motion.div>

        <AnimatePresence>
          {showOrdersSection && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center"
            >
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.95 }}
                className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-2xl p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto shadow-2xl border border-white/20 dark:border-gray-800/20"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Your Orders</h2>
                  <Button
                    variant="outline"
                    onClick={() => setShowOrdersSection(false)}
                    className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg shadow-sm"
                  >
                    Close
                  </Button>
                </div>
                <Orders />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
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
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onPaymentSuccess={fetchUserProfile}
      />

      <LiveChat />
    </div>
  );
};

export default Dashboard;
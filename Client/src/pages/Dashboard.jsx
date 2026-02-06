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
  Upload,
  ShoppingCart,
  Camera,
  LogOut,
  Moon,
  Sun,
  Wallet,
  CheckCircle,
  Truck,
  XCircle,
  Clock,
  X,
  MapPin,
  AlertTriangle
} from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { API_URL } from '../utils/apiConfig';
import Card from '../components/Card';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import VerificationModal from '../components/VerificationModal';
import ProductUploadModal from '../components/ProductUploadModal';
import ProfileImageUploadModal from '../components/ProfileImageUploadModal';
import PaymentModal from '../components/PaymentModal';
import Chart from 'chart.js/auto';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';

const EthiopianClock = ({ theme }) => {
  const { t, language } = useLanguage();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatLocalTime = (date) => {
    return date.toLocaleTimeString(language === 'am' ? 'am-ET' : 'en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const getEthiopianTime = (date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    // Ethiopian time starts at 6 AM (which is 12:00 in Ethiopian time)
    let ethiopianHour = (hours - 6 + 24) % 12;
    if (ethiopianHour === 0) ethiopianHour = 12;

    let periodKey = '';
    if (hours >= 6 && hours < 12) periodKey = 'morning';
    else if (hours >= 12 && hours < 18) periodKey = 'afternoon';
    else if (hours >= 18 && hours < 24) periodKey = 'evening';
    else periodKey = 'night';

    const pad = (num) => num.toString().padStart(2, '0');
    return `${ethiopianHour}:${pad(minutes)}:${pad(seconds)} ${t(`dashboard.time.periods.${periodKey}`)}`;
  };

  return (
    <div className={`flex flex-col sm:flex-row items-center gap-6 px-8 py-4 rounded-2xl border-2 shadow-xl animate-in fade-in slide-in-from-top-4 duration-700 ${theme === 'dark'
      ? 'bg-gray-800 border-blue-900'
      : 'bg-white border-blue-200'
      }`}>
      <div className="flex flex-col items-center sm:items-start">
        <span className={`text-[11px] uppercase tracking-[0.2em] font-extrabold mb-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>{t('dashboard.time.local')}</span>
        <span className={`text-2xl font-mono font-black tabular-nums tracking-widest ${theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>{formatLocalTime(time)}</span>
      </div>
      <div className={`hidden sm:block w-px h-10 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'
        }`}></div>
      <div className="flex flex-col items-center sm:items-start">
        <span className={`text-[11px] uppercase tracking-[0.2em] font-extrabold mb-1 ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'
          }`}>{t('dashboard.time.ethiopian')}</span>
        <span className={`text-2xl font-mono font-black tabular-nums tracking-widest ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'
          }`}>{getEthiopianTime(time)}</span>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { t } = useLanguage();
  const { user, isAuthenticated, loading, logout, setUser, fetchUserProfile } = useAuth();
  const navigate = useNavigate();
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [showProfileImageModal, setShowProfileImageModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showAllOrdersModal, setShowAllOrdersModal] = useState(false);
  const [showCustomersModal, setShowCustomersModal] = useState(false);
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [verificationStatus, setVerificationStatus] = useState(user?.govIdStatus || 'unverified');
  const [profileData, setProfileData] = useState({
    fullName: user?.fullName || '',
    phone: user?.phone || '',
    address: user?.address || '',
    location: user?.location || '',
  });
  const [error, setError] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();
  const theme = isDark ? 'dark' : 'light';
  const [stats, setStats] = useState([
    { title: t('dashboard.stats.posted'), value: t('dashboard.loading'), change: '0', trend: 'up', icon: Package, color: 'cyan', gradient: 'from-cyan-400 to-blue-500' },
    { title: t('dashboard.stats.totalOrders'), value: t('dashboard.loading'), change: '0', trend: 'up', icon: BarChart3, color: 'purple', gradient: 'from-purple-400 to-indigo-500' },
    { title: t('dashboard.stats.sold'), value: t('dashboard.loading'), change: '0', trend: 'up', icon: TrendingUp, color: 'teal', gradient: 'from-teal-400 to-cyan-500' },
    { title: t('dashboard.stats.rating'), value: t('dashboard.loading'), change: '0', trend: 'up', icon: Users, color: 'green', gradient: 'from-green-400 to-teal-500' },
  ]);
  const profileRef = useRef(null);
  const chartRef = useRef(null);
  const [chartInstance, setChartInstance] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState('90 Days');



  // Google Maps function
  const openGoogleMaps = (address) => {
    if (!address || address === 'Not specified') {
      toast.error('No delivery address available');
      return;
    }

    const encodedAddress = encodeURIComponent(address);
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
    window.open(googleMapsUrl, '_blank');
  };

  // Fetch customers from closeCustomers
  const fetchCustomers = async (closeCustomerIds = []) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setCustomers([]);
        return;
      }
      const customerPromises = closeCustomerIds.map(async (customerId) => {
        try {
          const response = await axios.get(`${API_URL}/api/users/${customerId.userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const { user } = response.data;
          return {
            _id: user.userId,
            fullName: user.fullName || 'Unknown',
            rank: user.rank || 0,
            customerRating: user.customerRating || 0,
            profilePic: user.profilePic || 'https://via.placeholder.com/150',
          };
        } catch (error) {
          console.error(`Error fetching customer ${customerId}:`, error);
          return null;
        }
      });
      const customerData = await Promise.all(customerPromises);
      setCustomers(customerData.filter(customer => customer));
    } catch (error) {
      console.error('Error fetching customers:', error);
      setCustomers([]);
      toast.error('Failed to fetch customer data');
    }
  };

  // Fetch user profile
  const fetchUserProfileLocal = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Please log in to continue');
      navigate('/login', { replace: true });
      return;
    }
    try {
      const response = await axios.get(`${API_URL}/api/users/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(response.data.user);
      setProfileData({
        fullName: response.data.user.fullName || 'Not set',
        phone: response.data.user.phone || 'Not set',
        address: response.data.user.address || 'Not set',
        location: response.data.user.location || 'Not set',
      });
      setVerificationStatus(response.data.user.govIdStatus || 'unverified');
      await updateStatsFromProfile(response.data.user);
      await fetchOrders(response.data.user.transactionHistory || []);
      await fetchCustomers(response.data.user.closeCustomers || []);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      localStorage.removeItem('token');
      setError('Failed to fetch user profile');
      navigate('/login', { replace: true });
    }
  };

  // FIXED: Fetch user's posted products with multiple fallbacks
  const fetchPostedProducts = async () => {
    try {
      const token = localStorage.getItem('token');

      let postedProducts = [];

      // Try the API endpoint first
      try {
        const response = await axios.get(`${API_URL}/api/products/my-products`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        postedProducts = response.data.products || [];
        console.log('Posted products from API:', postedProducts.length);
      } catch (apiError) {
        console.log('API endpoint failed, trying fallback...');

        // Fallback: get from user profile
        try {
          const userResponse = await axios.get(`${API_URL}/api/users/profile`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (userResponse.data.user && userResponse.data.user.postedProducts) {
            postedProducts = userResponse.data.user.postedProducts;
            console.log('Posted products from user profile:', postedProducts.length);
          }
        } catch (userError) {
          console.error('Error fetching user profile for products:', userError);
        }
      }

      return postedProducts;
    } catch (error) {
      console.error('Error fetching posted products:', error);
      return [];
    }
  };

  // FIXED: Update stats from profile data with better error handling
  const updateStatsFromProfile = async (userData) => {
    try {
      let postedProductsCount = 0;

      // Get posted products count with multiple fallbacks
      try {
        const postedProducts = await fetchPostedProducts();
        postedProductsCount = postedProducts.length || 0;

        // Final fallback - check userData directly
        if (postedProductsCount === 0 && userData.postedProducts) {
          postedProductsCount = userData.postedProducts.length || 0;
        }
      } catch (error) {
        console.error('Error getting posted products count:', error);
        // Use userData as last resort
        postedProductsCount = userData.postedProducts?.length || 0;
      }

      const totalOrdersCount = userData.transactionHistory?.length || 0;

      // Count sold products (transactions where user is seller and status is completed)
      const soldProductsCount = userData.transactionHistory?.filter(
        tx => tx.sellerUserId === userData.userId && tx.status === 'completed'
      ).length || 0;

      const customerRating = userData.customerRating || 0;

      setStats([
        { title: t('dashboard.stats.posted'), value: postedProductsCount, change: '0', trend: 'up', icon: Package, color: 'cyan', gradient: 'from-cyan-400 to-blue-500' },
        { title: t('dashboard.stats.totalOrders'), value: totalOrdersCount, change: '0', trend: 'up', icon: BarChart3, color: 'purple', gradient: 'from-purple-400 to-indigo-500' },
        { title: t('dashboard.stats.sold'), value: soldProductsCount, change: '0', trend: 'up', icon: TrendingUp, color: 'teal', gradient: 'from-teal-400 to-cyan-500' },
        { title: t('dashboard.stats.rating'), value: `${customerRating}/5`, change: '0', trend: 'up', icon: Users, color: 'green', gradient: 'from-green-400 to-teal-500' },
      ]);
    } catch (error) {
      console.error('Error updating stats:', error);
    }
  };

  // Fetch orders with enhanced information
  const fetchOrders = async (transactionIds = []) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setOrders([]);
        return;
      }
      const response = await axios.get(`${API_URL}/api/transactions/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const transactions = response.data.transactions || [];

      const enrichedOrders = await Promise.all(
        transactions.map(async (tx) => {
          try {
            if (!tx.productId || !tx.buyerUserId || !tx.sellerUserId) {
              return {
                ...tx,
                productName: 'Unknown Product',
                buyerName: 'Unknown Buyer',
                sellerName: 'Unknown Seller',
                totalPrice: tx.totalPrice || 0,
                deliveryAddress: tx.deliveryAddress || 'Not specified',
              };
            }

            let productName = 'Removed Product';
            let productImage = '';
            try {
              const productResponse = await axios.get(`${API_URL}/api/products/${tx.productId}`, {
                headers: { Authorization: `Bearer ${token}` },
              });
              productName = productResponse.data.product.title || 'Unknown Product';
              productImage = productResponse.data.product.images?.[0] || '';
            } catch (productError) {
              console.warn(`Product ${tx.productId} not found or deleted.`);
            }

            let buyerName = 'Unknown User';
            let buyerEmail = '';
            try {
              const buyerResponse = await axios.get(`${API_URL}/api/users/${tx.buyerUserId}`, {
                headers: { Authorization: `Bearer ${token}` },
              });
              buyerName = buyerResponse.data.user.fullName || 'Unknown';
              buyerEmail = buyerResponse.data.user.email || '';
            } catch (buyerError) {
              console.warn(`Buyer ${tx.buyerUserId} not found.`);
            }

            let sellerName = 'Unknown User';
            let sellerEmail = '';
            try {
              const sellerResponse = await axios.get(`${API_URL}/api/users/${tx.sellerUserId}`, {
                headers: { Authorization: `Bearer ${token}` },
              });
              sellerName = sellerResponse.data.user.fullName || 'Unknown';
              sellerEmail = sellerResponse.data.user.email || '';
            } catch (sellerError) {
              console.warn(`Seller ${tx.sellerUserId} not found.`);
            }

            return {
              ...tx,
              productName,
              productImage,
              buyerName,
              buyerEmail,
              sellerName,
              sellerEmail,
              totalPrice: tx.totalPrice || 0,
              deliveryAddress: tx.deliveryAddress || 'Not specified',
            };
          } catch (err) {
            console.error(`Error processing transaction ${tx._id || 'unknown'}:`, err);
            return {
              ...tx,
              productName: 'Unknown Product',
              buyerName: 'Unknown Buyer',
              sellerName: 'Unknown Seller',
              totalPrice: tx.totalPrice || 0,
              deliveryAddress: 'Not specified',
            };
          }
        })
      );
      setOrders(enrichedOrders.filter(order => order));
    } catch (error) {
      console.error('Error fetching enriched orders:', error);
      setOrders([]);
    }
  };
  // -------------------- Handle Mark as Shipped --------------------
  const handleDeliver = async (transactionId) => {
    try {
      const token = localStorage.getItem("token");

      // Mark order as shipped
      const response = await axios.post(
        `${API_URL}/api/transactions/mark-shipped/${transactionId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!response.data.success) throw new Error("Failed to mark product as shipped");

      // Find order info
      const transaction = orders.find((order) => order._id === transactionId);
      if (!transaction) {
        console.error("Transaction not found for ID:", transactionId);
        toast.error("Transaction not found");
        return;
      }

      console.log("Transaction found for shipping:", transaction);

      toast.success(" Product marked as shipped successfully!");
      fetchUserProfileLocal();

    } catch (error) {
      console.error("❌ Error in handleDeliver:", error);
      toast.error(error.response?.data?.error || error.message || "Failed to mark product as shipped");
    }
  };

  // -------------------- Handle Confirm Delivery --------------------
  const handleDelivered = async (transactionId) => {
    try {
      const token = localStorage.getItem("token");

      // Confirm delivery
      const response = await axios.post(
        `${API_URL}/api/transactions/confirm-delivery/${transactionId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!response.data.success) throw new Error("Failed to confirm delivery");

      // Find order info
      const transaction = orders.find((order) => order._id === transactionId);
      if (!transaction) {
        console.error("Transaction not found for ID:", transactionId);
        toast.error("Transaction not found");
        return;
      }

      console.log("Transaction found for delivery confirmation:", transaction);

      toast.success(" Delivery confirmed successfully!");
      fetchUserProfileLocal();

    } catch (error) {
      console.error("❌ Error in handleDelivered:", error);
      toast.error(error.response?.data?.error || error.message || "Failed to confirm delivery");
    }
  };



  const getStatusBadge = (status) => {
    const statusConfig = {
      completed: { color: 'bg-green-100 text-green-600 border-green-200', icon: CheckCircle },
      shipped: { color: 'bg-blue-100 text-blue-600 border-blue-200', icon: Truck },
      pending: { color: 'bg-yellow-100 text-yellow-600 border-yellow-200', icon: Clock },
      cancelled: { color: 'bg-red-100 text-red-600 border-red-200', icon: XCircle },
    };
    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;
    return (
      <span className={`inline-flex items-center px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-xs font-medium border ${config.color}`}>
        <Icon className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
        {t(`dashboard.status.${status}`) || status}
      </span>
    );
  };

  // Sales Overview Chart
  useEffect(() => {
    if (chartInstance) {
      chartInstance.destroy();
    }

    if (!chartRef.current || !user) return;

    const daysMap = { '7 Days': 7, '30 Days': 30, '90 Days': 90 };
    const days = daysMap[selectedPeriod];
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const filtered = orders.filter(
      (o) => o.status === 'completed' && o.sellerUserId === user?.userId && new Date(o.date) >= startDate && new Date(o.date) <= endDate
    );

    const dailySales = {};
    let d = new Date(startDate);
    while (d <= endDate) {
      const dateStr = d.toISOString().split('T')[0];
      dailySales[dateStr] = 0;
      d.setDate(d.getDate() + 1);
    }

    filtered.forEach((o) => {
      const dateStr = new Date(o.date).toISOString().split('T')[0];
      dailySales[dateStr] = (dailySales[dateStr] || 0) + o.totalPrice;
    });

    const labels = Object.keys(dailySales).sort();
    const data = labels.map((l) => dailySales[l]);

    const newChart = new Chart(chartRef.current, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: t('dashboard.chart.sales'),
          data,
          borderColor: theme === 'dark' ? '#FF6B6B' : '#4B6BFB',
          backgroundColor: theme === 'dark' ? 'rgba(255, 107, 107, 0.2)' : 'rgba(75, 107, 251, 0.2)',
          fill: true,
          tension: 0.4,
          pointRadius: 3,
          pointHoverRadius: 6,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            ticks: { color: theme === 'dark' ? '#E5E7EB' : '#374151', font: { size: 10 } },
            grid: { color: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)' },
            title: { display: true, text: t('dashboard.chart.date'), color: theme === 'dark' ? '#E5E7EB' : '#374151', font: { size: 12 } },
          },
          y: {
            beginAtZero: true,
            ticks: { color: theme === 'dark' ? '#E5E7EB' : '#374151', font: { size: 10 }, callback: (value) => `${value} ETB` },
            grid: { color: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)' },
            title: { display: true, text: t('dashboard.chart.salesAmount'), color: theme === 'dark' ? '#E5E7EB' : '#374151', font: { size: 12 } },
          },
        },
        plugins: {
          legend: { labels: { color: theme === 'dark' ? '#E5E7EB' : '#374151', font: { size: 12 } } },
          tooltip: { callbacks: { label: (context) => `${context.dataset.label}: ${context.parsed.y} ETB` } },
        },
        animation: {
          duration: 1000,
          easing: 'easeOutQuart',
        },
      },
    });

    setChartInstance(newChart);

    return () => {
      if (newChart) newChart.destroy();
    };
  }, [orders, selectedPeriod, theme, user]);

  let quickActions = [
    {
      title: t('dashboard.quickActions.addProduct'),
      description: t('dashboard.quickActions.addProductDesc'),
      action: () => handleSellClick(),
      icon: Upload,
      color: 'blue',
    },
    {
      title: t('dashboard.quickActions.addBalance'),
      description: t('dashboard.quickActions.addBalanceDesc'),
      action: () => setShowPaymentModal(true),
      icon: Wallet,
      color: 'indigo',
    },
    {
      title: t('dashboard.quickActions.viewCustomers'),
      description: t('dashboard.quickActions.viewCustomersDesc'),
      action: () => setShowCustomersModal(true),
      icon: Users,
      color: 'teal',
    },
    {
      title: t('dashboard.quickActions.about'),
      description: t('dashboard.quickActions.aboutDesc'),
      action: () => navigate('/about'),
      icon: Users,
      color: 'purple',
    },
  ];

  if (verificationStatus !== 'verified') {
    quickActions.unshift({
      title: t('dashboard.quickActions.verifyAccount'),
      description: t('dashboard.quickActions.verifyAccountDesc'),
      action: () => setShowVerificationModal(true),
      icon: CheckCircle,
      color: 'green',
    });
  }

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
      formData.append('role', data.role);
      await axios.post(`${API_URL}/api/users/verify-id`, formData, {
        headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` },
      });
      setVerificationStatus('pending');
      setShowVerificationModal(false);
      await axios.patch(
        `${API_URL}/api/users/profile`,
        { fullName: data.name },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchUserProfileLocal();
      toast.success('Government ID uploaded, pending verification');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Verification failed');
    }
  };

  const handleProductSubmit = async (productData) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/api/products`, productData, {
        headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` },
      });
      setShowProductModal(false);
      toast.success('Product uploaded successfully');
      fetchUserProfileLocal(); // Refresh stats to update posted products count
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
      await axios.post(`${API_URL}/api/users/profile-pic`, formData, {
        headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` },
      });
      fetchUserProfileLocal();
      toast.success('Profile image updated');
    } catch (error) {
      console.error('Profile image upload error:', error);
      toast.error(error.response?.data?.error || error.message || 'Failed to update profile image');
    }
  };

  const saveProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `${API_URL}/api/users/profile`,
        profileData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchUserProfileLocal();
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error(error.response?.data?.error || error.message || 'Failed to update profile');
    }
  };

  const handleBuyClick = () => {
    if (verificationStatus === 'rejected') {
      // Allow user to reapply after rejection
      setShowVerificationModal(true);
      return;
    }
    if (verificationStatus !== 'verified') {
      setShowVerificationModal(true);
      return;
    }
    navigate('/marketplace');
  };

  const handleSellClick = () => {
    if (verificationStatus === 'rejected') {
      // Allow user to reapply after rejection
      setShowVerificationModal(true);
      return;
    }
    if (verificationStatus !== 'verified') {
      setShowVerificationModal(true);
      return;
    }
    setShowProductModal(true);
  };

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login', { replace: true });
    } else if (!loading) {
      fetchUserProfileLocal();
    }
  }, [loading, isAuthenticated, navigate, setUser]);

  useEffect(() => {
    if (user) {
      setProfileData({
        fullName: user.fullName || 'Not set',
        phone: user.phone || 'Not set',
        address: user.address || 'Not set',
        location: user.location || 'Not set',
      });
      setVerificationStatus(user.govIdStatus || 'unverified');
      updateStatsFromProfile(user);
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-8 h-8 sm:w-10 sm:h-10 border-4 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (error && !user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4">
        <div className="text-center py-6 px-4 sm:px-6 text-sm sm:text-base text-red-500 bg-red-100/90 dark:bg-red-900/90 rounded-xl border border-red-200 dark:border-red-700 shadow-lg backdrop-blur-sm">
          {error}
          <Button
            onClick={() => {
              setError(null);
              fetchUserProfileLocal();
            }}
            className="mt-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-1.5 px-3 sm:px-4 text-xs sm:text-sm shadow-md hover:shadow-lg transition-all"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-20">
        {user?.isRestricted && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8 p-4 bg-red-100 border-2 border-red-500 rounded-xl flex items-center gap-4 text-red-700 shadow-lg"
          >
            <div className="bg-red-500 p-2 rounded-full text-white">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg">{t('dashboard.profile.accountRestricted')}</h3>
              <p className="text-sm">{t('dashboard.profile.restrictedMessage')}</p>
            </div>
          </motion.div>
        )}

        {/* Profile Section */}
        <div ref={profileRef} className="fixed top-4 right-4 z-50">
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center justify-center w-10 h-10 rounded-full overflow-hidden border-2 border-blue-300/50 dark:border-blue-600/50 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 bg-white/10 dark:bg-gray-800/10 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Toggle profile menu"
          >
            {user?.profilePic ? (
              <img src={user.profilePic} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <span className="text-sm font-bold text-white bg-gradient-to-br from-blue-500 to-indigo-600 w-full h-full flex items-center justify-center">
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
                transition={{ duration: 0.3 }}
                className="absolute right-0 mt-2 w-64 sm:w-72 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg rounded-xl shadow-xl border border-blue-200/30 dark:border-blue-700/30 overflow-hidden"
              >
                <div className="flex items-center space-x-3 p-3 border-b border-blue-200/50 dark:border-blue-700/50 bg-gradient-to-r from-blue-50/30 to-indigo-50/30 dark:from-gray-800/30 dark:to-gray-700/30">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-blue-300/50 dark:border-blue-600/50 group">
                    {user?.profilePic ? (
                      <img src={user.profilePic} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-sm font-bold text-white bg-gradient-to-br from-blue-500 to-indigo-600 w-full h-full flex items-center justify-center">
                        {user?.fullName?.[0] || 'U'}
                      </span>
                    )}
                    <div
                      className="absolute inset-0 bg-blue-900/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowProfileImageModal(true);
                      }}
                      aria-label="Upload profile picture"
                    >
                      <Camera className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white">{profileData.fullName}</h3>
                    <span
                      className={`inline-block text-xs px-2 py-0.5 rounded-full mt-1 ${verificationStatus === 'verified'
                        ? 'bg-green-100 text-green-600 border-green-200'
                        : verificationStatus === 'pending'
                          ? 'bg-yellow-100 text-yellow-600 border-yellow-200'
                          : 'bg-red-100 text-red-600 border-red-200'
                        }`}
                    >
                      {t(`dashboard.status.${verificationStatus}`)}
                    </span>
                  </div>
                </div>
                <div className="p-3 space-y-2 max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-400 dark:scrollbar-thumb-blue-600">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">{t('dashboard.profile.email')}</label>
                    <p className="w-full px-2 py-1 rounded-lg bg-blue-100/20 dark:bg-blue-900/20 text-gray-900 dark:text-white text-xs shadow-sm">
                      {user?.email || t('dashboard.profile.notSet')}
                    </p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">{t('dashboard.profile.balance')}</label>
                    <div className="flex items-center space-x-2 w-full px-2 py-1 rounded-lg bg-blue-100/20 dark:bg-blue-900/20 text-gray-900 dark:text-white text-xs shadow-sm">
                      <Wallet className="h-3 w-3 text-blue-500 dark:text-blue-400" />
                      <p>{user?.balance?.toFixed(2) || '0.00'} ETB</p>
                    </div>
                  </div>


                  {[
                    { label: t('dashboard.profile.fullName'), key: 'fullName', type: 'text' },
                    { label: t('dashboard.profile.phone'), key: 'phone', type: 'tel' },
                    { label: t('dashboard.profile.address'), key: 'address', type: 'text' },
                    { label: t('dashboard.profile.location'), key: 'location', type: 'text' },
                  ].map((field) => (
                    <div key={field.key}>
                      <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">{field.label}</label>
                      <input
                        type={field.type}
                        value={profileData[field.key]}
                        onChange={(e) => setProfileData({ ...profileData, [field.key]: e.target.value })}
                        className="w-full px-2 py-1 rounded-lg bg-blue-100/20 dark:bg-blue-900/20 border border-blue-200/50 dark:border-blue-700/50 text-gray-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm"
                        placeholder={`${t('dashboard.profile.enter')} ${field.label.toLowerCase()}`}
                        aria-label={field.label}
                      />
                    </div>
                  ))}
                </div>
                <div className="border-t border-blue-200/50 dark:border-blue-700/50 p-3 space-y-2 bg-gradient-to-r from-blue-50/30 to-indigo-50/30 dark:from-gray-800/30 dark:to-gray-700/30">
                  <Button
                    onClick={saveProfile}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-1.5 text-xs shadow-md hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label="Save profile changes"
                  >
                    {t('dashboard.profile.saveChanges')}
                  </Button>
                  <Button
                    onClick={toggleTheme}
                    variant="outline"
                    className="w-full flex items-center justify-center space-x-2 border-blue-300/50 dark:border-blue-600/50 text-blue-600 dark:text-blue-400 bg-blue-100/10 dark:bg-blue-900/10 hover:bg-blue-200/20 dark:hover:bg-blue-800/20 text-xs rounded-lg py-1.5 shadow-md hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
                  >
                    {!isDark ? <Moon className="h-3 w-3" /> : <Sun className="h-3 w-3" />}
                    <span>{isDark ? t('dashboard.profile.lightMode') : t('dashboard.profile.darkMode')}</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full flex items-center justify-center space-x-2 border-red-300/50 dark:border-red-600/50 text-red-600 dark:text-red-400 bg-red-100/10 dark:bg-red-900/10 hover:bg-red-200/20 dark:hover:bg-red-800/20 text-xs rounded-lg py-1.5 shadow-md hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-red-500"
                    onClick={logout}
                    aria-label="Logout"
                  >
                    <LogOut className="h-3 w-3" />
                    <span>{t('dashboard.profile.logout')}</span>
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="mb-12 flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-1"
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 dark:text-white mb-4 tracking-tight">
              {t('dashboard.welcome')}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">{user?.fullName}!</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 font-medium max-w-2xl">
              {t('dashboard.subtitle')}
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <button
                onClick={handleBuyClick}
                className="group flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-lg hover:shadow-blue-500/30 transition-all duration-300 hover:scale-105 active:scale-95"
              >
                <ShoppingCart className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                {t('dashboard.buyProducts')}
              </button>
              <button
                onClick={handleSellClick}
                className="group flex items-center gap-3 bg-emerald-500/10 hover:bg-emerald-500 dark:bg-emerald-500/30 text-emerald-600 dark:text-emerald-300 hover:text-white px-8 py-4 rounded-2xl font-bold text-lg border-2 border-emerald-500/30 dark:border-emerald-400/50 transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg shadow-emerald-500/10"
              >
                <Upload className="w-6 h-6 group-hover:-translate-y-1 transition-transform" />
                {t('dashboard.sellProducts')}
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col items-center lg:items-end gap-4"
          >
            <EthiopianClock theme={theme} />
          </motion.div>
        </div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
            >
              <Card className="group relative overflow-hidden bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm p-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-blue-200/20 dark:border-blue-700/20">
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-10 group-hover:opacity-20 transition-opacity`}></div>
                <div className={`p-2 rounded-lg bg-gradient-to-br ${stat.gradient} mb-3 shadow-sm`}>
                  <stat.icon className="h-5 w-5 text-white" />
                </div>
                <p className="text-xs font-medium text-gray-600 dark:text-gray-300">{stat.title}</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">{stat.value}</p>
                <div className={`flex items-center text-xs ${stat.trend === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {stat.trend === 'up' ? <ArrowUpRight className="h-3 w-3 mr-1" /> : null}
                  {stat.change}
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="lg:col-span-2"
          >
            <Card className="p-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-xl shadow-md border border-blue-200/20 dark:border-blue-700/20">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-4">{t('dashboard.recentActivity')}</h2>
              <div className="space-y-3">
                {orders.length > 0 ? (
                  orders.slice(0, 5).map((order, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 bg-blue-100/10 dark:bg-blue-900/10 rounded-lg hover:bg-blue-100/20 dark:hover:bg-blue-900/20 transition-all border border-blue-200/20 dark:border-blue-700/20"
                    >
                      <div className="flex items-center space-x-3 mb-2 sm:mb-0">
                        <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg shadow-sm">
                          <Activity className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white text-sm">
                            {order.sellerUserId === user?.userId ? (
                              <>
                                {t('dashboard.activity.youSold')} <span className="font-bold">{order.productName}</span> {t('dashboard.activity.to')} {order.buyerUserId === user?.userId ? t('dashboard.activity.you') : order.buyerName}
                              </>
                            ) : (
                              <>
                                {t('dashboard.activity.youPurchased')} <span className="font-bold">{order.productName}</span> {t('dashboard.activity.from')} {order.sellerUserId === user?.userId ? t('dashboard.activity.you') : order.sellerName}
                              </>
                            )}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-300">{new Date(order.date).toLocaleString()}</p>
                          {/* UPDATED: Google Maps integration for delivery address */}
                          <div className="flex items-center space-x-1 mt-1">
                            <MapPin className="h-3 w-3 text-blue-500" />
                            <button
                              onClick={() => openGoogleMaps(order.deliveryAddress)}
                              className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline cursor-pointer transition-colors"
                              title="Open in Google Maps"
                            >
                              {order.deliveryAddress}
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                        <p className="font-bold text-gray-900 dark:text-white text-sm">{order.totalPrice.toFixed(2)} ETB</p>
                        {getStatusBadge(order.status)}
                        {order.status === 'pending' && order.sellerUserId === user?.userId && (
                          <Button
                            onClick={() => handleDeliver(order._id)}
                            className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-1 px-3 text-xs shadow-sm hover:shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
                            aria-label={t('dashboard.actions.markShipped')}
                          >
                            {t('dashboard.actions.markShipped')}
                          </Button>
                        )}
                        {order.status === 'shipped' && order.buyerUserId === user?.userId && (
                          <Button
                            onClick={() => handleDelivered(order._id)}
                            className="bg-green-600 hover:bg-green-700 text-white rounded-lg py-1 px-3 text-xs shadow-sm hover:shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-green-500"
                            aria-label={t('dashboard.actions.confirmDelivery')}
                          >
                            {t('dashboard.actions.confirmDelivery')}
                          </Button>
                        )}
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <p className="text-gray-600 dark:text-gray-300 text-sm">{t('dashboard.noActivity')}</p>
                )}
              </div>
              {orders.length > 5 && (
                <Button
                  onClick={() => setShowAllOrdersModal(true)}
                  className="mt-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-1.5 px-4 text-sm shadow-sm hover:shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label={t('dashboard.viewAllOrders') || "View All Orders"}
                >
                  {t('dashboard.viewAllOrders') || "View All Orders"}
                </Button>
              )}
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Card className="p-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-xl shadow-md border border-blue-200/20 dark:border-blue-700/20">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-4">{t('dashboard.quickActions.title')}</h2>
              <div className="space-y-3">
                {quickActions.map((action, index) => (
                  <motion.button
                    key={index}
                    onClick={action.action}
                    className={`w-full text-left p-3 rounded-lg transition-all duration-300 border border-blue-200/20 dark:border-blue-700/20 hover:bg-${action.color}-100/10 dark:hover:bg-${action.color}-900/10 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-${action.color}-500`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    aria-label={action.title}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg bg-${action.color}-100/20 dark:bg-${action.color}-900/20`}>
                        <action.icon className={`h-4 w-4 text-${action.color}-500`} />
                      </div>
                      <div>
                        <h3 className={`text-sm font-bold text-gray-900 dark:text-white`}>{action.title}</h3>
                        <p className={`text-xs text-gray-600 dark:text-gray-300`}>{action.description}</p>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Card className="p-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-xl shadow-md border border-blue-200/20 dark:border-blue-700/20 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-100/10 to-indigo-100/10 dark:from-blue-900/10 dark:to-indigo-900/10 opacity-50"></div>
            <div className="flex flex-col sm:flex-row items-center justify-between mb-4 gap-3">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">{t('dashboard.salesOverview')}</h2>
              <div className="flex flex-wrap gap-2">
                {[
                  { key: '7 Days', label: t('dashboard.periods.d7') },
                  { key: '30 Days', label: t('dashboard.periods.d30') },
                  { key: '90 Days', label: t('dashboard.periods.d90') }
                ].map((period) => (
                  <Button
                    key={period.key}
                    variant={selectedPeriod === period.key ? undefined : 'outline'}
                    className={`py-1 px-3 text-xs rounded-lg transition-all duration-300 ${selectedPeriod === period.key
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-sm'
                      : 'border-blue-300/50 dark:border-blue-600/50 text-blue-600 dark:text-blue-400 hover:bg-blue-100/10 dark:hover:bg-blue-900/10'
                      }`}
                    onClick={() => setSelectedPeriod(period.key)}
                    aria-label={`Show sales for ${period.label}`}
                  >
                    {period.label}
                  </Button>
                ))}
              </div>
            </div>
            <div className="h-48 sm:h-64 relative">
              <canvas ref={chartRef}></canvas>
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
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onPaymentSuccess={fetchUserProfileLocal}
      />
      <AnimatePresence>
        {showAllOrdersModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white/95 dark:bg-gray-900/95 rounded-xl shadow-xl max-w-4xl w-full max-h-[80vh] overflow-hidden"
            >
              <div className="p-4 flex justify-between items-center border-b border-blue-200/20 dark:border-blue-700/20">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">All Orders</h2>
                <Button
                  onClick={() => setShowAllOrdersModal(false)}
                  className="bg-red-600 hover:bg-red-700 text-white rounded-lg py-1 px-2 text-xs shadow-sm hover:shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-red-500"
                  aria-label="Close orders popup"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="p-4 max-h-[60vh] overflow-y-auto scrollbar-thin scrollbar-thumb-blue-400 dark:scrollbar-thumb-blue-600">
                <div className="space-y-3">
                  {orders.map((order, index) => (
                    <div
                      key={index}
                      className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 bg-blue-100/10 dark:bg-blue-900/10 rounded-lg hover:bg-blue-100/20 dark:hover:bg-blue-900/20 transition-all border border-blue-200/20 dark:border-blue-700/20"
                    >
                      <div className="flex items-center space-x-3 mb-2 sm:mb-0">
                        <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg shadow-sm">
                          <Activity className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white text-sm">
                            {order.sellerUserId === user?.userId ? (
                              <>
                                You sold <span className="font-bold">{order.productName}</span> to {order.buyerUserId === user?.userId ? 'You' : order.buyerName}
                              </>
                            ) : (
                              <>
                                You purchased <span className="font-bold">{order.productName}</span> from {order.sellerUserId === user?.userId ? 'You' : order.sellerName}
                              </>
                            )}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-300">{new Date(order.date).toLocaleString()}</p>
                          {/* UPDATED: Google Maps integration for delivery address */}
                          <div className="flex items-center space-x-1 mt-1">
                            <MapPin className="h-3 w-3 text-blue-500" />
                            <span className="text-xs text-gray-500 dark:text-gray-400">Delivery Address:</span>
                            <button
                              onClick={() => openGoogleMaps(order.deliveryAddress)}
                              className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline cursor-pointer transition-colors ml-1"
                              title="Open in Google Maps"
                            >
                              {order.deliveryAddress}
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                        <p className="font-bold text-gray-900 dark:text-white text-sm">{order.totalPrice.toFixed(2)} ETB</p>
                        {getStatusBadge(order.status)}
                        {order.status === 'pending' && order.sellerUserId === user?.userId && (
                          <Button
                            onClick={() => handleDeliver(order._id)}
                            className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-1 px-3 text-xs shadow-sm hover:shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
                            aria-label="Mark as shipped"
                          >
                            Mark Shipped
                          </Button>
                        )}
                        {order.status === 'shipped' && order.buyerUserId === user?.userId && (
                          <Button
                            onClick={() => handleDelivered(order._id)}
                            className="bg-green-600 hover:bg-green-700 text-white rounded-lg py-1 px-3 text-xs shadow-sm hover:shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-green-500"
                            aria-label="Confirm delivery"
                          >
                            Confirm Delivery
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                  {orders.length === 0 && (
                    <p className="text-gray-600 dark:text-gray-300 text-sm">No orders found.</p>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Modal
        isOpen={showCustomersModal}
        onClose={() => setShowCustomersModal(false)}
        title="Customers"
        size="lg"
      >
        <div className="bg-white/95 dark:bg-gray-900/95 rounded-xl shadow-md">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Customer List</h2>
              <Button
                onClick={() => setShowCustomersModal(false)}
                className="bg-red-600 hover:bg-red-700 text-white rounded-lg py-1 px-3 text-xs shadow-sm hover:shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-red-500"
                aria-label="Close customers modal"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
            <div className="max-h-[60vh] overflow-y-auto space-y-3 pr-1 scrollbar-thin scrollbar-thumb-blue-400 dark:scrollbar-thumb-gray-600">
              {customers.map((customer, index) => (
                <div
                  key={index}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 bg-blue-100/10 dark:bg-blue-900/10 rounded-lg hover:bg-blue-100/20 dark:hover:bg-blue-900/20 transition-all border border-blue-200/20 dark:border-blue-700/20"
                >
                  <div className="flex items-center space-x-3 mb-2 sm:mb-0">
                    <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0 border-2 border-white dark:border-gray-700 shadow-sm">
                      <img src={customer.profilePic} alt={customer.fullName} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white text-sm">{customer.fullName}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-300">Rank: {customer.rank || 'N/A'}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-300">Rating: {customer.customerRating}/5</p>
                    </div>
                  </div>
                </div>
              ))}
              {customers.length === 0 && (
                <p className="text-gray-600 dark:text-gray-300 text-sm italic text-center py-4">No customers found.</p>
              )}
            </div>
          </div>
          <div className="p-4 flex justify-end">
            <Button
              onClick={() => setShowCustomersModal(false)}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-1.5 px-4 text-sm shadow-sm hover:shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Close customers modal"
            >
              Close
            </Button>
          </div>
        </div>
      </Modal>
      <LiveChat />
    </div>
  );
};

export default Dashboard;

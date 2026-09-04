import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  BarChart3, TrendingUp, Users, Package, Activity,
  Upload, ShoppingCart, Wallet, CheckCircle,
  Truck, XCircle, Clock, X, AlertTriangle, Loader2, Save, Sun, Moon,
  Calendar, ArrowRight, Phone, MapPin, Home, Store, List, User, Bell, CheckCheck
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

// =========================== CONSTANTS ===========================
const ORDER_STATUS = {
  PENDING: 'pending',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled'
};

const VERIFICATION_STATUS = {
  UNVERIFIED: 'unverified',
  PENDING: 'pending',
  VERIFIED: 'verified',
  REJECTED: 'rejected'
};

// =========================== HELPER COMPONENTS ===========================
const EthiopianClock = React.memo(({ theme }) => {
  const { t, language } = useLanguage();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatLocalTime = (date) => date.toLocaleTimeString(
    language === 'am' ? 'am-ET' : 'en-US',
    { hour: '2-digit', minute: '2-digit', second: '2-digit' }
  );

  const getEthiopianTime = (date) => {
    let h = (date.getHours() - 6 + 24) % 12 || 12;
    const period = h >= 6 && h < 12 ? 'morning' : h >= 12 && h < 18 ? 'afternoon' : h >= 18 && h < 24 ? 'evening' : 'night';
    return `${h}:${date.getMinutes().toString().padStart(2,'0')}:${date.getSeconds().toString().padStart(2,'0')} ${t(`dashboard.time.periods.${period}`)}`;
  };

  return (
    <div className={`flex flex-col sm:flex-row items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 rounded-xl border shadow-md ${theme === 'dark' ? 'bg-gray-800 border-blue-900' : 'bg-white border-blue-200'}`}>
      <div className="flex flex-col items-center sm:items-start">
        <span className={`text-[8px] sm:text-[9px] uppercase tracking-wide font-bold mb-0.5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{t('dashboard.time.local')}</span>
        <span className={`text-xs sm:text-sm font-mono font-black ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{formatLocalTime(time)}</span>
      </div>
      <div className={`hidden sm:block w-px h-6 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'}`} />
      <div className="flex flex-col items-center sm:items-start">
        <span className={`text-[8px] sm:text-[9px] uppercase tracking-wide font-bold mb-0.5 ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'}`}>{t('dashboard.time.ethiopian')}</span>
        <span className={`text-xs sm:text-sm font-mono font-black ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'}`}>{getEthiopianTime(time)}</span>
      </div>
    </div>
  );
});

const StatusBadge = ({ status }) => {
  const config = {
    [ORDER_STATUS.DELIVERED]: { color: 'bg-green-100 text-green-600 border-green-200', icon: CheckCircle, label: 'Delivered' },
    [ORDER_STATUS.SHIPPED]: { color: 'bg-blue-100 text-blue-600 border-blue-200', icon: Truck, label: 'Shipped' },
    [ORDER_STATUS.PENDING]: { color: 'bg-yellow-100 text-yellow-600 border-yellow-200', icon: Clock, label: 'Pending' },
    [ORDER_STATUS.CANCELLED]: { color: 'bg-red-100 text-red-600 border-red-200', icon: XCircle, label: 'Cancelled' }
  };
  const { color, icon: Icon, label } = config[status] || config[ORDER_STATUS.PENDING];
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium border ${color}`}>
      <Icon className="w-3 h-3 mr-1" />
      {label}
    </span>
  );
};

const StatsCard = ({ title, value, icon: Icon, gradient }) => (
  <Card className="p-2 sm:p-3 bg-white/90 dark:bg-gray-900/90 rounded-lg shadow-sm">
    <div className={`p-1.5 rounded-lg bg-gradient-to-br ${gradient} inline-block mb-1 sm:mb-2`}>
      <Icon className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
    </div>
    <p className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-300">{title}</p>
    <p className="text-base sm:text-xl font-bold">{value}</p>
  </Card>
);

// Mobile Bottom Navigation Bar
const MobileBottomNav = ({ activeTab, setActiveTab, navigate }) => {
  const navItems = [
    { id: 'dashboard', icon: Home, label: 'Home', action: () => { setActiveTab('dashboard'); window.scrollTo({ top: 0, behavior: 'smooth' }); } },
    { id: 'marketplace', icon: Store, label: 'Market', action: () => navigate('/marketplace') },
    { id: 'orders', icon: List, label: 'Orders', action: () => { setActiveTab('orders'); document.getElementById('orders-section')?.scrollIntoView({ behavior: 'smooth' }); } },
    { id: 'profile', icon: User, label: 'Profile', action: () => { setActiveTab('profile'); document.getElementById('profile-dropdown-btn')?.click(); } },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-t border-gray-200 dark:border-gray-800 shadow-lg sm:hidden">
      <div className="flex justify-around items-center py-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={item.action}
            className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition ${
              activeTab === item.id ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            <item.icon size={22} />
            <span className="text-[10px] font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

// =========================== MAIN DASHBOARD COMPONENT ===========================
const Dashboard = () => {
  const { t } = useLanguage();
  const { user, isAuthenticated, loading, logout, setUser } = useAuth();
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const theme = isDark ? 'dark' : 'light';

  const [mobileActiveTab, setMobileActiveTab] = useState('dashboard');
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [showProfileImageModal, setShowProfileImageModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showCustomersModal, setShowCustomersModal] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const [allTransactions, setAllTransactions] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [profileData, setProfileData] = useState({ fullName: '', phone: '', address: '', location: '' });
  const [verificationStatus, setVerificationStatus] = useState(VERIFICATION_STATUS.UNVERIFIED);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loadingNotifications, setLoadingNotifications] = useState(false);

  const [stats, setStats] = useState([
    { title: 'Posted', value: '0', icon: Package, gradient: 'from-cyan-400 to-blue-500' },
    { title: 'Total Orders', value: '0', icon: BarChart3, gradient: 'from-purple-400 to-indigo-500' },
    { title: 'Sold', value: '0', icon: TrendingUp, gradient: 'from-teal-400 to-cyan-500' },
    { title: 'Rating', value: '0/5', icon: Users, gradient: 'from-green-400 to-teal-500' },
  ]);

  const [error, setError] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState('90 Days');
  const [actionLoading, setActionLoading] = useState({});
  const [ordersTab, setOrdersTab] = useState('buying');
  const [identityCard, setIdentityCard] = useState(null);
  const profileRef = useRef(null);
  const notificationRef = useRef(null);
  const chartRef = useRef(null);
  const [chartInstance, setChartInstance] = useState(null);

  const openGoogleMaps = (addr) => {
    if (!addr || addr === 'Not specified') return toast.error('No delivery address');
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addr)}`, '_blank');
  };

  const normalizeVerificationStatus = (raw) => {
    if (raw === 'approved' || raw === 'verified') return VERIFICATION_STATUS.VERIFIED;
    if (raw === 'pending') return VERIFICATION_STATUS.PENDING;
    if (raw === 'rejected') return VERIFICATION_STATUS.REJECTED;
    return VERIFICATION_STATUS.UNVERIFIED;
  };

  // =========================== NOTIFICATION API ===========================
  const fetchNotifications = useCallback(async () => {
    const token = sessionStorage.getItem('token');
    if (!token) return;
    setLoadingNotifications(true);
    try {
      const { data } = await axios.get(`${API_URL}/api/notifications`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (data.success) {
        const unreadOnly = (data.notifications || []).filter(n => !n.isRead);
        setNotifications(unreadOnly);
        setUnreadCount(unreadOnly.length);
      }
    } catch (err) {
      console.error('Failed to fetch notifications', err);
    } finally {
      setLoadingNotifications(false);
    }
  }, []);

  const fetchUnreadCount = useCallback(async () => {
    const token = sessionStorage.getItem('token');
    if (!token) return;
    try {
      const { data } = await axios.get(`${API_URL}/api/notifications/unread-count`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (data.success) {
        setUnreadCount(data.count);
      }
    } catch (err) {
      console.error('Failed to fetch unread count', err);
    }
  }, []);

  const markNotificationAsRead = useCallback(async (notificationId) => {
    const token = sessionStorage.getItem('token');
    try {
      await axios.patch(`${API_URL}/api/notifications/${notificationId}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(prev => {
        const removed = prev.find(n => n._id === notificationId);
        if (removed && !removed.isRead) {
          setUnreadCount(prevCount => Math.max(0, prevCount - 1));
        }
        return prev.filter(n => n._id !== notificationId);
      });
    } catch (err) {
      console.error('Failed to mark as read', err);
    }
  }, []);

  const markAllNotificationsAsRead = useCallback(async () => {
    const token = sessionStorage.getItem('token');
    try {
      await axios.patch(`${API_URL}/api/notifications/read-all`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications([]);
      setUnreadCount(0);
      toast.success('All notifications cleared');
    } catch (err) {
      console.error('Failed to mark all as read', err);
      toast.error('Could not clear notifications');
    }
  }, []);

  const handleNotificationClick = useCallback(async (notification) => {
    await markNotificationAsRead(notification._id);
    setIsNotificationOpen(false);

    if (notification.type === 'order_shipped' || notification.type === 'order_delivered' || notification.type === 'new_order') {
      const isBuyerNotification = notification.type === 'order_shipped' || notification.type === 'order_delivered';
      if (isBuyerNotification) {
        setOrdersTab('buying');
      } else {
        setOrdersTab('selling');
      }
      const ordersSection = document.getElementById('orders-section');
      if (ordersSection) {
        ordersSection.scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => {
          const orderCard = document.getElementById(`order-${notification.relatedTransactionId}`);
          if (orderCard) {
            orderCard.classList.add('ring-2', 'ring-blue-500', 'bg-blue-50');
            setTimeout(() => {
              orderCard.classList.remove('ring-2', 'ring-blue-500', 'bg-blue-50');
            }, 3000);
          }
        }, 500);
      }
    } else if (notification.type === 'product_approved' || notification.type === 'product_rejected') {
      navigate('/my-products');
    } else {
      toast.info(notification.message);
    }
  }, [markNotificationAsRead, navigate, setOrdersTab]);

  // =========================== OTHER API CALLS ===========================
  const fetchPostedProducts = useCallback(async () => {
    const token = sessionStorage.getItem('token');
    try {
      const { data } = await axios.get(`${API_URL}/api/products/my-products`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return data.products || [];
    } catch { return []; }
  }, []);

  const fetchTransactions = useCallback(async (currentUserId) => {
    const token = sessionStorage.getItem('token');
    if (!token) return setAllTransactions([]);
    try {
      const { data } = await axios.get(`${API_URL}/api/transactions/my`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (data.success && data.transactions) {
        const formatted = data.transactions.map(tx => {
          const rawStatus = tx.status || 'pending';
          const normalizedStatus = rawStatus.toLowerCase();
          const isBuyer = String(tx.buyerUserId) === String(currentUserId);
          return {
            _id: tx._id,
            productName: tx.productId?.title || 'Unknown Product',
            totalPrice: tx.totalPrice || 0,
            status: normalizedStatus,
            deliveryAddress: tx.deliveryAddress || '-',
            createdAt: tx.createdAt || new Date().toISOString(),
            isBuyer,
            sellerId: tx.sellerId,
            buyerId: tx.buyerId,
            productImg: tx.productId?.images?.[0] || 'https://via.placeholder.com/100',
            seller: {
              name: tx.sellerDetails?.fullName || 'Seller',
              phone: tx.sellerDetails?.phone || '+251 ...',
              address: tx.deliveryAddress || 'Ethiopia',
              img: tx.sellerDetails?.profilePic || 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
            },
            buyer: {
              name: isBuyer ? 'You' : `Buyer #${String(tx.buyerUserId).slice(-4)}`,
              phone: 'Hidden',
              address: tx.deliveryAddress,
              img: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
            }
          };
        });
        setAllTransactions(formatted);
        return formatted;
      } else {
        setAllTransactions([]);
        return [];
      }
    } catch (err) {
      console.error('Transactions fetch error:', err);
      setAllTransactions([]);
      return [];
    }
  }, []);

  const fetchCustomers = useCallback(async (closeIds) => {
    if (!closeIds?.length) return setCustomers([]);
    const token = sessionStorage.getItem('token');
    const userIds = closeIds.map(id => typeof id === 'object' ? id.userId : id).filter(Boolean);
    if (!userIds.length) return setCustomers([]);
    try {
      const results = await Promise.all(userIds.map(async (uid) => {
        try {
          const { data: { user: u } } = await axios.get(`${API_URL}/api/users/${uid}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          return { _id: u.userId, fullName: u.fullName || 'Unknown', rank: u.rank || 0, customerRating: u.customerRating || 0, profilePic: u.profilePic || 'https://via.placeholder.com/150' };
        } catch { return null; }
      }));
      setCustomers(results.filter(Boolean));
    } catch {
      setCustomers([]);
    }
  }, []);

  const updateStatsFromProfile = useCallback(async (u, transactions) => {
    const posted = (await fetchPostedProducts()).length || u.postedProducts?.length || 0;
    const totalOrders = u.transactionHistory?.length || transactions?.length || 0;
    const sold = transactions?.filter(tx => !tx.isBuyer && tx.status === ORDER_STATUS.DELIVERED).length || 0;
    setStats(prev => prev.map((s, i) => ({
      ...s,
      value: i === 0 ? posted : i === 1 ? totalOrders : i === 2 ? sold : `${u.customerRating || 0}/5`
    })));
  }, [fetchPostedProducts]);

  const fetchUserProfileLocal = useCallback(async () => {
    const token = sessionStorage.getItem('token');
    if (!token) return navigate('/login', { replace: true });
    try {
      const { data: { user: u } } = await axios.get(`${API_URL}/api/users/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(u);
      setProfileData({
        fullName: u.fullName || 'Not set',
        phone: u.phone || 'Not set',
        address: u.address || 'Not set',
        location: u.location || 'Not set'
      });
      setVerificationStatus(normalizeVerificationStatus(u.govIdStatus));
      const transactions = await fetchTransactions(u.userId || u._id?.toString());
      await updateStatsFromProfile(u, transactions);
      if (u.closeCustomers?.length) fetchCustomers(u.closeCustomers);
      await fetchNotifications();
      await fetchUnreadCount();
    } catch (err) {
      sessionStorage.removeItem('token');
      setError('Failed to fetch user profile');
      navigate('/login', { replace: true });
    }
  }, [navigate, setUser, fetchTransactions, updateStatsFromProfile, fetchCustomers, fetchNotifications, fetchUnreadCount]);

  const handleShip = async (orderId) => {
    setActionLoading(prev => ({ ...prev, [orderId]: true }));
    try {
      const token = sessionStorage.getItem('token');
      const { data } = await axios.post(`${API_URL}/api/transactions/mark-shipped/${orderId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (data.success) {
        toast.success('Order marked as shipped – buyer notified');
        await fetchTransactions(user?.userId || user?._id?.toString());
        await fetchUserProfileLocal();
      } else throw new Error(data.error || 'Failed');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to mark shipped');
    } finally {
      setActionLoading(prev => ({ ...prev, [orderId]: false }));
    }
  };

  const handleConfirm = async (orderId) => {
    setActionLoading(prev => ({ ...prev, [orderId]: true }));
    try {
      const token = sessionStorage.getItem('token');
      const { data } = await axios.post(`${API_URL}/api/transactions/confirm-delivery/${orderId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (data.success) {
        toast.success('Delivery confirmed – seller notified');
        await fetchTransactions(user?.userId || user?._id?.toString());
        await fetchUserProfileLocal();
      } else throw new Error(data.error || 'Failed');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to confirm delivery');
    } finally {
      setActionLoading(prev => ({ ...prev, [orderId]: false }));
    }
  };

  const handleVerify = async (data) => {
    const token = sessionStorage.getItem('token');
    if (!token) return toast.error('Please login');
    const formData = new FormData();
    Object.entries(data).forEach(([k, v]) => formData.append(k, v));
    try {
      const { data: res } = await axios.post(`${API_URL}/api/users/verify-id`, formData, {
        headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` }
      });
      const isInstant = res.verified === true;
      setVerificationStatus(isInstant ? VERIFICATION_STATUS.VERIFIED : VERIFICATION_STATUS.PENDING);
      setShowVerificationModal(false);
      if (data.name) {
        await axios.patch(`${API_URL}/api/users/profile`, { fullName: data.name }, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      await fetchUserProfileLocal();
      toast.success(isInstant ? 'Profile verified' : 'Verification submitted');
    } catch (err) {
      toast.error(err.response?.data?.error || err.message || 'Verification failed');
      throw err;
    }
  };

  const handleProductSubmit = async (productData) => {
    setActionLoading(prev => ({ ...prev, productSubmit: true }));
    const token = sessionStorage.getItem('token');
    try {
      await axios.post(`${API_URL}/api/products`, productData, {
        headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` }
      });
      setShowProductModal(false);
      toast.success('Product uploaded');
      await fetchUserProfileLocal();
      navigate('/marketplace');
    } catch (err) {
      toast.error('Failed to upload product');
    } finally {
      setActionLoading(prev => ({ ...prev, productSubmit: false }));
    }
  };

  const handleProfileImageSave = async (file) => {
    setActionLoading(prev => ({ ...prev, profileImage: true }));
    const fd = new FormData();
    fd.append('profilePic', file);
    try {
      await axios.post(`${API_URL}/api/users/profile-pic`, fd, {
        headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${sessionStorage.getItem('token')}` }
      });
      await fetchUserProfileLocal();
      toast.success('Profile image updated');
    } catch {
      toast.error('Failed to update image');
    } finally {
      setActionLoading(prev => ({ ...prev, profileImage: false }));
    }
  };

  const saveProfile = async () => {
    setActionLoading(prev => ({ ...prev, saveProfile: true }));
    try {
      await axios.patch(`${API_URL}/api/users/profile`, profileData, {
        headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` }
      });
      await fetchUserProfileLocal();
      toast.success('Profile updated');
      setIsProfileOpen(false);
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setActionLoading(prev => ({ ...prev, saveProfile: false }));
    }
  };

  // Chart logic
  const chartData = useMemo(() => {
    const daysMap = { '7 Days': 7, '30 Days': 30, '90 Days': 90 };
    const days = daysMap[selectedPeriod];
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - days);
    const filtered = allTransactions.filter(tx =>
      !tx.isBuyer && tx.status === ORDER_STATUS.DELIVERED &&
      new Date(tx.createdAt) >= start && new Date(tx.createdAt) <= end
    );
    const daily = {};
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      daily[d.toISOString().split('T')[0]] = 0;
    }
    filtered.forEach(tx => {
      const ds = new Date(tx.createdAt).toISOString().split('T')[0];
      daily[ds] += tx.totalPrice;
    });
    const labels = Object.keys(daily).sort();
    const values = labels.map(l => daily[l]);
    return { labels, values };
  }, [allTransactions, selectedPeriod]);

  useEffect(() => {
    if (!chartRef.current) return;
    if (chartInstance) chartInstance.destroy();
    const ctx = chartRef.current.getContext('2d');
    const newChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: chartData.labels,
        datasets: [{
          label: 'Sales (ETB)',
          data: chartData.values,
          borderColor: theme === 'dark' ? '#FF6B6B' : '#4B6BFB',
          backgroundColor: theme === 'dark' ? 'rgba(255,107,107,0.2)' : 'rgba(75,107,251,0.2)',
          fill: true,
          tension: 0.4,
          pointRadius: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: { ticks: { color: theme === 'dark' ? '#E5E7EB' : '#374151', font: { size: 9 } }, grid: { color: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' } },
          y: { beginAtZero: true, ticks: { callback: v => `${v} ETB`, font: { size: 9 } }, grid: { color: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' } }
        },
        plugins: {
          tooltip: { callbacks: { label: ctx => `${ctx.dataset.label}: ${ctx.parsed.y} ETB` } },
          legend: { labels: { font: { size: 10 } } }
        },
        animation: { duration: 800 }
      }
    });
    setChartInstance(newChart);
    return () => newChart.destroy();
  }, [chartData, theme]);

  // Side effects
  useEffect(() => {
    const handleOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setIsProfileOpen(false);
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notificationRef.current && !notificationRef.current.contains(e.target)) {
        setIsNotificationOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!loading && !isAuthenticated) navigate('/login', { replace: true });
    else if (!loading && isAuthenticated) fetchUserProfileLocal();
  }, [loading, isAuthenticated, fetchUserProfileLocal, navigate]);

  // Render helpers
  const isVerified = verificationStatus === VERIFICATION_STATUS.VERIFIED;
  const isRestricted = user?.isRestricted === true;
  const displayedOrders = ordersTab === 'buying'
    ? allTransactions.filter(o => o.isBuyer)
    : allTransactions.filter(o => !o.isBuyer);

  const quickActions = [
    ...(!isVerified ? [{
      title: 'Verify Account', description: 'Complete KYC to sell/buy',
      action: () => setShowVerificationModal(true), icon: CheckCircle, color: 'green'
    }] : []),
    { title: 'Add Product', description: 'List your agriculture products', action: () => setShowProductModal(true), icon: Upload, color: 'blue' },
    { title: 'Add Balance', description: 'Add funds to wallet', action: () => setShowPaymentModal(true), icon: Wallet, color: 'indigo' },
    { title: 'View Customers', description: 'See recent buyers', action: () => setShowCustomersModal(true), icon: Users, color: 'teal' },
    { title: 'About', description: 'Learn about the platform', action: () => navigate('/about'), icon: Users, color: 'purple' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center text-red-500 bg-red-100/90 rounded-xl p-4">
          <p>{error}</p>
          <Button onClick={() => { setError(null); fetchUserProfileLocal(); }} className="mt-2 bg-blue-600 text-white rounded-lg py-1 px-3 text-sm">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-white pb-16 sm:pb-0">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 pt-16 sm:pt-20">
        {isRestricted && (
          <div className="mb-4 p-2 sm:p-3 bg-red-100 border border-red-500 rounded-lg flex items-center gap-2 sm:gap-3 text-red-700 text-sm">
            <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5" />
            <div>
              <h3 className="font-bold text-xs sm:text-sm">Account Restricted</h3>
              <p className="text-[10px] sm:text-xs">You cannot trade until restriction is lifted.</p>
            </div>
          </div>
        )}

        {/* ========== DESKTOP FIXED ICONS (visible only on md+) ========== */}
        <div className="hidden md:flex fixed top-4 right-4 z-50 items-center gap-3">
          {/* Notification Bell Desktop */}
          <div ref={notificationRef} className="relative">
            <button
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
              className="relative p-1.5 rounded-full bg-white/80 dark:bg-gray-800/80 shadow-md hover:bg-white dark:hover:bg-gray-700 transition"
            >
              <Bell className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
            <AnimatePresence>
              {isNotificationOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl border overflow-hidden z-50"
                >
                  <div className="flex justify-between items-center p-3 border-b">
                    <h3 className="font-bold text-sm">Notifications</h3>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllNotificationsAsRead}
                        className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
                      >
                        <CheckCheck size={12} /> Clear all
                      </button>
                    )}
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {loadingNotifications ? (
                      <div className="p-4 text-center text-gray-500">
                        <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                      </div>
                    ) : notifications.length === 0 ? (
                      <div className="p-4 text-center text-gray-500 text-sm">No new notifications</div>
                    ) : (
                      notifications.map(notif => (
                        <div
                          key={notif._id}
                          onClick={() => handleNotificationClick(notif)}
                          className="p-3 border-b cursor-pointer transition hover:bg-gray-50 dark:hover:bg-gray-700 bg-blue-50 dark:bg-blue-900/20"
                        >
                          <div className="flex items-start gap-2">
                            <div className="flex-1">
                              <p className="text-sm font-medium">{notif.title || 'Notification'}</p>
                              <p className="text-xs text-gray-500 mt-0.5">{notif.message}</p>
                              <p className="text-[10px] text-gray-400 mt-1">
                                {new Date(notif.createdAt).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Profile Dropdown Desktop */}
          <div ref={profileRef} className="relative">
            <button
              id="profile-dropdown-btn"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full overflow-hidden border-2 border-white shadow-md bg-white/10 hover:scale-105 transition"
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
                  className="absolute right-0 mt-2 w-56 bg-white/95 dark:bg-gray-900/95 rounded-lg shadow-lg border overflow-hidden text-xs sm:text-sm z-50"
                >
                  <div className="p-2 flex items-center gap-2 border-b">
                    <div
                      className="w-8 h-8 rounded-full overflow-hidden cursor-pointer"
                      onClick={() => setShowProfileImageModal(true)}
                    >
                      {user?.profilePic ? (
                        <img src={user.profilePic} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-xs font-bold text-white bg-blue-500 w-full h-full flex items-center justify-center">
                          {user?.fullName?.[0] || 'U'}
                        </span>
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-xs">{profileData.fullName}</p>
                      <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-green-100 text-green-600">
                        {verificationStatus}
                      </span>
                    </div>
                  </div>
                  <div className="p-2 space-y-1">
                    <p className="text-xs"><span className="font-semibold">Email:</span> {user?.email || '-'}</p>
                    <p className="text-xs"><span className="font-semibold">Balance:</span> {user?.balance?.toFixed(2)} ETB</p>
                    {['fullName', 'phone', 'address', 'location'].map(field => (
                      <input
                        key={field}
                        type="text"
                        value={profileData[field]}
                        onChange={e => setProfileData(p => ({ ...p, [field]: e.target.value }))}
                        className="w-full text-xs border rounded px-1 py-0.5 dark:bg-gray-800 dark:border-gray-700"
                        placeholder={field}
                      />
                    ))}
                  </div>
                  <div className="p-2 space-y-1 border-t">
                    <Button
                      onClick={saveProfile}
                      disabled={actionLoading.saveProfile}
                      className="w-full bg-blue-600 text-white text-xs py-1 rounded disabled:opacity-50"
                    >
                      {actionLoading.saveProfile ? <Loader2 className="w-3 h-3 animate-spin inline" /> : <Save className="w-3 h-3 inline mr-1" />}
                      Save
                    </Button>
                    <Button onClick={toggleTheme} className="w-full text-xs py-1 border rounded">
                      {isDark ? <Sun className="w-3 h-3 inline mr-1" /> : <Moon className="w-3 h-3 inline mr-1" />}
                      {isDark ? 'Light' : 'Dark'}
                    </Button>
                    <Button onClick={logout} className="w-full text-xs py-1 border-red-300 text-red-600 rounded">
                      Logout
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ========== MOBILE ICONS BAR (visible only on mobile) ========== */}
        <div className="flex md:hidden items-center justify-end gap-3 mb-4 -mt-2">
          {/* Notification Bell Mobile */}
          <div ref={notificationRef} className="relative">
            <button
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
              className="relative p-2 rounded-full bg-white/80 dark:bg-gray-800/80 shadow-md hover:bg-white dark:hover:bg-gray-700 transition"
            >
              <Bell className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
            <AnimatePresence>
              {isNotificationOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl border overflow-hidden z-50"
                >
                  {/* Same notification content as desktop */}
                  <div className="flex justify-between items-center p-3 border-b">
                    <h3 className="font-bold text-sm">Notifications</h3>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllNotificationsAsRead}
                        className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
                      >
                        <CheckCheck size={12} /> Clear all
                      </button>
                    )}
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {loadingNotifications ? (
                      <div className="p-4 text-center text-gray-500">
                        <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                      </div>
                    ) : notifications.length === 0 ? (
                      <div className="p-4 text-center text-gray-500 text-sm">No new notifications</div>
                    ) : (
                      notifications.map(notif => (
                        <div
                          key={notif._id}
                          onClick={() => handleNotificationClick(notif)}
                          className="p-3 border-b cursor-pointer transition hover:bg-gray-50 dark:hover:bg-gray-700 bg-blue-50 dark:bg-blue-900/20"
                        >
                          <div className="flex items-start gap-2">
                            <div className="flex-1">
                              <p className="text-sm font-medium">{notif.title || 'Notification'}</p>
                              <p className="text-xs text-gray-500 mt-0.5">{notif.message}</p>
                              <p className="text-[10px] text-gray-400 mt-1">
                                {new Date(notif.createdAt).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Profile Dropdown Mobile */}
          <div ref={profileRef} className="relative">
            <button
              id="profile-dropdown-btn-mobile"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="w-8 h-8 rounded-full overflow-hidden border-2 border-white shadow-md bg-white/10 hover:scale-105 transition"
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
                  className="absolute right-0 mt-2 w-56 bg-white/95 dark:bg-gray-900/95 rounded-lg shadow-lg border overflow-hidden text-xs sm:text-sm z-50"
                >
                  {/* Same profile content as desktop */}
                  <div className="p-2 flex items-center gap-2 border-b">
                    <div
                      className="w-8 h-8 rounded-full overflow-hidden cursor-pointer"
                      onClick={() => setShowProfileImageModal(true)}
                    >
                      {user?.profilePic ? (
                        <img src={user.profilePic} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-xs font-bold text-white bg-blue-500 w-full h-full flex items-center justify-center">
                          {user?.fullName?.[0] || 'U'}
                        </span>
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-xs">{profileData.fullName}</p>
                      <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-green-100 text-green-600">
                        {verificationStatus}
                      </span>
                    </div>
                  </div>
                  <div className="p-2 space-y-1">
                    <p className="text-xs"><span className="font-semibold">Email:</span> {user?.email || '-'}</p>
                    <p className="text-xs"><span className="font-semibold">Balance:</span> {user?.balance?.toFixed(2)} ETB</p>
                    {['fullName', 'phone', 'address', 'location'].map(field => (
                      <input
                        key={field}
                        type="text"
                        value={profileData[field]}
                        onChange={e => setProfileData(p => ({ ...p, [field]: e.target.value }))}
                        className="w-full text-xs border rounded px-1 py-0.5 dark:bg-gray-800 dark:border-gray-700"
                        placeholder={field}
                      />
                    ))}
                  </div>
                  <div className="p-2 space-y-1 border-t">
                    <Button
                      onClick={saveProfile}
                      disabled={actionLoading.saveProfile}
                      className="w-full bg-blue-600 text-white text-xs py-1 rounded disabled:opacity-50"
                    >
                      {actionLoading.saveProfile ? <Loader2 className="w-3 h-3 animate-spin inline" /> : <Save className="w-3 h-3 inline mr-1" />}
                      Save
                    </Button>
                    <Button onClick={toggleTheme} className="w-full text-xs py-1 border rounded">
                      {isDark ? <Sun className="w-3 h-3 inline mr-1" /> : <Moon className="w-3 h-3 inline mr-1" />}
                      {isDark ? 'Light' : 'Dark'}
                    </Button>
                    <Button onClick={logout} className="w-full text-xs py-1 border-red-300 text-red-600 rounded">
                      Logout
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Welcome Section */}
        <div className="mb-6 sm:mb-8 flex flex-col lg:flex-row justify-between gap-4 sm:gap-6">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-black mb-1 sm:mb-2">
              Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">{user?.fullName}!</span>
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Manage your agricultural business efficiently.</p>
            <div className="mt-3 sm:mt-4 flex gap-2 sm:gap-3">
              <button
                onClick={() => isVerified ? navigate('/marketplace') : setShowVerificationModal(true)}
                disabled={isRestricted}
                className="flex items-center gap-1 sm:gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingCart className="w-3 h-3 sm:w-4 sm:h-4" /> Buy
              </button>
              <button
                onClick={() => isVerified ? setShowProductModal(true) : setShowVerificationModal(true)}
                disabled={isRestricted}
                className="flex items-center gap-1 sm:gap-2 bg-emerald-500/20 hover:bg-emerald-500 text-emerald-700 hover:text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold border border-emerald-500 disabled:opacity-50"
              >
                <Upload className="w-3 h-3 sm:w-4 sm:h-4" /> Sell
              </button>
            </div>
          </div>
          <EthiopianClock theme={theme} />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 mb-4 sm:mb-6">
          {stats.map((s, i) => (
            <StatsCard key={i} title={s.title} value={s.value} icon={s.icon} gradient={s.gradient} />
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-6 sm:mb-8">
          <Card className="p-2 sm:p-3 bg-white/90 dark:bg-gray-900/90 rounded-lg shadow-sm">
            <h2 className="text-sm sm:text-base font-bold mb-2 sm:mb-3">Quick Actions</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
              {quickActions.map((a, i) => (
                <button
                  key={i}
                  onClick={a.action}
                  disabled={isRestricted && a.title !== 'About' && a.title !== 'Add Balance'}
                  className="text-left p-1.5 sm:p-2 rounded-lg border hover:bg-gray-100 dark:hover:bg-gray-800 transition text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <a.icon className="w-3 h-3 sm:w-4 sm:h-4" />
                    <div>
                      <p className="font-semibold text-[10px] sm:text-xs">{a.title}</p>
                      <p className="text-[9px] sm:text-[10px] text-gray-500 hidden sm:block">{a.description}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </Card>
        </div>

        {/* Orders Section */}
        <div id="orders-section" className="mb-8">
          <div className="flex justify-between items-end mb-3 sm:mb-4 border-b border-gray-50 pb-12">
            <div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tighter uppercase">My Orders</h2>
              <p className="text-[8px] sm:text-[10px] text-gray-400 font-bold tracking-[0.2em]">TRANSFERS & TRADES</p>
            </div>
            <div className="flex bg-gray-50 p-0.5 sm:p-1 rounded-xl border border-gray-200">
              <button
                onClick={() => setOrdersTab('buying')}
                className={`px-3 sm:px-4 py-1 sm:py-1.5 rounded-lg text-[10px] sm:text-xs font-black transition-all ${
                  ordersTab === 'buying' ? 'bg-black text-emerald-500 border border-gray-100' : 'text-gray-400'
                }`}
              >
                PURCHASES
              </button>
              <button
                onClick={() => setOrdersTab('selling')}
                className={`px-3 sm:px-4 py-1 sm:py-1.5 rounded-lg text-[10px] sm:text-xs font-black transition-all ${
                  ordersTab === 'selling' ? 'bg-black text-blue-100 border border-gray-100' : 'text-gray-400'
                }`}
              >
                SALES
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {displayedOrders.length === 0 ? (
              <div className="text-center py-8 sm:py-12 text-gray-400 text-xs sm:text-sm bg-white/50 rounded-2xl">
                No {ordersTab} orders yet.
              </div>
            ) : (
              displayedOrders.map(order => (
                <div
                  key={order._id}
                  id={`order-${order._id}`}
                  className="bg-white/80 dark:bg-gray-900/80 border border-gray-200 dark:border-gray-700 p-3 sm:p-4 rounded-2xl flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-5 transition-colors"
                >
                  <div className="flex items-center gap-3 sm:gap-5">
                    <img src={order.productImg} className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl object-cover bg-gray-50" alt="product" />
                    <div className="flex-1">
                      <h3 className="font-bold text-xs sm:text-sm uppercase">{order.productName}</h3>
                      <div className="flex items-center gap-2 sm:gap-3 mt-1 flex-wrap">
                        <StatusBadge status={order.status} />
                        <span className="text-[9px] sm:text-[10px] text-gray-400 flex items-center gap-1">
                          <Calendar size={10} /> {new Date(order.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 px-2 sm:px-3 py-1 sm:py-1.5 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 self-start sm:self-center">
                    <button
                      onClick={() => setIdentityCard(order.seller)}
                      className="relative group transition-transform active:scale-90"
                    >
                      <img src={order.seller.img} className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 border-white object-cover" />
                      <span className="absolute -bottom-1 -right-1 bg-blue-600 text-[6px] sm:text-[7px] text-white w-2.5 h-2.5 sm:w-3 sm:h-3 flex items-center justify-center rounded-full font-bold">S</span>
                    </button>
                    <ArrowRight size={12} className="text-gray-300" />
                    <button
                      onClick={() => setIdentityCard(order.buyer)}
                      className="relative group transition-transform active:scale-90"
                    >
                      <img src={order.buyer.img} className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 border-white object-cover" />
                      <span className="absolute -bottom-1 -right-1 bg-emerald-600 text-[6px] sm:text-[7px] text-white w-2.5 h-2.5 sm:w-3 sm:h-3 flex items-center justify-center rounded-full font-bold">B</span>
                    </button>
                  </div>

                  <div className="flex justify-between items-center sm:justify-end w-full sm:w-auto gap-3 sm:gap-5">
                    <div className="text-left sm:text-right">
                      <p className="font-black text-xs sm:text-sm">{order.totalPrice} ETB</p>
                      <p className="text-[9px] sm:text-[10px] text-gray-400 font-bold uppercase">Paid</p>
                    </div>
                    <div>
                      {ordersTab === 'selling' && order.status === ORDER_STATUS.PENDING && (
                        <button
                          onClick={() => handleShip(order._id)}
                          disabled={actionLoading[order._id]}
                          className="flex items-center gap-1 bg-blue-600 text-white text-[10px] sm:text-xs font-bold px-2 sm:px-3 py-1.5 rounded-lg disabled:opacity-50 transition active:scale-95"
                        >
                          {actionLoading[order._id] ? <Loader2 className="w-3 h-3 animate-spin" /> : <Truck size={12} />}
                          Ship
                        </button>
                      )}
                      {ordersTab === 'buying' && order.status === ORDER_STATUS.SHIPPED && (
                        <button
                          onClick={() => handleConfirm(order._id)}
                          disabled={actionLoading[order._id]}
                          className="flex items-center gap-1 bg-green-600 text-white text-[10px] sm:text-xs font-bold px-2 sm:px-3 py-1.5 rounded-lg disabled:opacity-50 transition active:scale-95"
                        >
                          {actionLoading[order._id] ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle size={12} />}
                          Confirm
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Sales Chart */}
        <Card className="p-2 sm:p-3 bg-white/90 dark:bg-gray-900/90 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-sm sm:text-base font-bold">Sales Overview</h2>
            <div className="flex gap-1">
              {['7 Days', '30 Days', '90 Days'].map(p => (
                <Button
                  key={p}
                  variant={selectedPeriod === p ? undefined : 'outline'}
                  className={`py-0.5 px-1.5 sm:px-2 text-[10px] sm:text-xs rounded ${selectedPeriod === p ? 'bg-blue-600 text-white' : ''}`}
                  onClick={() => setSelectedPeriod(p)}
                >
                  {p}
                </Button>
              ))}
            </div>
          </div>
          <div className="h-32 sm:h-40">
            <canvas ref={chartRef} />
          </div>
        </Card>
      </div>

      <MobileBottomNav activeTab={mobileActiveTab} setActiveTab={setMobileActiveTab} navigate={navigate} />

      {/* Modals */}
      <VerificationModal isOpen={showVerificationModal} onClose={() => setShowVerificationModal(false)} onVerify={handleVerify} verificationStatus={verificationStatus} userEmail={user?.email} />
      <ProductUploadModal isOpen={showProductModal} onClose={() => setShowProductModal(false)} onSubmit={handleProductSubmit} isLoading={actionLoading.productSubmit} />
      <ProfileImageUploadModal isOpen={showProfileImageModal} onClose={() => setShowProfileImageModal(false)} onImageSave={handleProfileImageSave} isLoading={actionLoading.profileImage} />
      <PaymentModal isOpen={showPaymentModal} onClose={() => setShowPaymentModal(false)} onPaymentSuccess={fetchUserProfileLocal} />

      <Modal isOpen={showCustomersModal} onClose={() => setShowCustomersModal(false)} title="Your Customers" size="lg">
        <div className="max-h-[60vh] overflow-y-auto p-2 space-y-2">
          {customers.map((c, i) => (
            <div key={i} className="flex items-center gap-3 p-2 bg-blue-100/10 rounded-lg">
              <img src={c.profilePic} alt={c.fullName} className="w-8 h-8 rounded-full object-cover" />
              <div>
                <p className="font-medium text-sm">{c.fullName}</p>
                <p className="text-xs text-gray-500">Rank: {c.rank} | Rating: {c.customerRating}/5</p>
              </div>
            </div>
          ))}
          {customers.length === 0 && <p className="text-center text-gray-500">No customers yet.</p>}
        </div>
      </Modal>

      <AnimatePresence>
        {identityCard && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-[2px]">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-gray-900 w-full max-w-xs rounded-[2rem] p-5 sm:p-6 border border-gray-200 shadow-xl"
            >
              <div className="flex justify-between items-start mb-4 sm:mb-6">
                <span className="text-[9px] sm:text-[10px] font-black text-gray-400 uppercase tracking-widest">Contact Info</span>
                <button onClick={() => setIdentityCard(null)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
                  <X size={16} />
                </button>
              </div>
              <div className="flex flex-col items-center text-center">
                <img src={identityCard.img} className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl object-cover mb-3 sm:mb-4 border-4 border-gray-50 shadow-sm" />
                <h2 className="text-lg sm:text-xl font-black text-gray-900 dark:text-white">{identityCard.name}</h2>
                <div className="w-6 h-1 sm:w-8 sm:h-1 bg-emerald-500 rounded-full my-2 sm:my-3"></div>
                <div className="w-full space-y-3 sm:space-y-4 mt-2">
                  <div className="flex items-center gap-3 text-left p-2 sm:p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                    <Phone size={14} className="text-emerald-600" />
                    <div>
                      <p className="text-[8px] sm:text-[9px] font-bold text-gray-400 uppercase">Contact</p>
                      <p className="text-[11px] sm:text-xs font-bold">{identityCard.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-left p-2 sm:p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                    <MapPin size={14} className="text-blue-600" />
                    <div>
                      <p className="text-[8px] sm:text-[9px] font-bold text-gray-400 uppercase">Location</p>
                      <p className="text-[11px] sm:text-xs font-bold leading-tight">{identityCard.address}</p>
                    </div>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIdentityCard(null)}
                className="w-full mt-4 sm:mt-6 py-2 sm:py-3 bg-gray-900 text-white rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-widest active:scale-95 transition-transform"
              >
                Close Profile
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;
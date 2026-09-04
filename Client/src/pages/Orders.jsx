import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { Calendar, ArrowRight, User, Phone, MapPin, X, Truck, CheckCircle, Loader2 } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { API_URL } from '../utils/apiConfig';
import toast from 'react-hot-toast';

const Orders = () => {
  const { user: authUser } = useAuth();
  const location = useLocation();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('buying');
  const [actionLoading, setActionLoading] = useState({});
  const [identityCard, setIdentityCard] = useState(null);

  // Set initial tab from notification state
  useEffect(() => {
    const state = location.state;
    if (state?.ordersTab) {
      setActiveTab(state.ordersTab);
    }
  }, [location.state]);

  useEffect(() => {
    if (authUser) fetchOrders();
  }, [authUser]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/api/transactions/my`, {
        headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
      });
      if (res.data.success) {
        const currentUserId = authUser?.userId || authUser?._id?.toString();
        const formatted = res.data.transactions.map(txn => {
          const rawStatus = txn.status || 'pending';
          const normalizedStatus = rawStatus.toLowerCase();
          const isBuyer = String(txn.buyerUserId) === String(currentUserId);
          return {
            ...txn,
            isBuyer,
            status: normalizedStatus,
            productName: txn.productId?.title || 'Item',
            productImg: txn.productId?.images?.[0] || 'https://via.placeholder.com/100',
            seller: {
              name: txn.sellerDetails?.fullName || 'Bantalem M.',
              phone: txn.sellerDetails?.phone || '+251 9...',
              address: txn.deliveryAddress || 'Debre Berhan, Ethiopia',
              img: txn.sellerDetails?.profilePic || 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
            },
            buyer: {
              name: isBuyer ? 'You' : `Buyer #${txn.buyerUserId?.slice(-4)}`,
              phone: 'Hidden for Privacy',
              address: txn.deliveryAddress,
              img: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
            },
          };
        });
        setOrders(formatted);
      }
    } catch (err) {
      toast.error('Failed to load orders');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Scroll to order after orders are loaded and tab is set
  useEffect(() => {
    const state = location.state;
    if (state?.scrollToOrder && orders.length > 0) {
      // Clear state so it doesn't re-run on re-render
      window.history.replaceState({}, document.title);
      setTimeout(() => {
        const orderElement = document.getElementById(`order-${state.scrollToOrder}`);
        if (orderElement) {
          orderElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          orderElement.classList.add('ring-2', 'ring-blue-500', 'bg-blue-50');
          setTimeout(() => {
            orderElement.classList.remove('ring-2', 'ring-blue-500', 'bg-blue-50');
          }, 3000);
        }
      }, 300);
    }
  }, [orders, location.state]);

  const handleShip = async (orderId) => {
    setActionLoading(prev => ({ ...prev, [orderId]: true }));
    try {
      const token = sessionStorage.getItem('token');
      const { data } = await axios.post(`${API_URL}/api/transactions/mark-shipped/${orderId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (data.success) {
        toast.success('Order marked as shipped');
        await fetchOrders();
      } else {
        throw new Error(data.error || 'Failed');
      }
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
        toast.success('Delivery confirmed');
        await fetchOrders();
      } else {
        throw new Error(data.error || 'Failed');
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to confirm delivery');
    } finally {
      setActionLoading(prev => ({ ...prev, [orderId]: false }));
    }
  };

  const filteredOrders = orders.filter(o => activeTab === 'buying' ? o.isBuyer : !o.isBuyer);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="p-2 md:p-6 max-w-5xl mx-auto font-sans text-gray-900 bg-white min-h-screen">
      {/* Mini Header */}
      <div className="flex justify-between items-end mb-8 border-b border-gray-100 pb-4">
        <div>
          <h1 className="text-3xl font-black tracking-tighter uppercase">My Hub</h1>
          <p className="text-[10px] text-gray-400 font-bold tracking-[0.2em]">TRANSFERS & TRADES</p>
        </div>
        <div className="flex bg-gray-50 p-1 rounded-xl border border-gray-200">
          <button
            onClick={() => setActiveTab('buying')}
            className={`px-5 py-2 rounded-lg text-xs font-black transition-all ${
              activeTab === 'buying' ? 'bg-white text-emerald-600 border border-gray-100' : 'text-gray-400'
            }`}
          >
            PURCHASES
          </button>
          <button
            onClick={() => setActiveTab('selling')}
            className={`px-5 py-2 rounded-lg text-xs font-black transition-all ${
              activeTab === 'selling' ? 'bg-white text-blue-600 border border-gray-100' : 'text-gray-400'
            }`}
          >
            SALES
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12 text-gray-400 text-sm">
            No {activeTab} orders yet.
          </div>
        ) : (
          filteredOrders.map(order => (
            <div
              key={order._id}
              id={`order-${order._id}`}
              className="border border-gray-100 p-4 rounded-2xl flex flex-wrap items-center gap-5 transition-colors"
            >
              <img src={order.productImg} className="w-14 h-14 rounded-xl object-cover bg-gray-50" alt="product" />

              <div className="flex-1 min-w-[120px]">
                <h3 className="font-bold text-sm uppercase">{order.productName}</h3>
                <div className="flex items-center gap-3 mt-1 flex-wrap">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tight ${
                      order.status === 'delivered'
                        ? 'bg-green-100 text-green-700'
                        : order.status === 'shipped'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {order.status}
                  </span>
                  <span className="text-[10px] text-gray-400 flex items-center gap-1">
                    <Calendar size={10} /> {new Date(order.createdAt || order.date).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Interactive Trade Photos */}
              <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-2xl border border-gray-100">
                <button
                  onClick={() => setIdentityCard({ ...order.seller, label: 'Seller Info' })}
                  className="relative group transition-transform active:scale-90"
                >
                  <img src={order.seller.img} className="w-8 h-8 rounded-full border-2 border-white object-cover" />
                  <span className="absolute -bottom-1 -right-1 bg-blue-600 text-[7px] text-white w-3 h-3 flex items-center justify-center rounded-full font-bold">S</span>
                </button>
                <ArrowRight size={12} className="text-gray-300" />
                <button
                  onClick={() => setIdentityCard({ ...order.buyer, label: 'Buyer Info' })}
                  className="relative group transition-transform active:scale-90"
                >
                  <img src={order.buyer.img} className="w-8 h-8 rounded-full border-2 border-white object-cover" />
                  <span className="absolute -bottom-1 -right-1 bg-emerald-600 text-[7px] text-white w-3 h-3 flex items-center justify-center rounded-full font-bold">B</span>
                </button>
              </div>

              <div className="text-right min-w-[80px]">
                <p className="font-black text-sm">{order.totalPrice} ETB</p>
                <p className="text-[10px] text-gray-400 font-bold uppercase">Paid</p>
              </div>

              {/* Action Buttons */}
              <div className="w-full sm:w-auto mt-2 sm:mt-0">
                {order.status === 'pending' && !order.isBuyer && (
                  <button
                    onClick={() => handleShip(order._id)}
                    disabled={actionLoading[order._id]}
                    className="flex items-center gap-1 bg-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg disabled:opacity-50 transition active:scale-95"
                  >
                    {actionLoading[order._id] ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <Truck size={12} />
                    )}
                    Ship
                  </button>
                )}
                {order.status === 'shipped' && order.isBuyer && (
                  <button
                    onClick={() => handleConfirm(order._id)}
                    disabled={actionLoading[order._id]}
                    className="flex items-center gap-1 bg-green-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg disabled:opacity-50 transition active:scale-95"
                  >
                    {actionLoading[order._id] ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <CheckCircle size={12} />
                    )}
                    Confirm
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Identity Modal */}
      <AnimatePresence>
        {identityCard && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-[2px]">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-xs rounded-[2rem] p-6 border border-gray-200 shadow-xl"
            >
              <div className="flex justify-between items-start mb-6">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{identityCard.label}</span>
                <button onClick={() => setIdentityCard(null)} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                  <X size={18} />
                </button>
              </div>

              <div className="flex flex-col items-center text-center">
                <img src={identityCard.img} className="w-20 h-20 rounded-3xl object-cover mb-4 border-4 border-gray-50 shadow-sm" />
                <h2 className="text-xl font-black text-gray-900">{identityCard.name}</h2>
                <div className="w-8 h-1 bg-emerald-500 rounded-full my-3"></div>

                <div className="w-full space-y-4 mt-2">
                  <div className="flex items-center gap-3 text-left p-3 bg-gray-50 rounded-xl">
                    <Phone size={16} className="text-emerald-600" />
                    <div>
                      <p className="text-[9px] font-bold text-gray-400 uppercase">Contact</p>
                      <p className="text-xs font-bold">{identityCard.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-left p-3 bg-gray-50 rounded-xl">
                    <MapPin size={16} className="text-blue-600" />
                    <div>
                      <p className="text-[9px] font-bold text-gray-400 uppercase">Location</p>
                      <p className="text-xs font-bold leading-tight">{identityCard.address}</p>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setIdentityCard(null)}
                className="w-full mt-6 py-3 bg-gray-900 text-white rounded-xl text-xs font-black uppercase tracking-widest active:scale-95 transition-transform"
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

export default Orders;
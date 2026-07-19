import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../utils/apiConfig';
import { 
  Eye, Search, Clock, CheckCircle, ShoppingCart, Filter, X, User, Tag, MapPin, DollarSign
} from 'lucide-react';
import Button from '../components/common/Button';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); 
  const [searchTerm, setSearchTerm] = useState('');
  
  // 🎯 ለሊስት እይታ (Modal) የተመረጠውን ኦርደር ለመያዝ
  const [selectedOrder, setSelectedOrder] = useState(null);
  
  const { token } = useAuth();

  useEffect(() => {
    const fetchOrders = async () => {
      if (!token) {
        setLoading(false);
        setError("አካውንትዎ አልተረጋገጠም ወይም ቶከን የለም። እባክዎ እንደገና ሎግኢን ያድርጉ።");
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const res = await axios.get(`${API_URL}/api/admin/transactions`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrders(res.data.transactions || []);
      } catch (err) {
        console.error("Failed to fetch orders", err);
        setError(err.response?.data?.error || err.response?.data?.message || "ኦርደሮችን ማምጣት አልተቻለም");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token]);

  const filteredOrders = orders.filter(order => {
    const orderId = order._id ? String(order._id).toLowerCase() : '';
    const productTitle = order.productId?.title ? String(order.productId.title).toLowerCase() : 'product deleted';
    const buyerName = order.buyerId?.fullName ? String(order.buyerId.fullName).toLowerCase() : 'unknown';
    const sellerName = order.sellerId?.fullName ? String(order.sellerId.fullName).toLowerCase() : 'unknown';
    const search = searchTerm.toLowerCase();

    return orderId.includes(search) || 
           productTitle.includes(search) || 
           buyerName.includes(search) || 
           sellerName.includes(search);
  });

  if (loading) return (
    <div className="flex h-96 items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
    </div>
  );

  if (error) return (
    <div className="flex h-96 flex-col items-center justify-center p-6 text-center">
      <div className="text-red-500 font-semibold mb-2">ችግር ተከስቷል!</div>
      <div className="text-gray-500 dark:text-gray-400 max-w-md">{error}</div>
    </div>
  );

  return (
    <div className="p-6 space-y-6 relative">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <ShoppingCart className="h-6 w-6 text-emerald-500" />
          <h1 className="text-2xl font-bold dark:text-white">Global Orders</h1>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search ID, Product, Buyer, Seller..."
              className="pl-10 pr-4 py-2 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none w-72 dark:text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" size="sm"><Filter className="h-4 w-4 mr-2" /> Filter</Button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/10 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 dark:bg-white/5 text-gray-500 text-xs uppercase">
              <th className="px-6 py-4">Order Details</th>
              <th className="px-6 py-4">Parties (Buyer & Seller)</th>
              <th className="px-6 py-4">Total Price</th>
              <th className="px-6 py-4">Fees (Admin)</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Escrow</th>
              <th className="px-6 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-white/5">
            {filteredOrders.map((order) => (
              <tr key={order._id} className="hover:bg-gray-50 dark:hover:bg-white/10 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-medium dark:text-white">
                    {order.productId?.title || 'Product Deleted'}
                  </div>
                  <div className="text-[10px] text-gray-400 font-mono uppercase">
                    ID: {order._id ? order._id.slice(-8) : 'N/A'}
                  </div>
                </td>

                <td className="px-6 py-4 text-sm space-y-1">
                  <div className="flex items-center gap-1.5 dark:text-white">
                    <span className="text-[10px] bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300 px-1.5 py-0.5 rounded font-bold uppercase">Buy</span>
                    <span className="font-medium">{order.buyerId?.fullName || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-1.5 dark:text-white">
                    <span className="text-[10px] bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300 px-1.5 py-0.5 rounded font-bold uppercase">Sell</span>
                    <span className="font-medium">{order.sellerId?.fullName || 'N/A'}</span>
                  </div>
                </td>

                <td className="px-6 py-4 font-semibold dark:text-white">
                  {(order.totalPrice || 0).toLocaleString()} ETB
                </td>

                <td className="px-6 py-4 text-emerald-500 text-sm font-medium">
                  +{( (order.platformFeeBuyer || 0) + (order.platformFeeSeller || 0) ).toLocaleString()} ETB
                </td>

                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                    order.status === 'completed' || order.status === 'delivered'
                      ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400' 
                      : order.status === 'shipped'
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400'
                      : 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400'
                  }`}>
                    {order.status}
                  </span>
                </td>

                <td className="px-6 py-4">
                  {order.paymentHeld ? (
                    <span className="flex items-center gap-1 text-amber-500 text-xs font-medium"><Clock size={14}/> Held</span>
                  ) : (
                    <span className="flex items-center gap-1 text-green-500 text-xs font-medium"><CheckCircle size={14}/> Released</span>
                  )}
                </td>

                {/* 👁️ Action Button የተስተካከለበት መስመር */}
                <td className="px-6 py-4 text-right">
                  <button 
                    onClick={() => setSelectedOrder(order)} // 👈 ክሊክ ሲደረግ ሙሉ ዳታውን ይይዛል
                    className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg group transition-colors"
                  >
                    <Eye size={18} className="text-gray-400 group-hover:text-emerald-500 transition-colors" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredOrders.length === 0 && (
          <div className="p-10 text-center text-gray-500 dark:text-gray-400">No orders found.</div>
        )}
      </div>

      {/* ==================== ✨ DETAILED VIEW MODAL (ፖፕ-አፕ) ==================== */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#121212] w-full max-w-2xl rounded-2xl shadow-xl border border-gray-200 dark:border-white/10 overflow-hidden max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-gray-100 dark:border-white/5 flex items-center justify-between bg-gray-50 dark:bg-white/5">
              <div>
                <h2 className="text-lg font-bold dark:text-white">Order Full History</h2>
                <p className="text-xs text-gray-400 font-mono">ID: {selectedOrder._id}</p>
              </div>
              <button 
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 hover:bg-gray-200 dark:hover:bg-white/10 rounded-lg text-gray-500 dark:text-gray-400 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body (Scrollable) */}
            <div className="p-6 overflow-y-auto space-y-6">
              
              {/* 1. Product Details */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase text-gray-400 tracking-wider flex items-center gap-1">
                  <Tag size={14} /> Product Information
                </h3>
                <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/5 flex items-start gap-4">
                  {selectedOrder.productId?.images?.[0] && (
                    <img 
                      src={selectedOrder.productId.images[0]} 
                      alt="Product" 
                      className="w-16 h-16 rounded-lg object-cover bg-gray-200"
                    />
                  )}
                  <div className="space-y-1">
                    <h4 className="font-semibold dark:text-white text-base">
                      {selectedOrder.productId?.title || 'Product Deleted'}
                    </h4>
                    <p className="text-sm font-medium text-emerald-500">
                      Price per Item: {(selectedOrder.productId?.price || selectedOrder.totalPrice).toLocaleString()} ETB
                    </p>
                    <p className="text-xs text-gray-500">
                      Quantity Ordered: <span className="font-bold text-gray-700 dark:text-gray-300">{selectedOrder.quantity || 1}</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* 2. Buyer & Seller History Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Buyer Card */}
                <div className="p-4 bg-blue-50/50 dark:bg-blue-500/5 rounded-xl border border-blue-100 dark:border-blue-500/10 space-y-3">
                  <h3 className="text-xs font-bold uppercase text-blue-600 dark:text-blue-400 tracking-wider flex items-center gap-1">
                    <User size={14} /> Buyer Details
                  </h3>
                  <div className="space-y-1 dark:text-white">
                    <div className="font-semibold">{selectedOrder.buyerId?.fullName || 'Unknown Buyer'}</div>
                    <div className="text-xs text-gray-500 break-all">{selectedOrder.buyerId?.email || 'No Email Provided'}</div>
                  </div>
                  <div className="pt-2 border-t border-blue-100 dark:border-blue-500/10 text-xs text-gray-500 space-y-1">
                    <div className="flex items-center gap-1">
                      <MapPin size={12} className="shrink-0" />
                      <span className="line-clamp-2">Address: {selectedOrder.deliveryAddress || 'Not Provided'}</span>
                    </div>
                  </div>
                </div>

                {/* Seller Card */}
                <div className="p-4 bg-emerald-50/50 dark:bg-emerald-500/5 rounded-xl border border-emerald-100 dark:border-emerald-500/10 space-y-3">
                  <h3 className="text-xs font-bold uppercase text-emerald-600 dark:text-emerald-400 tracking-wider flex items-center gap-1">
                    <User size={14} /> Seller Details
                  </h3>
                  <div className="space-y-1 dark:text-white">
                    <div className="font-semibold">{selectedOrder.sellerId?.fullName || 'Unknown Seller'}</div>
                    <div className="text-xs text-gray-500 break-all">{selectedOrder.sellerId?.email || 'No Email Provided'}</div>
                  </div>
                  <div className="pt-2 border-t border-emerald-100 dark:border-emerald-500/10 text-xs text-gray-500">
                    <div>Role: Verified Platform Merchant</div>
                  </div>
                </div>

              </div>

              {/* 3. Escrow & Financial Breakdowns */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase text-gray-400 tracking-wider flex items-center gap-1">
                  <DollarSign size={14} /> Financial & Escrow Summary
                </h3>
                <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/5 grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
                  <div>
                    <div className="text-gray-400 text-xs">Total Gross Price</div>
                    <div className="font-bold dark:text-white mt-0.5">{(selectedOrder.totalPrice || 0).toLocaleString()} ETB</div>
                  </div>
                  <div>
                    <div className="text-gray-400 text-xs">Platform Fee (Admin)</div>
                    <div className="font-bold text-emerald-500 mt-0.5">
                      +{( (selectedOrder.platformFeeBuyer || 0) + (selectedOrder.platformFeeSeller || 0) ).toLocaleString()} ETB
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-400 text-xs">Escrow Protection</div>
                    <div className="mt-1">
                      {selectedOrder.paymentHeld ? (
                        <span className="px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 text-[11px] font-bold uppercase">Funds Held</span>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 text-[11px] font-bold uppercase">Released</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-white/5 flex justify-end">
              <Button onClick={() => setSelectedOrder(null)} variant="secondary" size="sm">
                Close View
              </Button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default Orders;
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, CheckCircle, Clock, XCircle, Eye, Calendar, User, Search, Filter, Truck } from 'lucide-react';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Modal from '../components/common/Modal';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const Orders = () => {
  const { user: authUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    const fetchOrders = async () => {
      if (!authUser) {
        setError('User not authenticated. Please log in.');
        setLoading(false);
        return;
      }
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No authentication token found. Please log in.');
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/transactions/my`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const txns = res.data.transactions || [];
        const mapped = await Promise.all(
          txns.map(async (txn) => {
            try {
              const isBuyer = txn.buyerUserId === authUser.userId;
              const firstItem = txn.items && txn.items[0] ? txn.items[0] : { quantity: 1, product: {} };
              let productName = 'Unknown Product';
              let buyerName = 'Unknown Buyer';
              let sellerName = 'Unknown Seller';

              // Fetch product
              try {
                const productResponse = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/products/${txn.productId || firstItem.product?._id}`, {
                  headers: { Authorization: `Bearer ${token}` },
                });
                productName = productResponse.data.name || productResponse.data.title || 'Unknown Product';
              } catch (productError) {
                console.error(`Error fetching product ${txn.productId || firstItem.product?._id}:`, productError.response?.data || productError.message);
              }

              // Fetch buyer
              try {
                const buyerResponse = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/users/${txn.buyerUserId}`, {
                  headers: { Authorization: `Bearer ${token}` },
                });
                buyerName = buyerResponse.data.fullName || 'Unknown Buyer';
              } catch (buyerError) {
                console.error(`Error fetching buyer ${txn.buyerUserId}:`, buyerError.response?.data || buyerError.message);
              }

              // Fetch seller
              try {
                const sellerResponse = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/users/${txn.sellerUserId}`, {
                  headers: { Authorization: `Bearer ${token}` },
                });
                sellerName = sellerResponse.data.fullName || 'Unknown Seller';
              } catch (sellerError) {
                console.error(`Error fetching seller ${txn.sellerUserId}:`, sellerError.response?.data || sellerError.message);
              }

              return {
                _id: txn._id || 'unknown',
                buyerUserId: txn.buyerUserId || '',
                sellerUserId: txn.sellerUserId || '',
                buyerName,
                sellerName,
                productId: txn.productId || firstItem.product?._id || '',
                productName,
                quantity: firstItem.quantity || 1,
                totalPrice: txn.totalAmount || 0,
                platformFeeBuyer: txn.platformFeeBuyer || 0,
                netSellerAmount: txn.netSellerAmount || 0,
                status: txn.status || 'pending',
                date: txn.createdAt || Date.now(),
                deliveryAddress: txn.deliveryAddress || '-',
                paymentHeld: txn.paymentHeld || false,
                type: isBuyer ? 'purchase' : 'sale',
                description: `${isBuyer ? 'Purchased' : 'Sold'} ${firstItem.quantity || 1} × ${productName} (ID: ${txn.productId || firstItem.product?._id || 'unknown'})`,
              };
            } catch (err) {
              console.error(`Error processing transaction ${txn._id || 'unknown'}:`, err);
              return null;
            }
          })
        );

        const validOrders = mapped.filter(order => order);
        if (validOrders.length === 0 && txns.length > 0) {
          setError('No valid orders could be processed. Please check transaction data.');
        } else if (txns.length === 0) {
          setError('No orders found.');
        }
        setOrders(validOrders);
      } catch (err) {
        console.error('Error fetching orders:', {
          message: err.message,
          response: err.response ? {
            status: err.response.status,
            data: err.response.data,
          } : null,
        });
        setError(`Failed to load orders: ${err.response?.data?.error || err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [authUser]);

  const filteredOrders = orders.filter(
    (order) =>
      order &&
      (order._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.buyerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.sellerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.productName?.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filterStatus === 'all' || order.status === filterStatus)
  );

  const handleUpdateOrderStatus = async (orderId, status) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('No authentication token found. Please log in.');
        return;
      }
      let response;
      switch (status) {
        case 'delivered':
          response = await axios.post(
            `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api//confirm-delivery/:transactionId/${orderId}`,
            {},
            { headers: { Authorization: `Bearer ${token}` } }
          );
          break;
        case 'shipped':
          response = await axios.post(
            `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/transactions/${orderId}/deliver`,
            {},
            { headers: { Authorization: `Bearer ${token}` } }
          );
          break;
        case 'canceled':
          response = await axios.post(
            `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/transactions/${orderId}/cancel`,
            {},
            { headers: { Authorization: `Bearer ${token}` } }
          );
          break;
        default:
          throw new Error('Invalid status update');
      }
      if (response.data.success) {
        toast.success(`${status.charAt(0).toUpperCase() + status.slice(1)} updated successfully`);
        setOrders(orders.map(order =>
          order._id === orderId ? { ...order, status } : order
        ));
      }
    } catch (error) {
      toast.error(error.response?.data?.error || `Failed to update status to ${status}`);
    }
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      completed: { color: 'bg-green-100 text-green-600 border-green-200', icon: CheckCircle },
      shipped: { color: 'bg-blue-100 text-blue-600 border-blue-200', icon: Truck },
      pending: { color: 'bg-yellow-100 text-yellow-600 border-yellow-200', icon: Clock },
      canceled: { color: 'bg-red-100 text-red-600 border-red-200', icon: XCircle },
    };
    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${config.color}`}>
        <Icon className="w-3 h-3 mr-1" />
        {status?.charAt(0).toUpperCase() + status?.slice(1)}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, type: 'spring' }}
        className="mb-6"
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Orders</h1>
      </motion.div>

      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <Input
          type="text"
          placeholder="Search by ID, buyer, seller, or product..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full sm:w-1/3"
          icon={<Search className="h-5 w-5 text-gray-400" />}
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="w-full sm:w-1/3 p-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="shipped">Shipped</option>
          <option value="completed">Completed</option>
          <option value="canceled">Canceled</option>
        </select>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="text-center text-gray-500">No orders found.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOrders.map((order) => (
            <motion.div
              key={order._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-900 dark:text-white">{order.productName}</h3>
                <span>{getStatusBadge(order.status)}</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">ID: {order._id}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Type: {order.type}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Price: {order.totalPrice} ETB</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Date: {new Date(order.date).toLocaleDateString()}</p>
              <div className="mt-4 flex gap-2">
                <Button
                  onClick={() => handleViewOrder(order)}
                  variant="outline"
                  className="flex-1"
                >
                  <Eye className="h-4 w-4 mr-1" /> View
                </Button>
                {order.status === 'pending' && order.type === 'sale' && (
                  <Button
                    onClick={() => handleUpdateOrderStatus(order._id, 'shipped')}
                    className="flex-1 bg-blue-500 text-white"
                  >
                    <Truck className="h-4 w-4 mr-1" /> Ship
                  </Button>
                )}
                {order.status === 'shipped' && order.type === 'purchase' && (
                  <Button
                    onClick={() => handleUpdateOrderStatus(order._id, 'delivered')}
                    className="flex-1 bg-green-500 text-white"
                  >
                    <CheckCircle className="h-4 w-4 mr-1" /> Confirm
                  </Button>
                )}
                {order.status === 'pending' && (
                  <Button
                    onClick={() => handleUpdateOrderStatus(order._id, 'canceled')}
                    className="flex-1 bg-red-500 text-white"
                  >
                    <XCircle className="h-4 w-4 mr-1" /> Cancel
                  </Button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {showOrderModal && selectedOrder && (
          <Modal
            isOpen={showOrderModal}
            onClose={() => setShowOrderModal(false)}
            title="Order Details"
          >
            <div className="p-4">
              <p><strong>Product:</strong> {selectedOrder.productName}</p>
              <p><strong>Buyer:</strong> {selectedOrder.buyerName}</p>
              <p><strong>Seller:</strong> {selectedOrder.sellerName}</p>
              <p><strong>Quantity:</strong> {selectedOrder.quantity}</p>
              <p><strong>Total Price:</strong> {selectedOrder.totalPrice} ETB</p>
              <p><strong>Status:</strong> {getStatusBadge(selectedOrder.status)}</p>
              <p><strong>Date:</strong> {new Date(selectedOrder.date).toLocaleString()}</p>
              <p><strong>Delivery Address:</strong> {selectedOrder.deliveryAddress}</p>
              <Button
                onClick={() => setShowOrderModal(false)}
                className="mt-4 w-full bg-blue-500 text-white"
              >
                Close
              </Button>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Orders;
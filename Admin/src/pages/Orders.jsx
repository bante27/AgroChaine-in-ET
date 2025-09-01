import React, { useState, useEffect } from 'react';
import { ShoppingCart, CheckCircle, Clock, XCircle, Eye, Calendar, User, Search, Filter } from 'lucide-react';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Modal from '../components/common/Modal';
import axios from 'axios';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/admin/transactions', {
        headers: { Authorization: `Bearer ${localStorage.getItem('userToken')}` },
      });
      setOrders(response.data.transactions || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateOrderStatus = async (orderId, status) => {
    try {
      await axios.patch(`http://localhost:5000/api/admin/transactions/${orderId}/status`, 
        { status },
        { headers: { Authorization: `Bearer ${localStorage.getItem('userToken')}` } }
      );
      fetchOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const filteredOrders = orders.filter(order =>
    order._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.buyerUserId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.sellerUserId?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status) => {
    const statusConfig = {
      completed: { color: 'bg-green-100 text-green-600 border-green-200', icon: CheckCircle },
      pending: { color: 'bg-yellow-100 text-yellow-600 border-yellow-200', icon: Clock },
      canceled: { color: 'bg-red-100 text-red-600 border-red-200', icon: XCircle }
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
      <div className="flex items-center justify-center min-h-96 bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-400"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl shadow-md min-h-[80vh] flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white dark:bg-gray-800 p-4 border-b border-gray-200 dark:border-gray-700 rounded-t-2xl flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <ShoppingCart className="h-6 w-6 text-emerald-500" />
          <h2 className="text-lg md:text-xl font-semibold text-gray-800 dark:text-gray-100">
            Order Management
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <Input
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={Search}
            className="w-48 md:w-64 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500"
          />
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <Filter className="h-4 w-4 text-gray-600 dark:text-gray-300" />
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-x-auto p-4">
        <table className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
              <th className="text-left p-4 text-gray-800 dark:text-gray-100 font-medium">Order ID</th>
              <th className="text-left p-4 text-gray-800 dark:text-gray-100 font-medium">Buyer</th>
              <th className="text-left p-4 text-gray-800 dark:text-gray-100 font-medium">Product</th>
              <th className="text-left p-4 text-gray-800 dark:text-gray-100 font-medium">Total</th>
              <th className="text-left p-4 text-gray-800 dark:text-gray-100 font-medium">Status</th>
              <th className="text-left p-4 text-gray-800 dark:text-gray-100 font-medium">Date</th>
              <th className="text-left p-4 text-gray-800 dark:text-gray-100 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <tr
                  key={order._id}
                  className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="p-4">
                    <span className="font-mono text-emerald-400 font-medium">{order._id}</span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-emerald-400 to-blue-500 rounded-full flex items-center justify-center">
                        <User className="h-4 w-4 text-white" />
                      </div>
                      <span className="text-gray-900 dark:text-gray-100">{order.buyerUserId}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div>
                      <span className="text-gray-900 dark:text-gray-100">{order.productId}</span>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">{order.quantity} items</p>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-emerald-400 font-bold">${order.totalPrice?.toFixed(2)}</span>
                  </td>
                  <td className="p-4">
                    {getStatusBadge(order.status)}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                      <Calendar className="h-4 w-4" />
                      <span className="text-sm">{new Date(order.date).toLocaleDateString()}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Button
                        onClick={() => handleUpdateOrderStatus(order._id, 'completed')}
                        variant="success"
                        size="icon"
                        title="Mark Complete"
                        disabled={order.status === 'completed'}
                      >
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                      <Button
                        onClick={() => handleUpdateOrderStatus(order._id, 'pending')}
                        variant="warning"
                        size="icon"
                        title="Set Pending"
                        disabled={order.status === 'pending'}
                      >
                        <Clock className="h-4 w-4" />
                      </Button>
                      <Button
                        onClick={() => handleUpdateOrderStatus(order._id, 'canceled')}
                        variant="danger"
                        size="icon"
                        title="Cancel Order"
                        disabled={order.status === 'canceled'}
                      >
                        <XCircle className="h-4 w-4" />
                      </Button>
                      <Button
                        onClick={() => {
                          setSelectedOrder(order);
                          setShowOrderModal(true);
                        }}
                        variant="secondary"
                        size="icon"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center p-4 text-gray-700 dark:text-gray-300">
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Order Details Modal */}
      <Modal
        isOpen={showOrderModal}
        onClose={() => setShowOrderModal(false)}
        title="Order Details"
        size="lg"
      >
        {selectedOrder && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Order Information</h3>
                <div className="space-y-2">
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Order ID: </span>
                    <span className="font-mono text-emerald-400">{selectedOrder._id}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Date: </span>
                    <span className="text-gray-900 dark:text-gray-100">{new Date(selectedOrder.date).toLocaleDateString()}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Status: </span>
                    {getStatusBadge(selectedOrder.status)}
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Total: </span>
                    <span className="text-emerald-400 font-bold">${selectedOrder.totalPrice?.toFixed(2)}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Platform Fee (Buyer): </span>
                    <span className="text-gray-900 dark:text-gray-100">${selectedOrder.platformFeeBuyer?.toFixed(2)}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Net Seller Amount: </span>
                    <span className="text-gray-900 dark:text-gray-100">${selectedOrder.netSellerAmount?.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Transaction Details</h3>
                <div className="space-y-2">
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Buyer ID: </span>
                    <span className="text-gray-900 dark:text-gray-100">{selectedOrder.buyerUserId}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Seller ID: </span>
                    <span className="text-gray-900 dark:text-gray-100">{selectedOrder.sellerUserId}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Product ID: </span>
                    <span className="text-gray-900 dark:text-gray-100">{selectedOrder.productId}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Quantity: </span>
                    <span className="text-gray-900 dark:text-gray-100">{selectedOrder.quantity} items</span>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Delivery Address: </span>
                    <span className="text-gray-900 dark:text-gray-100">{selectedOrder.deliveryAddress || '-'}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Payment Held: </span>
                    <span className="text-gray-900 dark:text-gray-100">{selectedOrder.paymentHeld ? 'Yes' : 'No'}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button
                onClick={() => handleUpdateOrderStatus(selectedOrder._id, 'completed')}
                variant="success"
                className="flex-1"
                disabled={selectedOrder.status === 'completed'}
              >
                Mark Complete
              </Button>
              <Button
                onClick={() => handleUpdateOrderStatus(selectedOrder._id, 'pending')}
                variant="warning"
                className="flex-1"
                disabled={selectedOrder.status === 'pending'}
              >
                Set Pending
              </Button>
              <Button
                onClick={() => handleUpdateOrderStatus(selectedOrder._id, 'canceled')}
                variant="danger"
                className="flex-1"
                disabled={selectedOrder.status === 'canceled'}
              >
                Cancel Order
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Orders;
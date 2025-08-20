import React, { useState, useEffect } from 'react';
import { ShoppingCart, CheckCircle, Clock, XCircle, Eye, Calendar, User, Search, Filter } from 'lucide-react';
import Table from '../components/common/Table';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Modal from '../components/common/Modal';

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
      const response = await fetch('/api/admin/orders');//cange to real APi
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateOrderStatus = async (orderId, status) => {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      
      if (response.ok) {
        fetchOrders();
      }
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const filteredOrders = orders.filter(order => 
    order.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customer?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status) => {
    const statusConfig = {
      completed: { color: 'bg-green-500/20 text-green-400 border-green-500/30', icon: CheckCircle },
      pending: { color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30', icon: Clock },
      canceled: { color: 'bg-red-500/20 text-red-400 border-red-500/30', icon: XCircle }
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
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-400"></div>
      </div>
    );
  }

  return (
    <>
      <Table 
        title="Order Management" 
        icon={ShoppingCart}
        actions={[
          <div key="search" className="flex items-center gap-2">
            <Input
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={Search}
              className="w-64"
            />
            <Button variant="ghost" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        ]}
      >
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left p-4 text-white/80 font-medium">Order ID</th>
              <th className="text-left p-4 text-white/80 font-medium">Customer</th>
              <th className="text-left p-4 text-white/80 font-medium">Product</th>
              <th className="text-left p-4 text-white/80 font-medium">Total</th>
              <th className="text-left p-4 text-white/80 font-medium">Status</th>
              <th className="text-left p-4 text-white/80 font-medium">Date</th>
              <th className="text-left p-4 text-white/80 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                <td className="p-4">
                  <span className="font-mono text-emerald-400 font-medium">{order.id}</span>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-white">{order.customer}</span>
                  </div>
                </td>
                <td className="p-4">
                  <div>
                    <span className="text-white">{order.product}</span>
                    <p className="text-white/60 text-sm">{order.items} items</p>
                  </div>
                </td>
                <td className="p-4">
                  <span className="text-emerald-400 font-bold">${order.total?.toFixed(2)}</span>
                </td>
                <td className="p-4">
                  {getStatusBadge(order.status)}
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2 text-white/80">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm">{order.date}</span>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <Button 
                      onClick={() => handleUpdateOrderStatus(order.id, 'completed')} 
                      variant="success" 
                      size="icon"
                      title="Mark Complete"
                    >
                      <CheckCircle className="h-4 w-4" />
                    </Button>
                    <Button 
                      onClick={() => handleUpdateOrderStatus(order.id, 'pending')} 
                      variant="warning" 
                      size="icon"
                      title="Set Pending"
                    >
                      <Clock className="h-4 w-4" />
                    </Button>
                    <Button 
                      onClick={() => handleUpdateOrderStatus(order.id, 'canceled')} 
                      variant="danger" 
                      size="icon"
                      title="Cancel Order"
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
            ))}
          </tbody>
        </table>
      </Table>

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
                <h3 className="text-lg font-semibold text-white">Order Information</h3>
                <div className="space-y-2">
                  <div>
                    <span className="text-white/60">Order ID: </span>
                    <span className="font-mono text-emerald-400">{selectedOrder.id}</span>
                  </div>
                  <div>
                    <span className="text-white/60">Date: </span>
                    <span className="text-white">{selectedOrder.date}</span>
                  </div>
                  <div>
                    <span className="text-white/60">Status: </span>
                    {getStatusBadge(selectedOrder.status)}
                  </div>
                  <div>
                    <span className="text-white/60">Total: </span>
                    <span className="text-emerald-400 font-bold text-lg">
                      ${selectedOrder.total?.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Customer Information</h3>
                <div className="space-y-2">
                  <div>
                    <span className="text-white/60">Name: </span>
                    <span className="text-white">{selectedOrder.customer}</span>
                  </div>
                  <div>
                    <span className="text-white/60">Product: </span>
                    <span className="text-white">{selectedOrder.product}</span>
                  </div>
                  <div>
                    <span className="text-white/60">Quantity: </span>
                    <span className="text-white">{selectedOrder.items} items</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button variant="primary" className="flex-1">Update Order</Button>
              <Button variant="secondary">Contact Customer</Button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

export default Orders;
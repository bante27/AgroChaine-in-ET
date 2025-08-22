import React, { useState, useEffect } from 'react';
import { Search, Filter, CheckCircle, Clock, XCircle, Edit, User } from 'lucide-react';
import Table from '../components/common/Table';
import Button from '../components/common/Button';
import Input from '../components/common/Input';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Example fetch
    setOrders([
      {
        id: 1,
        customer: 'John Doe',
        phone: '0911223344',
        address: 'Addis Ababa',
        createdAt: '2025-08-21T07:15:00Z',
        status: 'pending',
      },
      {
        id: 2,
        customer: 'Sara Smith',
        phone: '0922334455',
        address: 'Bahir Dar',
        createdAt: '2025-08-20T16:30:00Z',
        status: 'completed',
      },
    ]);
  }, []);

  // ✅ Filter by search term
  const filteredOrders = orders.filter(order =>
    order.customer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ✅ Format time
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="p-6 bg-white min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Orders</h2>
        
        {/* ✅ Search bar (white background, border) */}
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search customer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm"
            />
          </div>
          <Button>
            <Filter className="w-4 h-4 mr-2" /> Filter
          </Button>
        </div>
      </div>

      {/* ✅ Table */}
      <Table
        headers={[
          "Customer",
          "Phone",
          "Address",
          "Created At",
          "Status",
          "Action",
        ]}
        rows={filteredOrders.map((order) => [
          // ✅ User avatar with name
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-gray-100 rounded-full">
              <User className="w-4 h-4 text-gray-500" />
            </div>
            <span>{order.customer}</span>
          </div>,
          order.phone,
          order.address,
          formatDate(order.createdAt), // ✅ formatted date
          <span
            className={`px-2 py-1 rounded text-xs font-medium ${
              order.status === 'completed'
                ? 'bg-green-100 text-green-700'
                : 'bg-yellow-100 text-yellow-700'
            }`}
          >
            {order.status}
          </span>,
          <div className="flex space-x-2">
            <Button size="sm" variant="outline">
              <Eye className="w-4 h-4 mr-1" /> View
            </Button>
            <Button size="sm" variant="outline">
              <Edit className="w-4 h-4 mr-1" /> Edit
            </Button>
          </div>
        ])}
      />
    </div>
  );
};

export default OrdersPage;

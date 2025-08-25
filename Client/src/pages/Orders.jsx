
import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const Orders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && user) {
      setLoading(true);
      axios
        .get('http://localhost:5000/api/users/profile', {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          const orderList = response.data.user.transactionHistory || [];
          setOrders(
            orderList.map((order, index) => ({
              id: index,
              type: order.buyerUserId === user.userId ? 'purchase' : 'sale',
              description: `${order.buyerUserId === user.userId ? 'Purchased' : 'Sold'} ${order.quantity} of product (ID: ${order.productId})`,
              amount: `${order.totalPrice} ETB`,
              time: new Date(order.date || Date.now()).toLocaleString(),
              status: order.status || 'completed',
            }))
          );
          setLoading(false);
        })
        .catch((err) => {
          setError('Failed to load orders');
          setLoading(false);
          console.error(err);
        });
    }
  }, [user]);

  if (loading) {
    return <div className="text-center text-gray-600 dark:text-gray-400">Loading orders...</div>;
  }

  if (error) {
    return <div className="text-center text-red-600">{error}</div>;
  }

  return (
    <div className="space-y-4">
      {orders.length ? (
        orders.map((order) => (
          <div
            key={order.id}
            className="p-4 bg-gray-100 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-600"
          >
            <p className="text-base font-semibold text-gray-900 dark:text-gray-100">{order.description}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total: {order.amount}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Date: {order.time}</p>
            <span
              className={`inline-flex px-2 py-1 text-sm font-semibold rounded-full ${
                order.status === 'completed'
                  ? 'bg-green-100 text-green-800 border border-green-200 dark:bg-green-900 dark:text-green-200 dark:border-green-800'
                  : order.status === 'pending'
                  ? 'bg-yellow-100 text-yellow-800 border border-yellow-200 dark:bg-yellow-900 dark:text-yellow-200 dark:border-yellow-800'
                  : 'bg-blue-100 text-blue-800 border border-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:border-blue-800'
              }`}
            >
              {order.status}
            </span>
          </div>
        ))
      ) : (
        <p className="text-center text-gray-600 dark:text-gray-400">No orders available.</p>
      )}
    </div>
  );
};

export default Orders;

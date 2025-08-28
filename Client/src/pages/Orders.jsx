import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const Orders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      const token = localStorage.getItem('token');
      try {
        setLoading(true);
        const res = await axios.get('http://localhost:5000/api/transactions/my', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const txns = res.data.transactions || [];
        const mapped = txns.map((txn) => {
          const isBuyer = txn.buyerUserId === user.userId;
          const firstItem = txn.items[0]; // show first product
          return {
            id: txn._id,
            type: isBuyer ? 'purchase' : 'sale',
            description: `${isBuyer ? 'Purchased' : 'Sold'} ${
              firstItem.quantity
            } × ${firstItem.product?.title || 'Product'} (ID: ${
              firstItem.product?._id || ''
            })`,
            amount: `${txn.totalAmount} ETB`,
            time: new Date(txn.createdAt).toLocaleString(),
            status: txn.status || 'pending',
          };
        });

        setOrders(mapped);
      } catch (err) {
        console.error(err);
        setError('Failed to load orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  if (loading) return <div className="text-center">Loading orders...</div>;
  if (error) return <div className="text-center text-red-600">{error}</div>;

  return (
    <div className="space-y-4">
      {orders.length ? (
        orders.map((order) => (
          <div
            key={order.id}
            className="p-4 bg-gray-100 rounded-xl border border-gray-200"
          >
            <p className="font-semibold">{order.description}</p>
            <p>Total: {order.amount}</p>
            <p>Date: {order.time}</p>
            <span
              className={`inline-block px-2 py-1 text-sm font-semibold rounded-full ${
                order.status === 'completed'
                  ? 'bg-green-100 text-green-800 border border-green-200'
                  : order.status === 'pending'
                  ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                  : 'bg-blue-100 text-blue-800 border border-blue-200'
              }`}
            >
              {order.status}
            </span>
          </div>
        ))
      ) : (
        <p className="text-center">No orders available.</p>
      )}
    </div>
  );
};

export default Orders;

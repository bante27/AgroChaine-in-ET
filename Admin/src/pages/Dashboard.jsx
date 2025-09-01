import React, { useState, useEffect } from 'react';
import { Users, Package, ShoppingCart, MessageSquare, TrendingUp, Calendar } from 'lucide-react';
import StatCard from '../components/common/StatCard';
import Card from '../components/common/Card';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { token, user } = useAuth();
  const [stats, setStats] = useState({
    users: { total: 1, verified: 0 }, // Self-only
    products: { bought: 0, saved: 0, totalValue: 0 },
    transactions: { total: 0, completed: 0, revenue: 0 },
    messages: { total: 0, unread: 0 },
  });
  const [loading, setLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch user profile
        const profileResponse = await axios.get('http://localhost:5000/api/users/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const userData = profileResponse.data.user;

        // Fetch verification status
        const verificationResponse = await axios.get('http://localhost:5000/api/admin/verifications/pending', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const pendingVerifications = verificationResponse.data.pending;
        const isVerified = !pendingVerifications.some((v) => v.userId === userData.userId);

        // Fetch products
        const productsResponse = await axios.get('http://localhost:5000/api/admin/products', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const products = productsResponse.data.products;

        // Fetch transactions
        const transactionsResponse = await axios.get('http://localhost:5000/api/admin/transactions', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const userTransactions = transactionsResponse.data.transactions.filter(
          (t) => t.buyerUserId === userData.userId || t.sellerUserId === userData.userId
        );

        // Fetch user messages
        const messagesResponse = await axios.get('http://localhost:5000/api/admin/messages', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const userMessages = messagesResponse.data.messages.filter((msg) => msg.email === userData.email);

        // Calculate stats
        const boughtProductIds = userData.boughtProducts?.map((p) => (typeof p === 'object' ? p.productId : p)) || [];
        const savedProductIds = userData.savedProducts?.map((p) => (typeof p === 'object' ? p.productId : p)) || [];
        const boughtProducts = products.filter((p) => boughtProductIds.includes(p.productId));
        const totalValue = boughtProducts.reduce((sum, p) => sum + (p.price || 0), 0);

        setStats({
          users: { total: 1, verified: isVerified ? 1 : 0 },
          products: {
            bought: boughtProductIds.length,
            saved: savedProductIds.length,
            totalValue,
          },
          transactions: {
            total: userTransactions.length,
            completed: userTransactions.filter((t) => t.status === 'completed').length,
            revenue: userTransactions.reduce((sum, t) => sum + (t.totalPrice || 0), 0),
          },
          messages: {
            total: userMessages.length,
            unread: userMessages.filter((msg) => msg.status === 'unread').length,
          },
        });

        // Set recent activity (messages and transactions)
        const messageActivities = userMessages.slice(0, 5).map((msg) => ({
          id: msg._id,
          type: 'message',
          description: `New message: ${msg.subject}`,
          timestamp: new Date(msg.createdAt).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          }),
        }));

        const transactionActivities = userTransactions.slice(0, 5).map((t) => ({
          id: t._id,
          type: 'transaction',
          description: `${
            t.buyerUserId === userData.userId ? 'Bought' : 'Sold'
          } product (ID: ${t.productId}) for $${t.totalPrice}`,
          timestamp: new Date(t.date).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          }),
        }));

        setRecentActivity([...messageActivities, ...transactionActivities].sort(
          (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
        ).slice(0, 5));
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (token && user) fetchDashboardData();
  }, [token, user]);

  const ProgressBar = ({ label, value, total, color = 'emerald' }) => (
    <div className="flex items-center justify-between mb-3">
      <span className="text-white/80 text-sm">{label}</span>
      <div className="flex items-center gap-2">
        <div className="w-24 h-2 bg-white/20 rounded-full overflow-hidden">
          <div
            className={`h-full bg-${color}-500 rounded-full transition-all duration-500`}
            style={{ width: `${total > 0 ? (value / total) * 100 : 0}%` }}
          />
        </div>
        <span className="text-white font-semibold text-sm">{value}</span>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Your Profile"
            value={stats.users.verified ? 'Verified' : 'Pending'}
            icon={Users}
            color="from-emerald-400 to-emerald-600"
            subtitle={`You have ${stats.users.total} account`}
            trend="0"
          />
          <StatCard
            title="Products Bought"
            value={stats.products.bought}
            icon={Package}
            color="from-blue-400 to-blue-600"
            subtitle={`$${stats.products.totalValue.toLocaleString()} spent`}
            trend="0"
          />
          <StatCard
            title="Transactions"
            value={stats.transactions.total}
            icon={ShoppingCart}
            color="from-purple-400 to-purple-600"
            subtitle={`$${stats.transactions.revenue.toLocaleString()} total`}
            trend="0"
          />
          <StatCard
            title="Messages"
            value={stats.messages.total}
            icon={MessageSquare}
            color="from-pink-400 to-pink-600"
            subtitle={`${stats.messages.unread} unread`}
            trend="0"
          />
        </div>

        {/* Charts and Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Product Activity */}
          <Card gradient className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <Package className="h-6 w-6 text-blue-400" />
              <h3 className="text-lg font-semibold text-white">Your Product Activity</h3>
            </div>
            <div className="space-y-4">
              <ProgressBar
                label="Bought Products"
                value={stats.products.bought}
                total={stats.products.bought + stats.products.saved}
                color="emerald"
              />
              <ProgressBar
                label="Saved Products"
                value={stats.products.saved}
                total={stats.products.bought + stats.products.saved}
                color="yellow"
              />
            </div>
          </Card>

          {/* Transaction Status */}
          <Card gradient className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <ShoppingCart className="h-6 w-6 text-purple-400" />
              <h3 className="text-lg font-semibold text-white">Transaction Status</h3>
            </div>
            <div className="space-y-4">
              <ProgressBar
                label="Completed Transactions"
                value={stats.transactions.completed}
                total={stats.transactions.total}
                color="emerald"
              />
              <ProgressBar
                label="Pending Transactions"
                value={stats.transactions.total - stats.transactions.completed}
                total={stats.transactions.total}
                color="yellow"
              />
            </div>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card gradient className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="h-6 w-6 text-purple-400" />
            <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
          </div>
          <div className="space-y-4">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center gap-3 p-3 bg-white/5 rounded-lg"
                >
                  <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                  <span className="text-white/80 text-sm">{activity.description}</span>
                  <span className="ml-auto text-white/60 text-xs flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {activity.timestamp}
                  </span>
                </div>
              ))
            ) : (
              <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                <span className="text-white/80 text-sm">No recent activity</span>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
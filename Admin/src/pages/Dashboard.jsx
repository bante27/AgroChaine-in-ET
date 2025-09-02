import React, { useState, useEffect } from 'react';
import { Users, Package, ShoppingCart, MessageSquare, TrendingUp, Calendar } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

// Custom ETB Icon Component
const ETBIcon = ({ className }) => (
  <svg
    className={className}
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <text x="6" y="18" fontSize="16" fontFamily="Arial, sans-serif">ብር</text>
    <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z" />
  </svg>
);

const Dashboard = () => {
  const { token } = useAuth();
  const [stats, setStats] = useState({
    users: { total: 0, verified: 0 },
    products: { total: 0, totalValue: 0 },
    transactions: { total: 0, completed: 0, revenue: 0 },
    messages: { total: 0, unread: 0 },
    platformRevenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const usersResponse = await axios.get('http://localhost:5000/api/admin/users', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const users = usersResponse.data.users || [];

        const productsResponse = await axios.get('http://localhost:5000/api/admin/products', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const products = productsResponse.data.products || [];

        const transactionsResponse = await axios.get('http://localhost:5000/api/admin/transactions', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const transactions = transactionsResponse.data.transactions || [];

        const messagesResponse = await axios.get('http://localhost:5000/api/admin/messages', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const messages = messagesResponse.data.messages || [];

        const totalValue = products.reduce((sum, p) => sum + (p.price || 0), 0);
        const platformRevenue = transactions.reduce((sum, t) => sum + (t.serviceFee || t.totalPrice * 0.05), 0);

        setStats({
          users: {
            total: users.length,
            verified: users.filter((u) => u.isVerified).length,
          },
          products: {
            total: products.length,
            totalValue,
          },
          transactions: {
            total: transactions.length,
            completed: transactions.filter((t) => t.status === 'completed').length,
            revenue: transactions.reduce((sum, t) => sum + (t.totalPrice || 0), 0),
          },
          messages: {
            total: messages.length,
            unread: messages.filter((msg) => msg.status === 'unread').length,
          },
          platformRevenue: platformRevenue.toFixed(2),
        });

        const messageActivities = messages.slice(0, 5).map((msg) => ({
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

        const transactionActivities = transactions.slice(0, 5).map((t) => ({
          id: t._id,
          type: 'transaction',
          description: `Transaction: Product (ID: ${t.productId}) for $${t.totalPrice}`,
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
        setError(error.response?.data?.error || 'Failed to fetch dashboard data');
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchDashboardData();
  }, [token]);

  const ProgressBar = ({ label, value, total, color = 'cyan' }) => (
    <div className="flex flex-col mb-4">
      <div className="flex justify-between mb-1">
        <span className="text-gray-300 text-sm font-medium">{label}</span>
        <span className="text-gray-300 text-sm font-semibold">{value}</span>
      </div>
      <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
        <div
          className={`h-full bg-${color}-400 rounded-full transition-all duration-700 ease-out`}
          style={{ width: `${total > 0 ? (value / total) * 100 : 0}%` }}
        />
      </div>
    </div>
  );

  const StatCard = ({ title, value, icon: Icon, color, subtitle }) => (
    <div className={`relative bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-${color}-500/20`}>
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-full bg-${color}-500/20`}>
          <Icon className={`h-8 w-8 text-${color}-400`} />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-white">{value}</h3>
          <p className="text-gray-400 text-sm font-medium">{title}</p>
          <p className="text-gray-500 text-xs mt-1">{subtitle}</p>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-cyan-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 lg:p-8">
      {error && (
        <div className="max-w-7xl mx-auto mb-6">
          <div className="bg-red-500/10 text-red-400 p-4 rounded-lg border border-red-500/30 shadow-md">
            {error}
          </div>
        </div>
      )}
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
          <div className="text-gray-400 text-sm">
            Last updated: {new Date().toLocaleString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          <StatCard
            title="Total Users"
            value={stats.users.total}
            icon={Users}
            color="cyan"
            subtitle={`${stats.users.verified} verified`}
          />
          <StatCard
            title="Total Products"
            value={stats.products.total}
            icon={Package}
            color="indigo"
            subtitle={`$${stats.products.totalValue.toLocaleString()} total value`}
          />
          <StatCard
            title="Total Transactions"
            value={stats.transactions.total}
            icon={ShoppingCart}
            color="purple"
            subtitle={`$${stats.transactions.revenue.toLocaleString()} revenue`}
          />
          <StatCard
            title="Platform Revenue"
            value={`ብር ${stats.platformRevenue}`}
            icon={ETBIcon}
            color="emerald"
            subtitle="Total service fees (5%)"
          />
          <StatCard
            title="Total Messages"
            value={stats.messages.total}
            icon={MessageSquare}
            color="pink"
            subtitle={`${stats.messages.unread} unread`}
          />
        </div>

        {/* Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Product Activity */}
          <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-cyan-500/20">
            <div className="flex items-center gap-3 mb-6">
              <Package className="h-6 w-6 text-cyan-400" />
              <h3 className="text-lg font-semibold text-white">Platform Product Activity</h3>
            </div>
            <ProgressBar
              label="Total Products"
              value={stats.products.total}
              total={stats.products.total}
              color="cyan"
            />
          </div>

          {/* Transaction Status */}
          <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-purple-500/20">
            <div className="flex items-center gap-3 mb-6">
              <ShoppingCart className="h-6 w-6 text-purple-400" />
              <h3 className="text-lg font-semibold text-white">Platform Transaction Status</h3>
            </div>
            <ProgressBar
              label="Completed Transactions"
              value={stats.transactions.completed}
              total={stats.transactions.total}
              color="cyan"
            />
            <ProgressBar
              label="Pending Transactions"
              value={stats.transactions.total - stats.transactions.completed}
              total={stats.transactions.total}
              color="yellow"
            />
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-purple-500/20">
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="h-6 w-6 text-purple-400" />
            <h3 className="text-lg font-semibold text-white">Recent Platform Activity</h3>
          </div>
          <div className="space-y-3">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center gap-3 p-3 bg-gray-700/50 rounded-lg hover:bg-gray-700/70 transition-colors duration-200"
                >
                  <div className={`w-2 h-2 rounded-full ${activity.type === 'message' ? 'bg-cyan-400' : 'bg-purple-400'}`}></div>
                  <span className="text-gray-300 text-sm flex-1">{activity.description}</span>
                  <span className="text-gray-400 text-xs flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {activity.timestamp}
                  </span>
                </div>
              ))
            ) : (
              <div className="flex items-center gap-3 p-3 bg-gray-700/50 rounded-lg">
                <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                <span className="text-gray-300 text-sm">No recent activity</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
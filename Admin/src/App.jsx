import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import PrivateRoute from './components/PrivateRoute';
import Layout from './components/layout/Layout';

// Pages
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Products from './pages/Products';
import Orders from './pages/Orders';
import Messages from './pages/Messages';
import Profile from './pages/Profile';
import Verifications from './pages/Verifications'; // Renamed for consistency
import Login from './pages/Login';
import AdminChatDashboard from './pages/ChatDashboard';
// import ForgotPassword from './pages/ForgotPassword'; // Add this when you create the page

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            {/* <Route path="/forgot-password" element={<ForgotPassword />} /> */}

            {/* Protected Routes Wrapper */}
            {/* All routes below require authentication */}
            
            {/* Dashboard */}
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Layout>
                    <Dashboard />
                  </Layout>
                </PrivateRoute>
              }
            />

            {/* Live Chat */}
            <Route
              path="/chat"
              element={
                <PrivateRoute>
                  <Layout>
                    <AdminChatDashboard />
                  </Layout>
                </PrivateRoute>
              }
            />

            {/* User Management - Admin Only */}
            <Route
              path="/users"
              element={
                <PrivateRoute adminOnly={true}>
                  <Layout>
                    <Users />
                  </Layout>
                </PrivateRoute>
              }
            />

            {/* Product Management */}
            <Route
              path="/products"
              element={
                <PrivateRoute>
                  <Layout>
                    <Products />
                  </Layout>
                </PrivateRoute>
              }
            />

            {/* Order Management */}
            <Route
              path="/orders"
              element={
                <PrivateRoute>
                  <Layout>
                    <Orders />
                  </Layout>
                </PrivateRoute>
              }
            />

            {/* Messages */}
            <Route
              path="/messages"
              element={
                <PrivateRoute>
                  <Layout>
                    <Messages />
                  </Layout>
                </PrivateRoute>
              }
            />

            {/* Profile */}
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <Layout>
                    <Profile />
                  </Layout>
                </PrivateRoute>
              }
            />

            {/* User ID Verifications */}
            <Route
              path="/verifications"
              element={
                <PrivateRoute>
                  <Layout>
                    <Verifications />
                  </Layout>
                </PrivateRoute>
              }
            />

            {/* Catch-all: Redirect unknown routes to login or dashboard */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
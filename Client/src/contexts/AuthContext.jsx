import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { API_URL } from '../utils/apiConfig';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  const socketRef = useRef(null);

  // Initialize Socket connection
  const initSocket = (currentUser) => {
    if (socketRef.current) return;

    const socket = io(API_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
    });

    socket.on('connect', () => {
      console.log('📡 Notification socket connected');
      if (currentUser) {
        socket.emit('user:join', {
          userId: currentUser.userId,
          userName: currentUser.fullName,
          userEmail: currentUser.email
        });
      }
    });

    socket.on('notification', (data) => {
      console.log('🔔 Real-time notification:', data);
      toast.success(data.data.message || 'Updated activity', {
        icon: '🔔',
        duration: 5000,
      });

      // Auto-refresh profile if it's a balance or order update
      if (['payment-released', 'order-received', 'order-shipped-notice', 'delivery-confirmed'].includes(data.type)) {
        fetchUserProfile();
      }
    });

    socketRef.current = socket;
  };

  const fetchUserProfile = async () => {
    const storedToken = localStorage.getItem('token');
    if (!storedToken) return;

    try {
      const res = await axios.get(`${API_URL}/api/users/profile`, {
        headers: { Authorization: `Bearer ${storedToken}` },
      });

      if (res.data.success && res.data.user) {
        setUser(res.data.user);
        setIsAuthenticated(true);
        initSocket(res.data.user);
      }
    } catch (err) {
      console.error('Fetch profile error:', err);
      // Only logout if 401 Unauthorized or 403 Forbidden
      if (err.response?.status === 401 || err.response?.status === 403) {
        logout();
      }
    }
  };

  // Check authentication on app load
  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (!storedToken) {
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(`${API_URL}/api/users/profile`, {
          headers: { Authorization: `Bearer ${storedToken}` },
        });

        if (res.data.success && res.data.user) {
          setUser(res.data.user);
          setIsAuthenticated(true);
          initSocket(res.data.user);
        } else {
          logout();
        }
      } catch (err) {
        console.error('Auth check error:', err);
        // Do NOT logout on network error, only on explicit auth failure
        if (err.response?.status === 401 || err.response?.status === 403) {
          logout();
        } else {
          // Keep current state but stop loading
          console.warn('Network error during auth check, keeping session');
        }
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, []);

  // Login function
  const login = async (credentials) => {
    try {
      const res = await axios.post(`${API_URL}/api/users/login`, credentials, {
        headers: { 'Content-Type': 'application/json' },
      });

      const data = res.data;

      // Backend returns: { success: true, token: '...', user: { ... } }
      if (res.status === 200 && data.success) {
        localStorage.setItem('token', data.token);
        setToken(data.token);
        setUser(data.user);
        setIsAuthenticated(true);
        initSocket(data.user);
        return { success: true, user: data.user };
      } else {
        return { success: false, error: data.error || 'Login failed' };
      }
    } catch (err) {
      console.error('Login error:', err);
      return { success: false, error: err.response?.data?.error || 'Network error' };
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, token, login, logout, loading, isAuthenticated, setUser, setToken, setIsAuthenticated, fetchUserProfile, socket: socketRef.current }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};
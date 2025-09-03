import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('userToken'));
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('userToken'));
  const [role, setRole] = useState('guest'); // Default role

  // Check authentication on app load
  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = localStorage.getItem('userToken');
      if (!storedToken) {
        setIsAuthenticated(false);
        setRole('guest');
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get('http://157.245.187.246:5000/api/users/profile', {
          headers: { Authorization: `Bearer ${storedToken}` },
        });

        if (res.data.success && res.data.user) {
          // Only set auth state if user is admin
          if (res.data.user.isAdmin) {
            setUser(res.data.user);
            setIsAuthenticated(true);
            setRole('admin');
          } else {
            localStorage.removeItem('userToken');
            setToken(null);
            setIsAuthenticated(false);
            setRole('guest');
          }
        } else {
          localStorage.removeItem('userToken');
          setToken(null);
          setIsAuthenticated(false);
          setRole('guest');
        }
      } catch (err) {
        console.error('Auth check error:', err);
        localStorage.removeItem('userToken');
        setToken(null);
        setIsAuthenticated(false);
        setRole('guest');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (credentials) => {
    try {
      const res = await axios.post('http://157.245.187.246:5000/api/users/login', credentials, {
        headers: { 'Content-Type': 'application/json' },
      });

      const data = res.data;

      if (res.status === 200 && data.success) {
        // Only allow login for admin users
        if (data.user.isAdmin) {
          localStorage.setItem('userToken', data.token);
          setToken(data.token);
          setUser(data.user);
          setIsAuthenticated(true);
          setRole('admin');
          return { success: true, user: data.user };
        } else {
          return { success: false, error: 'Access denied: Only admins can log in' };
        }
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
    localStorage.removeItem('userToken');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    setRole('guest');
  };

  return (
    <AuthContext.Provider
      value={{ user, token, role, login, logout, loading, isAuthenticated }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};
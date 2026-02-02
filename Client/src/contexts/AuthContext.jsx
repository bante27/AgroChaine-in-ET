import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../utils/apiConfig';

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

  // Check authentication on app load
  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = localStorage.getItem('userToken');
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
        } else {
          localStorage.removeItem('userToken');
          setToken(null);
          setIsAuthenticated(false);
        }
      } catch (err) {
        console.error('Auth check error:', err);
        localStorage.removeItem('userToken');
        setToken(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (credentials) => {
    try {
      const res = await axios.post(`${API_URL}/api/users/login`, credentials, {
        headers: { 'Content-Type': 'application/json' },
      });

      const data = res.data;

      if (res.status === 200 && data.success) {
        localStorage.setItem('userToken', data.token);
        setToken(data.token);
        setUser(data.user);
        setIsAuthenticated(true);
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
    localStorage.removeItem('userToken');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{ user, token, login, logout, loading, isAuthenticated }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};
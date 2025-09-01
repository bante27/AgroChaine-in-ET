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
        const res = await axios.get('http://localhost:5000/api/users/profile', {
          headers: { Authorization: `Bearer ${storedToken}` },
        });

        if (res.data.success && res.data.user) {
          setUser(res.data.user);
          setIsAuthenticated(true);
          setRole(res.data.user.isAdmin ? 'admin' : 'user');
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
      const res = await fetch('http://localhost:5000/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        localStorage.setItem('userToken', data.token);
        setToken(data.token);
        setUser(data.user);
        setIsAuthenticated(true);
        setRole(data.user.isAdmin ? 'admin' : 'user');
        return { success: true, user: data.user };
      } else {
        return { success: false, error: data.error || 'Login failed' };
      }
    } catch (err) {
      console.error('Login error:', err);
      return { success: false, error: 'Network error' };
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
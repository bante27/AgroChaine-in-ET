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
  const [token, setToken] = useState(sessionStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(!!sessionStorage.getItem('token'));
  const [role, setRole] = useState('guest'); 

  // Check auth on load
  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = sessionStorage.getItem('token');
      if (!storedToken) {
        handleLogout();
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(`${API_URL}/api/users/profile`, {
          headers: { Authorization: `Bearer ${storedToken}` },
        });

        if (res.data.success && res.data.user) {
          const userData = res.data.user;
          
          // Align with Schema: check the .role property directly
          if (userData.role === 'admin' || userData.role === 'superadmin') {
            setUser(userData);
            setIsAuthenticated(true);
            setToken(storedToken);
            setRole(userData.role); // Sets 'admin' or 'superadmin'
          } else {
            // Not an authorized role for this panel
            handleLogout();
          }
        } else {
          handleLogout();
        }
      } catch (err) {
        console.error('Auth check error:', err);
        handleLogout();
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (credentials) => {
    try {
      const res = await axios.post(`${API_URL}/api/users/login`, credentials);
      const data = res.data;

      if (data.success && data.token) {
        const userData = data.user;

        // Ensure role matches the schema's enum
        if (userData.role === 'admin' || userData.role === 'superadmin') {
          sessionStorage.setItem('token', data.token);
          setToken(data.token);
          setUser(userData);
          setIsAuthenticated(true);
          setRole(userData.role);

          return { success: true, user: userData };
        } else {
          return { success: false, error: 'Access denied: You do not have administrative privileges.' };
        }
      }
      return { success: false, error: data.error || 'Login failed' };
    } catch (err) {
      return { success: false, error: err.response?.data?.error || 'Network error' };
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    setRole('guest');
  };

  const logout = () => handleLogout();

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        role,
        login,
        logout,
        loading,
        isAuthenticated,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};
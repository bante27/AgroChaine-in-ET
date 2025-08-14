import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api/auth';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('AuthContext: Checking auth status, token:', token);
      if (token) {
        const response = await axios.get('http://localhost:5000/api/users/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('AuthContext: Profile response:', response.data);
        if (response.data && response.data.user) {
          setUser(response.data.user);
          setIsAuthenticated(true);
        } else {
          console.warn('AuthContext: No user data in profile response');
          localStorage.removeItem('token');
          setIsAuthenticated(false);
          setUser(null);
        }
      } else {
        console.log('AuthContext: No token found');
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (error) {
      console.error('AuthContext: Error verifying token:', error);
      localStorage.removeItem('token');
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (token, userData) => {
    try {
      console.log('AuthContext: Login attempt with token:', token);
      localStorage.setItem('token', token);
      setUser(userData);
      setIsAuthenticated(true);
      setLoading(false);
      return { success: true, user: userData };
    } catch (error) {
      console.error('AuthContext: Login error:', error);
      localStorage.removeItem('token');
      setIsAuthenticated(false);
      setUser(null);
      setLoading(false);
      return {
        success: false,
        error: error.response?.data?.error || 'Login failed',
      };
    }
  };

  const register = async (userData) => {
    try {
      console.log('AuthContext: Register attempt with data:', userData);
      const response = await authAPI.register(userData);
      console.log('AuthContext: Register response:', response.data);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('AuthContext: Registration error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Registration failed',
      };
    }
  };

  const logout = () => {
    console.log('AuthContext: Logging out');
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
    setLoading(false);
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
    setUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
import React, { createContext, useContext, useState, useEffect } from 'react';

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
  const [isAuthenticated, setIsAuthenticated] = useState(!!token);
  const [role, setRole] = useState("guest"); // default role

  // Validate token on app load
  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = localStorage.getItem('userToken');
      if (storedToken) {
        setLoading(false);
        setIsAuthenticated(true);
        setRole("admin");
        return;
      }

      try {
        const res = await fetch('http://localhost:5000/api/users/validate', {
          headers: { Authorization: `Bearer ${storedToken}` },
        });

        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
          setIsAuthenticated(true);
          //setRole(data.user.isAdmin ? "admin" : "user"); // fallback = user
        } else {
          localStorage.removeItem('userToken');
          setIsAuthenticated(false);
          setRole("guest");
        }
      } catch (err) {
        console.error('Auth validation error:', err);
        localStorage.removeItem('userToken');
        setIsAuthenticated(false);
        setRole("guest");
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
        setRole(data.user.isAdmin ? "admin" : "user"); 
        return { success: true, user: data.user };
      } else {
        return { success: false, error: data.error || 'Login failed' };
      }
    } catch (err) {
      return { success: false, error: 'Network error' };
    }
  };

  const logout = () => {
    localStorage.removeItem('userToken');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    setRole("guest");
  };

  return (
    <AuthContext.Provider
      value={{ user, token, role, login, logout, loading, isAuthenticated }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

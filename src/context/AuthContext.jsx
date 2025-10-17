// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import { authAPI } from '../services/api.js'; 

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await authAPI.getCurrentUser();
        setUser(response.data.data);
        setIsAuthenticated(true);
      } catch (error) {
        // 401 là bình thường khi user chưa login
        if (error.response?.status === 401) {
          console.log('User not authenticated');
          setUser(null);
          setIsAuthenticated(false);
        } else {
          // Các lỗi khác thì log ra
          console.error('Auth check error:', error.message);
          setUser(null);
          setIsAuthenticated(false);
        }
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, []); // Dependency array rỗng - chỉ chạy 1 lần khi component mount

  const login = async (email, password) => {
    try {
      const response = await authAPI.login({ email, password });
      setUser(response.data.data.user);
      setIsAuthenticated(true);
      return { success: true, user: response.data.data.user };
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);
      return { success: false, error: error.response?.data?.message || 'Login failed' };
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
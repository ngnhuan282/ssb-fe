// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import { authAPI } from '../services/api.js';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [driverId, setDriverId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // KHI APP LOAD: Kiểm tra localStorage thay vì gọi API
  useEffect(() => {
    const checkAuth = () => {
      try {
        const storedUser = localStorage.getItem('user');
        const storedDriverId = localStorage.getItem('driverId');
        
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          setUser(userData);
          setIsAuthenticated(true);
          console.log('User loaded from localStorage:', userData.email);

          //driver id 
          if (userData.role === 'driver' && storedDriverId) {
            setDriverId(storedDriverId);
            console.log('DriverID loaded from localStorage:', storedDriverId);
          }
        } else {
          console.log('No user in localStorage');
          setUser(null);
          setDriverId(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Error loading user from localStorage:', error);
        setUser(null);
        setDriverId(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // LOGIN: Lưu user vào localStorage
  const login = async (email, password) => {
    try {
      const response = await authAPI.login({ email, password });
      const userData = response.data.data.user;
      const newDriverId = response.data.data.driverId;// luu ca driver id vao local storage
      if (userData.id && !userData._id) {
      userData._id = userData.id;
      delete userData.id; // optional
    }

      // Lưu vào state
      setUser(userData);
      setIsAuthenticated(true);
      
      // LƯU VÀO LOCALSTORAGE
      localStorage.setItem('user', JSON.stringify(userData));

      // Nếu là tài xế, lưu driverId
      if (userData.role === 'driver' && newDriverId) {
        setDriverId(newDriverId);
        localStorage.setItem('driverId', newDriverId);
      }
      
      return { success: true, user: userData };
    } catch (error) {
      setUser(null);
      setDriverId(null);
      setIsAuthenticated(false);
      localStorage.removeItem('user');
      localStorage.removeItem('driverId');
      return { 
        success: false, 
        error: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  // LOGOUT: Xóa localStorage
  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout API failed:', error);
    } finally {
      setUser(null);
      setDriverId(null);
      setIsAuthenticated(false);
      
      // XÓA KHỎI LOCALSTORAGE
      localStorage.removeItem('user');
      localStorage.removeItem('driverId');
      console.log('User removed from localStorage');
    }
  };

  // UPDATE USER: Cập nhật thông tin user (nếu cần)
  const updateUser = (updatedData) => {
    const newUserData = { ...user, ...updatedData };
    setUser(newUserData);
    localStorage.setItem('user', JSON.stringify(newUserData));
    console.log('User updated in localStorage');
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        driverId,
        loading, 
        isAuthenticated, 
        login, 
        logout,
        updateUser 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
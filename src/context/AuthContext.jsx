// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { authAPI } from '../services/api.js';
import axiosInstance from '../services/axiosCustomize';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const { 
    isAuthenticated: auth0Authenticated, 
    getIdTokenClaims, 
    loginWithRedirect, 
    logout: auth0Logout 
  } = useAuth0();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [redirectAfterLogin, setRedirectAfterLogin] = useState(null);

  // === XỬ LÝ SOCIAL CALLBACK ===
  const handleSocialCallback = async (idToken) => {
    try {
      // BƯỚC 1: XÓA LOCALSTORAGE CŨ (TRÁNH FLASH ROLE)
      localStorage.removeItem('user');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');

      const response = await axiosInstance.post('/auth/social-callback', { idToken });
      const { user: apiUser, accessToken, refreshToken } = response.data.data;

      const userData = {
        ...apiUser,
        _id: apiUser._id || apiUser.id,
        // id: apiUser.id || apiUser._id,
      };

      // BƯỚC 2: LƯU MỚI
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);

      setUser(userData);
      setIsAuthenticated(true);

      // BƯỚC 3: SET REDIRECT
      const redirectTo = userData.role === 'admin' ? '/admin' : '/';
      setRedirectAfterLogin(redirectTo);

    } catch (error) {
      console.error('Social callback failed:', error);
      localStorage.clear();
      setIsAuthenticated(false);
      setRedirectAfterLogin('/login');
    }
  };

  // === ĐĂNG NHẬP EMAIL/PASSWORD ===
  const login = async (email, password) => {
    try {
      // XÓA CŨ
      localStorage.removeItem('user');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');

      const response = await authAPI.login({ email, password });
      const { user: apiUser, accessToken, refreshToken } = response.data.data;

      const userData = {
        ...apiUser,
        _id: apiUser._id || apiUser.id,
      };

      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);

      setUser(userData);
      setIsAuthenticated(true);

      const redirectTo = userData.role === 'admin' ? '/admin' : '/';
      setRedirectAfterLogin(redirectTo);

      return { success: true, user: userData };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Login failed',
      };
    }
  };

  // === SOCIAL LOGIN ===
  const socialLogin = (provider) => {
    loginWithRedirect({
      authorizationParams: {
        connection: provider,
      },
    });
  };

  // === LOGOUT ===
  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout API failed:', error);
    } finally {
      localStorage.clear();
      setUser(null);
      setIsAuthenticated(false);
      setRedirectAfterLogin(null);
      auth0Logout({ logoutParams: { returnTo: window.location.origin } });
    }
  };

  // === CẬP NHẬT USER ===
  const updateUser = (data) => {
    if (!user) return;
    const newUser = { ...user, ...data };
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  // === LOAD AUTH KHI TẢI TRANG ===
  useEffect(() => {
    const loadAuth = async () => {
      try {
        // NẾU ĐANG SOCIAL LOGIN → KHÔNG ĐỌC LOCALSTORAGE
        if (auth0Authenticated) {
          const claims = await getIdTokenClaims();
          if (claims?.__raw) {
            await handleSocialCallback(claims.__raw);
            return; // DỪNG, KHÔNG ĐỌC LOCALSTORAGE
          }
        }

        // CHỈ ĐỌC LOCALSTORAGE NẾU KHÔNG PHẢI SOCIAL LOGIN
        const storedUser = localStorage.getItem('user');
        const accessToken = localStorage.getItem('accessToken');

        if (storedUser && accessToken) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          setIsAuthenticated(true);

          // Redirect nếu đang ở login/register
          if (window.location.pathname === '/login' || window.location.pathname === '/register') {
            const redirectTo = parsedUser.role === 'admin' ? '/admin' : '/';
            setRedirectAfterLogin(redirectTo);
          }
        }
      } catch (error) {
        console.error('Error loading auth:', error);
      } finally {
        setLoading(false);
      }
    };
    loadAuth();
  }, [auth0Authenticated, getIdTokenClaims]);

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      isAuthenticated,
      login,
      logout,
      updateUser,
      socialLogin,
      redirectAfterLogin,
      setRedirectAfterLogin,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
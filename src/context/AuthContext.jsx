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
  const [isAuthenticated, setIsAuthenticated] = useState(false);  // ĐÃ SỬA DÒNG NÀY
  const [redirectAfterLogin, setRedirectAfterLogin] = useState(null);

  // === XỬ LÝ SOCIAL CALLBACK ===
  const handleSocialCallback = async (idToken) => {
    try {
      localStorage.removeItem('user');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');

      const response = await axiosInstance.post('/auth/social-callback', { idToken });
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
    } catch (error) {
      console.error('Social callback failed:', error);
      localStorage.clear();
      setIsAuthenticated(false);
      setRedirectAfterLogin('/login');
    }
  };

  // === LOGIN EMAIL/PASSWORD ===
  const login = async (email, password) => {
    try {
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

  // === LOGOUT – FIX HOÀN TOÀN KHÔNG FLASH DASHBOARD ===
  const logout = async () => {
    // XÓA NGAY LẬP TỨC STATE + LOCALSTORAGE TRƯỚC KHI AUTH0 REDIRECT
    setUser(null);
    setIsAuthenticated(false);
    setRedirectAfterLogin(null);
    localStorage.clear();

    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout API failed:', error);
    }

    // Redirect thẳng về /login, không qua root route nữa
    auth0Logout({
      logoutParams: {
        returnTo: window.location.origin + "/login",
      },
    });
  };

  // === CẬP NHẬT USER ===
  const updateUser = (data) => {
    if (!user) return;
    const newUser = { ...user, ...data };
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  // === LOAD AUTH KHI APP KHỞI ĐỘNG ===
  useEffect(() => {
    const loadAuth = async () => {
      try {
        // Nếu URL có dấu hiệu là sau khi logout (có state, error, v.v.) → bỏ qua
        const params = new URLSearchParams(window.location.search);
        if (params.get('error') || params.has('state')) {
          setLoading(false);
          return;
        }

        // Xử lý social login callback
        if (auth0Authenticated) {
          const claims = await getIdTokenClaims();
          if (claims?.__raw) {
            await handleSocialCallback(claims.__raw);
            return;
          }
        }

        // Đọc từ localStorage (email/password login trước đó)
        const storedUser = localStorage.getItem('user');
        const accessToken = localStorage.getItem('accessToken');

        if (storedUser && accessToken) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          setIsAuthenticated(true);

          if (['/login', '/register'].includes(window.location.pathname)) {
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
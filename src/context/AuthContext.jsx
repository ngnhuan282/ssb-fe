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
  const [redirectAfterLogin, setRedirectAfterLogin] = useState(null); // THÊM

  useEffect(() => {
    const loadAuth = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        const accessToken = localStorage.getItem('accessToken');

        if (storedUser && accessToken) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          setIsAuthenticated(true);

          // Lưu đường dẫn cần redirect
          if (window.location.pathname === '/login' || window.location.pathname === '/register') {
            const redirectTo = parsedUser.role === 'admin' ? '/admin' : '/';
            setRedirectAfterLogin(redirectTo);
          }
        } else if (auth0Authenticated) {
          const claims = await getIdTokenClaims();
          if (claims?.__raw) {
            await handleSocialCallback(claims.__raw);
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

  const handleSocialCallback = async (idToken) => {
    try {
      const response = await axiosInstance.post('/auth/social-callback', { idToken });
      const { user, accessToken, refreshToken } = response.data.data;

      const userData = {
        ...user,
        _id: user._id || user.id,
        id: user.id || user._id,
      };

      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);

      setUser(userData);
      setIsAuthenticated(true);

      // Lưu redirect
      const redirectTo = userData.role === 'admin' ? '/admin' : '/';
      setRedirectAfterLogin(redirectTo);

    } catch (error) {
      console.error('Social callback failed:', error);
      localStorage.clear();
      setIsAuthenticated(false);
      setRedirectAfterLogin('/login');
    }
  };

  const login = async (email, password) => {
    try {
      const response = await authAPI.login({ email, password });
      const { user, accessToken, refreshToken } = response.data.data;

      const userData = {
        ...user,
        _id: user._id || user.id,
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

  const socialLogin = (provider) => {
    loginWithRedirect({
      authorizationParams: {
        connection: provider,
      },
    });
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout API failed:', error);
    } finally {
      localStorage.removeItem('user');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setUser(null);
      setIsAuthenticated(false);
      setRedirectAfterLogin(null);
      auth0Logout({ logoutParams: { returnTo: window.location.origin } });
    }
  };

  const updateUser = (data) => {
    if (!user) return;
    const newUser = { ...user, ...data };
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      isAuthenticated,
      login,
      logout,
      updateUser,
      socialLogin,
      redirectAfterLogin,     // THÊM
      setRedirectAfterLogin,  // THÊM
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
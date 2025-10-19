// src/pages/user/LoginPage.jsx
import React, { useEffect, useState } from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import LoginHeader from '../../components/user/login/LoginHeader';
import LoginForm from '../../components/user/login/LoginForm';
import { useAuth } from '../../context/AuthContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, user, loading } = useAuth();
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!loading && isAuthenticated && user) {
      const roleRoutes = {
        admin: '/admin',
        driver: '/',
        parent: '/',
      };
      navigate(roleRoutes[user.role] || '/');
    }
  }, [isAuthenticated, user, loading, navigate]);

  const handleLogin = async (credentials) => {
    setError(null);
    const result = await login(credentials.email, credentials.password);
    if (!result.success) {
      setError(result.error || 'Đăng nhập thất bại. Vui lòng thử lại.');
    }
  };

  if (loading) {
    return <Box>Đang tải...</Box>;
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 50%, #fce4ec 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
      }}
    >
      <Paper
        elevation={8}
        sx={{
          p: { xs: 4, sm: 5 },
          width: '100%',
          maxWidth: 480,
          borderRadius: 4,
          textAlign: 'center',
          backgroundColor: '#fff',
        }}
      >
        <LoginHeader />
        {error && (
          <Typography variant='body2' color='error' sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}
        <LoginForm onSubmit={handleLogin} />
      </Paper>
    </Box>
  );
};

export default LoginPage;
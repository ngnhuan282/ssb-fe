// src/pages/user/LoginPage.jsx
import { Box } from '@mui/material';
import LoginHeader from '../../components/user/login/LoginHeader';
import LoginForm from '../../components/user/login/LoginForm';
import { useAuth } from '../../context/AuthContext';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, isAuthenticated, user, loading } = useAuth();
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!loading && isAuthenticated && user) {
      const roleRoutes = { admin: '/admin', driver: '/', parent: '/' };
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

  if (loading) return <Box>Đang tải...</Box>;

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f0f9ff 0%, #fafaf9 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: { xs: 3, md: 4 },
        px: { xs: 2, md: 0 },
      }}
    >
      {/* Card nhỏ gọn */}
      <Box
        sx={{
          width: '100%',
          maxWidth: { xs: 380, sm: 720, md: 800 },
          backgroundColor: '#fff',
          borderRadius: 3,
          overflow: 'hidden',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
        }}
      >
        {/* Cột trái: Logo + Tiêu đề */}
        <Box
          sx={{
            bgcolor: '#f0f9ff',
            p: { xs: 3, md: 4 },
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <LoginHeader />
        </Box>

        {/* Cột phải: Form */}
        <Box
          sx={{
            bgcolor: '#ffffff',
            p: { xs: 3, md: 4 },
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <LoginForm onSubmit={handleLogin} error={error} />
        </Box>
      </Box>
    </Box>
  );
}
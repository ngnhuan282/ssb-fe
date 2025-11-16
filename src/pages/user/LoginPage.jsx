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

  // LOG ĐỂ DEBUG
  useEffect(() => {
    // console.log('LoginPage useEffect triggered:', { loading, isAuthenticated, user });
    if (!loading && isAuthenticated && user) {
      const roleRoutes = { admin: '/admin', driver: '/', parent: '/' };
      const target = roleRoutes[user.role] || '/';
      // console.log('Navigating to:', target);
      navigate(target, { replace: true });
    }
  }, [isAuthenticated, user, loading, navigate]);

  const handleLogin = async (credentials) => {
    setError(null);
    const result = await login(credentials.email, credentials.password);
    if (!result.success) {
      setError(result.error);
    } else {
      // console.log('Login successful, should redirect...');
    }
  };

  if (loading) return <Box>Đang tải...</Box>;

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f0f9ff 0%, #fafaf9 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', py: 4 }}>
      <Box sx={{ maxWidth: 800, width: '100%', backgroundColor: '#fff', borderRadius: 3, overflow: 'hidden', boxShadow: 3, display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
        <Box sx={{ bgcolor: '#f0f9ff', p: 4, flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <LoginHeader />
        </Box>
        <Box sx={{ bgcolor: '#ffffff', p: 4, flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <LoginForm onSubmit={handleLogin} error={error} />
        </Box>
      </Box>
    </Box>
  );
}
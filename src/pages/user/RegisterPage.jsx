// src/pages/RegisterPage.jsx
import { Box } from '@mui/material';
import RegisterHeader from '../../components/user/register/RegisterHeader';
import RegisterForm from '../../components/user/register/RegisterForm';

export default function RegisterPage() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#fff', // Trắng tinh, giống LoginPage
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: { xs: 3, md: 5 },
        px: { xs: 2, md: 3 },
      }}
    >
      {/* Card rộng hơn, thoải mái hơn */}
      <Box
        sx={{
          width: '100%',
          maxWidth: { xs: 380, sm: 800, md: 1000, lg: 1100 }, // Tăng maxWidth
          backgroundColor: '#fff',
          borderRadius: 3,
          overflow: 'hidden',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
        }}
      >
        {/* Cột trái: Logo + Text */}
        <Box
          sx={{
            bgcolor: '#f0f9ff',
            p: { xs: 4, md: 6 }, // Tăng padding
            flex: 1,
            minWidth: { md: 380 }, // Đảm bảo không bị co
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <RegisterHeader />
        </Box>

        {/* Cột phải: Form */}
        <Box
          sx={{
            bgcolor: '#ffffff',
            p: { xs: 4, md: 6 }, // Tăng padding
            flex: 1,
            minWidth: { md: 400 },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <RegisterForm />
        </Box>
      </Box>
    </Box>
  );
}
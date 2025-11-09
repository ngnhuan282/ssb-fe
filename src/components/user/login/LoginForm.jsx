// src/components/user/login/LoginForm.jsx
import { useState } from 'react';
import {
  TextField,
  Button,
  Box,
  Typography,
  Stack,
  InputAdornment,
  IconButton,
  Divider,
} from '@mui/material';
import { Visibility, VisibilityOff, Email, Lock } from '@mui/icons-material';
import GoogleIcon from '@mui/icons-material/Google';
import FacebookIcon from '@mui/icons-material/Facebook';

export default function LoginForm({ onSubmit, error }) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ email, password });
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 360 }}>
      <Typography
        variant="h5"
        fontWeight="bold"
        textAlign="center"
        mb={3}
        sx={{ fontSize: { xs: '1.5rem', md: '1.7rem' } }}
      >
        Đăng nhập
      </Typography>

      {error && (
        <Typography color="error" textAlign="center" mb={2} fontSize="0.9rem">
          {error}
        </Typography>
      )}

      <Stack component="form" onSubmit={handleSubmit} spacing={2.5}>
        <Box>
          <Typography variant="subtitle2" fontWeight={600} gutterBottom>
            Email
          </Typography>
          <TextField
            type="email"
            placeholder="Nhập email của bạn"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            sx={{
              '& .MuiInputBase-root': {
                borderRadius: 2,
                fontSize: '0.95rem',
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email sx={{ color: '#64b5f6', fontSize: 20 }} />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <Box>
          <Typography variant="subtitle2" fontWeight={600} gutterBottom>
            Mật khẩu
          </Typography>
          <TextField
            type={showPassword ? 'text' : 'password'}
            placeholder="Nhập mật khẩu"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            sx={{
              '& .MuiInputBase-root': {
                borderRadius: 2,
                fontSize: '0.95rem',
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock sx={{ color: '#64b5f6', fontSize: 20 }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} size="small">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <Box textAlign="right">
          <Typography
            color="primary"
            fontSize="0.85rem"
            sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
          >
            Quên mật khẩu?
          </Typography>
        </Box>

        <Button
  type="submit"
  variant="contained"
  fullWidth
  sx={{
    borderRadius: 2.5,                 // Bo góc giống trong ảnh
    py: 1.6,                          // Chiều cao nút
    textTransform: 'none',            // Không viết hoa
    fontWeight: 600,
    fontSize: '1rem',
    backgroundColor: '#2196f3',       // Màu xanh nhẹ (blue-500)
    color: '#fff',
    boxShadow: '0 4px 12px rgba(33, 150, 243, 0.3)', // Đổ bóng nhẹ
    '&:hover': {
      backgroundColor: '#1e88e5',     // Tối hơn 1 chút khi hover
      boxShadow: '0 6px 16px rgba(33, 150, 243, 0.4)',
    },
    '&:active': {
      backgroundColor: '#1976d2',
    },
    transition: 'all 0.2s ease',
  }}
>
  Đăng nhập
</Button>

        <Box sx={{ display: 'flex', alignItems: 'center', my: 1 }}>
          <Divider sx={{ flex: 1 }} />
          <Typography variant="body2" sx={{ px: 1.5, color: '#999', fontSize: '0.85rem' }}>
            Hoặc đăng nhập với
          </Typography>
          <Divider sx={{ flex: 1 }} />
        </Box>

        <Stack direction="row" spacing={1.5}>
          <Button
            variant="outlined"
            startIcon={<GoogleIcon />}
            fullWidth
            sx={{ textTransform: 'none', fontSize: '0.9rem', py: 1.2 }}
          >
            Google
          </Button>
          <Button
            variant="outlined"
            startIcon={<FacebookIcon />}
            fullWidth
            sx={{ textTransform: 'none', fontSize: '0.9rem', py: 1.2 }}
          >
            Facebook
          </Button>
        </Stack>

        <Typography textAlign="center" fontSize="0.9rem" color="text.secondary" mt={1}>
          Chưa có tài khoản?{' '}
          <Typography
            component="span"
            color="primary"
            fontWeight="medium"
            sx={{
              cursor: 'pointer',
              '&:hover': { textDecoration: 'underline' },
            }}
            onClick={() => window.location.href = '/register'}
          >
            Đăng ký ngay
          </Typography>
        </Typography>
      </Stack>
    </Box>
  );
}
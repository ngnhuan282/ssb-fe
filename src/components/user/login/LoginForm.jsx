// src/components/user/login/LoginForm.jsx
import { useState } from 'react';
import {
  TextField, Button, Box, Typography, Stack,
  InputAdornment, IconButton, Divider
} from '@mui/material';
import { Visibility, VisibilityOff, Email, Lock } from '@mui/icons-material';
import GoogleIcon from '@mui/icons-material/Google';
import FacebookIcon from '@mui/icons-material/Facebook';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

export default function LoginForm({ onSubmit, error }) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { socialLogin } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ email, password });
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 360 }}>
      <Typography variant="h5" fontWeight="bold" textAlign="center" mb={3}>
        Đăng nhập
      </Typography>

      {error && (
        <Typography color="error" textAlign="center" mb={2} fontSize="0.9rem">
          {error}
        </Typography>
      )}

      <Stack component="form" onSubmit={handleSubmit} spacing={2.5}>
        <Box>
          <Typography variant="subtitle2" fontWeight={600} gutterBottom>Email</Typography>
          <TextField
            type="email"
            placeholder="Nhập email của bạn"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            InputProps={{
              startAdornment: <InputAdornment position="start"><Email sx={{ color: '#64b5f6' }} /></InputAdornment>,
            }}
            sx={{ '& .MuiInputBase-root': { borderRadius: 2 } }}
          />
        </Box>

        <Box>
          <Typography variant="subtitle2" fontWeight={600} gutterBottom>Mật khẩu</Typography>
          <TextField
            type={showPassword ? 'text' : 'password'}
            placeholder="Nhập mật khẩu"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            InputProps={{
              startAdornment: <InputAdornment position="start"><Lock sx={{ color: '#64b5f6' }} /></InputAdornment>,
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{ '& .MuiInputBase-root': { borderRadius: 2 } }}
          />
        </Box>

        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{
            py: 1.6,
            textTransform: 'none',
            fontWeight: 600,
            fontSize: '1rem',
            backgroundColor: '#2196f3',
            color: '#fff',
            boxShadow: '0 4px 12px rgba(33, 150, 243, 0.3)',
            '&:hover': { backgroundColor: '#1e88e5' },
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
            onClick={() => socialLogin('google-oauth2')}
            sx={{ textTransform: 'none', py: 1.2 }}
          >
            Google
          </Button>
          <Button
            variant="outlined"
            startIcon={<FacebookIcon />}
            fullWidth
            onClick={() => socialLogin('facebook')}
            sx={{ textTransform: 'none', py: 1.2 }}
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
            sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
            onClick={() => navigate('/register')}
          >
            Đăng ký ngay
          </Typography>
        </Typography>
      </Stack>
    </Box>
  );
}
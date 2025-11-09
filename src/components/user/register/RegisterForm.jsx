// src/components/user/register/RegisterForm.jsx
import {
  TextField,
  Button,
  Box,
  Typography,
  Stack,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import GoogleIcon from '@mui/icons-material/Google';
import FacebookIcon from '@mui/icons-material/Facebook';
import { useState } from 'react';

export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <Box sx={{ width: '100%', maxWidth: 360 }}>
      <Typography
        variant="h5"
        fontWeight="bold"
        textAlign="center"
        mb={3}
        sx={{ fontSize: { xs: '1.5rem', md: '1.7rem' } }}
      >
        Tạo tài khoản mới
      </Typography>

      <Stack spacing={2.5}>
        {['Họ và tên', 'Email', 'Mật khẩu', 'Xác nhận mật khẩu'].map((label, idx) => {
          const isPassword = label.includes('mật khẩu');
          const isConfirm = label.includes('Xác nhận');
          const show = isConfirm ? showConfirm : isPassword ? showPassword : null;
          const setShow = isConfirm ? setShowConfirm : isPassword ? setShowPassword : null;

          return (
            <Box key={label}>
              <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                {label}
              </Typography>
              <TextField
                type={
                  isPassword ? (show ? 'text' : 'password') : label === 'Email' ? 'email' : 'text'
                }
                placeholder={`Nhập ${label.toLowerCase()}`}
                fullWidth
                size="medium"
                sx={{
                  '& .MuiInputBase-root': {
                    borderRadius: 2,
                    fontSize: '0.95rem',
                  },
                }}
                InputProps={
                  isPassword
                    ? {
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={() => setShow(!show)} edge="end" size="small">
                              {show ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }
                    : undefined
                }
              />
            </Box>
          );
        })}

        <Button
          variant="contained"
          fullWidth
          sx={{
            borderRadius: 2.5,
            py: 1.6,
            textTransform: 'none',
            fontWeight: 600,
            fontSize: '1rem',
            mt: 1,
          }}
        >
          Đăng ký
        </Button>

        <Typography textAlign="center" color="text.secondary" fontSize="0.9rem">
          Hoặc đăng ký với
        </Typography>

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

        <Typography textAlign="center" fontSize="0.9rem" color="text.secondary">
          Đã có tài khoản?{' '}
          <Typography
            component="span"
            color="primary"
            fontWeight="medium"
            sx={{
              cursor: 'pointer',
              '&:hover': { textDecoration: 'underline' },
            }}
          >
            Đăng nhập
          </Typography>
        </Typography>
      </Stack>
    </Box>
  );
}
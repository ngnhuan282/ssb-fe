// src/components/user/register/RegisterForm.jsx
import {
  TextField, Button, Box, Typography, Stack, InputAdornment,
  IconButton, Alert, CircularProgress
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../../../services/api'; 

export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '', email: '', password: '', confirmPassword: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const validate = () => {
    if (formData.username.length < 3) return 'Tên tài khoản phải ≥ 3 ký tự';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) return 'Email không hợp lệ';
    if (formData.password.length < 6) return 'Mật khẩu phải ≥ 6 ký tự';
    if (formData.password !== formData.confirmPassword) return 'Mật khẩu không khớp';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) return setError(err);

    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      await authAPI.register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: 'parent' // Mặc định
      });

      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      const msg = err.response?.data?.message || 'Đăng ký thất bại. Vui lòng thử lại.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 360 }}>
      <Typography variant="h5" fontWeight="bold" textAlign="center" mb={3}>
        Tạo tài khoản mới
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>Đăng ký thành công!</Alert>}

      <form onSubmit={handleSubmit}>
        <Stack spacing={2.5}>
          {[
            { label: 'Tên tài khoản', name: 'username' },
            { label: 'Email', name: 'email', type: 'email' },
            { label: 'Mật khẩu', name: 'password', type: 'password' },
            { label: 'Xác nhận mật khẩu', name: 'confirmPassword', type: 'password' }
          ].map(field => {
            const isPass = field.type === 'password';
            const show = field.name === 'confirmPassword' ? showConfirm : isPass ? showPassword : null;
            const setShow = field.name === 'confirmPassword' ? setShowConfirm : isPass ? setShowPassword : null;

            return (
              <Box key={field.name}>
                <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                  {field.label}
                </Typography>
                <TextField
                  name={field.name}
                  type={isPass ? (show ? 'text' : 'password') : field.type || 'text'}
                  placeholder={`Nhập ${field.label.toLowerCase()}`}
                  fullWidth
                  size="medium"
                  value={formData[field.name]}
                  onChange={handleChange}
                  disabled={loading}
                  sx={{ '& .MuiInputBase-root': { borderRadius: 2 } }}
                  InputProps={isPass ? {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShow(!show)} disabled={loading}>
                          {show ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    )
                  } : undefined}
                />
              </Box>
            );
          })}

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={loading}
            sx={{ borderRadius: 2.5, py: 1.6, mt: 1 }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Đăng ký'}
          </Button>
        </Stack>
      </form>

      <Typography textAlign="center" color="text.secondary" mt={2} fontSize="0.9rem">
        Đã có tài khoản?{' '}
        <Typography
          component="span"
          color="primary"
          fontWeight="medium"
          sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
          onClick={() => navigate('/login')}
        >
          Đăng nhập
        </Typography>
      </Typography>
    </Box>
  );
}
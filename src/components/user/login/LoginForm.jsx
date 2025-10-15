import { React, useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff, Email, Lock } from "@mui/icons-material";
import { Navigate, useNavigate } from "react-router-dom";

const LoginForm = ({ onSubmit }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit({ email, password });
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <TextField
        fullWidth
        label="Email"
        variant="outlined"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        sx={{
          mb: 2.5,
          "& .MuiOutlinedInput-root": {
            borderRadius: 2.5,
            backgroundColor: "#f8f9fa",
            "&:hover": {
              backgroundColor: "#f0f2f5",
            },
            "&.Mui-focused": {
              backgroundColor: "#fff",
            },
          },
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Email sx={{ color: "#64b5f6" }} />
            </InputAdornment>
          ),
        }}
      />

      <TextField
        fullWidth
        label="Mật khẩu"
        variant="outlined"
        type={showPassword ? "text" : "password"}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        sx={{
          mb: 1.5,
          "& .MuiOutlinedInput-root": {
            borderRadius: 2.5,
            backgroundColor: "#f8f9fa",
            "&:hover": {
              backgroundColor: "#f0f2f5",
            },
            "&.Mui-focused": {
              backgroundColor: "#fff",
            },
          },
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Lock sx={{ color: "#64b5f6" }} />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={() => setShowPassword(!showPassword)}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <Box sx={{ textAlign: "right", mb: 3 }}>
        <Typography
          sx={{
            fontSize: 13,
            color: "#64b5f6",
            fontWeight: 500,
            cursor: "pointer",
            "&:hover": {
              textDecoration: "underline",
            },
          }}
        >
          Quên mật khẩu?
        </Typography>
      </Box>

      <Button
        type="submit"
        variant="contained"
        fullWidth
        sx={{
          py: 1.5,
          fontWeight: "bold",
          fontSize: "16px",
          borderRadius: 2.5,
          background: "linear-gradient(135deg, #64b5f6 0%, #ab47bc 100%)",
          color: "#fff",
          boxShadow: "0 4px 15px rgba(100, 181, 246, 0.3)",
          textTransform: "none",
          "&:hover": {
            background: "linear-gradient(135deg, #42a5f5 0%, #9c27b0 100%)",
            boxShadow: "0 6px 20px rgba(100, 181, 246, 0.4)",
            transform: "translateY(-2px)",
          },
          transition: "all 0.3s ease",
        }}
      >
        Đăng nhập
      </Button>

      <Typography sx={{ mt: 3.5, fontSize: 14, color: "#666" }}>
        Bạn chưa có tài khoản?{" "}
        <Typography
          component="span"
          onClick={() => navigate("/register")}
          sx={{
            background: "linear-gradient(135deg, #64b5f6 0%, #ab47bc 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            fontWeight: "bold",
            cursor: "pointer",
            "&:hover": {
              textDecoration: "underline",
            },
          }}
        >
          Đăng ký ngay
        </Typography>
      </Typography>
    </Box>
  );
};

export default LoginForm;
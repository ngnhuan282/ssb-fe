// ============================================================
// STYLE 1: PASTEL GRADIENT (Style hiện tại của bạn)
// Đặc điểm: Nhẹ nhàng, thân thiện, gradient pastel
// ============================================================

import React, { useState } from "react";
import { Box, Paper, Typography, TextField, Button, InputAdornment, IconButton } from "@mui/material";
import { DirectionsBus, Email, Lock, Visibility, VisibilityOff } from "@mui/icons-material";

const LoginPageStyle1 = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 50%, #fce4ec 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      <Paper
        elevation={8}
        sx={{
          p: { xs: 4, sm: 5 },
          width: "100%",
          maxWidth: 480,
          borderRadius: 4,
          textAlign: "center",
        }}
      >
        {/* Logo Icon */}
        <Box
          sx={{
            width: 80,
            height: 80,
            margin: "0 auto 24px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #64b5f6 0%, #ab47bc 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <DirectionsBus sx={{ fontSize: 40, color: "#fff" }} />
        </Box>

        {/* Title */}
        <Typography
          variant="h4"
          sx={{
            fontWeight: "bold",
            background: "linear-gradient(135deg, #64b5f6 0%, #ab47bc 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            mb: 1,
          }}
        >
          Smart School Bus
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
          Đăng nhập để tiếp tục
        </Typography>

        {/* Form */}
        <Box component="form" sx={{ textAlign: "left" }}>
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            sx={{ mb: 3 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email sx={{ color: "#64b5f6" }} />
                </InputAdornment>
              ),
              sx: { borderRadius: 2 },
            }}
          />

          <TextField
            fullWidth
            label="Mật khẩu"
            name="password"
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={handleChange}
            sx={{ mb: 3 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock sx={{ color: "#64b5f6" }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
              sx: { borderRadius: 2 },
            }}
          />

          <Button
            fullWidth
            variant="contained"
            size="large"
            sx={{
              py: 1.5,
              borderRadius: 2,
              background: "linear-gradient(135deg, #64b5f6 0%, #ab47bc 100%)",
              textTransform: "none",
              fontSize: 16,
              fontWeight: 600,
              "&:hover": {
                background: "linear-gradient(135deg, #42a5f5 0%, #9c27b0 100%)",
              },
            }}
          >
            Đăng nhập
          </Button>
        </Box>

        {/* Register Link */}
        <Typography sx={{ mt: 3, fontSize: 14, color: "#666" }}>
          Chưa có tài khoản?{" "}
          <Typography
            component="span"
            sx={{
              background: "linear-gradient(135deg, #64b5f6 0%, #ab47bc 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontWeight: "bold",
              cursor: "pointer",
              "&:hover": { textDecoration: "underline" },
            }}
          >
            Đăng ký ngay
          </Typography>
        </Typography>
      </Paper>
    </Box>
  );
};


// ============================================================
// STYLE 2: MODERN VIBRANT
// Đặc điểm: Năng động, gradient đậm, có animation
// ============================================================

const LoginPageStyle2 = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Animated Floating Shapes */}
      <Box
        sx={{
          position: "absolute",
          top: "10%",
          left: "10%",
          width: 300,
          height: 300,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.1)",
          filter: "blur(60px)",
          animation: "float 6s ease-in-out infinite",
          "@keyframes float": {
            "0%, 100%": { transform: "translateY(0px)" },
            "50%": { transform: "translateY(-30px)" },
          },
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: "15%",
          right: "15%",
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.08)",
          filter: "blur(80px)",
          animation: "float 8s ease-in-out infinite 1s",
        }}
      />

      <Paper
        elevation={24}
        sx={{
          p: { xs: 4, sm: 6 },
          width: "100%",
          maxWidth: 480,
          borderRadius: 5,
          textAlign: "center",
          backgroundColor: "rgba(255,255,255,0.95)",
          backdropFilter: "blur(20px)",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Logo */}
        <Box
          sx={{
            width: 90,
            height: 90,
            margin: "0 auto 20px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 10px 30px rgba(102,126,234,0.4)",
          }}
        >
          <DirectionsBus sx={{ fontSize: 45, color: "#fff" }} />
        </Box>

        {/* Title */}
        <Typography
          variant="h3"
          sx={{
            fontWeight: 800,
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            mb: 1,
            letterSpacing: "-1px",
          }}
        >
          Welcome Back!
        </Typography>
        <Typography variant="body1" sx={{ color: "#666", mb: 4, fontWeight: 500 }}>
          Đăng nhập vào hệ thống Smart School Bus
        </Typography>

        {/* Form */}
        <Box component="form" sx={{ textAlign: "left" }}>
          <TextField
            fullWidth
            label="Email Address"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            sx={{ mb: 3 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email sx={{ color: "#667eea" }} />
                </InputAdornment>
              ),
              sx: {
                borderRadius: 3,
                "& .MuiOutlinedInput-notchedOutline": {
                  borderWidth: 2,
                  borderColor: "#e0e0e0",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#667eea",
                },
              },
            }}
          />

          <TextField
            fullWidth
            label="Password"
            name="password"
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={handleChange}
            sx={{ mb: 4 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock sx={{ color: "#667eea" }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
              sx: {
                borderRadius: 3,
                "& .MuiOutlinedInput-notchedOutline": {
                  borderWidth: 2,
                  borderColor: "#e0e0e0",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#667eea",
                },
              },
            }}
          />

          <Button
            fullWidth
            variant="contained"
            size="large"
            sx={{
              py: 1.8,
              borderRadius: 3,
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              textTransform: "none",
              fontSize: 17,
              fontWeight: 700,
              boxShadow: "0 8px 20px rgba(102,126,234,0.3)",
              "&:hover": {
                background: "linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)",
                boxShadow: "0 12px 28px rgba(102,126,234,0.4)",
                transform: "translateY(-2px)",
              },
              transition: "all 0.3s ease",
            }}
          >
            Sign In
          </Button>
        </Box>

        {/* Register Link */}
        <Typography sx={{ mt: 4, fontSize: 14, color: "#666" }}>
          Chưa có tài khoản?{" "}
          <Typography
            component="span"
            sx={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontWeight: 700,
              cursor: "pointer",
              "&:hover": { textDecoration: "underline" },
            }}
          >
            Tạo tài khoản mới
          </Typography>
        </Typography>
      </Paper>
    </Box>
  );
};


// ============================================================
// STYLE 3: MINIMAL BRIGHT
// Đặc điểm: Tối giản, sáng sủa, professional, clean
// ============================================================

const LoginPageStyle3 = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom, #ffffff 0%, #f8f9ff 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      <Box sx={{ width: "100%", maxWidth: 480 }}>
        {/* Header */}
        <Box sx={{ textAlign: "center", mb: 5 }}>
          <Box
            sx={{
              width: 70,
              height: 70,
              margin: "0 auto 16px",
              borderRadius: 3,
              background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 10px 40px rgba(79,172,254,0.3)",
            }}
          >
            <DirectionsBus sx={{ fontSize: 38, color: "#fff" }} />
          </Box>

          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              color: "#1a1a1a",
              mb: 1,
              fontSize: { xs: 32, sm: 38 },
            }}
          >
            Smart School Bus
          </Typography>
          <Typography variant="h6" sx={{ color: "#666", fontWeight: 400 }}>
            Hệ thống quản lý xe đưa đón thông minh
          </Typography>
        </Box>

        {/* Card */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, sm: 5 },
            borderRadius: 4,
            border: "2px solid #f0f0f0",
            backgroundColor: "#fff",
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 700, color: "#1a1a1a", mb: 1 }}>
            Đăng nhập
          </Typography>
          <Typography variant="body2" sx={{ color: "#888", mb: 4 }}>
            Nhập thông tin để truy cập hệ thống
          </Typography>

          <Box component="form">
            {/* Email Field */}
            <Typography variant="body2" sx={{ fontWeight: 600, color: "#333", mb: 1 }}>
              Email
            </Typography>
            <TextField
              fullWidth
              name="email"
              type="email"
              placeholder="example@school.edu.vn"
              value={formData.email}
              onChange={handleChange}
              sx={{ mb: 3 }}
              InputProps={{
                sx: {
                  borderRadius: 2,
                  backgroundColor: "#f8f9ff",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "transparent",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#4facfe",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#4facfe",
                    borderWidth: 2,
                  },
                },
              }}
            />

            {/* Password Field */}
            <Typography variant="body2" sx={{ fontWeight: 600, color: "#333", mb: 1 }}>
              Mật khẩu
            </Typography>
            <TextField
              fullWidth
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Nhập mật khẩu của bạn"
              value={formData.password}
              onChange={handleChange}
              sx={{ mb: 2 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
                sx: {
                  borderRadius: 2,
                  backgroundColor: "#f8f9ff",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "transparent",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#4facfe",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#4facfe",
                    borderWidth: 2,
                  },
                },
              }}
            />

            {/* Forgot Password */}
            <Typography
              variant="body2"
              sx={{
                textAlign: "right",
                color: "#4facfe",
                cursor: "pointer",
                fontWeight: 600,
                mb: 4,
                "&:hover": { textDecoration: "underline" },
              }}
            >
              Quên mật khẩu?
            </Typography>

            {/* Submit Button */}
            <Button
              fullWidth
              variant="contained"
              size="large"
              sx={{
                py: 1.8,
                borderRadius: 2,
                background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
                textTransform: "none",
                fontSize: 16,
                fontWeight: 700,
                boxShadow: "0 8px 24px rgba(79,172,254,0.3)",
                "&:hover": {
                  background: "linear-gradient(135deg, #3d9be9 0%, #00d8e6 100%)",
                  boxShadow: "0 12px 32px rgba(79,172,254,0.4)",
                },
              }}
            >
              Đăng nhập ngay
            </Button>

            {/* Register Link */}
            <Box
              sx={{
                mt: 4,
                pt: 3,
                borderTop: "1px solid #f0f0f0",
                textAlign: "center",
              }}
            >
              <Typography variant="body2" sx={{ color: "#888" }}>
                Bạn là phụ huynh mới?{" "}
                <Typography
                  component="span"
                  sx={{
                    color: "#4facfe",
                    fontWeight: 700,
                    cursor: "pointer",
                    "&:hover": { textDecoration: "underline" },
                  }}
                >
                  Đăng ký tài khoản
                </Typography>
              </Typography>
            </Box>
          </Box>
        </Paper>

        {/* Footer */}
        <Typography
          variant="body2"
          sx={{
            textAlign: "center",
            color: "#aaa",
            mt: 4,
            fontSize: 13,
          }}
        >
          © 2024 Smart School Bus. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
};

export { LoginPageStyle1, LoginPageStyle2, LoginPageStyle3 };
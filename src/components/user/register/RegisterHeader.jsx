// src/components/user/register/RegisterHeader.jsx
import React from "react";
import { Box, Typography } from "@mui/material";
import { School } from "@mui/icons-material";

const RegisterHeader = () => {
  return (
    <Box sx={{ textAlign: "center", mb: 3 }}>
      <Box
        sx={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: 60,
          height: 60,
          borderRadius: "50%",
          background: "linear-gradient(135deg, #64b5f6 0%, #ab47bc 100%)",
          mb: 1.5,
          boxShadow: "0 4px 15px rgba(100, 181, 246, 0.3)",
        }}
      >
        <School sx={{ fontSize: 32, color: "#fff" }} />
      </Box>

      <Typography
        variant="h5"
        fontWeight="bold"
        sx={{
          mb: 0.5,
          background: "linear-gradient(135deg, #64b5f6 0%, #ab47bc 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          fontSize: { xs: "1.4rem", sm: "1.6rem" },
        }}
      >
        Đăng ký tài khoản
      </Typography>

      <Typography variant="body2" sx={{ color: "#666", fontSize: 13 }}>
        Theo dõi xe đưa đón của con bạn! 🚌
      </Typography>
    </Box>
  );
};

export default RegisterHeader;
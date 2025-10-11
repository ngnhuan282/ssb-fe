import React from "react";
import { Box, Typography } from "@mui/material";
import { School } from "@mui/icons-material";

const LoginHeader = () => {
  return (
    <>
      {/* Logo Icon */}
      <Box
        sx={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: 80,
          height: 80,
          borderRadius: "50%",
          background: "linear-gradient(135deg, #64b5f6 0%, #ab47bc 100%)",
          mb: 2,
          boxShadow: "0 4px 15px rgba(100, 181, 246, 0.3)",
        }}
      >
        <School sx={{ fontSize: 45, color: "#fff" }} />
      </Box>

      <Typography
        variant="h4"
        fontWeight="bold"
        sx={{
          mb: 1,
          background: "linear-gradient(135deg, #64b5f6 0%, #ab47bc 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          fontSize: { xs: "1.75rem", sm: "2rem" },
        }}
      >
        Smart School Bus
      </Typography>

      <Typography variant="body1" sx={{ mb: 4, color: "#666", fontSize: 15 }}>
        Chào mừng trở lại! 👋
      </Typography>
    </>
  );
};

export default LoginHeader;
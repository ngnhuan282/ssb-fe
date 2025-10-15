import React from "react";
import { Box, Paper, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Home, ArrowBack, ErrorOutline } from "@mui/icons-material";

const ErrorPage = ({ 
  errorCode = "404", 
  title = "Trang không tồn tại",
  message = "Xin lỗi, trang bạn đang tìm kiếm không tồn tại.",
  showBackButton = true 
}) => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/");
  };

  const handleGoBack = () => {
    navigate(-1);
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
          p: { xs: 4, sm: 6 },
          width: "100%",
          maxWidth: 520,
          borderRadius: 4,
          textAlign: "center",
          backgroundColor: "#fff",
        }}
      >
        {/* Error Icon */}
        <Box
          sx={{
            width: 120,
            height: 120,
            margin: "0 auto 24px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #64b5f6 0%, #ab47bc 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            animation: "pulse 2s ease-in-out infinite",
            "@keyframes pulse": {
              "0%, 100%": {
                transform: "scale(1)",
                opacity: 1,
              },
              "50%": {
                transform: "scale(1.05)",
                opacity: 0.9,
              },
            },
          }}
        >
          <ErrorOutline sx={{ fontSize: 72, color: "#fff" }} />
        </Box>

        {/* Error Code */}
        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: 72, sm: 96 },
            fontWeight: "bold",
            background: "linear-gradient(135deg, #64b5f6 0%, #ab47bc 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            mb: 2,
            letterSpacing: -2,
          }}
        >
          {errorCode}
        </Typography>

        {/* Error Title */}
        <Typography
          variant="h5"
          sx={{
            fontWeight: "bold",
            color: "#333",
            mb: 2,
          }}
        >
          {title}
        </Typography>

        {/* Error Message */}
        <Typography
          variant="body1"
          sx={{
            color: "#666",
            mb: 4,
            lineHeight: 1.6,
            px: { xs: 0, sm: 2 },
          }}
        >
          {message}
        </Typography>

        {/* Action Buttons */}
        <Box
          sx={{
            display: "flex",
            gap: 2,
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "center",
          }}
        >
          {showBackButton && (
            <Button
              onClick={handleGoBack}
              variant="outlined"
              startIcon={<ArrowBack />}
              sx={{
                py: 1.2,
                px: 3,
                borderRadius: 2,
                textTransform: "none",
                borderColor: "#64b5f6",
                color: "#64b5f6",
                fontSize: 15,
                fontWeight: 500,
                "&:hover": {
                  borderColor: "#42a5f5",
                  backgroundColor: "rgba(100, 181, 246, 0.05)",
                },
              }}
            >
              Quay lại
            </Button>
          )}

          <Button
            onClick={handleGoHome}
            variant="contained"
            startIcon={<Home />}
            sx={{
              py: 1.2,
              px: 3,
              borderRadius: 2,
              background: "linear-gradient(135deg, #64b5f6 0%, #ab47bc 100%)",
              textTransform: "none",
              fontSize: 15,
              fontWeight: 500,
              "&:hover": {
                background: "linear-gradient(135deg, #42a5f5 0%, #9c27b0 100%)",
              },
            }}
          >
            Về trang chủ
          </Button>
        </Box>

        {/* Footer Note */}
        <Typography
          sx={{
            mt: 4,
            pt: 3,
            borderTop: "1px solid #f0f0f0",
            fontSize: 13,
            color: "#999",
          }}
        >
          Smart School Bus 1.0 - Hệ thống quản lý xe đưa đón học sinh
        </Typography>
      </Paper>
    </Box>
  );
};

export default ErrorPage;
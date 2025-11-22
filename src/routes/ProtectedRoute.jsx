import { Navigate } from "react-router-dom";
import { Box, CircularProgress, Typography, Paper } from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading } = useAuth();
  const { t } = useTranslation();
  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          bgcolor: "#f5f7fa",
        }}
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Kiểm tra role nếu có yêu cầu
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          bgcolor: "#f5f7fa",
          p: 3,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            textAlign: "center",
            maxWidth: 400,
            borderRadius: 3,
          }}
        >
          <Typography variant="h5" color="error" gutterBottom fontWeight="bold">
            {t("auth.accessDenied")}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {t("auth.noAccess")}
          </Typography>
        </Paper>
      </Box>
    );
  }

  return children;
};

export default ProtectedRoute;
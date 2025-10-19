import { Navigate } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";
import { useAuth } from "../context/AuthContext";

const PublicRoute = ({ children }) => {
  const { user, loading, isAuthenticated } = useAuth();

  // Nếu đang load auth, hiển thị spinner
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
        <CircularProgress size={50} />
      </Box>
    );
  }

  // ⚠️ Kiểm tra nếu đã authenticated, redirect ngay
  // Không cần kiểm tra user, chỉ cần isAuthenticated
  if (isAuthenticated) {
    // Redirect về home hoặc admin tùy theo role
    const defaultRoute = user?.role === "admin" ? "/admin" : "/";
    return <Navigate to={defaultRoute} replace />;
  }

  // Chỉ render login/register khi chưa login
  return children;
};

export default PublicRoute;
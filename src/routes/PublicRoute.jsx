// src/routes/PublicRoute.jsx
import { Navigate } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";
import { useAuth } from "../context/AuthContext";

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // Hiển thị loading spinner khi đang xác thực
  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
        }}
      >
        <CircularProgress size={50} />
      </Box>
    );
  }

  // Nếu đã đăng nhập thì chặn truy cập vào /login hoặc /register
  if (user) {
    const defaultRoute = user.role === "admin" ? "/admin" : "/";
    return <Navigate to={defaultRoute} replace />;
  }

  // Nếu chưa đăng nhập thì cho phép hiển thị nội dung (trang login/register)
  return children;
};

export default PublicRoute;

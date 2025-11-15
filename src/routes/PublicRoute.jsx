import { Navigate } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";
import { useAuth } from "../context/AuthContext";

const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return (
      <Box sx={{ 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center", 
        minHeight: "100vh" 
      }}>
        <CircularProgress size={50} />
      </Box>
    );
  }

  // CHỈ redirect nếu đã authenticated VÀ không có pending redirect
  if (isAuthenticated) {
    const redirectTo = user?.role === 'admin' ? '/admin' : '/';
    return <Navigate to={redirectTo} replace />;
  }

  return children;
};

export default PublicRoute;
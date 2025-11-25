// src/routes/PublicRoute.jsx
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

  if (isAuthenticated) {
    // LOGIC MỚI: Redirect dựa trên role cụ thể
    let redirectTo = "/";
    if (user?.role === "admin") redirectTo = "/admin";
    else if (user?.role === "driver") redirectTo = "/driver";
    else if (user?.role === "parent") redirectTo = "/parent";
    
    return <Navigate to={redirectTo} replace />;
  }

  return children;
};

export default PublicRoute;
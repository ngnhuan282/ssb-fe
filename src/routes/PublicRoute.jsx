// src/routes/PublicRoute.jsx
import { Navigate } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";
import { useAuth } from "../context/AuthContext";

const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading, redirectAfterLogin } = useAuth();

  if (loading) {
    return (
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
        <CircularProgress size={50} />
      </Box>
    );
  }

  if (isAuthenticated || redirectAfterLogin) {
    return <Navigate to={redirectAfterLogin || "/"} replace />;
  }

  return children;
};

export default PublicRoute;
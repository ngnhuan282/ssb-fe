import React from "react";
import { Box, Paper } from "@mui/material";
import LoginHeader from "../../components/user/login/LoginHeader";
import LoginForm from "../../components/user/login/LoginForm";

const LoginPage = () => {
  const handleLogin = (credentials) => {
    console.log("Login with:", credentials);
    // TODO: Call API login here
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
          backgroundColor: "#fff",
        }}
      >
        <LoginHeader />
        <LoginForm onSubmit={handleLogin} />
      </Paper>
    </Box>
  );
};

export default LoginPage;
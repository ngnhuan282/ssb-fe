import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login:", { email, password });
    // TODO: call API /api/auth/login
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #FFF9C4 0%, #BBDEFB 100%)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        p: 2,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          p: 4,
          width: "100%",
          maxWidth: 420,
          borderRadius: 4,
          textAlign: "center",
          backgroundColor: "#fff",
        }}
      >
        <Typography
          variant="h4"
          fontWeight="bold"
          sx={{ mb: 2, color: "#1976d2" }}
        >
          🚌 Smart School Bus
        </Typography>
        <Typography variant="body1" sx={{ mb: 3, color: "gray" }}>
          Welcome back! Please login to continue
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email"
            variant="outlined"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Password"
            variant="outlined"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ mb: 3 }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              py: 1.2,
              fontWeight: "bold",
              fontSize: "16px",
              borderRadius: "10px",
              backgroundColor: "#FFD54F",
              color: "#333",
              "&:hover": {
                backgroundColor: "#FFCA28",
              },
            }}
          >
            Login
          </Button>
        </Box>

        <Typography sx={{ mt: 3, fontSize: 14, color: "gray" }}>
          Don’t have an account?{" "}
          <Typography
            component="span"
            sx={{
              color: "#1976d2",
              fontWeight: "bold",
              cursor: "pointer",
              "&:hover": { textDecoration: "underline" },
            }}
          >
            Register here
          </Typography>
        </Typography>
      </Paper>
    </Box>
  );
}

import React from "react";
import { Typography, Grid, TextField, InputAdornment, IconButton } from "@mui/material";
import { Lock, Visibility, VisibilityOff } from "@mui/icons-material";

const PasswordForm = ({ formData, onChange, showPassword, setShowPassword, showConfirmPassword, setShowConfirmPassword }) => {
  return (
    <>
      <Typography 
        variant="subtitle1"
        sx={{ 
          mb: 1.5,
          color: "#64b5f6",
          fontWeight: 600,
          fontSize: 15,
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        <Lock sx={{ fontSize: 20 }} /> Bảo mật tài khoản
      </Typography>

      <Grid container spacing={2}>
        {/* Mật khẩu */}
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Mật khẩu"
            name="password"
            variant="outlined"
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={onChange}
            required
            placeholder="Tối thiểu 6 ký tự"
            size="small"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                backgroundColor: "#f8f9fa",
                "&:hover": { backgroundColor: "#f0f2f5" },
                "&.Mui-focused": { backgroundColor: "#fff" },
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock sx={{ color: "#64b5f6", fontSize: 20 }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                    size="small"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        {/* Xác nhận mật khẩu */}
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Xác nhận mật khẩu"
            name="confirmPassword"
            variant="outlined"
            type={showConfirmPassword ? "text" : "password"}
            value={formData.confirmPassword}
            onChange={onChange}
            required
            placeholder="Nhập lại mật khẩu"
            size="small"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                backgroundColor: "#f8f9fa",
                "&:hover": { backgroundColor: "#f0f2f5" },
                "&.Mui-focused": { backgroundColor: "#fff" },
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock sx={{ color: "#64b5f6", fontSize: 20 }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    edge="end"
                    size="small"
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default PasswordForm;
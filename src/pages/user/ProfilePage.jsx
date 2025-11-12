// src/pages/user/Profile.jsx
import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Avatar,
  TextField,
  Button,
  IconButton,
  Snackbar,
  Alert,
  Grid,
} from "@mui/material";
import { Edit, PhotoCamera } from "@mui/icons-material";
import { useAuth } from "../../context/AuthContext";

const Profile = () => {
  const { user } = useAuth();
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Form data cho hồ sơ và liên hệ
  const [profileData, setProfileData] = useState({
    username: user?.username || "Nguyễn Văn A",
    email: user?.email || "email@example.com",
    phone: user?.phone || "",
    address: "",
  });

  // Form data cho mật khẩu
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleProfileChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    if (passwordData.newPassword || passwordData.confirmPassword) {
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        setSnackbar({
          open: true,
          message: "Mật khẩu mới không khớp!",
          severity: "error",
        });
        return;
      }
      if (!passwordData.currentPassword) {
        setSnackbar({
          open: true,
          message: "Vui lòng nhập mật khẩu hiện tại!",
          severity: "error",
        });
        return;
      }
      console.log("Đang đổi mật khẩu:", passwordData);
    }
    try {
      console.log("Đang lưu thông tin:", profileData);
      setSnackbar({
        open: true,
        message: "Cập nhật thông tin thành công!",
        severity: "success",
      });
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Có lỗi xảy ra, vui lòng thử lại!",
        severity: "error",
      });
    }
  };

  const handleAvatarClick = () => {
    document.getElementById("avatar-upload").click();
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // Cập nhật avatar nếu cần (hiện tại chỉ log)
        console.log("Avatar mới:", reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const cardStyles = {
    p: 3,
    borderRadius: 3,
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
    border: "1px solid #e0e0e0",
    background: "#ffffff",
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: "#111827" }}>
          Chỉnh sửa hồ sơ cá nhân
        </Typography>
      </Box>

      {/* Main Content */}
      <Grid container spacing={3} sx={{ alignItems: "stretch" }}>
        {/* Left Column - Profile Card */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ ...cardStyles, textAlign: "center", height: "100%" }}>
            <Box sx={{ position: "relative", mb: 2, display: "inline-block" }}>
              <Avatar
                sx={{
                  width: 120,
                  height: 120,
                  fontSize: 48,
                  background: "#e0e7ff",
                  color: "#4f46e5",
                }}
              >
                {profileData.username?.[0]?.toUpperCase() || "A"}
              </Avatar>
              <IconButton
                onClick={handleAvatarClick}
                size="small"
                sx={{
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                  background: "#3b82f6",
                  color: "#fff",
                  "&:hover": {
                    background: "#2563eb",
                  },
                }}
              >
                <Edit sx={{ fontSize: 16 }} />
              </IconButton>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleAvatarChange}
              />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 600, color: "#111827" }}>
              {profileData.username}
            </Typography>
            <Typography variant="body2" sx={{ color: "#6b7280", mb: 3 }}>
              {profileData.email}
            </Typography>

            <TextField
              fullWidth
              label="Tên tài khoản"
              name="username"
              value={profileData.username}
              onChange={handleProfileChange}
              variant="outlined"
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Email"
              name="email"
              value={profileData.email}
              onChange={handleProfileChange}
              variant="outlined"
            />
          </Paper>
        </Grid>

        {/* Right Column - Info & Password */}
        <Grid
          item
          xs={12}
          md={8}
          sx={{ display: "flex", flexDirection: "column" }}
        >
          {/* Contact Info Card */}
          <Paper sx={cardStyles}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2.5 }}>
              Thông tin liên hệ
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Số điện thoại"
                  name="phone"
                  value={profileData.phone}
                  onChange={handleProfileChange}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Địa chỉ"
                  name="address"
                  value={profileData.address}
                  onChange={handleProfileChange}
                  variant="outlined"
                />
              </Grid>
            </Grid>
          </Paper>

          {/* Change Password Card */}
          <Paper sx={{ ...cardStyles, mt: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2.5 }}>
              Thay đổi mật khẩu
            </Typography>
            <TextField
              fullWidth
              label="Mật khẩu hiện tại"
              name="currentPassword"
              type="password"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              variant="outlined"
              sx={{ mb: 2 }}
            />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Mật khẩu mới"
                  name="newPassword"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Xác nhận mật khẩu mới"
                  name="confirmPassword"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  variant="outlined"
                />
              </Grid>
            </Grid>
          </Paper>

          {/* Save Button - Đẩy xuống dưới cùng */}
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: "auto", pt: 3 }}>
            <Button
              variant="contained"
              onClick={handleSave}
              sx={{
                textTransform: "none",
                borderRadius: 2,
                px: 4,
                py: 1.25,
                fontSize: "1rem",
                background: "#3b82f6",
                "&:hover": {
                  background: "#2563eb",
                },
              }}
            >
              Lưu thay đổi
            </Button>
          </Box>
        </Grid>
      </Grid>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          severity={snackbar.severity}
          sx={{ borderRadius: 2 }}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Profile;
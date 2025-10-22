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
} from "@mui/material";
import {
  Edit,
  Save,
  Cancel,
  PhotoCamera,
} from "@mui/icons-material";
import { useAuth } from "../../context/AuthContext";

const Profile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [snackbar, setSnackbar] = useState({ 
    open: false, 
    message: "", 
    severity: "success" 
  });

  // Form data
  const [formData, setFormData] = useState({
    username: user?.username || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: "",
    studentName: "",
    studentClass: "",
    emergencyContact: "",
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    try {
      // Call API to update profile
      // await updateProfile(formData);
      setSnackbar({
        open: true,
        message: "Cập nhật thông tin thành công!",
        severity: "success",
      });
      setIsEditing(false);
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Có lỗi xảy ra, vui lòng thử lại!",
        severity: "error",
      });
    }
  };

  const handleCancel = () => {
    setFormData({
      username: user?.username || "",
      email: user?.email || "",
      phone: user?.phone || "",
      address: "",
      studentName: "",
      studentClass: "",
      emergencyContact: "",
    });
    setIsEditing(false);
  };

  const handleAvatarClick = () => {
    // Trigger file input
    document.getElementById('avatar-upload').click();
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Handle avatar upload
      console.log('Selected file:', file);
      setSnackbar({
        open: true,
        message: "Đang cập nhật ảnh đại diện...",
        severity: "info",
      });
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: "#2c3e50", mb: 1 }}>
          Thông tin phụ huynh
        </Typography>
        <Typography variant="body2" sx={{ color: "#7f8c8d" }}>
          Quản lý thông tin cá nhân của bạn
        </Typography>
      </Box>

      {/* Main Content */}
      <Paper 
        elevation={0} 
        sx={{ 
          p: 4, 
          borderRadius: 3,
          border: '1px solid #e0e0e0'
        }}
      >
        <Box sx={{ display: 'flex', gap: 4 }}>
          {/* Left - Avatar */}
          <Box 
            sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              minWidth: 200,
              flexShrink: 0
            }}
          >
            <Box sx={{ position: 'relative', mb: 2 }}>
              <Avatar
                sx={{
                  width: 160,
                  height: 160,
                  fontSize: 64,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: '#fff',
                  border: '4px solid #f8f9fa',
                  boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'scale(1.05)',
                  }
                }}
                onClick={handleAvatarClick}
              >
                {user?.username?.[0]?.toUpperCase() || "P"}
              </Avatar>
              <IconButton
                onClick={handleAvatarClick}
                sx={{
                  position: 'absolute',
                  bottom: 5,
                  right: 5,
                  background: '#fff',
                  width: 40,
                  height: 40,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                  '&:hover': { 
                    background: '#667eea',
                    '& svg': { color: '#fff' }
                  },
                }}
              >
                <PhotoCamera sx={{ fontSize: 20, color: '#667eea' }} />
              </IconButton>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleAvatarChange}
              />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#2c3e50', mb: 0.5 }}>
              {user?.username || "Phụ huynh"}
            </Typography>
            <Box
              sx={{
                px: 2,
                py: 0.5,
                borderRadius: 2,
                background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                color: '#fff',
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              PHỤ HUYNH
            </Box>
          </Box>

          {/* Right - Form */}
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            {/* Edit Button - Top Right of Form */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
              {!isEditing && (
                <IconButton
                  onClick={() => setIsEditing(true)}
                  sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: '#fff',
                    width: 48,
                    height: 48,
                    '&:hover': {
                      background: 'linear-gradient(135deg, #5568d3 0%, #653a8b 100%)',
                    },
                  }}
                >
                  <Edit />
                </IconButton>
              )}
            </Box>

            {/* Form Fields */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              {/* Row 1 */}
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  fullWidth
                  label="Họ và tên"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  variant="outlined"
                />
                <TextField
                  fullWidth
                  label="Số điện thoại"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  variant="outlined"
                />
              </Box>

              {/* Row 2 */}
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  variant="outlined"
                />
                <TextField
                  fullWidth
                  label="Số điện thoại khẩn cấp"
                  name="emergencyContact"
                  value={formData.emergencyContact}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  variant="outlined"
                />
              </Box>

              {/* Row 3 - Địa chỉ */}
              <TextField
                fullWidth
                label="Địa chỉ"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                disabled={!isEditing}
                variant="outlined"
              />

              {/* Row 4 */}
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  fullWidth
                  label="Tên học sinh"
                  name="studentName"
                  value={formData.studentName}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  variant="outlined"
                />
                <TextField
                  fullWidth
                  label="Lớp"
                  name="studentClass"
                  value={formData.studentClass}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  variant="outlined"
                />
              </Box>
            </Box>

            {/* Action Buttons - Below Form */}
            {isEditing && (
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 3, pt: 3, borderTop: '1px solid #e0e0e0' }}>
                <Button
                  variant="outlined"
                  startIcon={<Cancel />}
                  onClick={handleCancel}
                  sx={{
                    textTransform: 'none',
                    borderRadius: 2,
                    px: 4,
                    py: 1,
                    borderColor: '#7f8c8d',
                    color: '#7f8c8d',
                    '&:hover': {
                      borderColor: '#5a6c7d',
                      background: '#f8f9fa',
                    },
                  }}
                >
                  Hủy
                </Button>
                <Button
                  variant="contained"
                  startIcon={<Save />}
                  onClick={handleSave}
                  sx={{
                    textTransform: 'none',
                    borderRadius: 2,
                    px: 4,
                    py: 1,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #5568d3 0%, #653a8b 100%)',
                    },
                  }}
                >
                  Lưu
                </Button>
              </Box>
            )}
          </Box>
        </Box>
      </Paper>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
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
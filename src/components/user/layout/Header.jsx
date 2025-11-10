// src/components/user/layout/Header.jsx
import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  IconButton,
  Badge,
  Avatar,
  Chip,
  Menu,
  MenuItem,
} from "@mui/material";
import {
  Notifications,
  Menu as MenuIcon,
  Logout as LogoutIcon,
  Person as PersonIcon,
} from "@mui/icons-material";
import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

const Header = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleProfile = () => {
    handleClose();
    navigate("/profile");
  };

  const handleLogout = async () => {
    handleClose();
    await logout();
    navigate("/login");
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        // Thay đổi nền sang màu trắng và thêm viền dưới
        background: "#ffffff",
        color: "text.primary",
        boxShadow: "none",
        borderBottom: "1px solid #e5e7eb", // Viền dưới mỏng
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar
        sx={{
          justifyContent: "space-between",
          minHeight: "70px !important",
          px: { xs: 2, sm: 3 },
        }}
      >
        {/* Left Side - Logo & Title */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <IconButton
            sx={{
              display: { xs: "flex", md: "none" },
              color: "text.secondary", // Đổi màu icon
            }}
            onClick={onMenuClick}
          >
            <MenuIcon />
          </IconButton>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              // Bỏ nền và hiệu ứng
              background: "transparent",
              px: 2,
              py: 1,
              borderRadius: 3,
            }}
          >
            <Box
              sx={{
                background: "#fff",
                borderRadius: "50%",
                width: 40,
                height: 40,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                // Thêm viền nhẹ cho giống thiết kế
                border: "1px solid #e5e7eb",
              }}
            >
              <DirectionsBusIcon
                sx={{
                  fontSize: 24,
                  color: "#667eea", // Giữ màu icon logo
                }}
              />
            </Box>
            <Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  color: "text.primary", // Đổi màu text
                  lineHeight: 1.2,
                  fontSize: { xs: "1rem", sm: "1.25rem" },
                }}
              >
                SSB 1.0
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: "text.secondary", // Đổi màu text
                  fontSize: "11px",
                  display: { xs: "none", sm: "block" },
                }}
              >
                Smart School Bus
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Right Side - Actions */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          {/* Search Button - Đã bị loại bỏ theo thiết kế */}

          {/* Notifications */}
          <IconButton
            sx={{
              color: "text.secondary", // Đổi màu icon
              // Bỏ nền
            }}
          >
            <Badge
              variant="dot" // Đổi thành dấu chấm đỏ
              sx={{
                "& .MuiBadge-badge": {
                  background: "#ff5252",
                  color: "#fff",
                },
              }}
            >
              <Notifications />
            </Badge>
          </IconButton>

          {/* User Avatar */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              // Bỏ nền và hiệu ứng
              background: "transparent",
              px: 1.5,
              py: 0.5,
              borderRadius: 3,
              cursor: "pointer",
            }}
            onClick={handleMenu}
          >
            <Avatar
              sx={{
                width: 35,
                height: 35,
                background: "#fff",
                color: "#667eea",
                fontSize: "14px",
                fontWeight: 600,
                // Thêm viền
                border: "1px solid #e0e0e0",
              }}
            >
              {user?.username?.[0]?.toUpperCase() || "A"}
            </Avatar>
            <Box sx={{ display: { xs: "none", sm: "block" } }}>
              <Typography
                variant="body2"
                sx={{ color: "text.primary", fontWeight: 600, lineHeight: 1.2 }}
              >
                {user?.username || "Nguyễn Văn A"}
              </Typography>
              <Chip
                label={user?.role?.toUpperCase() || "ADMIN"}
                size="small"
                sx={{
                  height: 18,
                  fontSize: "10px",
                  background: "#f3f4f6", // Đổi màu nền chip
                  color: "#6b7280", // Đổi màu text chip
                  fontWeight: 500,
                }}
              />
            </Box>
          </Box>

          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            sx={{
              mt: 1,
            }}
          >
            <MenuItem onClick={handleProfile}>
              <PersonIcon sx={{ mr: 1 }} /> Thông tin cá nhân
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <LogoutIcon sx={{ mr: 1 }} /> Đăng xuất
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
// src/components/user/layout/Header.jsx
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
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
import LanguageSwitcher from "./LanguageSwitcher"; 

const Header = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const { t } = useTranslation();

  const handleMenu = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
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
        background: "#ffffff",
        color: "text.primary",
        boxShadow: "none",
        borderBottom: "1px solid #e5e7eb",
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
            sx={{ display: { xs: "flex", md: "none" }, color: "text.secondary" }}
            onClick={onMenuClick}
          >
            <MenuIcon />
          </IconButton>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
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
                border: "1px solid #e5e7eb",
              }}
            >
              <DirectionsBusIcon sx={{ fontSize: 24, color: "#667eea" }} />
            </Box>
            <Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  color: "text.primary",
                  lineHeight: 1.2,
                  fontSize: { xs: "1rem", sm: "1.25rem" },
                }}
              >
                {t("app.title")}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: "text.secondary",
                  fontSize: "11px",
                  display: { xs: "none", sm: "block" },
                }}
              >
                {t("app.subtitle")}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Right Side - Actions */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          {/* Notifications */}
          <IconButton sx={{ color: "text.secondary" }}>
            <Badge
              variant="dot"
              sx={{
                "& .MuiBadge-badge": { background: "#ff5252", color: "#fff" },
              }}
            >
              <Notifications />
            </Badge>
          </IconButton>

          {/* Language Switcher - Thêm ở đây */}
          <LanguageSwitcher />

          {/* User Avatar & Menu */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
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
                border: "1px solid #e0e0e0",
              }}
            >
              {(user?.username?.[0] || "A").toUpperCase()}
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
                  background: "#f3f4f6",
                  color: "#6b7280",
                  fontWeight: 500,
                }}
              />
            </Box>
          </Box>

          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            keepMounted
            transformOrigin={{ vertical: "top", horizontal: "right" }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            sx={{ mt: 1 }}
          >
            <MenuItem onClick={handleProfile}>
              <PersonIcon sx={{ mr: 1 }} /> {t("header.profile")}
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <LogoutIcon sx={{ mr: 1 }} /> {t("header.logout")}
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
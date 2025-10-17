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
  Search,
  Menu as MenuIcon,
  Logout as LogoutIcon,
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

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        boxShadow: "0 4px 12px rgba(102, 126, 234, 0.15)",
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
              color: "#fff",
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
              background: "rgba(255, 255, 255, 0.15)",
              backdropFilter: "blur(10px)",
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
              }}
            >
              <DirectionsBusIcon
                sx={{
                  fontSize: 24,
                  color: "#667eea",
                }}
              />
            </Box>
            <Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  color: "#fff",
                  lineHeight: 1.2,
                  fontSize: { xs: "1rem", sm: "1.25rem" },
                }}
              >
                SSB 1.0
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: "rgba(255, 255, 255, 0.9)",
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
          {/* Search Button */}
          <IconButton
            sx={{
              color: "#fff",
              background: "rgba(255, 255, 255, 0.1)",
              "&:hover": {
                background: "rgba(255, 255, 255, 0.2)",
              },
            }}
          >
            <Search />
          </IconButton>

          {/* Notifications */}
          <IconButton
            sx={{
              color: "#fff",
              background: "rgba(255, 255, 255, 0.1)",
              "&:hover": {
                background: "rgba(255, 255, 255, 0.2)",
              },
            }}
          >
            <Badge
              badgeContent={3}
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
              background: "rgba(255, 255, 255, 0.15)",
              backdropFilter: "blur(10px)",
              px: 1.5,
              py: 0.5,
              borderRadius: 3,
              cursor: "pointer",
              "&:hover": {
                background: "rgba(255, 255, 255, 0.25)",
              },
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
              }}
            >
              {user?.username?.[0]?.toUpperCase() || 'A'}
            </Avatar>
            <Box sx={{ display: { xs: "none", sm: "block" } }}>
              <Typography
                variant="body2"
                sx={{ color: "#fff", fontWeight: 600, lineHeight: 1.2 }}
              >
                {user?.username || 'Nguyễn Văn A'}
              </Typography>
              <Chip
                label={user?.role?.toUpperCase() || 'ADMIN'}
                size="small"
                sx={{
                  height: 18,
                  fontSize: "10px",
                  background: "rgba(255, 255, 255, 0.3)",
                  color: "#fff",
                  fontWeight: 500,
                }}
              />
            </Box>
          </Box>

          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
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
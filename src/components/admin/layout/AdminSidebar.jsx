// src/components/admin/layout/AdminSidebar.jsx
import React, { useState } from "react";
import {
  Drawer,
  Toolbar,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Divider,
  Typography,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  Person,
  DirectionsBus,
  DriveEta,
  Route,
  Schedule,
  Message,
  Settings,
  HelpOutline,
  Logout,
} from "@mui/icons-material";
import { Map } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

const drawerWidth = 260;

const mainMenu = [
  { text: "Tổng quan", icon: <DashboardIcon />, path: "/admin" },
  { text: "Học sinh", icon: <Person />, path: "/admin/students" },
  { text: "Tài xế", icon: <DriveEta />, path: "/admin/drivers" },
  { text: "Xe buýt", icon: <DirectionsBus />, path: "/admin/buses" },
  { text: "Tuyến đường", icon: <Route />, path: "/admin/routes" },
  { text: "Lịch trình", icon: <Schedule />, path: "/admin/schedule" },
  { text: "Thông báo", icon: <Message />, path: "/admin/notifications" },
  { text: "Theo dõi xe buýt", icon: <Map />, path: "/admin/tracking" },
];

const supportMenu = [
  { text: "Đăng xuất", icon: <Logout />, path: "/login" },
];

const AdminSidebar = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(0);
  const { user, logout } = useAuth();

  const handleNavigation = async (index, path) => {
    // Nếu index là số thì mới set selected cho menu chính
    if (typeof index === "number") {
      setSelected(index);
    }

    // Nếu là logout thì gọi hàm logout trước
    if (path === "/login") {
      try {
        await logout();
      } catch (err) {
        console.error("Logout error:", err);
      }
    }

    navigate(path);
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          backgroundColor: "#fff",
          color: "#1f2937",
          boxShadow: "2px 0 12px rgba(0,0,0,0.05)",
          borderRight: "1px solid #f1f1f1",
        },
      }}
    >
      {/* Logo */}
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: 80,
          borderBottom: "1px solid #f1f1f1",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: "bold",
            color: "#524be3ff",
            letterSpacing: 1,
            fontFamily: "Poppins, sans-serif",
          }}
        >
          SSB
        </Typography>
      </Toolbar>

      {/* Menu chính */}
      <Box sx={{ mt: 3, px: 2 }}>
        <Typography
          variant="subtitle2"
          sx={{ color: "#9ca3af", mb: 1, ml: 1, fontWeight: 600 }}
        >
          MENU
        </Typography>
        <List>
          {mainMenu.map((item, index) => (
            <ListItem key={index} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                selected={selected === index}
                onClick={() => handleNavigation(index, item.path)}
                sx={{
                  borderRadius: 2,
                  py: 1,
                  "&.Mui-selected": {
                    backgroundColor: "#f0f9ff",
                    color: "#0ea5e9",
                    "& .MuiListItemIcon-root": { color: "#0ea5e9" },
                  },
                  "&:hover": {
                    backgroundColor: "#f9fafb",
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: "#9ca3af",
                    minWidth: 40,
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontWeight: 500,
                    fontSize: "0.95rem",
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>

      <Box sx={{ flexGrow: 1 }} />

      {/* Support */}
      <Divider />
      <Box sx={{ px: 2, py: 2 }}>
        <Typography
          variant="subtitle2"
          sx={{ color: "#9ca3af", mb: 1, ml: 1, fontWeight: 600 }}
        >
          SUPPORT
        </Typography>
        <List>
          {supportMenu.map((item, index) => (
            <ListItem key={index} disablePadding>
              <ListItemButton
                onClick={() => handleNavigation(null, item.path)}
                sx={{
                  borderRadius: 2,
                  py: 1,
                  "&:hover": {
                    backgroundColor: "#f9fafb",
                  },
                }}
              >
                <ListItemIcon sx={{ color: "#9ca3af", minWidth: 40 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontWeight: 500,
                    fontSize: "0.9rem",
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
};

export default AdminSidebar;

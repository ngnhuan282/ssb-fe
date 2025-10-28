// src/components/user/layout/Sidebar.jsx
import React, { useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  IconButton,
  CircularProgress,
  Divider,
  Typography,
} from "@mui/material";
import {
  Dashboard,
  DirectionsBus,
  Schedule,
  Assessment,
  Person,
  Route,
  Notifications,
  Settings,
  ChevronLeft,
  ChevronRight,
  LocationOn,
  Warning,
} from "@mui/icons-material";
import { useAuth } from "../../../context/AuthContext";

// Menu items với allowedRoles
const menuItems = [
  {
    text: "Tổng quan",
    icon: <Dashboard />,
    path: "/",
    allowedRoles: ["parent", "driver"],
  },
  {
    text: "Theo dõi xe buýt",
    icon: <DirectionsBus />,
    path: "/bus",
    allowedRoles: ["parent"],
  },
  {
    text: "Danh sách học sinh",
    icon: <Person />,
    path: "/students",
    allowedRoles: ["driver"],
  },
  {
    text: "Lịch làm việc",
    icon: <Schedule />,
    path: "/schedule",
    allowedRoles: ["driver"],
  },
  {
    text: "Điểm đón/trả",
    icon: <LocationOn />,
    path: "/pickup-points",
    allowedRoles: ["driver"],
  },
  {
    text: "Báo cáo chuyến đi",
    icon: <Assessment />,
    path: "/trip-report",
    allowedRoles: ["driver"],
  },
  {
    text: "Cảnh báo sự cố",
    icon: <Warning />,
    path: "/incident",
    allowedRoles: ["driver"],
  },
  {
    text: "Bản đồ",
    icon: <Route />,
    path: "/map",
    allowedRoles: ["parent", "driver"],
  },
  {
    text: "Thông báo",
    icon: <Notifications />,
    path: "/notification",
    allowedRoles: ["parent", "driver"],
  },
  {
    text: "Cài đặt",
    icon: <Settings />,
    path: "/profile",
    allowedRoles: ["parent", "driver"],
  },
];

const drawerWidthOpen = 260;
const drawerWidthClosed = 72;

const Sidebar = ({ onToggle }) => {
  const { user, loading } = useAuth();
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Lọc menu items dựa trên role
  const filteredMenuItems = useMemo(() => {
    if (!user || !user.role) return [];
    return menuItems.filter((item) => item.allowedRoles.includes(user.role));
  }, [user]);

  const handleToggle = () => {
    const newState = !open;
    setOpen(newState);
    if (onToggle) {
      onToggle(newState);
    }
  };

  // Loading state
  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "calc(100vh - 70px)",
          width: open ? drawerWidthOpen : drawerWidthClosed,
          top: "70px",
          bgcolor: "#ffffff",
        }}
      >
        <CircularProgress size={32} sx={{ color: "#3b82f6" }} />
      </Box>
    );
  }

  if (!user) {
    return null;
  }

  // Check if current path is active
  const isActive = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: open ? drawerWidthOpen : drawerWidthClosed,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: open ? drawerWidthOpen : drawerWidthClosed,
          transition: "width 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          top: "70px",
          height: "calc(100vh - 70px)",
          borderRight: "1px solid #e5e7eb",
          background: "#ffffff",
          overflowX: "hidden",
          overflowY: "auto",
        },
      }}
    >
      {/* Toggle Button */}
      <Box
        sx={{
          display: "flex",
          justifyContent: open ? "flex-end" : "center",
          p: 2,
          pb: 1,
        }}
      >
        <IconButton
          onClick={handleToggle}
          sx={{
            width: 36,
            height: 36,
            bgcolor: "#f3f4f6",
            color: "#6b7280",
            "&:hover": {
              bgcolor: "#e5e7eb",
              color: "#1f2937",
            },
            transition: "all 0.2s",
          }}
        >
          {open ? <ChevronLeft fontSize="small" /> : <ChevronRight fontSize="small" />}
        </IconButton>
      </Box>

      {/* Menu Section Label */}
      {open && (
        <Box sx={{ px: 3, py: 1.5 }}>
          <Typography
            variant="caption"
            sx={{
              color: "#9ca3af",
              fontSize: "0.6875rem",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            Menu chính
          </Typography>
        </Box>
      )}

      {/* Menu Items */}
      <List sx={{ px: 2, py: 0 }}>
        {filteredMenuItems.map((item, index) => {
          const active = isActive(item.path);
          
          return (
            <ListItem key={index} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => navigate(item.path)}
                sx={{
                  minHeight: 44,
                  borderRadius: 2,
                  justifyContent: open ? "initial" : "center",
                  px: open ? 2 : 1.5,
                  py: 1.25,
                  bgcolor: active ? "#eff6ff" : "transparent",
                  color: active ? "#2563eb" : "#6b7280",
                  "&:hover": {
                    bgcolor: active ? "#dbeafe" : "#f9fafb",
                    color: active ? "#1d4ed8" : "#1f2937",
                  },
                  transition: "all 0.2s ease",
                  position: "relative",
                  // Active indicator line
                  ...(active && {
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      left: 0,
                      top: "50%",
                      transform: "translateY(-50%)",
                      width: 3,
                      height: "60%",
                      bgcolor: "#2563eb",
                      borderRadius: "0 4px 4px 0",
                    },
                  }),
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 2 : 0,
                    justifyContent: "center",
                    color: "inherit",
                    fontSize: "1.25rem",
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                {open && (
                  <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{
                      fontSize: "0.875rem",
                      fontWeight: active ? 600 : 500,
                      noWrap: true,
                    }}
                  />
                )}
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      {/* Divider */}
      {open && <Divider sx={{ my: 2, mx: 3 }} />}

      {/* Footer Info */}
      {open && (
        <Box
          sx={{
            mt: "auto",
            p: 2,
            mx: 2,
            mb: 2,
            borderRadius: 2,
            bgcolor: "#f9fafb",
            border: "1px solid #e5e7eb",
          }}
        >
          <Typography
            sx={{
              fontSize: "0.75rem",
              color: "#6b7280",
              fontWeight: 500,
              mb: 0.5,
            }}
          >
            Phiên bản
          </Typography>
          <Typography
            sx={{
              fontSize: "0.875rem",
              color: "#1f2937",
              fontWeight: 600,
            }}
          >
            SSB v1.0
          </Typography>
        </Box>
      )}
    </Drawer>
  );
};

export default Sidebar;
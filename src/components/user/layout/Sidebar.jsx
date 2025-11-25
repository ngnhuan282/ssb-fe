// src/components/user/layout/Sidebar.jsx
import React, { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation, Link } from "react-router-dom"; // Import Link nếu cần
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
  LocationOn,
  Warning,
  Notifications,
  Settings,
  ChevronLeft,
  ChevronRight,
  Logout as LogoutIcon,
} from "@mui/icons-material";
import { useAuth } from "../../../context/AuthContext";

const drawerWidthOpen = 260;
const drawerWidthClosed = 72;

const Sidebar = ({ onToggle }) => {
  const { t } = useTranslation();
  const { user, loading, logout } = useAuth();
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const handleToggle = () => {
    const newState = !open;
    setOpen(newState);
    onToggle?.(newState);
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  // --- LOGIC MỚI: TẠO MENU DYNAMIC THEO ROLE ---
  const menuConfig = useMemo(() => {
    if (!user || !user.role) return { main: [], settings: null };

    // 1. Xác định prefix dựa trên role
    let prefix = "";
    if (user.role === "driver") prefix = "/driver";
    else if (user.role === "parent") prefix = "/parent";
    // Nếu là admin hoặc role khác thì xử lý tùy ý, ở đây mình tập trung driver/parent

    // 2. Định nghĩa danh sách menu gốc (chưa có prefix)
    const items = [
      {
        text: t("sidebar.dashboard"),
        icon: <Dashboard />,
        path: prefix, // Trang chủ là /driver hoặc /parent
        allowedRoles: ["parent", "driver"],
      },
      {
        text: t("sidebar.busTracking"),
        icon: <DirectionsBus />,
        path: `${prefix}/bus`, // -> /parent/bus
        allowedRoles: ["parent"],
      },
      {
        text: t("sidebar.studentList"),
        icon: <Person />,
        path: `${prefix}/students`, // -> /driver/students
        allowedRoles: ["driver"],
      },
      {
        text: t("sidebar.schedule"),
        icon: <Schedule />,
        path: `${prefix}/schedule`,
        allowedRoles: ["driver"],
      },
      {
        text: t("sidebar.pickupPoints"),
        icon: <LocationOn />,
        path: `${prefix}/pickup-points`,
        allowedRoles: ["driver"],
      },
      {
        text: t("sidebar.tripHistory"),
        icon: <Assessment />,
        path: `${prefix}/trip-history`,
        allowedRoles: ["driver"],
      },
      {
        text: t("sidebar.incident"),
        icon: <Warning />,
        path: `${prefix}/incident`,
        allowedRoles: ["driver"],
      },
      {
        text: t("sidebar.notifications"),
        icon: <Notifications />,
        path: `${prefix}/notification`,
        allowedRoles: ["parent", "parent"], // Chỉnh lại allowedRoles nếu cần
      },
      {
        text: t("sidebar.settings"),
        icon: <Settings />,
        path: `${prefix}/profile`,
        allowedRoles: ["parent", "driver"],
      },
    ];

    // 3. Lọc theo role của user
    const allowedItems = items.filter((item) =>
      item.allowedRoles.includes(user.role)
    );

    // 4. Tách settings ra riêng như code cũ của bạn
    const main = allowedItems.filter((item) => !item.path.includes("profile"));
    const settings = allowedItems.find((item) => item.path.includes("profile"));

    return { main, settings };
  }, [user, t]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!user) return null;

  // Hàm kiểm tra active (đã sửa để khớp chính xác hơn)
  const isActive = (path) => {
    // Nếu path là root role (vd: /driver), chỉ active khi pathname khớp chính xác
    if (path === "/driver" || path === "/parent") {
      return location.pathname === path || location.pathname === path + "/";
    }
    return location.pathname.startsWith(path);
  };

  const renderListItem = (item, index) => {
    if (!item) return null;
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
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        },
      }}
    >
      <Box sx={{ overflowY: "auto", overflowX: "hidden" }}>
        <Box sx={{ display: "flex", justifyContent: open ? "flex-end" : "center", p: 2, pb: 1 }}>
          <IconButton
            onClick={handleToggle}
            sx={{
              width: 36,
              height: 36,
              bgcolor: "#f3f4f6",
              color: "#6b7280",
              "&:hover": { bgcolor: "#e5e7eb", color: "#1f2937" },
            }}
          >
            {open ? <ChevronLeft fontSize="small" /> : <ChevronRight fontSize="small" />}
          </IconButton>
        </Box>

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
              {t("sidebar.mainMenu")}
            </Typography>
          </Box>
        )}

        <List sx={{ px: 2, py: 0 }}>
          {menuConfig.main.map(renderListItem)}
        </List>
      </Box>

      <Box sx={{ mb: 2 }}>
        <Divider sx={{ my: 1, mx: 3 }} />
        <List sx={{ px: 2, py: 0 }}>
          {renderListItem(menuConfig.settings, "settings")}
          
          {/* Nút Logout giữ nguyên */}
          <ListItem key="logout" disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              onClick={handleLogout}
              sx={{
                minHeight: 44,
                borderRadius: 2,
                justifyContent: open ? "initial" : "center",
                px: open ? 2 : 1.5,
                py: 1.25,
                bgcolor: "transparent",
                color: "#6b7280",
                "&:hover": { bgcolor: "#f9fafb", color: "#1f2937" },
                transition: "all 0.2s ease",
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
                <LogoutIcon />
              </ListItemIcon>
              {open && (
                <ListItemText
                  primary={t("sidebar.logout")}
                  primaryTypographyProps={{
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    noWrap: true,
                  }}
                />
              )}
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
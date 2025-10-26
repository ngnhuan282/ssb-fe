// src/components/user/layout/Sidebar.jsx
import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
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

// Định nghĩa menuItems với allowedRoles
const menuItems = [
  { text: "Tổng quan", icon: <Dashboard />, color: "#667eea", path: "/", allowedRoles: ["parent", "driver"] },
  { text: "Theo dõi xe buýt", icon: <DirectionsBus />, color: "#f093fb", path: "/bus", allowedRoles: ["parent"] },
  { text: "Danh sách học sinh", icon: <Person />, color: "#4facfe", path: "/students", allowedRoles: ["driver"] },
  { text: "Điểm đón/trả", icon: <LocationOn />, color: "#43e97b", path: "/pickup-points", allowedRoles: ["driver"] },
  { text: "Báo cáo chuyến đi", icon: <Assessment />, color: "#feca57", path: "/trip-report", allowedRoles: ["driver"] },
  { text: "Cảnh báo sự cố", icon: <Warning />, color: "#e74c3c", path: "/incident", allowedRoles: ["driver"] },
  { text: "Bản đồ", icon: <Route />, color: "#43e97b", path: "/map", allowedRoles: ["parent", "driver"] },
  { text: "Lịch làm việc", icon: <Schedule />, color: "#fa709a", path: "/schedule", allowedRoles: ["driver"] },
  { text: "Thông báo", icon: <Notifications />, color: "#ff6b6b", path: "/notification", allowedRoles: ["parent", "driver"] },
  { text: "Cài đặt", icon: <Settings />, color: "#95afc0", path: "/profile", allowedRoles: ["parent", "driver"] }, 
];

const drawerWidthOpen = 280;
const drawerWidthClosed = 80;

const Sidebar = ({ onToggle }) => {
  const { user, loading } = useAuth(); // Lấy user và loading từ AuthContext
  const [open, setOpen] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();

  // Lọc menuItems dựa trên vai trò của người dùng
  const filteredMenuItems = useMemo(() => {
    if (!user || !user.role) return []; // Nếu không có user hoặc role, trả về mảng rỗng
    return menuItems.filter((item) => item.allowedRoles.includes(user.role));
  }, [user]);

  const handleToggle = () => {
    const newState = !open;
    setOpen(newState);
    if (onToggle) {
      onToggle(newState);
    }
  };

  // Hiển thị loading khi đang kiểm tra xác thực
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
          bgcolor: "#f8f9fa",
        }}
      >
        <CircularProgress size={40} />
      </Box>
    );
  }

  // Nếu không có user, không hiển thị Sidebar
  if (!user) {
    return null;
  }

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: open ? drawerWidthOpen : drawerWidthClosed,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: open ? drawerWidthOpen : drawerWidthClosed,
          transition: "width 0.3s ease",
          top: "70px",
          height: "calc(100vh - 70px)",
          borderRight: "none",
          background: "#f8f9fa",
          overflowX: "hidden",
          boxShadow: "4px 0 12px rgba(0, 0, 0, 0.05)",
        },
      }}
    >
      {/* Toggle Button */}
      <Box
        sx={{
          display: "flex",
          justifyContent: open ? "flex-end" : "center",
          p: 2,
        }}
      >
        <IconButton
          onClick={handleToggle}
          sx={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "#fff",
            width: 36,
            height: 36,
            "&:hover": {
              background: "linear-gradient(135deg, #5568d3 0%, #653a8b 100%)",
            },
          }}
        >
          {open ? <ChevronLeft /> : <ChevronRight />}
        </IconButton>
      </Box>

      {/* Menu Items */}
      <List sx={{ px: 1.5 }}>
        {filteredMenuItems.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              selected={selectedIndex === index}
              onClick={() => {
                setSelectedIndex(index);
                navigate(item.path);
              }}
              sx={{
                borderRadius: 2,
                py: 1.5,
                justifyContent: open ? "initial" : "center",
                background:
                  selectedIndex === index
                    ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                    : "transparent",
                color: selectedIndex === index ? "#fff" : "#666",
                "&:hover": {
                  background:
                    selectedIndex === index
                      ? "linear-gradient(135deg, #5568d3 0%, #653a8b 100%)"
                      : "rgba(102, 126, 234, 0.08)",
                },
                transition: "all 0.3s ease",
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 2 : 0,
                  justifyContent: "center",
                  color: selectedIndex === index ? "#fff" : item.color,
                }}
              >
                {item.icon}
              </ListItemIcon>
              {open && (
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontSize: 14,
                    fontWeight: selectedIndex === index ? 600 : 500,
                  }}
                />
              )}
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
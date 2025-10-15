// src/components/user/layout/Sidebar.jsx
import React, { useState } from "react";
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
} from "@mui/icons-material";

const menuItems = [
  { text: "Tổng quan", icon: <Dashboard />, color: "#667eea", path: "/" },
  { text: "Xe bus đang hoạt động", icon: <DirectionsBus />, color: "#f093fb", path: "/bus"},
  { text: "Danh sách tài xế", icon: <Person />, color: "#4facfe" , path: "/driver"},
  { text: "Bản đồ", icon: <Route />, color: "#43e97b", path: "/map" },
  { text: "Lịch trình", icon: <Schedule />, color: "#fa709a", path: "/schedule" },
  { text: "Báo cáo", icon: <Assessment />, color: "#feca57", path: "/report" },
  { text: "Thông báo", icon: <Notifications />, color: "#ff6b6b", path: "/notification" },
  { text: "Cài đặt", icon: <Settings />, color: "#95afc0", path: "/settings" },
];

const drawerWidthOpen = 280;
const drawerWidthClosed = 80;

const Sidebar = ({ onToggle }) => {
  const [open, setOpen] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();

  const handleToggle = () => {
    const newState = !open;
    setOpen(newState);
    if (onToggle) {
      onToggle(newState);
    }
  };

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
        {menuItems.map((item, index) => (
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
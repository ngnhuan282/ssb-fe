import React, { useState } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  IconButton,
  Typography,
  Avatar,
  Divider,
  Chip,
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
  { text: "Tổng quan", icon: <Dashboard />, color: "#667eea" },
  { text: "Quản lý xe", icon: <DirectionsBus />, color: "#f093fb" },
  { text: "Quản lý tài xế", icon: <Person />, color: "#4facfe" },
  { text: "Lộ trình", icon: <Route />, color: "#43e97b" },
  { text: "Lịch trình", icon: <Schedule />, color: "#fa709a" },
  { text: "Báo cáo", icon: <Assessment />, color: "#feca57" },
  { text: "Thông báo", icon: <Notifications />, color: "#ff6b6b" },
  { text: "Cài đặt", icon: <Settings />, color: "#95afc0" },
];

const drawerWidthOpen = 280;
const drawerWidthClosed = 80;

const Sidebar = () => {
  const [open, setOpen] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);

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
          onClick={() => setOpen(!open)}
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
              onClick={() => setSelectedIndex(index)}
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

      {/* User Info at Bottom */}
      {open && (
        <Box
          sx={{
            mt: "auto",
            p: 2.5,
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            borderRadius: 3,
            mx: 1.5,
            mb: 2,
            color: "#fff",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
            <Avatar
              sx={{
                width: 45,
                height: 45,
                background: "#fff",
                color: "#667eea",
                fontWeight: 700,
              }}
            >
              A
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                Nguyễn Văn A
              </Typography>
              <Chip
                label="Admin"
                size="small"
                sx={{
                  height: 20,
                  fontSize: "11px",
                  background: "rgba(255, 255, 255, 0.25)",
                  color: "#fff",
                  fontWeight: 500,
                }}
              />
            </Box>
          </Box>
          <Divider sx={{ my: 1, borderColor: "rgba(255, 255, 255, 0.2)" }} />
          <Typography variant="caption" sx={{ opacity: 0.9 }}>
            📍 Trường Đại học Sài Gòn - TP.HCM
          </Typography>
        </Box>
      )}

      {/* Collapsed User Avatar */}
      {!open && (
        <Box
          sx={{
            mt: "auto",
            display: "flex",
            justifyContent: "center",
            mb: 2,
          }}
        >
          <Avatar
            sx={{
              width: 45,
              height: 45,
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "#fff",
              fontWeight: 700,
            }}
          >
            A
          </Avatar>
        </Box>
      )}
    </Drawer>
  );
};

export default Sidebar;
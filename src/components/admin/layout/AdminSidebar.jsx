import React, { useState } from "react";
import { Drawer, Toolbar, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Box } from "@mui/material";
import {
  Dashboard as DashboardIcon,
  Person,
  DirectionsBus,
  DriveEta,
  Route,
  Schedule,
  Message
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const drawerWidth = 260;

const menuItems = [
  { text: "Tổng quan", icon: <DashboardIcon />, path: "/admin" },
  { text: "Học sinh", icon: <Person />, path: "/admin/students" },
  { text: "Tài xế", icon: <DriveEta />, path: "/admin/drivers" },
  { text: "Xe buýt", icon: <DirectionsBus />, path: "/admin/buses" },
  { text: "Tuyến đường", icon: <Route />, path: "/admin/routes" },
  { text: "Lịch trình", icon: <Schedule />, path: "/admin/schedule" },
  { text: "Thông báo", icon: <Message />, path: "/admin/notifications" },
];

const AdminSidebar = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(0);

  const handleNavigation = (index, path) => {
    setSelected(index);
    navigate(path);
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          backgroundColor: "#2c3e50",
          color: "#fff",
        },
      }}
    >
      <Toolbar />
      <Box sx={{ mt: 2, px: 1 }}>
        <List>
          {menuItems.map((item, index) => (
            <ListItem key={index} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                selected={selected === index}
                onClick={() => handleNavigation(index, item.path)}
                sx={{
                  borderRadius: 2,
                  "&.Mui-selected": { backgroundColor: "#007bff" },
                  "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" },
                }}
              >
                <ListItemIcon sx={{ color: "#fff" }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
};

export default AdminSidebar;
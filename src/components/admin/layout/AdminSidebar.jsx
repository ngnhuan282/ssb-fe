import React, { useState } from "react";
import { Drawer, Toolbar, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Box } from "@mui/material";
import {
  Dashboard as DashboardIcon, Person, DirectionsBus, DriveEta, Route, Schedule, Message
} from "@mui/icons-material";

const drawerWidth = 260;

const menuItems = [
  { text: "Tổng quan", icon: <DashboardIcon /> },
  { text: "Học sinh", icon: <Person /> },
  { text: "Tài xế", icon: <DriveEta /> },
  { text: "Xe buýt", icon: <DirectionsBus /> },
  { text: "Tuyến đường", icon: <Route /> },
  { text: "Lịch trình", icon: <Schedule /> },
  { text: "Tin nhắn", icon: <Message /> },
];

const AdminSidebar = () => {
  const [selected, setSelected] = useState(0);

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
                onClick={() => setSelected(index)}
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

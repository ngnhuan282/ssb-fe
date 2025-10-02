import React, { useState } from "react";
import { Drawer, Toolbar, Divider, List, ListItem, ListItemButton, ListItemText, Box, IconButton, Typography } from "@mui/material";
import { Dashboard, DirectionsBus, Schedule, Assessment, Person, Login, MenuOpen } from "@mui/icons-material";

const menuItems = [
  { text: "Tổng quan", icon: <Dashboard /> },
  { text: "Đăng nhập", icon: <Login /> },
  { text: "Quản lý xe", icon: <DirectionsBus /> },
  { text: "Quản lý người dùng", icon: <Person /> },
  { text: "Lịch trình", icon: <Schedule /> },
  { text: "Báo cáo", icon: <Assessment /> },
];

const drawerWidthOpen = 350;
const drawerWidthClosed = 90;

const SidebarMenu = () => {
  const [open, setOpen] = useState(false);

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: open ? drawerWidthOpen : drawerWidthClosed,
        "& .MuiDrawer-paper": {
          width: open ? drawerWidthOpen : drawerWidthClosed,
          transition: "width 0.3s ease",
          top: "60px",
          height: "calc(100vh - 60px)",
          borderRight: "1px solid #ddd",
          overflowX: "hidden",
        },
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: open ? "flex-end" : "center" }}>
        <IconButton onClick={() => setOpen(!open)}>
          <MenuOpen sx={{ transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.3s" }} />
        </IconButton>
      </Toolbar>

      <Divider />
      <List>
        {menuItems.map((item, i) => (
          <ListItem key={i} disablePadding sx={{ display: "block" }}>
            <ListItemButton sx={{ justifyContent: open ? "initial" : "center" }}>
              <Box sx={{ mr: open ? 2 : 0 }}>{item.icon}</Box>
              {open && <ListItemText primary={item.text} />}
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider />
      <Box sx={{ p: 2.5 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Person sx={{ fontSize: 20 }} />
          <Typography variant="subtitle2">Nguyễn Văn A</Typography>
        </Box>
        <Typography variant="caption" color="text.secondary">Admin</Typography>
      </Box>
    </Drawer>
  );
};

export default SidebarMenu;

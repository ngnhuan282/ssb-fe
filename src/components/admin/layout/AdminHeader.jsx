import React from "react";
import { AppBar, Toolbar, Typography, Box, IconButton, Badge, Avatar } from "@mui/material";
import { DirectionsBus as BusIcon, Notifications as NotificationIcon } from "@mui/icons-material";

const AdminHeader = () => (
  <AppBar position="fixed" sx={{ zIndex: (t) => t.zIndex.drawer + 1, backgroundColor: "#fff", color: "#333" }}>
    <Toolbar>
      <BusIcon sx={{ fontSize: 32, color: "#007bff", mr: 1.5 }} />
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="h6" fontWeight={700} color="#007bff">SSB Admin Panel</Typography>
        <Typography variant="caption" color="text.secondary">Hệ thống quản trị xe buýt trường học</Typography>
      </Box>
      <IconButton sx={{ mr: 2 }}>
        <Badge badgeContent={5} color="error"><NotificationIcon /></Badge>
      </IconButton>
      <Avatar sx={{ width: 40, height: 40, bgcolor: "#007bff" }}>AD</Avatar>
    </Toolbar>
  </AppBar>
);

export default AdminHeader;

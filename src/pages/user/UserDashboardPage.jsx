import React from "react";
import { Box, Typography, Paper } from "@mui/material";
import Header from "../../components/user/layout/Header";
import SidebarMenu from "../../components/user/layout/Sidebar";

const UserDashboardPage = () => {
  return (
    <Box sx={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      <Header />
      <SidebarMenu />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          mt: "60px",
          p: 3,
          backgroundColor: "#f9fafc",
        }}
      >
        <Paper sx={{ p: 4, borderRadius: 3 }}>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            🏫 Tổng quan hệ thống
          </Typography>
          <Typography variant="body1" sx={{ color: "text.secondary" }}>
            Chào mừng bạn đến với hệ thống quản lý Smart School Bus 1.0.
            Tại đây bạn có thể xem thông tin xe, tài xế, hành trình, và nhiều chức năng khác.
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
};

export default UserDashboardPage;

import React from "react";
import { Box, Typography, Paper } from "@mui/material";

const UserDashboardPage = () => {
  return (
    <Box>
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
  );
};

export default UserDashboardPage;
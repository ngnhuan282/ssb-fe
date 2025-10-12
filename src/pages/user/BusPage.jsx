import React from "react";
import { Box, Typography, Paper } from "@mui/material";

const BusPage = () => {
  return (
    <Box>
      <Paper sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          🚌 Quản lý xe BUS
        </Typography>
        <Typography variant="body1" sx={{ color: "text.secondary" }}>
          Đây là trang quản lý xe BUS
        </Typography>
      </Paper>
    </Box>
  );
};

export default BusPage;
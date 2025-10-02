import React from "react";
import { Paper, Box, Typography } from "@mui/material";

const MapLegend = () => (
  <Paper sx={{ position: "absolute", bottom: 20, left: 20, p: 2 }}>
    <Typography variant="subtitle2" fontWeight={600}>Chú thích</Typography>
    <Box sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
      <Box sx={{ width: 15, height: 15, backgroundColor: "#28a745", mr: 1.5 }} />
      <Typography variant="body2">Đang chạy</Typography>
    </Box>
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Box sx={{ width: 15, height: 15, backgroundColor: "#ffc107", mr: 1.5 }} />
      <Typography variant="body2">Đang dừng</Typography>
    </Box>
  </Paper>
);

export default MapLegend;

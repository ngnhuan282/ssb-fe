import React from "react";
import { Paper, Box, Typography } from "@mui/material";
import BusCard from "./BusCard";

const BusList = ({ buses }) => (
  <Paper sx={{ width: 350, overflowY: "auto", borderRight: "1px solid #ddd" }}>
    <Box sx={{ p: 2.5 }}>
      <Typography variant="h6" color="primary">Danh sách xe buýt</Typography>
      <Typography variant="body2" color="text.secondary">
        {buses.filter(bus => bus.status === "running").length}/{buses.length} xe đang hoạt động
      </Typography>
    </Box>
    <Box sx={{ px: 2, pb: 2 }}>
      {buses.map(bus => <BusCard key={bus.id} bus={bus} />)}
    </Box>
  </Paper>
);

export default BusList;

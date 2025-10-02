import React from "react";
import { Card, CardContent, Typography, Chip, Box } from "@mui/material";

const BusCard = ({ bus }) => (
  <Card
    sx={{
      mb: 1.5,
      borderLeft: `5px solid ${bus.status === "running" ? "#28a745" : "#ffc107"}`,
    }}
  >
    <CardContent>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="subtitle2" fontWeight={600}>
          {bus.name} - {bus.plate}
        </Typography>
        <Chip
          label={bus.status === "running" ? "Đang chạy" : "Đang dừng"}
          size="small"
          sx={{
            backgroundColor: bus.status === "running" ? "#28a745" : "#ffc107",
            color: "#fff",
            fontWeight: 600,
          }}
        />
      </Box>
      <Typography variant="body2">👤 Tài xế: {bus.driver}</Typography>
      <Typography variant="body2">🛣️ Tuyến: {bus.route}</Typography>
      <Typography variant="body2">🧑‍🎓 Học sinh: {bus.students}</Typography>
    </CardContent>
  </Card>
);

export default BusCard;

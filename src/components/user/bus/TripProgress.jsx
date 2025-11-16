// src/components/user/bus/TripProgress.jsx
import React from "react";
import { Box, LinearProgress, Typography } from "@mui/material";

const TripProgress = ({ stops }) => {
  // Tính phần trăm hoàn thành
  const completedStops = stops.filter((s) => s.status === "completed").length;
  const totalStops = stops.length;
  const progress = totalStops > 0 ? (completedStops / totalStops) * 100 : 0;

  return (
    <Box sx={{ px: 2, pb: 2 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 1,
        }}
      >
        <Typography variant="body2" fontWeight={600} color="text.secondary">
          Tiến độ hành trình
        </Typography>
        <Typography variant="body2" fontWeight={600} color="primary">
          {completedStops}/{totalStops} điểm
        </Typography>
      </Box>
      <LinearProgress
        variant="determinate"
        value={progress}
        sx={{
          height: 8,
          borderRadius: 4,
          backgroundColor: "#e0e0e0",
          "& .MuiLinearProgress-bar": {
            backgroundColor: "#28a745",
            borderRadius: 4,
          },
        }}
      />
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ mt: 0.5, display: "block" }}
      >
        {Math.round(progress)}% hoàn thành
      </Typography>
    </Box>
  );
};

export default TripProgress;

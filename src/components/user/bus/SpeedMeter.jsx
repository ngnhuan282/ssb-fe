// src/components/user/bus/SpeedMeter.jsx
import React from "react";
import { Box, Typography, LinearProgress } from "@mui/material";

const SpeedMeter = ({ speed = 0 }) => {
  const percentage = Math.min((speed / 60) * 100, 100);

  const getColor = () => {
    if (speed < 30) return "#ff9800";
    if (speed < 45) return "#2196F3";
    return "#4caf50";
  };

  const getLabel = () => {
    if (speed < 30) return "Chậm";
    if (speed < 45) return "Bình thường";
    return "Nhanh";
  };

  return (
    <Box sx={{ width: "100%", mb: 2 }}>
      {/* Thanh tốc độ */}
      <Box sx={{ position: "relative", mb: 1 }}>
        <LinearProgress
          variant="determinate"
          value={percentage}
          sx={{
            height: 12,
            borderRadius: 6,
            backgroundColor: "#f0f0f0",
            "& .MuiLinearProgress-bar": {
              backgroundColor: getColor(),
              borderRadius: 6,
              transition: "all 0.5s ease",
            },
          }}
        />

        {/* Markers */}
        <Box
          sx={{
            position: "absolute",
            top: 15,
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "space-between",
            px: 0.5,
          }}
        >
          <Typography
            variant="caption"
            color="text.secondary"
            fontSize="0.65rem"
          >
            0
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            fontSize="0.65rem"
          >
            30
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            fontSize="0.65rem"
          >
            60
          </Typography>
        </Box>
      </Box>

      {/* Hiển thị tốc độ và trạng thái */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mt: 3,
        }}
      >
        <Box>
          <Typography variant="caption" color="text.secondary">
            Tốc độ
          </Typography>
          <Typography
            variant="h5"
            fontWeight={700}
            sx={{
              color: getColor(),
              transition: "color 0.5s ease",
            }}
          >
            {speed}
            <Typography
              component="span"
              variant="body2"
              color="text.secondary"
              sx={{ ml: 0.5 }}
            >
              km/h
            </Typography>
          </Typography>
        </Box>

        <Box
          sx={{
            px: 2,
            py: 0.5,
            borderRadius: 2,
            backgroundColor: getColor() + "20",
            transition: "background-color 0.5s ease",
          }}
        >
          <Typography
            variant="body2"
            fontWeight={600}
            sx={{
              color: getColor(),
              transition: "color 0.5s ease",
            }}
          >
            {getLabel()}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default SpeedMeter;

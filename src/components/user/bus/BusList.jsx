import React from "react";
import {
  Paper,
  Box,
  Typography,
  CircularProgress,
  Alert,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  CheckCircle,
  RadioButtonChecked,
  RadioButtonUnchecked,
  LocationOn,
} from "@mui/icons-material";
import TripProgress from "./TripProgress";

const BusList = ({ buses = [], loading, error }) => {
  const bus = buses.length > 0 ? buses[0] : null;

  const getStopIcon = (status) => {
    if (status === "completed") {
      return <CheckCircle color="success" sx={{ fontSize: 28 }} />;
    }
    if (status === "current") {
      return <RadioButtonChecked color="primary" sx={{ fontSize: 28 }} />;
    }
    return <RadioButtonUnchecked color="disabled" sx={{ fontSize: 28 }} />;
  };

  // Tìm điểm đang đến
  const currentStop = bus?.route?.stops?.find((s) => s.status === "current");

  return (
    <Paper
      sx={{
        width: 350,
        overflowY: "auto",
        borderRight: "1px solid #ddd",
        height: "100%",
      }}
    >
      {/* Header */}
      <Box sx={{ p: 2.5 }}>
        <Typography variant="h6" color="primary" fontWeight={600}>
          Theo dõi lộ trình
        </Typography>
        {bus && (
          <Box>
            <Typography variant="body2" color="text.secondary">
              {bus.status === "running" ? "Xe đang di chuyển" : "Xe đang dừng"}
            </Typography>
            {currentStop && (
              <Box
                sx={{
                  mt: 1,
                  p: 1,
                  backgroundColor: "#e3f2fd",
                  borderRadius: 1,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <LocationOn color="primary" fontSize="small" />
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Đang đến
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {currentStop.name}
                  </Typography>
                </Box>
              </Box>
            )}
          </Box>
        )}
      </Box>

      {/* Nội dung chi tiết */}
      <Box sx={{ px: 1, pb: 2 }}>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : !bus ? (
          <Alert severity="info" sx={{ mx: 2 }}>
            Không tìm thấy thông tin xe của con bạn.
          </Alert>
        ) : (
          <Box>
            {/* Thông tin xe cơ bản */}
            <Box sx={{ px: 1.5, mb: 2 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 1.5,
                }}
              >
                <Typography variant="h6" fontWeight={500}>
                  {bus.name || `Xe ${bus.plate}`}
                </Typography>
                <Chip
                  label={bus.status === "running" ? "Đang chạy" : "Đang dừng"}
                  size="small"
                  sx={{
                    backgroundColor:
                      bus.status === "running" ? "#28a745" : "#ffc107",
                    color: "#fff",
                    fontWeight: 600,
                  }}
                />
              </Box>
              <Typography variant="body2" color="text.secondary">
                Biển số: **{bus.plate}**
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Tài xế: **{bus.driver}**
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Tuyến: **{bus.route?.name || "Chưa có tuyến"}**
              </Typography>

              {/* Hiển thị tốc độ với animation */}
              {bus.status === "running" && bus.speed && (
                <Box
                  sx={{
                    mt: 1.5,
                    p: 1.5,
                    backgroundColor: "#e3f2fd",
                    borderRadius: 1,
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    transition: "all 0.5s ease", // ✨ Animation khi thay đổi
                  }}
                >
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      backgroundColor:
                        bus.speed < 30
                          ? "#ff9800" // Chậm: Cam
                          : bus.speed < 45
                          ? "#2196F3" // Trung bình: Xanh
                          : "#4caf50", // Nhanh: Xanh lá
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "background-color 0.5s ease", // ✨ Đổi màu mượt
                    }}
                  >
                    <Typography
                      variant="caption"
                      fontWeight={700}
                      color="white"
                      sx={{ fontSize: "1.2rem" }}
                    >
                      {bus.speed < 30 ? "🐌" : bus.speed < 45 ? "⚡" : "🚀"}
                    </Typography>
                  </Box>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="caption" color="text.secondary">
                      Tốc độ hiện tại
                    </Typography>
                    <Typography
                      variant="h6"
                      fontWeight={600}
                      sx={{
                        color:
                          bus.speed < 30
                            ? "#ff9800"
                            : bus.speed < 45
                            ? "#2196F3"
                            : "#4caf50",
                        transition: "color 0.5s ease", // ✨ Đổi màu chữ mượt
                      }}
                    >
                      {bus.speed} km/h
                    </Typography>
                  </Box>
                  {/* ✨ Badge trạng thái */}
                  <Chip
                    label={
                      bus.speed < 30
                        ? "Chậm"
                        : bus.speed < 45
                        ? "Bình thường"
                        : "Nhanh"
                    }
                    size="small"
                    sx={{
                      backgroundColor:
                        bus.speed < 30
                          ? "#fff3e0"
                          : bus.speed < 45
                          ? "#e3f2fd"
                          : "#e8f5e9",
                      color:
                        bus.speed < 30
                          ? "#ff9800"
                          : bus.speed < 45
                          ? "#2196F3"
                          : "#4caf50",
                      fontWeight: 600,
                      fontSize: "0.7rem",
                    }}
                  />
                </Box>
              )}
            </Box>

            {/* Thanh tiến độ */}
            {bus.route?.stops && <TripProgress stops={bus.route.stops} />}

            <Divider sx={{ mx: 2, my: 2 }} />

            {/* Danh sách các điểm dừng */}
            <List sx={{ width: "100%", position: "relative" }}>
              {/* Đường kẻ dọc */}
              <Box
                sx={{
                  position: "absolute",
                  left: "29px",
                  top: 20,
                  bottom: 20,
                  width: 2,
                  backgroundColor: "#e0e0e0",
                  zIndex: 0,
                }}
              />

              {bus.route?.stops?.map((stop, index) => (
                <ListItem
                  key={stop.id}
                  sx={{
                    zIndex: 1,
                    alignItems: "flex-start",
                    backgroundColor:
                      stop.status === "current" ? "#f5f5f5" : "transparent",
                    borderRadius: 1,
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40, mt: -0.5 }}>
                    {getStopIcon(stop.status)}
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography
                        fontWeight={stop.status === "current" ? 600 : 400}
                        color={
                          stop.status === "completed"
                            ? "text.secondary"
                            : "text.primary"
                        }
                      >
                        {stop.name}
                      </Typography>
                    }
                    secondary={
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Dự kiến: {stop.time}
                        </Typography>
                        {stop.status === "completed" && (
                          <Chip
                            label="Đã qua"
                            size="small"
                            sx={{
                              ml: 1,
                              height: 18,
                              fontSize: "0.65rem",
                              backgroundColor: "#e8f5e9",
                              color: "#2e7d32",
                            }}
                          />
                        )}
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        )}
      </Box>
    </Paper>
  );
};

export default BusList;

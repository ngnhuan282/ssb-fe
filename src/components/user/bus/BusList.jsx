import React from "react";
import { Paper, Box, Typography, CircularProgress, Alert } from "@mui/material";
import BusCard from "./BusCard";
import useFetch from "../../../hooks/useFetch";
import { busAPI } from "../../../services/api";

const BusList = () => {
  // Gọi API để lấy danh sách xe bus
  const { data, loading, error } = useFetch(() => busAPI.getAll());

  // Lấy mảng buses từ response
  const buses = data?.data || [];

  // Đếm số xe đang chạy
  const runningBuses = buses.filter((bus) => bus.status === "active").length;

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
          Danh sách xe buýt
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {runningBuses}/{buses.length} xe đang hoạt động
        </Typography>
      </Box>

      {/* Danh sách xe */}
      <Box sx={{ px: 2, pb: 2 }}>
        {loading ? (
          // Hiển thị loading spinner
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          // Hiển thị lỗi nếu có
          <Alert severity="error">{error}</Alert>
        ) : buses.length === 0 ? (
          // Hiển thị thông báo nếu không có xe
          <Alert severity="info">Không có xe nào trong hệ thống</Alert>
        ) : (
          // Hiển thị danh sách xe
          buses.map((bus) => (
            <BusCard
              key={bus._id}
              bus={{
                id: bus._id,
                name: bus.name || `Xe ${bus.licensePlate}`,
                plate: bus.licensePlate,
                driver: bus.driverId?.name || "Chưa phân công",
                route: bus.routeId?.name || "Chưa có tuyến",
                students: bus.students?.length || 0,
                status: bus.status === "active" ? "running" : "stopped",
              }}
            />
          ))
        )}
      </Box>
    </Paper>
  );
};

export default BusList;

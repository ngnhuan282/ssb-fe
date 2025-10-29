import React, { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Button,
  CircularProgress,
  Alert,
  Divider,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

import { scheduleAPI } from "../../services/api";
import useFetch from "../../hooks/useFetch";

const busIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/3448/3448623.png",
  iconSize: [35, 35],
  iconAnchor: [17, 35],
  popupAnchor: [0, -35],
});

const studentIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/1995/1995574.png",
  iconSize: [35, 35],
  iconAnchor: [17, 35],
  popupAnchor: [0, -35],
});

const DriverPage = () => {
  const {
    data: scheduleData,
    loading,
    error,
    refetch,
  } = useFetch(scheduleAPI.getDriverScheduleForToday);

  const [isUpdating, setIsUpdating] = useState(false);
  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        sx={{ height: "calc(100vh - 64px)" }}
      >
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2 }}>
          Đang tải lịch trình...
        </Typography>
      </Box>
    );
  }

  // if (error) {
  //   return (
  //     <Alert severity="error" sx={{ m: 2 }}>
  //       <Typography>
  //         <b>Lỗi khi tải dữ liệu!</b>
  //       </Typography>
  //       {error}
  //     </Alert>
  //   );
  // }

  if (!scheduleData) {
    return (
      <Alert severity="info" sx={{ m: 2 }}>
        <Typography>
          <b>Hôm nay bạn không có lịch trình nào.</b>
        </Typography>
      </Alert>
    );
  }

  const { route, students = [], bus, startTime, endTime } = scheduleData;

  const mapCenter =
    students.length > 0 ? students[0].position : [10.8231, 106.6297];

  const routePolyline = students.map((s) => s.position);

  const handleUpdateStatus = async (studentId, status) => {
    if (!scheduleData?._id) return;

    setIsUpdating(true);
    try {
      await scheduleAPI.updateStudentPickupStatus(
        scheduleData._id,
        studentId,
        status
      );
      await refetch();
    } catch (err) {
      console.error("Lỗi cập nhật trạng thái:", err);
      alert("Cập nhật thất bại, vui lòng thử lại.");
    } finally {
      setIsUpdating(false);
    }
  };

  // 7. Render giao diện
  return (
    <Box sx={{ p: 3 }}>
      {/* Nút đóng (tùy chọn) */}
      <IconButton
        aria-label="close"
        onClick={() => alert("Đóng trang")}
        sx={{ position: "absolute", top: 8, right: 8, zIndex: 1000 }}
      >
        <CloseIcon />
      </IconButton>

      {/* Thẻ thông tin lịch làm việc */}
      <Card sx={{ mb: 3, backgroundColor: "#f0f4f8" }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            📅 Lịch làm việc hôm nay: {route?.name}
          </Typography>
          <Typography>
            <b>Giờ bắt đầu:</b> {startTime}
          </Typography>
          <Typography>
            <b>Giờ kết thúc (dự kiến):</b> {endTime}
          </Typography>
          <Typography>
            <b>Xe được gán:</b> {`${bus?.model} - ${bus?.licensePlate}`}
          </Typography>
        </CardContent>
      </Card>

      {/* Layout chính chia 2 cột */}
      <Box
        display="grid"
        gridTemplateColumns={{ xs: "1fr", md: "1fr 2fr" }}
        gap={3}
      >
        {/* Cột bên trái: Danh sách và Báo cáo */}
        <Box display="flex" flexDirection="column" gap={3}>
          {/* Danh sách học sinh */}
          <Card>
            <CardContent>
              <Typography variant="h6">
                👨‍👩‍👧 Danh sách học sinh ({students.length})
              </Typography>
              <List dense>
                {students.map((student) => (
                  <React.Fragment key={student._id}>
                    <ListItem>
                      <ListItemText
                        primary={`${student.user.fullName} - Lớp ${student.grade}`}
                        secondary={`Phụ huynh: ${student.parent.user.phoneNumber}`}
                      />
                    </ListItem>
                    <Divider component="li" />
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>

          {/* Báo cáo tình trạng */}
          <Card>
            <CardContent>
              <Typography variant="h6">✅ Báo cáo tình trạng</Typography>
              <Box mt={2} display="flex" flexDirection="column" gap={1.5}>
                {students.map((student) => (
                  <Box key={student._id} display="flex" alignItems="center">
                    <Typography sx={{ flexGrow: 1 }}>
                      {student.user.fullName}
                    </Typography>
                    <Button
                      size="small"
                      variant={
                        student.pickupStatus === "picked_up" ||
                        student.pickupStatus === "dropped_off"
                          ? "contained"
                          : "outlined"
                      }
                      color="success"
                      sx={{ mr: 1 }}
                      disabled={
                        isUpdating || student.pickupStatus !== "pending"
                      }
                      onClick={() =>
                        handleUpdateStatus(student._id, "picked_up")
                      }
                    >
                      Đã đón
                    </Button>
                    <Button
                      size="small"
                      variant={
                        student.pickupStatus === "dropped_off"
                          ? "contained"
                          : "outlined"
                      }
                      color="info"
                      disabled={
                        isUpdating || student.pickupStatus !== "picked_up"
                      }
                      onClick={() =>
                        handleUpdateStatus(student._id, "dropped_off")
                      }
                    >
                      Đã trả
                    </Button>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Cột bên phải: Bản đồ */}
        <Box>
          <Card sx={{ height: "100%", minHeight: "600px" }}>
            <CardContent
              sx={{ height: "100%", display: "flex", flexDirection: "column" }}
            >
              <Typography variant="h6">🗺️ Bản đồ tuyến đường</Typography>
              <Box
                sx={{
                  mt: 2,
                  flexGrow: 1,
                  borderRadius: "12px",
                  overflow: "hidden",
                }}
              >
                <MapContainer
                  center={mapCenter}
                  zoom={14}
                  scrollWheelZoom={true}
                  style={{ height: "100%", width: "100%" }}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />

                  {/* Marker xe bus (vị trí đầu tiên) */}
                  {routePolyline.length > 0 && (
                    <Marker position={routePolyline[0]} icon={busIcon}>
                      <Popup>Điểm xuất phát của xe</Popup>
                    </Marker>
                  )}

                  {/* Marker các học sinh */}
                  {students.map((student) => (
                    <Marker
                      key={student._id}
                      position={student.position}
                      icon={studentIcon}
                    >
                      <Popup>
                        <b>{student.user.fullName}</b> <br /> Lớp{" "}
                        {student.grade}
                      </Popup>
                    </Marker>
                  ))}

                  {/* Đường đi */}
                  <Polyline
                    positions={routePolyline}
                    color="blue"
                    weight={5}
                    opacity={0.7}
                  />
                </MapContainer>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
};

export default DriverPage;

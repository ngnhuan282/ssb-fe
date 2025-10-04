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
  Checkbox,
  Divider,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Icon xe bus
const busIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/61/61212.png",
  iconSize: [32, 32],
});

const DriverPage = () => {
  // Mock dữ liệu tuyến đường
  const routeInfo = {
    id: 1,
    startTime: "06:30",
    endTime: "08:00",
    vehicle: "Xe 16 chỗ - 51B-12345",
  };

  // Mock dữ liệu học sinh + vị trí
  const students = [
    { id: 1, name: "Nguyễn Văn A", grade: "Lớp 5A", parent: "0909xxxxxx", position: [10.762622, 106.660172] },
    { id: 2, name: "Trần Thị B", grade: "Lớp 4B", parent: "0912xxxxxx", position: [10.768, 106.66] },
    { id: 3, name: "Lê Văn C", grade: "Lớp 3C", parent: "0934xxxxxx", position: [10.755, 106.665] },
  ];

  // Mock vị trí xe bus
  const busPosition = [10.762622, 106.660172];

  // State tick học sinh
  const [pickupStatus, setPickupStatus] = useState({});

  const togglePickup = (id) => {
    setPickupStatus((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Polyline từ xe bus -> học sinh theo thứ tự
  const routePolyline = [busPosition, ...students.map((s) => s.position)];

  return (
    <Box p={3} position="relative">
      {/* Nút đóng */}
      <IconButton
        sx={{ position: "absolute", top: 8, right: 8 }}
        onClick={() => alert("Đóng trang")}
      >
        <CloseIcon />
      </IconButton>

      {/* Lịch làm việc hằng ngày */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6">📅 Lịch làm việc hôm nay</Typography>
          <Typography>Giờ bắt đầu: {routeInfo.startTime}</Typography>
          <Typography>Giờ kết thúc: {routeInfo.endTime}</Typography>
          <Typography>Xe được gán: {routeInfo.vehicle}</Typography>
        </CardContent>
      </Card>

      {/* Layout chia 2 cột */}
      <Box display="flex" gap={3}>
        {/* Bên trái: Danh sách HS + Báo cáo */}
        <Box flex={1} display="flex" flexDirection="column" gap={3}>
          {/* Danh sách học sinh */}
          <Card>
            <CardContent>
              <Typography variant="h6">👨‍👩‍👧 Danh sách học sinh cần đón</Typography>
              <List>
                {students.map((s) => (
                  <React.Fragment key={s.id}>
                    <ListItem
                      secondaryAction={
                        <Checkbox
                          checked={pickupStatus[s.id] || false}
                          onChange={() => togglePickup(s.id)}
                        />
                      }
                    >
                      <ListItemText
                        primary={`${s.name} - ${s.grade}`}
                        secondary={`Phụ huynh: ${s.parent}`}
                      />
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>

          {/* Báo cáo tình trạng */}
          <Card>
            <CardContent>
              <Typography variant="h6">✅ Báo cáo tình trạng</Typography>
              <Box mt={2}>
                {students.map((s) => (
                  <Box key={s.id} display="flex" alignItems="center" mb={1}>
                    <Typography sx={{ flexGrow: 1 }}>{s.name}</Typography>
                    <Button
                      size="small"
                      variant="contained"
                      color="success"
                      sx={{ mr: 1 }}
                    >
                      Đã đón
                    </Button>
                    <Button size="small" variant="contained" color="info">
                      Đã trả
                    </Button>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Bên phải: Map */}
        <Box flex={2}>
          <Card sx={{ height: "100%" }}>
            <CardContent sx={{ height: "100%" }}>
              <Typography variant="h6">🗺️ Bản đồ tuyến đường</Typography>
              <Box sx={{ mt: 2, height: 1000 }}>
                <MapContainer
                  center={busPosition}
                  zoom={14}
                  scrollWheelZoom={true}
                  style={{ height: "100%", borderRadius: "12px" }}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />

                  {/* Marker xe bus */}
                  <Marker position={busPosition} icon={busIcon}>
                    <Popup>Xe bus tại đây</Popup>
                  </Marker>

                  {/* Marker học sinh */}
                  {students.map((s) => (
                    <Marker key={s.id} position={s.position}>
                      <Popup>
                        {s.name} <br /> {s.grade}
                      </Popup>
                    </Marker>
                  ))}

                  {/* Polyline tuyến đường */}
                  <Polyline positions={routePolyline} color="blue" />
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

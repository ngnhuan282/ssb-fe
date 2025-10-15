import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
  Card,
  CardContent,
  Chip,
  Paper,
  Toolbar,
  Divider,
  IconButton,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  DirectionsBus as BusIcon,
  Schedule as ScheduleIcon,
  Assessment as ReportIcon,
  Person as PersonIcon,
  Login as LoginIcon,
  MenuOpen as MenuOpenIcon,
} from "@mui/icons-material";
import Header from "../layout/Header.jsx";
import { busAPI, locationAPI } from "../../../services/api";
import useFetch from "../../../hooks/useFetch";

const drawerWidthOpen = 350;
const drawerWidthClosed = 90;
const sidebarWidth = 350;

const center = {
  lat: 10.775843,
  lng: 106.660172,
};

const menuItems = [
  { text: "Tổng quan", icon: <DashboardIcon /> },
  { text: "Đăng nhập", icon: <LoginIcon /> },
  { text: "Quản lý xe", icon: <BusIcon /> },
  { text: "Quản lý người dùng", icon: <PersonIcon /> },
  { text: "Lịch trình", icon: <ScheduleIcon /> },
  { text: "Báo cáo", icon: <ReportIcon /> },
];

const createBusIcon = (status) => {
  const color = status === "running" ? "#28a745" : "#ffc107";

  return L.divIcon({
    html: `
      <div style="
        background-color: ${color};
        width: 32px;
        height: 32px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 5px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
          <path d="M4 16c0 .88.39 1.67 1 2.22V20c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h8v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1.78c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4s-8 .5-8 4v10zm3.5 1c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm9 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm1.5-6H6V6h12v5z"/>
        </svg>
      </div>
    `,
    className: "custom-bus-icon",
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  });
};

const MapComponent = () => {
  const [open, setOpen] = useState(false);
  const [mapKey, setMapKey] = useState(0);

  // Gọi API để lấy danh sách xe bus
  const {
    data: busesData,
    loading: busesLoading,
    error: busesError,
    refetch: refetchBuses,
  } = useFetch(() => busAPI.getAll());

  // Gọi API để lấy vị trí các xe
  const {
    data: locationsData,
    loading: locationsLoading,
    error: locationsError,
  } = useFetch(() => locationAPI.getAll());

  // Lấy data từ API response
  const buses = busesData?.data || [];
  const locations = locationsData?.data || [];

  // Kết hợp data xe bus với vị trí GPS
  const busesWithLocations = buses.map((bus) => {
    const location = locations.find((loc) => loc.busId === bus._id);
    return {
      id: bus._id,
      name: bus.name || `Xe ${bus.licensePlate}`,
      plate: bus.licensePlate,
      driver: bus.driverId?.name || "Chưa phân công",
      route: bus.routeId?.name || "Chưa có tuyến",
      students: bus.students?.length || 0,
      status: bus.status === "active" ? "running" : "stopped",
      position: location
        ? {
            lat: location.latitude,
            lng: location.longitude,
          }
        : center,
    };
  });

  // Tự động refresh data mỗi 30 giây
  useEffect(() => {
    const interval = setInterval(() => {
      refetchBuses();
      setMapKey((prev) => prev + 1); // Force re-render map
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Box sx={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      <Header />

      {/* Left Sidebar - Menu */}
      <Drawer
        variant="permanent"
        sx={{
          width: open ? drawerWidthOpen : drawerWidthClosed,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: open ? drawerWidthOpen : drawerWidthClosed,
            boxSizing: "border-box",
            top: "60px",
            height: "calc(100vh - 60px)",
            borderRight: "1px solid #ddd",
            transition: "width 0.3s ease",
            overflowX: "hidden",
          },
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: open ? "flex-end" : "center",
            px: 1,
            minHeight: "60px",
            color: "#007bff",
          }}
        >
          <IconButton onClick={() => setOpen(!open)}>
            <MenuOpenIcon
              sx={{
                transform: open ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.3s",
              }}
            />
          </IconButton>
        </Toolbar>

        <Divider />

        <List sx={{ flexGrow: 1 }}>
          {menuItems.map((item, index) => (
            <ListItem key={index} disablePadding sx={{ display: "block" }}>
              <ListItemButton
                sx={{
                  py: 2,
                  px: open ? 2 : 1,
                  justifyContent: open ? "initial" : "center",
                  "&:hover": {
                    backgroundColor: "#f0f0f0",
                    color: "#007bff",
                  },
                }}
              >
                <Box sx={{ mr: open ? 2 : 0, color: "inherit" }}>
                  {item.icon}
                </Box>
                {open && (
                  <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{
                      fontWeight: 500,
                    }}
                  />
                )}
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        <Divider />

        <Box sx={{ p: 2.5, borderTop: "1px solid #ddd" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
            <PersonIcon sx={{ fontSize: 20, color: "#666" }} />
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              Nguyễn Văn A
            </Typography>
          </Box>
          <Typography variant="caption" color="text.secondary">
            Admin
          </Typography>
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: "flex",
          mt: "60px",
          height: "calc(100vh - 60px)",
          overflow: "hidden",
        }}
      >
        {/* Bus List Sidebar */}
        <Paper
          elevation={1}
          sx={{
            width: sidebarWidth,
            height: "100%",
            overflowY: "auto",
            backgroundColor: "#f8f9fa",
            borderRight: "1px solid #ddd",
          }}
        >
          <Box sx={{ p: 2.5 }}>
            <Typography
              variant="h6"
              sx={{ color: "#007bff", fontWeight: 600, mb: 0.5 }}
            >
              Danh sách xe buýt
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {
                busesWithLocations.filter((bus) => bus.status === "running")
                  .length
              }
              /{busesWithLocations.length} xe đang hoạt động
            </Typography>
          </Box>

          <Box sx={{ px: 2, pb: 2 }}>
            {busesLoading ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                <CircularProgress />
              </Box>
            ) : busesError ? (
              <Alert severity="error" sx={{ mb: 2 }}>
                Lỗi API: {busesError}
                <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                  Kiểm tra Backend: http://localhost:5000/api/buses
                </Typography>
              </Alert>
            ) : busesWithLocations.length === 0 ? (
              <Alert severity="info">Không có xe nào trong hệ thống</Alert>
            ) : (
              busesWithLocations.map((bus) => (
                <Card
                  key={bus.id}
                  sx={{
                    mb: 1.5,
                    cursor: "pointer",
                    borderLeft: `5px solid ${
                      bus.status === "running" ? "#28a745" : "#ffc107"
                    }`,
                    transition: "all 0.2s",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: 3,
                    },
                  }}
                >
                  <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        mb: 1,
                      }}
                    >
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {bus.name} - {bus.plate}
                      </Typography>
                      <Chip
                        label={
                          bus.status === "running" ? "Đang chạy" : "Đang dừng"
                        }
                        size="small"
                        sx={{
                          backgroundColor:
                            bus.status === "running" ? "#28a745" : "#ffc107",
                          color: "#fff",
                          fontWeight: 600,
                          fontSize: "11px",
                        }}
                      />
                    </Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 0.5 }}
                    >
                      👤 Tài xế: {bus.driver}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 0.5 }}
                    >
                      🛣️ Tuyến: {bus.route}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      🧑‍🎓 Học sinh: {bus.students}
                    </Typography>
                  </CardContent>
                </Card>
              ))
            )}
          </Box>
        </Paper>

        {/* Map Container */}
        <Box sx={{ flexGrow: 1, position: "relative", height: "100%" }}>
          <MapContainer
            key={mapKey}
            center={[center.lat, center.lng]}
            zoom={13}
            style={{ width: "100%", height: "100%" }}
            zoomControl={true}
          >
            {/* Tile Layer - Sử dụng OpenStreetMap (miễn phí) */}
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Hiển thị marker cho mỗi xe bus */}
            {busesWithLocations.map((bus) => (
              <Marker
                key={bus.id}
                position={[bus.position.lat, bus.position.lng]}
                icon={createBusIcon(bus.status)}
              >
                <Popup>
                  <Box sx={{ minWidth: 200 }}>
                    <Typography
                      variant="subtitle2"
                      sx={{ fontWeight: 600, mb: 1 }}
                    >
                      {bus.name} - {bus.plate}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 0.5 }}>
                      👤 Tài xế: {bus.driver}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 0.5 }}>
                      🛣️ Tuyến: {bus.route}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 0.5 }}>
                      🧑‍🎓 Học sinh: {bus.students}
                    </Typography>
                    <Chip
                      label={
                        bus.status === "running" ? "Đang chạy" : "Đang dừng"
                      }
                      size="small"
                      sx={{
                        mt: 1,
                        backgroundColor:
                          bus.status === "running" ? "#28a745" : "#ffc107",
                        color: "#fff",
                        fontWeight: 600,
                      }}
                    />
                  </Box>
                </Popup>
              </Marker>
            ))}
          </MapContainer>

          {/* Map Legend */}
          <Paper
            elevation={2}
            sx={{
              position: "absolute",
              bottom: 20,
              left: 20,
              p: 2,
              zIndex: 1000,
              backgroundColor: "rgba(255, 255, 255, 0.95)",
            }}
          >
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
              Chú thích
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
              <Box
                sx={{
                  width: 15,
                  height: 15,
                  borderRadius: "50%",
                  backgroundColor: "#28a745",
                  mr: 1.5,
                }}
              />
              <Typography variant="body2">Đang chạy</Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Box
                sx={{
                  width: 15,
                  height: 15,
                  borderRadius: "50%",
                  backgroundColor: "#ffc107",
                  mr: 1.5,
                }}
              />
              <Typography variant="body2">Đang dừng</Typography>
            </Box>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default MapComponent;

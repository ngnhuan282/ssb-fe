import React, { useState, useCallback } from "react";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
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
  useTheme,
  useMediaQuery,
  IconButton,

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
import Header from "./Header.jsx";

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const libraries = ["places", "geometry"];

const mockBusData = [
  {
    id: "01",
    name: "Xe 01",
    plate: "29A-12345",
    driver: "Trần Văn Bảo",
    route: "Tuyến 1: Quận 1 - Quận 3",
    students: 25,
    status: "running",
    position: { lat: 10.762622, lng: 106.660172 },
  },
  {
    id: "02",
    name: "Xe 02",
    plate: "29B-67890",
    driver: "Lê Thị Cún",
    route: "Tuyến 2: Quận 2 - Bình Thạnh",
    students: 25,
    status: "running",
    position: { lat: 10.794155, lng: 106.7 },
  },
  {
    id: "03",
    name: "Xe 03",
    plate: "29C-11111",
    driver: "Phạm Văn Danh",
    route: "Tuyến 3: Quận 10 - Tân Bình",
    students: 25,
    status: "stopped",
    position: { lat: 10.77, lng: 106.68 },
  },
];

const drawerWidth = 250;
const sidebarWidth = 350;
const drawerWidthOpen = 350;
const drawerWidthClosed = 90;

const containerStyle = {
  width: "100%",
  height: "100%",
};

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

const MapComponent = () => {
  const [map, setMap] = useState(null);
  const [buses] = useState(mockBusData);
  const [open, setOpen] = useState(false);//che do cua sidebar
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: libraries,
  });

  const onLoad = useCallback(
    (mapInstance) => {
      if (window.google?.maps?.LatLngBounds) {
        const bounds = new window.google.maps.LatLngBounds();
        buses.forEach((bus) => {
          bounds.extend(
            new window.google.maps.LatLng(bus.position.lat, bus.position.lng)
          );
        });
        mapInstance.fitBounds(bounds);
      }
      setMap(mapInstance);
    },
    [buses]
  );

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  const createBusIcon = (status) => {
    const iconBaseUrl = window.location.origin;
    return {
      url: `${iconBaseUrl}/assets/bus-${status}.png`,
      scaledSize: new window.google.maps.Size(32, 32),
    };
  };

  if (loadError)
    return <div>Lỗi khi tải bản đồ. Vui lòng kiểm tra API Key.</div>;

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
                <Box sx={{ mr: open ? 2 : 0, color: "inherit" }}>{item.icon}</Box>
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
              {buses.filter((bus) => bus.status === "running").length}/
              {buses.length} xe đang hoạt động đồng thời
            </Typography>
          </Box>

          <Box sx={{ px: 2, pb: 2 }}>
            {buses.map((bus) => (
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
            ))}
          </Box>
        </Paper>

        {/* Map Container */}
        <Box sx={{ flexGrow: 1, position: "relative", height: "100%" }}>
          {isLoaded ? (
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={center}
              zoom={12}
              onLoad={onLoad}
              onUnmount={onUnmount}
              options={{
                disableDefaultUI: true,
                zoomControl: true,
                streetViewControl: false,
                mapTypeControl: false,
                fullscreenControl: false,
              }}
            >
              {buses.map((bus) => (
                <Marker
                  key={bus.id}
                  position={bus.position}
                  icon={createBusIcon(bus.status)}
                  title={`${bus.name} - ${bus.plate} (${
                    bus.status === "running" ? "Đang chạy" : "Đang dừng"
                  })`}
                />
              ))}
            </GoogleMap>
          ) : (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
              }}
            >
              <Typography>Đang tải bản đồ...</Typography>
            </Box>
          )}

          {/* Map Legend */}
          <Paper
            elevation={2}
            sx={{
              position: "absolute",
              bottom: 20,
              left: 20,
              p: 2,
              zIndex: 10,
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
                  borderRadius: 1,
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
                  borderRadius: 1,
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

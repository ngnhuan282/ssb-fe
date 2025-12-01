import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Alert,
  Paper,
  Typography,
  Badge,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  Slide,
} from "@mui/material";
import {
  PlayArrow,
  Stop,
  DirectionsBus,
  WarningAmber,
  AccessTime,
  Notifications,
  NotificationsActive,
  Close,
  Delete,
  VolumeUp,
  VolumeOff,
} from "@mui/icons-material";

// Components
import BusList from "../../components/user/bus/BusList";
import MapContainer from "../../components/user/map/MapContainer";
import MapLegend from "../../components/user/map/MapLegend";

// Services & Hooks
import { useSocket } from "../../hooks/useSocket";
import busSimulationService from "../../services/busSimulationService";
import { routeAPI } from "../../services/api";

const MapPage = () => {
  const socket = useSocket();

  const [currentRouteId, setCurrentRouteId] = useState(
    "6655aa11bb22cc33dd44ee01"
  );
  const VIRTUAL_BUS_ID = "bus_simulation_01";

  const [buses, setBuses] = useState([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // === NOTIFICATION SYSTEM ===
  const [notifications, setNotifications] = useState([]);
  const [currentNotification, setCurrentNotification] = useState(null);
  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] =
    useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const notificationTimeoutRef = useRef(null);

  // Hàm phát âm thanh
  const playNotificationSound = (type) => {
    if (!soundEnabled) return;

    try {
      const audioContext = new (window.AudioContext ||
        window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      if (type === "late") {
        // Âm thanh cảnh báo (2 tiếng beep)
        oscillator.frequency.value = 400;
        gainNode.gain.value = 0.3;
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.2);

        setTimeout(() => {
          const osc2 = audioContext.createOscillator();
          const gain2 = audioContext.createGain();
          osc2.connect(gain2);
          gain2.connect(audioContext.destination);
          osc2.frequency.value = 350;
          gain2.gain.value = 0.3;
          osc2.start();
          osc2.stop(audioContext.currentTime + 0.2);
        }, 250);
      } else {
        // Âm thanh thông báo nhẹ nhàng
        oscillator.frequency.value = 600;
        gainNode.gain.value = 0.2;
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.15);
      }
    } catch (err) {
      console.error("Cannot play sound:", err);
    }
  };

  // Hàm thêm thông báo mới
  const addNotification = (alert) => {
    const newNotification = {
      ...alert,
      id: Date.now(),
      timestamp: new Date(),
    };

    setNotifications((prev) => [newNotification, ...prev].slice(0, 20));
    setCurrentNotification(newNotification);
    playNotificationSound(alert.type);

    // Tự động ẩn sau 6 giây
    if (notificationTimeoutRef.current) {
      clearTimeout(notificationTimeoutRef.current);
    }
    notificationTimeoutRef.current = setTimeout(() => {
      setCurrentNotification(null);
    }, 6000);
  };

  // Hàm xóa tất cả thông báo
  const clearAllNotifications = () => {
    setNotifications([]);
  };

  // Hàm lấy dữ liệu Route
  const fetchRouteData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await routeAPI.getById(currentRouteId);
      const routeData = response.data.data || response.data;

      if (!routeData || !routeData.stops || routeData.stops.length === 0) {
        throw new Error(
          "Không tìm thấy lộ trình hoặc lộ trình chưa có điểm dừng."
        );
      }

      // Xử lý dữ liệu trạm: Đảm bảo có tên hiển thị để tránh lỗi lệch tên
      const formattedStops = routeData.stops.map((stop, index) => ({
        ...stop,
        id: stop._id || `stop_${index}`,
        // Ưu tiên: Tên > Địa chỉ > Mặc định
        name: stop.name || stop.address || `Trạm số ${index + 1}`,
        position: { lat: stop.lat, lng: stop.lng },
        status: "pending",
        expectedTime: stop.time,
      }));

      const virtualBus = {
        id: VIRTUAL_BUS_ID,
        name: `Xe mô phỏng (${routeData.name})`,
        plate: "51B-SSB.01",
        driver: "Tài xế Demo",
        route: {
          name: routeData.name,
          stops: formattedStops,
        },
        position: formattedStops[0].position,
        latitude: formattedStops[0].position.lat,
        longitude: formattedStops[0].position.lng,
        status: "stopped",
        students: 0,
        speed: 0,
      };

      setBuses([virtualBus]);
      setLoading(false);
    } catch (err) {
      console.error("Lỗi lấy dữ liệu Route:", err);
      setError(err.message || "Không thể tải dữ liệu.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRouteData();
    return () => {
      busSimulationService.stopAllSimulations();
      if (notificationTimeoutRef.current) {
        clearTimeout(notificationTimeoutRef.current);
      }
    };
  }, [currentRouteId]);

  // Hàm bắt đầu mô phỏng
  const handleStartSimulation = () => {
    const targetBus = buses.find((b) => b.id === VIRTUAL_BUS_ID);
    if (!targetBus || !targetBus.route?.stops) return;

    setIsSimulating(true);

    busSimulationService.startSimulation(
      targetBus.id,
      targetBus.route.stops,
      (data) => {
        // Cập nhật vị trí xe
        setBuses((prev) =>
          prev.map((bus) =>
            bus.id === data.busId
              ? {
                  ...bus,
                  position: data.position,
                  latitude: data.position.lat,
                  longitude: data.position.lng,
                  speed: data.speed,
                  status: "running",
                  route: { ...bus.route, stops: data.stops },
                }
              : bus
          )
        );

        // Xử lý cảnh báo từ service
        if (data.alerts && data.alerts.length > 0) {
          data.alerts.forEach((alert) => {
            addNotification(alert);
            console.log("🔔 CẢNH BÁO MỚI:", alert.message);
          });
        }

        // Gửi socket (nếu có)
        if (socket) {
          socket.emit("updateLocation", {
            busId: data.busId,
            latitude: data.position.lat,
            longitude: data.position.lng,
            speed: data.speed,
          });
        }
      }
    );
  };

  const handleStopSimulation = () => {
    busSimulationService.stopSimulation(VIRTUAL_BUS_ID);
    setIsSimulating(false);
    setBuses((prev) =>
      prev.map((bus) =>
        bus.id === VIRTUAL_BUS_ID
          ? { ...bus, status: "stopped", speed: 0 }
          : bus
      )
    );
  };

  if (loading)
    return (
      <Box p={4} display="flex" justifyContent="center">
        <CircularProgress />
      </Box>
    );
  if (error)
    return (
      <Box p={4}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );

  return (
    <Box
      sx={{
        display: "flex",
        height: "calc(100vh - 80px)",
        width: "100%",
        gap: 2,
        p: 2,
        bgcolor: "#f5f7fa",
      }}
    >
      {/* Cột trái */}
      <Box sx={{ width: 350, display: { xs: "none", md: "block" } }}>
        <BusList buses={buses} loading={loading} error={error} />
      </Box>

      {/* Cột phải: Bản đồ */}
      <Box
        sx={{
          flexGrow: 1,
          position: "relative",
          borderRadius: 4,
          overflow: "hidden",
          boxShadow: 3,
          bgcolor: "white",
        }}
      >
        <MapContainer buses={buses} loading={loading} error={error} />
        <MapLegend />

        {/* === THÔNG BÁO CHÍNH (TOP CENTER) === */}
        {currentNotification && (
          <Slide
            direction="down"
            in={Boolean(currentNotification)}
            mountOnEnter
            unmountOnExit
          >
            <Paper
              elevation={6}
              sx={{
                position: "absolute",
                top: 20,
                left: "50%",
                transform: "translateX(-50%)",
                zIndex: 1001,
                maxWidth: 450,
                background:
                  currentNotification.type === "late"
                    ? "linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)"
                    : "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
                borderRadius: 3,
                p: 0.5,
                animation: "slideDown 0.4s ease-out",
                "@keyframes slideDown": {
                  "0%": { transform: "translate(-50%, -100%)", opacity: 0 },
                  "100%": { transform: "translate(-50%, 0)", opacity: 1 },
                },
              }}
            >
              <Box
                sx={{
                  bgcolor: "white",
                  borderRadius: 2.5,
                  p: 2,
                  position: "relative",
                }}
              >
                <IconButton
                  size="small"
                  onClick={() => setCurrentNotification(null)}
                  sx={{ position: "absolute", top: 8, right: 8 }}
                >
                  <Close fontSize="small" />
                </IconButton>

                <Box display="flex" alignItems="flex-start" gap={2}>
                  <Avatar
                    sx={{
                      bgcolor:
                        currentNotification.type === "late"
                          ? "error.light"
                          : "info.light",
                      color:
                        currentNotification.type === "late"
                          ? "error.dark"
                          : "info.dark",
                    }}
                  >
                    {currentNotification.type === "late" ? (
                      <WarningAmber />
                    ) : (
                      <AccessTime />
                    )}
                  </Avatar>

                  <Box flex={1} pr={3}>
                    <Typography
                      variant="subtitle1"
                      fontWeight="bold"
                      gutterBottom
                    >
                      {currentNotification.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" mb={1}>
                      {currentNotification.message}
                    </Typography>
                    <Box display="flex" gap={2} flexWrap="wrap">
                      <Typography variant="caption" color="text.disabled">
                        📍 {currentNotification.stopName}
                      </Typography>
                      {currentNotification.distance > 0 && (
                        <Typography variant="caption" color="text.disabled">
                          🚏 {currentNotification.distance}m
                        </Typography>
                      )}
                      {currentNotification.estimatedMinutes > 0 && (
                        <Typography
                          variant="caption"
                          color="primary.main"
                          fontWeight="bold"
                        >
                          ⏱️ ~{currentNotification.estimatedMinutes} phút
                        </Typography>
                      )}
                      {currentNotification.delayMinutes > 0 && (
                        <Typography
                          variant="caption"
                          color="error.main"
                          fontWeight="bold"
                        >
                          ⚠️ Trễ {currentNotification.delayMinutes} phút
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </Box>

                {/* Progress Bar */}
                <Box
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: 4,
                    bgcolor: "grey.200",
                    borderRadius: "0 0 8px 8px",
                    overflow: "hidden",
                  }}
                >
                  <Box
                    sx={{
                      height: "100%",
                      background:
                        "linear-gradient(90deg, #667eea 0%, #764ba2 100%)",
                      animation: "shrink 6s linear",
                      "@keyframes shrink": {
                        "0%": { width: "100%" },
                        "100%": { width: "0%" },
                      },
                    }}
                  />
                </Box>
              </Box>
            </Paper>
          </Slide>
        )}

        {/* Panel điều khiển */}
        <Paper
          elevation={3}
          sx={{
            position: "absolute",
            top: 20,
            right: 20,
            zIndex: 1000,
            p: 1.5,
            borderRadius: 2,
            display: "flex",
            gap: 1,
            bgcolor: "rgba(255,255,255,0.95)",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", mr: 2 }}>
            <DirectionsBus color="action" sx={{ mr: 1 }} />
            <Typography variant="subtitle2" fontWeight="bold">
              {isSimulating
                ? `Đang chạy (${buses[0]?.speed || 0} km/h)`
                : "Sẵn sàng"}
            </Typography>
          </Box>
          {!isSimulating ? (
            <Button
              variant="contained"
              color="success"
              startIcon={<PlayArrow />}
              onClick={handleStartSimulation}
              size="small"
            >
              Chạy tuyến
            </Button>
          ) : (
            <Button
              variant="contained"
              color="error"
              startIcon={<Stop />}
              onClick={handleStopSimulation}
              size="small"
            >
              Dừng
            </Button>
          )}
        </Paper>

        {/* === NÚT THÔNG BÁO (BOTTOM RIGHT) === */}
        <Paper
          elevation={3}
          sx={{
            position: "absolute",
            bottom: 20,
            right: 20,
            zIndex: 1000,
            borderRadius: "50%",
          }}
        >
          <IconButton
            size="large"
            onClick={() => setIsNotificationDrawerOpen(true)}
            sx={{ p: 2 }}
          >
            <Badge badgeContent={notifications.length} color="error">
              {notifications.length > 0 ? (
                <NotificationsActive color="primary" sx={{ fontSize: 28 }} />
              ) : (
                <Notifications color="action" sx={{ fontSize: 28 }} />
              )}
            </Badge>
          </IconButton>

          {/* Nút bật/tắt âm thanh */}
          <IconButton
            size="small"
            onClick={() => setSoundEnabled(!soundEnabled)}
            sx={{
              position: "absolute",
              top: -8,
              right: -8,
              bgcolor: "white",
              boxShadow: 2,
              "&:hover": { bgcolor: "grey.100" },
            }}
          >
            {soundEnabled ? (
              <VolumeUp fontSize="small" color="primary" />
            ) : (
              <VolumeOff fontSize="small" color="disabled" />
            )}
          </IconButton>
        </Paper>

        {/* === DRAWER LỊCH SỬ THÔNG BÁO === */}
        <Drawer
          anchor="right"
          open={isNotificationDrawerOpen}
          onClose={() => setIsNotificationDrawerOpen(false)}
          PaperProps={{
            sx: {
              width: 400,
              background: "linear-gradient(180deg, #667eea 0%, #764ba2 100%)",
              color: "white",
            },
          }}
        >
          <Box
            sx={{
              p: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box display="flex" alignItems="center" gap={1}>
              <Notifications />
              <Typography variant="h6" fontWeight="bold">
                Lịch sử thông báo
              </Typography>
            </Box>
            <IconButton
              onClick={() => setIsNotificationDrawerOpen(false)}
              sx={{ color: "white" }}
            >
              <Close />
            </IconButton>
          </Box>

          <Box sx={{ bgcolor: "white", flexGrow: 1, color: "black" }}>
            {notifications.length === 0 ? (
              <Box p={4} textAlign="center">
                <Notifications
                  sx={{ fontSize: 60, color: "grey.300", mb: 2 }}
                />
                <Typography color="text.secondary">
                  Chưa có thông báo
                </Typography>
              </Box>
            ) : (
              <>
                <Box p={2} display="flex" justifyContent="flex-end">
                  <Button
                    size="small"
                    startIcon={<Delete />}
                    onClick={clearAllNotifications}
                    color="error"
                  >
                    Xóa tất cả
                  </Button>
                </Box>
                <List sx={{ pt: 0 }}>
                  {notifications.map((notif, index) => (
                    <React.Fragment key={notif.id}>
                      <ListItem alignItems="flex-start">
                        <ListItemAvatar>
                          <Avatar
                            sx={{
                              bgcolor:
                                notif.type === "late"
                                  ? "error.light"
                                  : "info.light",
                              color:
                                notif.type === "late"
                                  ? "error.dark"
                                  : "info.dark",
                            }}
                          >
                            {notif.type === "late" ? (
                              <WarningAmber />
                            ) : (
                              <AccessTime />
                            )}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Typography variant="subtitle2" fontWeight="bold">
                              {notif.title}
                            </Typography>
                          }
                          secondary={
                            <>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                gutterBottom
                              >
                                {notif.message}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.disabled"
                              >
                                {notif.timestamp.toLocaleTimeString("vi-VN")}
                              </Typography>
                            </>
                          }
                        />
                      </ListItem>
                      {index < notifications.length - 1 && (
                        <Divider variant="inset" />
                      )}
                    </React.Fragment>
                  ))}
                </List>
              </>
            )}
          </Box>
        </Drawer>
      </Box>
    </Box>
  );
};

export default MapPage;

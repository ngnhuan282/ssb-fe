import React, { useEffect, useState } from "react";
import {
  MapContainer as LeafletMapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  CircleMarker,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Box, Typography, CircularProgress, Alert, Chip } from "@mui/material";
import busSimulationService from "../../../services/busSimulationService";
const center = { lat: 10.76065, lng: 106.682057 };

const createBusIcon = (status) => {
  const isRunning = status === "active" || status === "running";
  const color = isRunning ? "#28a745" : "#ffc107";

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

const MapContainer = ({ buses, loading, error }) => {
  const [routePaths, setRoutePaths] = useState({});

  const busesWithLocations = buses.map((bus) => {
    const lat = bus.latitude || bus.position?.lat || center.lat;
    const lng = bus.longitude || bus.position?.lng || center.lng;
    const status =
      bus.status === "active" || bus.status === "running"
        ? "running"
        : "stopped";

    return {
      id: bus.id || bus._id,
      name: bus.name || `Xe ${bus.licensePlate || bus.plate}`,
      plate: bus.licensePlate || bus.plate,
      driver: bus.driverId?.name || bus.driver || "Chưa phân công",
      route: bus.routeId?.name || bus.route?.name || "Chưa có tuyến",
      students: bus.students?.length || bus.students || 0,
      status: status,
      position: { lat, lng },
      stops: bus.route?.stops || [],
    };
  });

  useEffect(() => {
    const fetchRoutes = async () => {
      for (const bus of busesWithLocations) {
        if (bus.stops && bus.stops.length > 1) {
          try {
            const path = await busSimulationService.buildFullRoute(bus.stops);
            setRoutePaths((prev) => ({
              ...prev,
              [bus.id]: path,
            }));
          } catch (err) {
            console.error("Error building route:", err);
          }
        }
      }
    };

    if (busesWithLocations.length > 0) {
      fetchRoutes();
    }
  }, [buses.length]);

  if (error) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
        }}
      >
        <Alert severity="error">Lỗi API: {error}</Alert>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
        }}
      >
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Đang tải bản đồ...</Typography>
      </Box>
    );
  }

  return (
    <LeafletMapContainer
      center={[center.lat, center.lng]}
      zoom={13}
      style={{ width: "100%", height: "100%" }}
      zoomControl={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Vẽ route cho mỗi xe */}
      {busesWithLocations.map((bus) => {
        const path = routePaths[bus.id];
        if (path && path.length > 0) {
          return (
            <Polyline
              key={`route-${bus.id}`}
              positions={path.map((p) => [p.lat, p.lng])}
              color="#2196F3"
              weight={4}
              opacity={0.7}
            />
          );
        }
        return null;
      })}

      {/* Hiển thị các điểm đón */}
      {busesWithLocations.map((bus) =>
        bus.stops.map((stop) => {
          if (!stop.position) return null;

          const fillColor =
            stop.status === "completed"
              ? "#28a745"
              : stop.status === "current"
              ? "#ffc107"
              : "#6c757d";

          return (
            <CircleMarker
              key={`stop-${stop.id}`}
              center={[stop.position.lat, stop.position.lng]}
              radius={8}
              fillColor={fillColor}
              color="#fff"
              weight={2}
              opacity={1}
              fillOpacity={0.8}
            >
              // Trong Popup của Marker
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
                    ⚡ Tốc độ: {bus.speed || 40} km/h
                  </Typography>
                  <Chip
                    label={bus.status === "running" ? "Đang chạy" : "Đang dừng"}
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
            </CircleMarker>
          );
        })
      )}

      {/* Hiển thị xe buýt */}
      {busesWithLocations.map((bus) => (
        <Marker
          key={bus.id}
          position={[bus.position.lat, bus.position.lng]}
          icon={createBusIcon(bus.status)}
        >
          <Popup>
            <Box sx={{ minWidth: 200 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
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
                label={bus.status === "running" ? "Đang chạy" : "Đang dừng"}
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
    </LeafletMapContainer>
  );
};

export default MapContainer;

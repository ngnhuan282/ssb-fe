import React from "react";
import {
  MapContainer as LeafletMapContainer,
  TileLayer,
  Marker,
  Popup,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Box, Typography, CircularProgress, Alert, Chip } from "@mui/material";
import useFetch from "../../../hooks/useFetch";
import { busAPI, locationAPI } from "../../../services/api";

const center = { lat: 10.775843, lng: 106.660172 };

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

const MapContainer = () => {
  const {
    data: busesData,
    loading: busesLoading,
    error: busesError,
  } = useFetch(() => busAPI.getAll());

  const { data: locationsData } = useFetch(() => locationAPI.getAll());

  const buses = busesData?.data || [];
  const locations = locationsData?.data || [];

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

  if (busesError) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
        }}
      >
        <Alert severity="error">Lỗi API: {busesError}</Alert>
      </Box>
    );
  }

  if (busesLoading) {
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
      {/* Tile Layer - OpenStreetMap (miễn phí) */}
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

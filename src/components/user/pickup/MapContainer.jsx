// src/components/driver/pickup/MapContainer.jsx
import React, { useMemo } from 'react';
import {
  Box,
  Paper,
  TextField,
  InputAdornment,
  Typography, // <--- ĐÃ THÊM VÀO
} from '@mui/material';
import { Search } from '@mui/icons-material';
import {
  MapContainer as LeafletMapContainer,
  TileLayer,
  Marker,
  Popup,
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import RoutingMachine from './RoutingMachine';
const defaultCenter  = { lat: 10.760650, lng: 106.682057 };

const pickupIcon = new L.Icon({
  iconUrl:
    'https://cdn-icons-png.flaticon.com/512/3448/3448339.png',
  iconSize: [36, 36],
  iconAnchor: [18, 36],
  popupAnchor: [0, -30],
});

const busIcon = new L.Icon({
  iconUrl:
    'https://cdn-icons-png.flaticon.com/512/1068/1068631.png', 
  iconSize: [40, 40],   
  iconAnchor: [20, 40],
  popupAnchor: [0, -35],
});

const MapContainer = ({ 
  licensePlate = "",
  busLocation = null,
  pickupPoints = [],
  routeStartPoint = null,
  routeDestination = null,
  onRouteFound = () => {}
}) => {

  // const startCoords = useMemo(() => {
  //   return routeStartPoint ? [routeStartPoint.lat, routeStartPoint.lng] : null;
  // }, [routeStartPoint]);

  // const endCoords = useMemo(() => {
  //   return routeDestination ? [routeDestination.lat, routeDestination.lng] : null;
  // }, [routeDestination]);

  const startCoords = useMemo(() => {
    return routeStartPoint ? { lat: routeStartPoint.lat, lng: routeStartPoint.lng } : null;
  }, [routeStartPoint]);
  
  const endCoords = useMemo(() => {
    return routeDestination ? { lat: routeDestination.lat, lng: routeDestination.lng } : null;
  }, [routeDestination]);

  
  return (
    <Box
      sx={{
        flex: 1,
        height: 'calc(100vh - 100px)',
        position: 'relative',
        bgcolor: '#e5e7eb', // Màu nền placeholder cho map
      }}
    >
      {/* Thanh tìm kiếm */}
      <Paper
        elevation={3}
        sx={{
          position: 'absolute',
          top: 10,
          left: 72,
          zIndex: 10,
          borderRadius: 3,
        }}
      >
        {/* <TextField
          placeholder="Search for a location"
          variant="outlined"
          sx={{
            width: 350,
            '& .MuiOutlinedInput-root': {
              borderRadius: 3,
              bgcolor: '#ffffff',
              '& fieldset': {
                border: 'none',
              },
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search sx={{ color: '#9ca3af' }} />
              </InputAdornment>
            ),
          }}
        /> */}
      </Paper>

      {/* Placeholder cho bản đồ */}
      <Box
        sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#9ca3af',
        }}
      >
        {/* Bản đồ Leaflet */}
      <LeafletMapContainer
        center={[defaultCenter.lat, defaultCenter.lng]}
        zoom={13}
        style={{
          width: '100%',
          height: '100%',
          borderRadius: 12,
          overflow: 'hidden',
          zIndex: 1,
        }}
        zoomControl={true}
      >
        {/* Lớp bản đồ nền từ OpenStreetMap */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Hiển thị các điểm đón */}
        {pickupPoints.map((point) => {
          if (!point || !point.position || typeof point.position.lat !== 'number' || typeof point.position.lng !== 'number') {
            console.warn(`Điểm dừng ${point?.name || 'không tên'} bị lỗi tọa độ, bỏ qua.`);
            return null;
          }
          let distanceStr = "Chưa có vị trí xe";
          if (busLocation) {
            try {
              const busLatLng = L.latLng(busLocation.lat, busLocation.lng);
              const pointLatLng = L.latLng(point.position.lat, point.position.lng);
              
              const distanceInMeters = busLatLng.distanceTo(pointLatLng);
              
              if (distanceInMeters > 1000) {
                 distanceStr = `${(distanceInMeters / 1000).toFixed(1)} km`;
              } else {
                 distanceStr = `${Math.round(distanceInMeters)} m`;
              }
            } catch(e) {
              console.error("Lỗi tính khoảng cách:", e);
              distanceStr = "Lỗi vị trí";
            }
          }
          return (
            <Marker
              key={point.id}
              position={[point.position.lat, point.position.lng]}
              icon={pickupIcon}
            >
              <Popup>
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  {point.name}
                </Typography>
                <Typography variant="body2" sx={{ color: '#6b7280' }}>
                  (Vĩ độ: {point.position.lat.toFixed(5)}, Kinh độ:{' '}
                  {point.position.lng.toFixed(5)})
                </Typography>

                <Box sx={{ borderTop: '1px solid #eee', mt: 1, pt: 1 }}>
                  <Typography variant="caption" sx={{ color: '#333', fontWeight: 500, fontSize: '0.9rem' }}>
                    Khoảng cách: {distanceStr}
                  </Typography>
                </Box>
              </Popup>
            </Marker>
          );
        })}

        {/* Hien thi marker bus */}
        {busLocation && (
          <Marker
            position={[busLocation.lat, busLocation.lng]}
            icon={busIcon}
          >
            <Popup>
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                Vị trí của bạn
              </Typography>
              <Typography variant="body2" sx={{ color: '#6b7280' }}>
                Xe buýt {licensePlate} đang hoạt động
              </Typography>
            </Popup>
          </Marker>
          )}

          {startCoords && endCoords && (
            <RoutingMachine 
              start={startCoords}
              end={endCoords} 
              onRouteFound={onRouteFound}
            />
          )}

      </LeafletMapContainer>
      </Box>
    </Box>
  );
};

export default MapContainer;
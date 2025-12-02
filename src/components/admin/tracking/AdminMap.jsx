// src/components/admin/tracking/AdminMap.jsx
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { io } from "socket.io-client";
import { Box, Typography, Paper, Chip } from '@mui/material';
import { DirectionsBus, Speed, AccessTime } from '@mui/icons-material';

// URL Socket server (phải khớp với file .env của bạn)
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
const FlyToBus = ({ location }) => {
  const map = useMap();

  useEffect(() => {
    if (location) {
      // Bay đến vị trí mới với mức zoom 16
      map.flyTo([location.lat, location.lng], 16, {
        animate: true,
        duration: 1.5 // Thời gian bay (giây)
      });
    }
  }, [location, map]);

  return null;
};

// Custom Icon cho xe buýt
const busIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/3448/3448339.png', // Hoặc dùng icon trong assets của bạn
  iconSize: [40, 40],
  iconAnchor: [20, 20],
  popupAnchor: [0, -20],
});

// Component con để auto-zoom (tuỳ chọn)
const MapAdjuster = ({ buses }) => {
  const map = useMap();
  useEffect(() => {
    if (buses.length > 0) {
      const group = new L.FeatureGroup(
        buses.map(b => L.marker([b.lat, b.lng]))
      );
      // Fit bounds để nhìn thấy tất cả xe, nhưng không zoom quá gần
      map.fitBounds(group.getBounds().pad(0.1), { maxZoom: 15 });
    }
  }, [buses.length, map]); // Chỉ chạy khi số lượng xe thay đổi
  return null;
};

const AdminMap = ({ onBusUpdate, focusedLocation }) => {
  const [buses, setBuses] = useState({}); // Dùng Object để dễ update theo ID

  useEffect(() => {
    // 1. Kết nối Socket
    const socket = io(SOCKET_URL);
    
    console.log("Admin Map: Connecting to socket...");

    // 2. Join phòng dành cho Admin (nếu backend yêu cầu)
    socket.on('connect', () => {
      console.log('Connected to socket server');
      socket.emit('joinAdminRoom'); 
    });

    // 3. Lắng nghe sự kiện cập nhật vị trí
    // Tên sự kiện phải khớp với backend (socketService.js: io.to(busId).emit('locationUpdated', data))
    // Tuy nhiên, Admin cần nghe TOÀN BỘ. Giả sử Backend emit 'admin_all_locations' hoặc admin join từng phòng bus.
    // Ở đây mình giả lập Admin nghe sự kiện broadcast chung.
    socket.on('locationUpdated', (data) => {
        // data format: { busId, location: {lat, lng}, speed, routeName, ... }
        setBuses(prev => {
            const updatedBuses = {
                ...prev,
                [data.busId]: {
                    ...prev[data.busId],
                    ...data,
                    lastUpdate: new Date()
                }
            };
            // Callback để update danh sách bên ngoài (Sidebar list)
            if (onBusUpdate) onBusUpdate(Object.values(updatedBuses));
            return updatedBuses;
        });
    });

    return () => {
      socket.disconnect();
    };
  }, [onBusUpdate]);

  const activeBuses = Object.values(buses);

  return (
    <Box sx={{ height: '100%', width: '100%', position: 'relative' }}>
      <MapContainer 
        center={[10.762622, 106.660172]} // Mặc định TP.HCM
        zoom={13} 
        style={{ height: '100%', width: '100%' }}
      > 
      <FlyToBus location={focusedLocation} />
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />
        
        {/* Render các xe buýt */}
        {activeBuses.map((bus) => (
          <Marker 
            key={bus.busId} 
            position={[bus.location?.lat || bus.lat, bus.location?.lng || bus.lng]} 
            icon={busIcon}
          >
            <Popup>
              <Paper elevation={0} sx={{ p: 0, minWidth: 200 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, borderBottom: '1px solid #eee', pb: 1 }}>
                    <DirectionsBus color="primary" />
                    <Typography variant="subtitle2" fontWeight="bold">
                        {bus.licensePlate || bus.busId}
                    </Typography>
                    <Chip 
                        label={bus.status || 'Đang chạy'} 
                        size="small" 
                        color="success" 
                        sx={{ ml: 'auto', height: 20, fontSize: '0.65rem' }} 
                    />
                </Box>
                
                <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    <strong>Tuyến:</strong> {bus.routeName || 'Chưa cập nhật'}
                </Typography>
                
                <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    <Speed fontSize="small" color="action"/> 
                    {bus.speed ? `${bus.speed} km/h` : '0 km/h'}
                </Typography>

                <Typography variant="caption" color="textSecondary" sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                    <AccessTime fontSize="small" style={{ fontSize: 14 }}/>
                    Cập nhật: {new Date(bus.lastUpdate).toLocaleTimeString()}
                </Typography>
              </Paper>
            </Popup>
          </Marker>
        ))}

        {/* <MapAdjuster buses={activeBuses} /> */}
      </MapContainer>

      {/* Overlay thông tin số lượng xe (Góc trên phải) */}
      <Paper 
        sx={{ 
            position: 'absolute', 
            top: 20, 
            right: 20, 
            zIndex: 1000, 
            p: 2, 
            borderRadius: 2,
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
        }}
      >
        <Typography variant="subtitle2" color="textSecondary">Xe đang hoạt động</Typography>
        <Typography variant="h4" fontWeight="bold" color="primary">
            {activeBuses.length}
        </Typography>
      </Paper>
    </Box>
  );
};

export default AdminMap;
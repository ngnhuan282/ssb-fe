// src/pages/user/MapPage.jsx
import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import BusList from '../../components/user/bus/BusList';
import MapContainer from '../../components/user/map/MapContainer';
import MapLegend from '../../components/user/map/MapLegend';
import { useSocket } from '../../hooks/useSocket';
import mockBusData from '../../data/mockBusData';

const MapPage = () => {
  const [buses, setBuses] = useState(mockBusData);
  const socket = useSocket();

  useEffect(() => {
    if (socket) {
      socket.emit('joinBusRoom', 'bus123'); // Join room cho bus cụ thể (có thể dynamic từ state)

      socket.on('locationUpdated', (data) => {
        setBuses((prevBuses) =>
          prevBuses.map((bus) =>
            bus.id === data.busId ? { ...bus, latitude: data.latitude, longitude: data.longitude } : bus
          )
        );
      });

      return () => {
        socket.off('locationUpdated');
      };
    }
  }, [socket]);

  return (
    <Box
      sx={{
        display: 'flex',
        height: 'calc(100vh - 70px - 48px)',
        width: '100%',
        gap: 2,
      }}
    >
      <BusList buses={buses} />
      <Box
        sx={{
          flexGrow: 1,
          position: 'relative',
          borderRadius: 3,
          overflow: 'hidden',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
        }}
      >
        <MapContainer buses={buses} />
        <MapLegend />
      </Box>
    </Box>
  );
};

export default MapPage;
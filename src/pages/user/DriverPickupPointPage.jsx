// src/DriverPickupPointsPage.jsx
import React, { useState } from 'react';
import {
  Box, Container, Grid, Typography, Paper, Button, ToggleButtonGroup, ToggleButton
} from '@mui/material';
import { Map as MapIcon, List as ListIcon, Refresh } from '@mui/icons-material';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import StopMarkerCard from '../../components/user/pickup/StopMarkerCard';
import StudentPickupDetail from '../../components/user/pickup/StudentPickupDetail';

// Fix Leaflet icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const mockStops = [
  {
    id: 1, order: 1, name: 'Trường Tiểu học Kim Đồng', address: '123 Đường Láng, Hà Nội',
    status: 'current', distance: '1.2km', estimatedTime: '5 phút',
    coordinates: { lat: 21.0285, lng: 105.8248 },
    students: [
      { id: 1, name: 'Nguyễn Văn A', phone: '0901234567', status: 'boarded' },
      { id: 2, name: 'Trần Thị B', phone: '0909876543', status: 'waiting' },
      { id: 3, name: 'Lê Văn C', phone: null, status: 'waiting' },
    ]
  },
  {
    id: 2, order: 2, name: 'Trường THCS Nguyễn Tất Thành', address: '456 Cầu Giấy, Hà Nội',
    status: 'pending', distance: '3.5km', estimatedTime: '12 phút',
    coordinates: { lat: 21.0385, lng: 105.7848 },
    students: [
      { id: 4, name: 'Phạm Thị D', phone: '0912345678', status: 'waiting' },
    ]
  },
];

const DriverPickupPointsPage = () => {
  const [viewMode, setViewMode] = useState('list');
  const [studentDialog, setStudentDialog] = useState({ open: false, stop: null });
  const [stops, setStops] = useState(mockStops);
  const currentLocation = { lat: 21.0185, lng: 105.8148 };

  const handleNavigate = (stop) => {
    alert(`Dẫn đường đến: ${stop.name}`);
  };

  const handleComplete = (stop) => {
    setStops(prev => prev.map(s => s.id === stop.id ? { ...s, status: 'completed', completedAt: new Date().toLocaleTimeString() } : s));
  };

  const handleSkip = (stop) => {
    if (window.confirm('Bỏ qua điểm dừng này?')) {
      setStops(prev => prev.map(s => s.id === stop.id ? { ...s, status: 'skipped' } : s));
    }
  };

  const handleToggleStudent = (stopOrder, studentId, status) => {
    setStops(prev => prev.map(stop => {
      if (stop.order === stopOrder) {
        return {
          ...stop,
          students: stop.students.map(s => s.id === studentId ? { ...s, status } : s)
        };
      }
      return stop;
    }));
    setStudentDialog(prev => ({ ...prev, open: false }));
  };

  const polylinePositions = stops.map(stop => [stop.coordinates.lat, stop.coordinates.lng]);

  return (
    <Box sx={{ bgcolor: '#f4f6f8', minHeight: '100vh', py: 3 }}>
      <Container maxWidth="lg">
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, color: '#2c3e50' }}>
          Điểm đón hôm nay
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12} md={viewMode === 'list' ? 12 : 4}>
            <Paper sx={{ p: 2, mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <ToggleButtonGroup value={viewMode} exclusive onChange={(e, v) => v && setViewMode(v)} size="small">
                <ToggleButton value="list"><ListIcon sx={{ mr: 1 }} /> Danh sách</ToggleButton>
                <ToggleButton value="map"><MapIcon sx={{ mr: 1 }} /> Bản đồ</ToggleButton>
              </ToggleButtonGroup>
              <Button startIcon={<Refresh />} onClick={() => alert('Làm mới')} sx={{ textTransform: 'none' }}>
                Làm mới
              </Button>
            </Paper>

            <Box sx={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
              {stops.map((stop) => (
                <StopMarkerCard
                  key={stop.id}
                  stop={stop}
                  onNavigate={handleNavigate}
                  onComplete={handleComplete}
                  onSkip={handleSkip}
                  onViewStudents={(stop) => setStudentDialog({ open: true, stop })}
                />
              ))}
            </Box>
          </Grid>

          {viewMode === 'map' && (
            <Grid item xs={12} md={8}>
              <Paper sx={{ height: 'calc(100vh - 200px)', borderRadius: 2, overflow: 'hidden' }}>
                <MapContainer center={[currentLocation.lat, currentLocation.lng]} zoom={13} style={{ height: '100%', width: '100%' }}>
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <Marker position={[currentLocation.lat, currentLocation.lng]} icon={L.icon({ iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png', shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png', iconSize: [25, 41], iconAnchor: [12, 41] })}>
                    <Popup>Vị trí xe</Popup>
                  </Marker>
                  {stops.map(stop => (
                    <Marker key={stop.id} position={[stop.coordinates.lat, stop.coordinates.lng]} icon={L.icon({ iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${stop.status === 'completed' ? 'green' : stop.status === 'current' ? 'orange' : 'grey'}.png`, shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png', iconSize: [25, 41], iconAnchor: [12, 41] })}>
                      <Popup>
                        <Typography variant="subtitle2">{stop.name}</Typography>
                        <Typography variant="body2">{stop.address}</Typography>
                        <Typography variant="caption">Học sinh: {stop.students.length}</Typography>
                      </Popup>
                    </Marker>
                  ))}
                  <Polyline positions={polylinePositions} color="blue" />
                </MapContainer>
              </Paper>
            </Grid>
          )}
        </Grid>

        <StudentPickupDetail
          open={studentDialog.open}
          onClose={() => setStudentDialog({ open: false, stop: null })}
          stop={studentDialog.stop}
          onToggleStudent={(studentId, status) => handleToggleStudent(studentDialog.stop?.order, studentId, status)}
        />
      </Container>
    </Box>
  );
};

export default DriverPickupPointsPage;
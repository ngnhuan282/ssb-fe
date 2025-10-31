// src/pages/user/DriverPickupPointsPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import {
  Box, Container, Grid, Typography, Paper, Button, Snackbar, Alert,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, ToggleButtonGroup, ToggleButton
} from '@mui/material';
import { Map as MapIcon, List as ListIcon, MyLocation, Refresh } from '@mui/icons-material';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import StopMarkerCard from '../../components/user/driver/StopMarkerCard';
import StudentPickupDetail from '../../components/user/driver/StudentPickupDetail';

// Fix Leaflet icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const DriverPickupPointsPage = () => {
  const [stops, setStops] = useState([]);
  const [viewMode, setViewMode] = useState('list');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [skipDialog, setSkipDialog] = useState({ open: false, stop: null, reason: '' });
  const [studentDialog, setStudentDialog] = useState({ open: false, stop: null });
  const [currentLocation, setCurrentLocation] = useState({ lat: 10.762622, lng: 106.660172 });
  const mapRef = useRef();

  useEffect(() => {
    fetchStops();
    const interval = setInterval(updateCurrentLocation, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchStops = () => {
    const mockStops = [
      { id: 1, order: 1, name: 'Xuất phát', address: 'Bến xe Miền Đông', time: '06:00', students: 0, status: 'completed', completedAt: '06:02', coordinates: { lat: 10.8142, lng: 106.7120 } },
      { id: 2, order: 2, name: 'Điểm đón 1', address: '123 Nguyễn Huệ', time: '06:15', students: 3, status: 'completed', completedAt: '06:18', coordinates: { lat: 10.7744, lng: 106.7010 } },
      { id: 3, order: 3, name: 'Điểm đón 2', address: '456 Lê Lợi', time: '06:30', students: 5, status: 'current', distance: '2.5km', estimatedTime: '8 phút', coordinates: { lat: 10.7769, lng: 106.7009 } },
      { id: 4, order: 4, name: 'Điểm đón 3', address: '789 Trần Hưng Đạo', time: '06:45', students: 4, status: 'pending', distance: '5km', estimatedTime: '15 phút', coordinates: { lat: 10.7555, lng: 106.6799 } },
      { id: 5, order: 5, name: 'Trường DEF', address: 'Số 1 Võ Văn Ngân', time: '07:45', students: 0, status: 'pending', distance: '12km', estimatedTime: '35 phút', coordinates: { lat: 10.8505, lng: 106.7719 } },
    ];

    const stopsWithStudents = mockStops.map(stop => ({
      ...stop,
      students: stop.students > 0 ? generateMockStudents(stop.id).slice(0, stop.students) : [],
    }));

    setStops(stopsWithStudents);
  };

  const generateMockStudents = (stopId) => {
    const names = ['Nguyễn Văn An', 'Trần Thị Bình', 'Lê Minh Châu', 'Phạm Hồng Đào', 'Hoàng Kim Dung'];
    const classes = ['6A1', '7B2', '8C3', '9A4', '10B1'];
    const phones = ['0901234567', '0912345678', '0923456789', '0934567890', '0945678901'];
    return Array.from({ length: 5 }, (_, i) => ({
      id: `${stopId}-${i + 1}`,
      name: names[i % 5],
      class: classes[i % 5],
      phone: phones[i % 5],
      status: 'waiting',
      boardedAt: null,
    }));
  };

  const updateCurrentLocation = () => {
    setCurrentLocation(prev => ({
      lat: prev.lat + (Math.random() - 0.5) * 0.001,
      lng: prev.lng + (Math.random() - 0.5) * 0.001,
    }));
  };

  const handleNavigate = (stop) => {
    const { lat, lng } = stop.coordinates;
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank');
    setSnackbar({ open: true, message: `Đang dẫn đường đến ${stop.name}`, severity: 'info' });
  };

  const handleComplete = (stop) => {
    const now = new Date();
    const timeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    setStops(prev => prev.map(s => {
      if (s.id === stop.id) return { ...s, status: 'completed', completedAt: timeString };
      if (s.order === stop.order + 1) return { ...s, status: 'current' };
      return s;
    }));
    setSnackbar({ open: true, message: `Đã hoàn thành ${stop.name}`, severity: 'success' });
  };

  const handleSkip = (stop) => setSkipDialog({ open: true, stop, reason: '' });

  const confirmSkip = () => {
    const stop = skipDialog.stop;
    setStops(prev => prev.map(s => {
      if (s.id === stop.id) return { ...s, status: 'skipped' };
      if (s.order === stop.order + 1) return { ...s, status: 'current' };
      return s;
    }));
    setSnackbar({ open: true, message: `Đã bỏ qua ${stop.name}`, severity: 'warning' });
    setSkipDialog({ open: false, stop: null, reason: '' });
  };

  const handleViewStudents = (stop) => setStudentDialog({ open: true, stop });

  const handleToggleStudent = (studentId, newStatus) => {
    setStudentDialog(prev => {
      const updatedStudents = prev.stop.students.map(s => {
        if (s.id === studentId) {
          if (newStatus === 'boarded') {
            const now = new Date();
            const timeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
            return { ...s, status: 'boarded', boardedAt: timeString };
          } else if (newStatus === 'absent') {
            return { ...s, status: 'absent', boardedAt: null };
          } else {
            return { ...s, status: 'waiting', boardedAt: null };
          }
        }
        return s;
      });

      setStops(prevStops => prevStops.map(s =>
        s.id === prev.stop.id ? { ...s, students: updatedStudents } : s
      ));

      return { ...prev, stop: { ...prev.stop, students: updatedStudents } };
    });
  };

  const handleRefresh = () => {
    setSnackbar({ open: true, message: 'Đang làm mới...', severity: 'info' });
    fetchStops();
  };

  const completedCount = stops.filter(s => s.status === 'completed').length;
  const totalCount = stops.length;

  const currentStop = stops.find(s => s.status === 'current');
  const routeCoords = currentStop ? [[currentLocation.lat, currentLocation.lng], [currentStop.coordinates.lat, currentStop.coordinates.lng]] : [];

  const getMarkerIcon = (status) => {
    const color = status === 'completed' ? '#27ae60' :
                  status === 'current' ? '#f39c12' :
                  status === 'skipped' ? '#e74c3c' : '#667eea';
    return L.divIcon({
      html: `<div style="background:${color};width:14px;height:14px;border-radius:50%;border:3px solid white;box-shadow:0 0 4px rgba(0,0,0,0.3);"></div>`,
      iconSize: [20, 20],
      className: 'custom-marker',
    });
  };

  return (
    <Box sx={{ bgcolor: '#f8f9fa', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="xl">
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#2c3e50', mb: 1 }}>
                Điểm đón/trả
              </Typography>
              <Typography variant="body1" color="textSecondary">
                Theo dõi và quản lý các điểm dừng trên tuyến đường
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button startIcon={<Refresh />} onClick={handleRefresh} variant="outlined" sx={{ textTransform: 'none' }}>
                Làm mới
              </Button>
              <ToggleButtonGroup value={viewMode} exclusive onChange={(e, v) => v && setViewMode(v)} size="small">
                <ToggleButton value="list"><ListIcon /></ToggleButton>
                <ToggleButton value="map"><MapIcon /></ToggleButton>
              </ToggleButtonGroup>
            </Box>
          </Box>
        </Box>

        {/* Progress */}
        <Paper sx={{ p: 3, mb: 3, borderRadius: 2, boxShadow: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#2c3e50', mb: 0.5 }}>
                Tiến độ chuyến đi
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Đã hoàn thành {completedCount}/{totalCount} điểm dừng
              </Typography>
            </Box>
            <Typography variant="h3" sx={{ fontWeight: 700, color: '#27ae60' }}>
              {((completedCount / totalCount) * 100).toFixed(0)}%
            </Typography>
          </Box>
        </Paper>

        {/* Main Content */}
        <Grid container spacing={3}>
          {viewMode === 'list' && (
            <Grid item xs={12} md={6}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#2c3e50' }}>
                Danh sách điểm dừng
              </Typography>
              {stops.map(stop => (
                <StopMarkerCard
                  key={stop.id}
                  stop={stop}
                  onNavigate={handleNavigate}
                  onComplete={handleComplete}
                  onSkip={handleSkip}
                  onViewStudents={handleViewStudents}
                />
              ))}
            </Grid>
          )}

          {/* Map - Luôn hiển thị, chiếm toàn bộ nếu viewMode = map */}
          <Grid item xs={12} md={viewMode === 'list' ? 6 : 12}>
  <Paper
    sx={{
      height: viewMode === 'list' 
        ? 'calc(100vh - 220px)'  // 70px header + 3*16px padding + margin
        : 'calc(100vh - 170px)',
      borderRadius: 2,
      overflow: 'hidden',
      position: 'relative',
      width: '100%', // Đảm bảo full width
    }}
  >
    <MapContainer
      center={[currentLocation.lat, currentLocation.lng]}
      zoom={13}
      style={{ height: '100%', width: '100%' }}
      ref={mapRef}
    >
      {/* ... các Marker, Polyline, TileLayer */}
    </MapContainer>

    {/* Nút Vị trí của tôi */}
    <Button
      variant="contained"
      startIcon={<MyLocation />}
      onClick={() => mapRef.current?.setView([currentLocation.lat, currentLocation.lng], 15)}
      sx={{
        position: 'absolute',
        bottom: 20,
        right: 20,
        bgcolor: '#fff',
        color: '#667eea',
        boxShadow: 3,
        '&:hover': { bgcolor: '#f5f5f5' },
        textTransform: 'none',
        fontWeight: 600,
      }}
    >
      Vị trí của tôi
    </Button>
  </Paper>
</Grid>
        </Grid>

        {/* Snackbar, Skip Dialog, Student Dialog */}
        <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
          <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity}>{snackbar.message}</Alert>
        </Snackbar>

        <Dialog open={skipDialog.open} onClose={() => setSkipDialog({ open: false, stop: null, reason: '' })} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ fontWeight: 600 }}>Bỏ qua điểm dừng</DialogTitle>
          <DialogContent>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>Bạn có chắc muốn bỏ qua điểm dừng này?</Typography>
            <TextField fullWidth multiline rows={3} label="Lý do bỏ qua" value={skipDialog.reason} onChange={e => setSkipDialog({ ...skipDialog, reason: e.target.value })} />
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setSkipDialog({ open: false, stop: null, reason: '' })} sx={{ textTransform: 'none' }}>Hủy</Button>
            <Button onClick={confirmSkip} variant="contained" sx={{ textTransform: 'none', bgcolor: '#f39c12', '&:hover': { bgcolor: '#e67e22' } }}>Xác nhận</Button>
          </DialogActions>
        </Dialog>

        <StudentPickupDetail
          open={studentDialog.open}
          onClose={() => setStudentDialog({ open: false, stop: null })}
          stop={studentDialog.stop}
          onToggleStudent={handleToggleStudent}
        />
      </Container>
    </Box>
  );
};

export default DriverPickupPointsPage
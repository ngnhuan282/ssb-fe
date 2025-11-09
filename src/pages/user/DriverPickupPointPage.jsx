// src/pages/user/DriverPickupPointsPage.jsx

import React, { useState, useEffect, useRef } from 'react';
import {
  Box, Container, Grid, Typography, Paper, Button, Snackbar, Alert,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, ToggleButtonGroup, ToggleButton
} from '@mui/material';
import { Map as MapIcon, List as ListIcon, Refresh } from '@mui/icons-material';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import StopMarkerCard from '../../components/user/pickup/StopMarkerCard';
import StudentPickupDetail from '../../components/user/pickup/StudentPickupDetail';
import { usePickupPoints } from '../../hooks/usePickupPoints';
import { useDriverSchedule } from '../../hooks/useDriverSchedule';

// Fix Leaflet icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const DriverPickupPointsPage = () => {
  const { todaySchedule, loading: scheduleLoading, error: scheduleError, refetch: refetchSchedule } = useDriverSchedule();
  const scheduleId = todaySchedule?._id;

  // LOG DEBUG
  console.log('DriverPage → scheduleId:', scheduleId);
  console.log('DriverPage → todaySchedule:', todaySchedule);

  // GỌI HOOK Ở ĐẦU, KHÔNG ĐIỀU KIỆN
  const {
    stops,
    currentLocation,
    loading: pointsLoading,
    error: pointsError,
    refetch,
    updateStopStatus,
    updateStudentStatus
  } = usePickupPoints(scheduleId); // ← GỌI TRỰC TIẾP

  const [viewMode, setViewMode] = useState('list');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [skipDialog, setSkipDialog] = useState({ open: false, stopIndex: null, reason: '' });
  const [studentDialog, setStudentDialog] = useState({ open: false, stop: null });
  const mapRef = useRef();

  const polylinePositions = stops?.map(stop => [stop.coordinates.lat, stop.coordinates.lng]) || [];

  // --- CÁC HÀM XỬ LÝ ---
  const handleNavigate = (stop) => {
    const url = `https://www.google.com/maps/dir/?api=1&origin=${currentLocation.lat},${currentLocation.lng}&destination=${stop.coordinates.lat},${stop.coordinates.lng}`;
    window.open(url, '_blank');
  };

  const handleComplete = async (stop) => {
    try {
      await updateStopStatus(stop.order - 1, 'completed');
      setSnackbar({ open: true, message: 'Điểm dừng hoàn thành', severity: 'success' });
      refetch();
    } catch (err) {
      setSnackbar({ open: true, message: 'Lỗi hoàn thành điểm dừng', severity: 'error' });
    }
  };

  const handleSkip = (stop) => {
    setSkipDialog({ open: true, stopIndex: stop.order - 1, reason: '' });
  };

  const confirmSkip = async () => {
    try {
      await updateStopStatus(skipDialog.stopIndex, 'skipped', skipDialog.reason);
      setSnackbar({ open: true, message: 'Đã bỏ qua điểm dừng', severity: 'info' });
      setSkipDialog({ open: false, stopIndex: null, reason: '' });
      refetch();
    } catch (err) {
      setSnackbar({ open: true, message: 'Lỗi bỏ qua điểm dừng', severity: 'error' });
    }
  };

  const handleToggleStudent = async (studentId, status) => {
    try {
      await updateStudentStatus(studentDialog.stop.order - 1, studentId, status);
      setSnackbar({ open: true, message: 'Cập nhật trạng thái học sinh thành công', severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: 'Lỗi cập nhật trạng thái', severity: 'error' });
    }
  };

  const handleViewStudents = (stop) => {
    setStudentDialog({ open: true, stop });
  };

  // --- RENDER THEO TRẠNG THÁI ---
  if (scheduleLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography variant="h6">Đang tải lịch trình...</Typography>
      </Box>
    );
  }

  if (scheduleError) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">Lỗi: {scheduleError}</Typography>
        <Button onClick={refetchSchedule} sx={{ mt: 2 }}>Thử lại</Button>
      </Box>
    );
  }

  if (!todaySchedule) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="textSecondary">
          Không có lịch trình hôm nay.
        </Typography>
        <Button variant="outlined" onClick={refetchSchedule} sx={{ mt: 2 }}>
          Làm mới
        </Button>
      </Box>
    );
  }

  if (pointsLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography variant="h6">Đang tải điểm dừng...</Typography>
      </Box>
    );
  }

  if (pointsError) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">Lỗi điểm dừng: {pointsError}</Typography>
        <Button onClick={refetch} sx={{ mt: 2 }}>Thử lại</Button>
      </Box>
    );
  }

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
              <Button startIcon={<Refresh />} onClick={refetch} sx={{ textTransform: 'none' }}>
                Làm mới
              </Button>
            </Paper>

            <Box sx={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
              {(!stops || stops.length === 0) ? (
                <Typography color="textSecondary" sx={{ p: 3, textAlign: 'center' }}>
                  Không có điểm dừng nào.
                </Typography>
              ) : (
                stops.map((stop) => (
                  <StopMarkerCard
                    key={stop.id}
                    stop={stop}
                    onNavigate={() => handleNavigate(stop)}
                    onComplete={() => handleComplete(stop)}
                    onSkip={() => handleSkip(stop)}
                    onViewStudents={() => handleViewStudents(stop)}
                  />
                ))
              )}
            </Box>
          </Grid>

          {viewMode === 'map' && stops && stops.length > 0 && (
            <Grid item xs={12} md={8}>
              <Paper sx={{ height: 'calc(100vh - 200px)', borderRadius: 2, overflow: 'hidden' }}>
                <MapContainer center={[currentLocation.lat, currentLocation.lng]} zoom={13} style={{ height: '100%', width: '100%' }} ref={mapRef}>
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <Marker position={[currentLocation.lat, currentLocation.lng]} icon={L.icon({ iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png', shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png', iconSize: [25, 41], iconAnchor: [12, 41] })}>
                    <Popup>Vị trí xe (mẫu)</Popup>
                  </Marker>
                  {stops.map(stop => (
                    <Marker key={stop.id} position={[stop.coordinates.lat, stop.coordinates.lng]} icon={L.icon({ iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${stop.status === 'completed' ? 'green' : stop.status === 'current' ? 'orange' : 'grey'}.png`, shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png', iconSize: [25, 41], iconAnchor: [12, 41] })}>
                      <Popup>
                        <Typography variant="subtitle2">{stop.name}</Typography>
                        <Typography variant="body2">{stop.address}</Typography>
                        <Typography variant="caption">Học sinh: {stop.students?.length || 0}</Typography>
                      </Popup>
                    </Marker>
                  ))}
                  <Polyline positions={polylinePositions} color="blue" />
                </MapContainer>
              </Paper>
            </Grid>
          )}
        </Grid>

        {/* Snackbar & Dialogs */}
        <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
          <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity}>{snackbar.message}</Alert>
        </Snackbar>

        <Dialog open={skipDialog.open} onClose={() => setSkipDialog({ open: false, stopIndex: null, reason: '' })} maxWidth="sm" fullWidth>
          <DialogTitle>Bỏ qua điểm dừng</DialogTitle>
          <DialogContent>
            <Typography variant="body2" sx={{ mb: 2 }}>Bạn có chắc muốn bỏ qua điểm dừng này?</Typography>
            <TextField fullWidth multiline rows={3} label="Lý do" value={skipDialog.reason} onChange={e => setSkipDialog({ ...skipDialog, reason: e.target.value })} />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setSkipDialog({ open: false, stopIndex: null, reason: '' })}>Hủy</Button>
            <Button onClick={confirmSkip} variant="contained" color="warning">Xác nhận</Button>
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

export default DriverPickupPointsPage;
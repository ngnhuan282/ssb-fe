// src/pages/user/DriverPickupPoints.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Paper,
  Button,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';
import {
  Map as MapIcon,
  List as ListIcon,
  MyLocation,
  Refresh,
} from '@mui/icons-material';
import StopMarkerCard from '../../components/user/driver/StopMarkerCard';

const DriverPickupPointsPage = () => {
  const [stops, setStops] = useState([]);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'map'
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [skipDialog, setSkipDialog] = useState({ open: false, stop: null, reason: '' });
  const [currentLocation, setCurrentLocation] = useState({ lat: 10.762622, lng: 106.660172 });

  useEffect(() => {
    fetchStops();
    // Giả lập cập nhật vị trí thời gian thực
    const interval = setInterval(() => {
      updateCurrentLocation();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchStops = () => {
    // Mock data
    const mockStops = [
      {
        id: 1,
        order: 1,
        name: 'Xuất phát',
        address: 'Bến xe Miền Đông, Quận Bình Thạnh',
        time: '06:00',
        students: 0,
        status: 'completed',
        completedAt: '06:02',
        coordinates: { lat: 10.8142, lng: 106.7120 },
      },
      {
        id: 2,
        order: 2,
        name: 'Điểm đón 1',
        address: '123 Nguyễn Huệ, Quận 1, TP.HCM',
        time: '06:15',
        students: 3,
        status: 'completed',
        completedAt: '06:18',
        coordinates: { lat: 10.7744, lng: 106.7010 },
      },
      {
        id: 3,
        order: 3,
        name: 'Điểm đón 2',
        address: '456 Lê Lợi, Quận 1, TP.HCM',
        time: '06:30',
        students: 5,
        status: 'current',
        distance: '2.5km',
        estimatedTime: '8 phút',
        coordinates: { lat: 10.7769, lng: 106.7009 },
      },
      {
        id: 4,
        order: 4,
        name: 'Điểm đón 3',
        address: '789 Trần Hưng Đạo, Quận 5, TP.HCM',
        time: '06:45',
        students: 4,
        status: 'pending',
        distance: '5km',
        estimatedTime: '15 phút',
        coordinates: { lat: 10.7555, lng: 106.6799 },
      },
      {
        id: 5,
        order: 5,
        name: 'Trường DEF',
        address: 'Số 1 Võ Văn Ngân, Thủ Đức, TP.HCM',
        time: '07:45',
        students: 0,
        status: 'pending',
        distance: '12km',
        estimatedTime: '35 phút',
        coordinates: { lat: 10.8505, lng: 106.7719 },
      },
    ];
    setStops(mockStops);
  };

  const updateCurrentLocation = () => {
    // Giả lập cập nhật vị trí (trong thực tế sẽ dùng GPS)
    setCurrentLocation(prev => ({
      lat: prev.lat + (Math.random() - 0.5) * 0.001,
      lng: prev.lng + (Math.random() - 0.5) * 0.001,
    }));
  };

  const handleNavigate = (stop) => {
    const { lat, lng } = stop.coordinates;
    // Mở Google Maps
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank');
    
    setSnackbar({
      open: true,
      message: `🗺️ Đang dẫn đường đến ${stop.name}`,
      severity: 'info'
    });
  };

  const handleComplete = (stop) => {
    const now = new Date();
    const timeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    setStops(prevStops => {
      const updatedStops = prevStops.map(s => {
        if (s.id === stop.id) {
          return { ...s, status: 'completed', completedAt: timeString };
        }
        // Đánh dấu điểm tiếp theo là current
        if (s.order === stop.order + 1) {
          return { ...s, status: 'current' };
        }
        return s;
      });
      return updatedStops;
    });

    setSnackbar({
      open: true,
      message: `✅ Đã hoàn thành ${stop.name}`,
      severity: 'success'
    });
  };

  const handleSkip = (stop) => {
    setSkipDialog({ open: true, stop, reason: '' });
  };

  const confirmSkip = () => {
    const stop = skipDialog.stop;
    
    setStops(prevStops => {
      const updatedStops = prevStops.map(s => {
        if (s.id === stop.id) {
          return { ...s, status: 'skipped' };
        }
        // Đánh dấu điểm tiếp theo là current
        if (s.order === stop.order + 1) {
          return { ...s, status: 'current' };
        }
        return s;
      });
      return updatedStops;
    });

    setSnackbar({
      open: true,
      message: `⏭️ Đã bỏ qua ${stop.name}`,
      severity: 'warning'
    });

    setSkipDialog({ open: false, stop: null, reason: '' });
  };

  const handleRefresh = () => {
    setSnackbar({
      open: true,
      message: '🔄 Đang làm mới danh sách...',
      severity: 'info'
    });
    fetchStops();
  };

  const completedCount = stops.filter(s => s.status === 'completed').length;
  const totalCount = stops.length;

  return (
    <Box sx={{ bgcolor: '#f8f9fa', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="xl">
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#2c3e50', mb: 1 }}>
                🚏 Điểm đón/trả
              </Typography>
              <Typography variant="body1" color="textSecondary">
                Theo dõi và quản lý các điểm dừng trên tuyến đường
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                startIcon={<Refresh />}
                onClick={handleRefresh}
                variant="outlined"
                sx={{ textTransform: 'none' }}
              >
                Làm mới
              </Button>
              <ToggleButtonGroup
                value={viewMode}
                exclusive
                onChange={(e, newMode) => newMode && setViewMode(newMode)}
                size="small"
              >
                <ToggleButton value="list">
                  <ListIcon />
                </ToggleButton>
                <ToggleButton value="map">
                  <MapIcon />
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>
          </Box>
        </Box>

        {/* Progress Summary */}
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
            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="h3" sx={{ fontWeight: 700, color: '#27ae60' }}>
                {((completedCount / totalCount) * 100).toFixed(0)}%
              </Typography>
            </Box>
          </Box>
        </Paper>

        {/* Main Content */}
        <Grid container spacing={3}>
          {/* List View */}
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
                />
              ))}
            </Grid>
          )}

          {/* Map View */}
          <Grid item xs={12} md={viewMode === 'list' ? 6 : 12}>
            <Paper
              sx={{
                height: viewMode === 'list' ? 'calc(100vh - 300px)' : 'calc(100vh - 250px)',
                borderRadius: 2,
                overflow: 'hidden',
                position: 'relative',
              }}
            >
              {/* Map Placeholder */}
              <Box
                sx={{
                  width: '100%',
                  height: '100%',
                  bgcolor: '#e8eaf6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                  gap: 2,
                }}
              >
                <MapIcon sx={{ fontSize: 80, color: '#667eea' }} />
                <Typography variant="h6" color="textSecondary">
                  Bản đồ sẽ hiển thị ở đây
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Tích hợp Google Maps API để hiển thị vị trí thực tế
                </Typography>
                
                {/* Mock markers info */}
                <Box sx={{ mt: 2, textAlign: 'center' }}>
                  <Typography variant="caption" color="textSecondary">
                    🔴 Vị trí hiện tại • 🟢 Đã hoàn thành • 🟡 Đang đến • ⚪ Chưa đến
                  </Typography>
                </Box>
              </Box>

              {/* Current Location Button */}
              <Button
                variant="contained"
                startIcon={<MyLocation />}
                sx={{
                  position: 'absolute',
                  bottom: 20,
                  right: 20,
                  bgcolor: '#fff',
                  color: '#667eea',
                  boxShadow: 3,
                  '&:hover': {
                    bgcolor: '#f5f5f5',
                  },
                  textTransform: 'none',
                  fontWeight: 600,
                }}
                onClick={() => {
                  setSnackbar({
                    open: true,
                    message: '📍 Đang cập nhật vị trí của bạn...',
                    severity: 'info'
                  });
                }}
              >
                Vị trí của tôi
              </Button>
            </Paper>
          </Grid>
        </Grid>

        {/* Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert 
            onClose={() => setSnackbar({ ...snackbar, open: false })} 
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>

        {/* Skip Dialog */}
        <Dialog 
          open={skipDialog.open} 
          onClose={() => setSkipDialog({ open: false, stop: null, reason: '' })}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle sx={{ fontWeight: 600 }}>
            ⏭️ Bỏ qua điểm dừng
          </DialogTitle>
          <DialogContent>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
              Bạn có chắc muốn bỏ qua điểm dừng này?
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Lý do bỏ qua"
              placeholder="Nhập lý do (tùy chọn)..."
              value={skipDialog.reason}
              onChange={(e) => setSkipDialog({ ...skipDialog, reason: e.target.value })}
            />
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button 
              onClick={() => setSkipDialog({ open: false, stop: null, reason: '' })}
              sx={{ textTransform: 'none' }}
            >
              Hủy
            </Button>
            <Button 
              onClick={confirmSkip}
              variant="contained"
              sx={{ 
                textTransform: 'none',
                bgcolor: '#f39c12',
                '&:hover': { bgcolor: '#e67e22' }
              }}
            >
              Xác nhận bỏ qua
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default DriverPickupPointsPage;
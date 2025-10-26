// src/pages/user/DriverTripReport.jsx
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
  Card,
  CardContent,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  Divider,
} from '@mui/material';
import {
  Assessment,
  CheckCircle,
  Schedule,
  DirectionsBus,
  Save,
  Download,
  History,
} from '@mui/icons-material';
import TripReportCard from '../../components/user/driver/TripReportCard';

const DriverTripReportPage = () => {
  const [currentTrip, setCurrentTrip] = useState(null);
  const [tripHistory, setTripHistory] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [endTripDialog, setEndTripDialog] = useState(false);
  const [tripReport, setTripReport] = useState({
    totalKm: '',
    fuelUsed: '',
    notes: '',
  });

  useEffect(() => {
    fetchCurrentTrip();
    fetchTripHistory();
  }, []);

  const fetchCurrentTrip = () => {
    // Mock current trip data
    const mockCurrentTrip = {
      id: 1,
      date: '27/10/2025',
      shift: 'morning',
      routeName: 'Tuyến A1 - Quận 1 → Trường DEF',
      busNumber: '51A-12345',
      startTime: '06:00',
      endTime: '08:00',
      status: 'in_progress',
      totalStudents: 12,
      studentsPickedUp: 8,
      studentsAbsent: 2,
      totalStops: 5,
      stopsCompleted: 3,
      distance: '15.5 km',
      delayed: true,
      delayMinutes: 10,
    };
    setCurrentTrip(mockCurrentTrip);
  };

  const fetchTripHistory = () => {
    // Mock trip history
    const mockHistory = [
      {
        id: 2,
        date: '26/10/2025',
        shift: 'afternoon',
        routeName: 'Tuyến A1 - Quận 1 → Trường DEF',
        busNumber: '51A-12345',
        startTime: '15:00',
        endTime: '17:00',
        status: 'completed',
        totalStudents: 12,
        studentsPickedUp: 12,
        studentsAbsent: 0,
        totalStops: 5,
        stopsCompleted: 5,
        distance: '15.2 km',
        delayed: false,
      },
      {
        id: 3,
        date: '26/10/2025',
        shift: 'morning',
        routeName: 'Tuyến A1 - Quận 1 → Trường DEF',
        busNumber: '51A-12345',
        startTime: '06:00',
        endTime: '08:00',
        status: 'completed',
        totalStudents: 12,
        studentsPickedUp: 11,
        studentsAbsent: 1,
        totalStops: 5,
        stopsCompleted: 5,
        distance: '15.8 km',
        delayed: true,
        delayMinutes: 5,
      },
      {
        id: 4,
        date: '25/10/2025',
        shift: 'afternoon',
        routeName: 'Tuyến A1 - Quận 1 → Trường DEF',
        busNumber: '51A-12345',
        startTime: '15:00',
        endTime: '17:00',
        status: 'completed',
        totalStudents: 12,
        studentsPickedUp: 12,
        studentsAbsent: 0,
        totalStops: 5,
        stopsCompleted: 5,
        distance: '14.9 km',
        delayed: false,
      },
    ];
    setTripHistory(mockHistory);
  };

  const handleEndTrip = () => {
    setEndTripDialog(true);
  };

  const confirmEndTrip = () => {
    console.log('End trip with report:', tripReport);
    
    setSnackbar({
      open: true,
      message: '✅ Đã kết thúc chuyến đi và lưu báo cáo',
      severity: 'success'
    });

    // Update current trip to completed
    setCurrentTrip(prev => ({ ...prev, status: 'completed' }));
    setEndTripDialog(false);
    setTripReport({ totalKm: '', fuelUsed: '', notes: '' });
  };

  const handleExportReport = () => {
    setSnackbar({
      open: true,
      message: '📄 Đang xuất báo cáo...',
      severity: 'info'
    });
    // TODO: Implement PDF export
  };

  return (
    <Box sx={{ bgcolor: '#f8f9fa', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="xl">
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#2c3e50', mb: 1 }}>
                📊 Báo cáo đón/trả học sinh
              </Typography>
              <Typography variant="body1" color="textSecondary">
                Theo dõi và quản lý báo cáo chuyến đi
              </Typography>
            </Box>
            <Button
              startIcon={<Download />}
              onClick={handleExportReport}
              variant="outlined"
              sx={{ textTransform: 'none', fontWeight: 600 }}
            >
              Xuất báo cáo
            </Button>
          </Box>
        </Box>

        {/* Tabs */}
        <Paper sx={{ mb: 3, borderRadius: 2 }}>
          <Tabs
            value={activeTab}
            onChange={(e, newValue) => setActiveTab(newValue)}
            sx={{
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 600,
                fontSize: 16,
              },
              '& .Mui-selected': {
                color: '#667eea',
              },
              '& .MuiTabs-indicator': {
                backgroundColor: '#667eea',
                height: 3,
              },
            }}
          >
            <Tab icon={<Schedule />} iconPosition="start" label="Chuyến hiện tại" />
            <Tab icon={<History />} iconPosition="start" label="Lịch sử chuyến đi" />
          </Tabs>
        </Paper>

        {/* Current Trip Tab */}
        {activeTab === 0 && (
          <Grid container spacing={3}>
            {/* Left Column - Trip Info */}
            <Grid item xs={12} lg={8}>
              {currentTrip ? (
                <>
                  <TripReportCard trip={currentTrip} />
                  
                  {/* Timeline Summary */}
                  <Card sx={{ boxShadow: 3, borderRadius: 2, mb: 3 }}>
                    <CardContent>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#2c3e50' }}>
                        📍 Timeline chuyến đi
                      </Typography>
                      
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Box sx={{ 
                            width: 40, 
                            height: 40, 
                            borderRadius: '50%', 
                            bgcolor: '#27ae60',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#fff',
                          }}>
                            <CheckCircle />
                          </Box>
                          <Box>
                            <Typography variant="body1" sx={{ fontWeight: 600 }}>
                              06:02 - Xuất phát
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                              Bến xe Miền Đông
                            </Typography>
                          </Box>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Box sx={{ 
                            width: 40, 
                            height: 40, 
                            borderRadius: '50%', 
                            bgcolor: '#27ae60',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#fff',
                          }}>
                            <CheckCircle />
                          </Box>
                          <Box>
                            <Typography variant="body1" sx={{ fontWeight: 600 }}>
                              06:18 - Điểm đón 1
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                              123 Nguyễn Huệ, Q1 (3 học sinh)
                            </Typography>
                          </Box>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Box sx={{ 
                            width: 40, 
                            height: 40, 
                            borderRadius: '50%', 
                            bgcolor: '#27ae60',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#fff',
                          }}>
                            <CheckCircle />
                          </Box>
                          <Box>
                            <Typography variant="body1" sx={{ fontWeight: 600 }}>
                              06:35 - Điểm đón 2
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                              456 Lê Lợi, Q1 (5 học sinh)
                            </Typography>
                          </Box>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Box sx={{ 
                            width: 40, 
                            height: 40, 
                            borderRadius: '50%', 
                            bgcolor: '#f39c12',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#fff',
                          }}>
                            <Schedule />
                          </Box>
                          <Box>
                            <Typography variant="body1" sx={{ fontWeight: 600 }}>
                              Đang đến - Điểm đón 3
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                              789 Trần Hưng Đạo, Q5 (4 học sinh)
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </>
              ) : (
                <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 2 }}>
                  <DirectionsBus sx={{ fontSize: 60, color: '#bdc3c7', mb: 2 }} />
                  <Typography variant="h6" color="textSecondary">
                    Không có chuyến đi nào đang diễn ra
                  </Typography>
                </Paper>
              )}
            </Grid>

            {/* Right Column - Quick Stats */}
            <Grid item xs={12} lg={4}>
              <Card sx={{ boxShadow: 3, borderRadius: 2, mb: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: '#fff' }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                    📈 Thống kê nhanh
                  </Typography>
                  
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box>
                      <Typography variant="h3" sx={{ fontWeight: 700 }}>
                        {currentTrip?.studentsPickedUp || 0}
                      </Typography>
                      <Typography variant="body2">
                        Học sinh đã đón
                      </Typography>
                    </Box>

                    <Divider sx={{ bgcolor: 'rgba(255,255,255,0.3)' }} />

                    <Box>
                      <Typography variant="h3" sx={{ fontWeight: 700 }}>
                        {currentTrip?.stopsCompleted || 0}
                      </Typography>
                      <Typography variant="body2">
                        Điểm dừng hoàn thành
                      </Typography>
                    </Box>

                    <Divider sx={{ bgcolor: 'rgba(255,255,255,0.3)' }} />

                    <Box>
                      <Typography variant="h3" sx={{ fontWeight: 700 }}>
                        {currentTrip?.distance || '0 km'}
                      </Typography>
                      <Typography variant="body2">
                        Quãng đường đã đi
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>

              {currentTrip?.status === 'in_progress' && (
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  startIcon={<Save />}
                  onClick={handleEndTrip}
                  sx={{
                    bgcolor: '#e74c3c',
                    fontWeight: 600,
                    py: 1.5,
                    textTransform: 'none',
                    fontSize: 16,
                    '&:hover': {
                      bgcolor: '#c0392b',
                    },
                  }}
                >
                  Kết thúc chuyến đi
                </Button>
              )}
            </Grid>
          </Grid>
        )}

        {/* History Tab */}
        {activeTab === 1 && (
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#2c3e50' }}>
              Lịch sử chuyến đi
            </Typography>
            {tripHistory.map(trip => (
              <TripReportCard key={trip.id} trip={trip} />
            ))}
          </Box>
        )}

        {/* End Trip Dialog */}
        <Dialog
          open={endTripDialog}
          onClose={() => setEndTripDialog(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle sx={{ fontWeight: 600 }}>
            🏁 Kết thúc chuyến đi
          </DialogTitle>
          <DialogContent>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
              Vui lòng điền thông tin báo cáo trước khi kết thúc chuyến đi
            </Typography>

            <TextField
              fullWidth
              label="Tổng số km đã đi"
              type="number"
              value={tripReport.totalKm}
              onChange={(e) => setTripReport({ ...tripReport, totalKm: e.target.value })}
              sx={{ mb: 2 }}
              InputProps={{
                endAdornment: <Typography variant="body2" color="textSecondary">km</Typography>
              }}
            />

            <TextField
              fullWidth
              label="Nhiên liệu tiêu thụ"
              type="number"
              value={tripReport.fuelUsed}
              onChange={(e) => setTripReport({ ...tripReport, fuelUsed: e.target.value })}
              sx={{ mb: 2 }}
              InputProps={{
                endAdornment: <Typography variant="body2" color="textSecondary">lít</Typography>
              }}
            />

            <TextField
              fullWidth
              multiline
              rows={4}
              label="Ghi chú"
              placeholder="Nhập ghi chú về chuyến đi (nếu có)..."
              value={tripReport.notes}
              onChange={(e) => setTripReport({ ...tripReport, notes: e.target.value })}
            />
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button
              onClick={() => setEndTripDialog(false)}
              sx={{ textTransform: 'none' }}
            >
              Hủy
            </Button>
            <Button
              onClick={confirmEndTrip}
              variant="contained"
              sx={{
                textTransform: 'none',
                bgcolor: '#27ae60',
                '&:hover': { bgcolor: '#229954' }
              }}
            >
              Xác nhận kết thúc
            </Button>
          </DialogActions>
        </Dialog>

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
      </Container>
    </Box>
  );
};

export default DriverTripReportPage;
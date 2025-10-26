// src/pages/user/DriverIncidentReport.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Snackbar,
  Alert,
  Tabs,
  Tab,
  Paper,
} from '@mui/material';
import {
  Report,
  History,
} from '@mui/icons-material';
import IncidentReportForm from '../../components/user/driver/IncidentReportForm';
import IncidentHistoryCard from '../../components/user/driver/IncidentHistoryCard';

const DriverIncidentReportPage = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [incidents, setIncidents] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    fetchIncidentHistory();
  }, []);

  const fetchIncidentHistory = () => {
    // Mock incident history
    const mockIncidents = [
      {
        id: 1,
        type: 'traffic',
        title: 'Kẹt xe trên đường Nguyễn Trãi',
        description: 'Kẹt xe nghiêm trọng do tai nạn giao thông, dự kiến trễ 15 phút',
        severity: 'medium',
        status: 'resolved',
        location: 'Nguyễn Trãi, Quận 5',
        reportedAt: '27/10/2025 06:25',
        resolvedAt: '27/10/2025 06:45',
        resolution: 'Đã chọn đường tránh, hoàn thành chuyến đi',
      },
      {
        id: 2,
        type: 'medical',
        title: 'Học sinh bị say xe',
        description: 'Học sinh Nguyễn Văn A bị say xe, cần dừng xe nghỉ',
        severity: 'low',
        status: 'resolved',
        location: '123 Lê Lợi, Quận 1',
        reportedAt: '26/10/2025 06:35',
        resolvedAt: '26/10/2025 06:40',
        resolution: 'Học sinh đã ổn, tiếp tục hành trình',
      },
      {
        id: 3,
        type: 'breakdown',
        title: 'Xe bị lốp xẹp',
        description: 'Lốp sau bên phải bị xì hơi, cần thay lốp dự phòng',
        severity: 'high',
        status: 'resolved',
        location: 'Đinh Tiên Hoàng, Quận 1',
        reportedAt: '25/10/2025 15:15',
        resolvedAt: '25/10/2025 15:45',
        resolution: 'Đã thay lốp dự phòng, xe hoạt động bình thường',
      },
      {
        id: 4,
        type: 'emergency',
        title: 'Học sinh quên đồ quan trọng',
        description: 'Phụ huynh yêu cầu quay lại điểm đón để lấy thuốc của học sinh',
        severity: 'medium',
        status: 'resolved',
        location: '456 Nguyễn Huệ, Quận 1',
        reportedAt: '24/10/2025 06:20',
        resolvedAt: '24/10/2025 06:35',
        resolution: 'Đã quay lại và lấy thuốc cho học sinh',
      },
    ];
    setIncidents(mockIncidents);
  };

  const handleSubmitIncident = (incidentData) => {
    console.log('Submitting incident:', incidentData);
    
    // Create new incident
    const newIncident = {
      id: incidents.length + 1,
      type: incidentData.type,
      title: getIncidentTitle(incidentData.type),
      description: incidentData.description,
      severity: incidentData.severity,
      status: 'pending',
      location: incidentData.location,
      reportedAt: new Date().toLocaleString('vi-VN'),
    };

    setIncidents([newIncident, ...incidents]);
    
    setSnackbar({
      open: true,
      message: '🚨 Đã gửi báo cáo sự cố đến quản lý!',
      severity: 'success'
    });

    // Switch to history tab
    setActiveTab(1);
  };

  const getIncidentTitle = (type) => {
    const titles = {
      breakdown: 'Xe hỏng',
      traffic: 'Kẹt xe',
      fuel: 'Hết xăng',
      medical: 'Sự cố y tế',
      emergency: 'Tình huống khẩn cấp',
      other: 'Sự cố khác',
    };
    return titles[type] || 'Sự cố';
  };

  const pendingCount = incidents.filter(i => i.status === 'pending').length;
  const resolvedCount = incidents.filter(i => i.status === 'resolved').length;

  return (
    <Box sx={{ bgcolor: '#f8f9fa', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#2c3e50', mb: 1 }}>
            ⚠️ Báo cáo sự cố
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Gửi cảnh báo và theo dõi lịch sử sự cố
          </Typography>
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
            <Tab icon={<Report />} iconPosition="start" label="Báo cáo mới" />
            <Tab 
              icon={<History />} 
              iconPosition="start" 
              label={`Lịch sử (${incidents.length})`}
            />
          </Tabs>
        </Paper>

        {/* New Report Tab */}
        {activeTab === 0 && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <IncidentReportForm onSubmit={handleSubmitIncident} />
            </Grid>

            {/* Guidelines */}
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 3, bgcolor: '#e8f5e9' }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#2e7d32' }}>
                  📋 Hướng dẫn báo cáo
                </Typography>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#2c3e50', mb: 0.5 }}>
                      1. Chọn loại sự cố
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      Chọn đúng loại sự cố để hệ thống xử lý phù hợp
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#2c3e50', mb: 0.5 }}>
                      2. Đánh giá mức độ
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      🟢 Nhẹ: Không ảnh hưởng nhiều<br/>
                      🟡 Trung bình: Có thể trễ giờ<br/>
                      🔴 Khẩn cấp: Cần xử lý ngay
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#2c3e50', mb: 0.5 }}>
                      3. Mô tả chi tiết
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      Cung cấp thông tin đầy đủ để quản lý xử lý nhanh chóng
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#2c3e50', mb: 0.5 }}>
                      4. Đính kèm ảnh
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      Ảnh giúp quản lý hiểu rõ tình huống hơn
                    </Typography>
                  </Box>
                </Box>
              </Paper>

              {/* Emergency Contact */}
              <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 3, mt: 2, bgcolor: '#ffebee' }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#c62828' }}>
                  📞 Liên hệ khẩn cấp
                </Typography>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#2c3e50' }}>
                      Quản lý xe buýt
                    </Typography>
                    <Typography variant="body2" color="primary" sx={{ fontWeight: 600 }}>
                      0901 234 567
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#2c3e50' }}>
                      Cấp cứu 115
                    </Typography>
                    <Typography variant="body2" color="error" sx={{ fontWeight: 600 }}>
                      115
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#2c3e50' }}>
                      Cảnh sát 113
                    </Typography>
                    <Typography variant="body2" color="error" sx={{ fontWeight: 600 }}>
                      113
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        )}

        {/* History Tab */}
        {activeTab === 1 && (
          <Box>
            {/* Stats */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={6}>
                <Paper sx={{ p: 3, borderRadius: 2, bgcolor: '#fff3cd' }}>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#856404' }}>
                    {pendingCount}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Đang xử lý
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Paper sx={{ p: 3, borderRadius: 2, bgcolor: '#d4edda' }}>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#155724' }}>
                    {resolvedCount}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Đã giải quyết
                  </Typography>
                </Paper>
              </Grid>
            </Grid>

            {/* Incident List */}
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#2c3e50' }}>
              Lịch sử báo cáo sự cố
            </Typography>
            {incidents.length === 0 ? (
              <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 2 }}>
                <Report sx={{ fontSize: 60, color: '#bdc3c7', mb: 2 }} />
                <Typography variant="h6" color="textSecondary">
                  Chưa có báo cáo sự cố nào
                </Typography>
              </Paper>
            ) : (
              incidents.map((incident) => (
                <IncidentHistoryCard key={incident.id} incident={incident} />
              ))
            )}
          </Box>
        )}

        {/* Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
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

export default DriverIncidentReportPage;
// src/pages/user/DriverStudentList.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  LinearProgress,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import {
  CheckCircle,
  Cancel,
  Refresh,
} from '@mui/icons-material';
import StudentListFilter from '../../components/user/driver/StudentListFilter';
import StudentCard from '../../components/user/driver/StudentCard';

const DriverStudentListPage = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [stats, setStats] = useState({ all: 0, pending: 0, pickedUp: 0, droppedOff: 0 });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [absentDialog, setAbsentDialog] = useState({ open: false, studentId: null, reason: '' });

  // Mock data - Thay bằng API call
  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = () => {
    // Mock student data
    const mockStudents = [
      {
        id: 1,
        name: 'Nguyễn Văn A',
        class: 'Lớp 5A',
        pickupPoint: '123 Nguyễn Huệ, Q1',
        fullAddress: '123 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP.HCM',
        pickupTime: '06:15',
        parentPhone: '0901234567',
        status: 'pending',
        notes: 'Học sinh dễ say xe, cần chú ý'
      },
      {
        id: 2,
        name: 'Trần Thị B',
        class: 'Lớp 5B',
        pickupPoint: '456 Lê Lợi, Q1',
        fullAddress: '456 Lê Lợi, Phường Bến Thành, Quận 1, TP.HCM',
        pickupTime: '06:30',
        parentPhone: '0907654321',
        status: 'picked_up',
      },
      {
        id: 3,
        name: 'Lê Văn C',
        class: 'Lớp 5A',
        pickupPoint: '789 Trần Hưng Đạo, Q5',
        fullAddress: '789 Trần Hưng Đạo, Phường 1, Quận 5, TP.HCM',
        pickupTime: '06:45',
        parentPhone: '0909876543',
        status: 'pending',
      },
      {
        id: 4,
        name: 'Phạm Thị D',
        class: 'Lớp 5C',
        pickupPoint: '321 Điện Biên Phủ, Q3',
        fullAddress: '321 Điện Biên Phủ, Phường Võ Thị Sáu, Quận 3, TP.HCM',
        pickupTime: '06:20',
        parentPhone: '0903456789',
        status: 'picked_up',
      },
      {
        id: 5,
        name: 'Hoàng Văn E',
        class: 'Lớp 5B',
        pickupPoint: '654 Hai Bà Trưng, Q1',
        fullAddress: '654 Hai Bà Trưng, Phường Tân Định, Quận 1, TP.HCM',
        pickupTime: '06:35',
        parentPhone: '0908765432',
        status: 'dropped_off',
      },
    ];
    
    setStudents(mockStudents);
    updateStats(mockStudents);
  };

  const updateStats = (studentList) => {
    setStats({
      all: studentList.length,
      pending: studentList.filter(s => s.status === 'pending').length,
      pickedUp: studentList.filter(s => s.status === 'picked_up').length,
      droppedOff: studentList.filter(s => s.status === 'dropped_off').length,
    });
  };

  // Filter students
  useEffect(() => {
    let filtered = [...students];

    // Filter by tab
    if (activeTab !== 'all') {
      filtered = filtered.filter(s => s.status === activeTab);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(s => 
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.class.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredStudents(filtered);
  }, [students, activeTab, searchTerm]);

  const handleCheckIn = (studentId, checked) => {
    setStudents(prevStudents => 
      prevStudents.map(student => 
        student.id === studentId 
          ? { ...student, status: checked ? 'picked_up' : 'pending' }
          : student
      )
    );
    
    const student = students.find(s => s.id === studentId);
    setSnackbar({
      open: true,
      message: checked 
        ? `✅ Đã đánh dấu đón ${student.name}`
        : `⏳ Đã bỏ đánh dấu ${student.name}`,
      severity: 'success'
    });

    updateStats(students);
  };

  const handleCallParent = (phoneNumber) => {
    console.log('Calling:', phoneNumber);
    // Mở ứng dụng gọi điện
    window.location.href = `tel:${phoneNumber}`;
  };

  const handleReportAbsent = (studentId) => {
    setAbsentDialog({ open: true, studentId, reason: '' });
  };

  const confirmAbsent = () => {
    const studentId = absentDialog.studentId;
    const student = students.find(s => s.id === studentId);
    
    setStudents(prevStudents => 
      prevStudents.map(s => 
        s.id === studentId 
          ? { ...s, status: 'absent' }
          : s
      )
    );

    setSnackbar({
      open: true,
      message: `📝 Đã báo vắng ${student.name}`,
      severity: 'warning'
    });

    setAbsentDialog({ open: false, studentId: null, reason: '' });
    updateStats(students);
  };

  const handleRefresh = () => {
    setSnackbar({
      open: true,
      message: '🔄 Đang làm mới danh sách...',
      severity: 'info'
    });
    fetchStudents();
  };

  const handleMarkAllPickedUp = () => {
    setStudents(prevStudents => 
      prevStudents.map(s => ({ ...s, status: 'picked_up' }))
    );
    setSnackbar({
      open: true,
      message: '✅ Đã đánh dấu tất cả học sinh đã đón',
      severity: 'success'
    });
    updateStats(students);
  };

  const progress = (stats.pickedUp / stats.all) * 100 || 0;

  return (
    <Box sx={{ bgcolor: '#f8f9fa', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#2c3e50', mb: 1 }}>
            👥 Danh sách học sinh cần đón
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Quản lý và cập nhật trạng thái học sinh
          </Typography>
        </Box>

        {/* Summary Card */}
        <Paper sx={{ p: 3, mb: 3, borderRadius: 2, boxShadow: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#2c3e50' }}>
              Tiến độ đón học sinh
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                size="small"
                startIcon={<Refresh />}
                onClick={handleRefresh}
                variant="outlined"
                sx={{ textTransform: 'none' }}
              >
                Làm mới
              </Button>
              <Button
                size="small"
                startIcon={<CheckCircle />}
                onClick={handleMarkAllPickedUp}
                variant="contained"
                sx={{ 
                  textTransform: 'none',
                  bgcolor: '#27ae60',
                  '&:hover': { bgcolor: '#229954' }
                }}
              >
                Đánh dấu tất cả
              </Button>
            </Box>
          </Box>

          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" color="textSecondary">
                Đã đón: {stats.pickedUp}/{stats.all} học sinh
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#27ae60' }}>
                {progress.toFixed(0)}%
              </Typography>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={progress}
              sx={{
                height: 8,
                borderRadius: 1,
                bgcolor: '#ecf0f1',
                '& .MuiLinearProgress-bar': {
                  bgcolor: '#27ae60',
                  borderRadius: 1,
                }
              }}
            />
          </Box>
        </Paper>

        {/* Filter */}
        <StudentListFilter
          searchTerm={searchTerm}
          onSearchChange={(e) => setSearchTerm(e.target.value)}
          activeTab={activeTab}
          onTabChange={(e, newValue) => setActiveTab(newValue)}
          stats={stats}
        />

        {/* Student List */}
        {filteredStudents.length === 0 ? (
          <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 2 }}>
            <Cancel sx={{ fontSize: 60, color: '#bdc3c7', mb: 2 }} />
            <Typography variant="h6" color="textSecondary">
              Không tìm thấy học sinh nào
            </Typography>
          </Paper>
        ) : (
          <Box>
            {filteredStudents.map((student) => (
              <StudentCard
                key={student.id}
                student={student}
                onCheckIn={handleCheckIn}
                onCallParent={handleCallParent}
                onReportAbsent={handleReportAbsent}
              />
            ))}
          </Box>
        )}

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

        {/* Absent Dialog */}
        <Dialog 
          open={absentDialog.open} 
          onClose={() => setAbsentDialog({ open: false, studentId: null, reason: '' })}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle sx={{ fontWeight: 600 }}>
            📝 Báo cáo học sinh vắng mặt
          </DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Lý do vắng mặt"
              placeholder="Nhập lý do học sinh vắng mặt..."
              value={absentDialog.reason}
              onChange={(e) => setAbsentDialog({ ...absentDialog, reason: e.target.value })}
              sx={{ mt: 2 }}
            />
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button 
              onClick={() => setAbsentDialog({ open: false, studentId: null, reason: '' })}
              sx={{ textTransform: 'none' }}
            >
              Hủy
            </Button>
            <Button 
              onClick={confirmAbsent}
              variant="contained"
              sx={{ 
                textTransform: 'none',
                bgcolor: '#e74c3c',
                '&:hover': { bgcolor: '#c0392b' }
              }}
            >
              Xác nhận vắng
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default DriverStudentListPage;
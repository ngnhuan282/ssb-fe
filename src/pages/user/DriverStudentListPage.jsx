// src/pages/user/DriverStudentList.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  LinearProgress,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  CheckCircle,
  Refresh,
} from '@mui/icons-material';
import StudentListFilter from '../../components/user/driver/StudentListFilter';
import StudentCard from '../../components/user/driver/StudentCard';
import { studentAPI } from '../../services/api'; // Import từ api.js (điều chỉnh path nếu cần)
import { useAuth } from '../../context/AuthContext'; // Để lấy user (driverId)

const DriverStudentListPage = () => {
  const { user } = useAuth(); // Lấy user từ AuthContext (giả định có driverId = user.id)
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [stats, setStats] = useState({ all: 0, pending: 0, pickedUp: 0, droppedOff: 0 });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [loading, setLoading] = useState(true); // Thêm state loading
  const [error, setError] = useState(null); // Thêm state error

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    // Filter động dựa trên search và tab
    let filtered = students;
    if (searchTerm) {
      filtered = filtered.filter(student =>
        student.fullName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (activeTab !== 'all') {
      filtered = filtered.filter(student => student.status === activeTab);
    }
    setFilteredStudents(filtered);
  }, [students, searchTerm, activeTab]);

  const fetchStudents = async () => {
    setLoading(true);
    setError(null);
    try {
      // API call thực tế
      // Nếu có endpoint cho driver: const response = await studentAPI.getStudentsForDriver(user.id);
      const response = await studentAPI.getAll(); // Hoặc getStudentsForDriver nếu có
      const data = response.data.data; // Giả định cấu trúc response từ ApiResponse (status, data, message)
      
      setStudents(data);
      updateStats(data);
      setSnackbar({ open: true, message: 'Dữ liệu đã tải thành công', severity: 'success' });
    } catch (err) {
      setError('Lỗi khi tải dữ liệu: ' + (err.response?.data?.message || err.message));
      setSnackbar({ open: true, message: 'Lỗi khi tải dữ liệu', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const updateStats = (data) => {
    const pending = data.filter(s => s.status === 'pending').length;
    const pickedUp = data.filter(s => s.status === 'picked_up').length;
    const droppedOff = data.filter(s => s.status === 'dropped_off').length;
    setStats({
      all: data.length,
      pending,
      pickedUp,
      droppedOff,
    });
  };

  const handleCheckIn = async (studentId, checked) => {
    try {
      const newStatus = checked ? 'picked_up' : 'pending'; // Hoặc 'dropped_off' tùy logic
      await studentAPI.update(studentId, { status: newStatus });
      // Cập nhật local state mà không cần reload full
      const updatedStudents = students.map(s =>
        s._id === studentId ? { ...s, status: newStatus } : s
      );
      setStudents(updatedStudents);
      updateStats(updatedStudents);
      setSnackbar({ open: true, message: 'Cập nhật trạng thái thành công', severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: 'Lỗi cập nhật trạng thái', severity: 'error' });
    }
  };

  const handleCallParent = (phone) => {
    if (phone) {
      window.location.href = `tel:${phone}`;
    } else {
      setSnackbar({ open: true, message: 'Không có số điện thoại', severity: 'warning' });
    }
  };

  const progress = stats.all > 0 ? ((stats.pickedUp + stats.droppedOff) / stats.all) * 100 : 0;

  if (loading) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography>Đang tải dữ liệu...</Typography>
        <LinearProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="error">{error}</Typography>
        <Button variant="contained" onClick={fetchStudents} sx={{ mt: 2 }}>Thử lại</Button>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f7fa', pt: 3, pb: 10 }}>
      <Container maxWidth="md">
        {/* Progress Bar */}
        <Paper sx={{ p: 2, mb: 3, borderRadius: 1, boxShadow: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              Tiến độ: {stats.pickedUp + stats.droppedOff}/{stats.all}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                size="small"
                startIcon={<CheckCircle />}
                sx={{ textTransform: 'none', fontWeight: 500, borderRadius: 1 }}
              >
                Hoàn tất tất cả
              </Button>
              <Button
                variant="outlined"
                size="small"
                startIcon={<Refresh />}
                onClick={fetchStudents}
                sx={{ textTransform: 'none', fontWeight: 500, borderRadius: 1 }}
              >
                Làm mới
              </Button>
            </Box>
          </Box>

          <LinearProgress 
            variant="determinate" 
            value={progress}
            sx={{
              height: 6,
              borderRadius: 1,
              bgcolor: '#f5f5f5',
              '& .MuiLinearProgress-bar': {
                bgcolor: '#4caf50',
                borderRadius: 1,
              }
            }}
          />
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
          <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 1, border: '1px solid #e0e0e0' }}>
            <Typography variant="body1" color="textSecondary">
              Không tìm thấy học sinh nào
            </Typography>
          </Paper>
        ) : (
          <Box>
            {filteredStudents.map((student) => (
              <StudentCard
                key={student._id}
                student={student}
                onCheckIn={handleCheckIn}
                onCallParent={() => handleCallParent(student.parent?.user?.phone)}
              />
            ))}
          </Box>
        )}

        {/* Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
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

export default DriverStudentListPage;
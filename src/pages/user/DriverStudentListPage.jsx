// src/pages/user/DriverStudentListPage.jsx
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
import StudentListFilter from '../../components/user/student/StudentListFilter';
import StudentCard from '../../components/user/student/StudentCard';
import { studentAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const DriverStudentListPage = () => {
  const { user } = useAuth();
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [stats, setStats] = useState({ all: 0, pending: 0, pickedUp: 0, droppedOff: 0 });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  // LỌC THEO NAME + TAB
  useEffect(() => {
    let filtered = students;
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(student => {
        const name = (student.name || '').toLowerCase();
        return name.includes(term);
      });
    }

    if (activeTab !== 'all') {
      filtered = filtered.filter(student => student.status === activeTab);
    }

    setFilteredStudents(filtered);
  }, [students, searchTerm, activeTab]);

  // LẤY DỮ LIỆU TỪ DB
  const fetchStudents = async () => {
    setLoading(true);
    try {
      const response = await studentAPI.getAll();
      const data = response.data.data;

      console.log('DB Students:', data.map(s => ({ id: s._id, name: s.name, status: s.status })));

      setStudents(data);
      updateStats(data);
      setSnackbar({ open: true, message: 'Tải từ DB thành công', severity: 'success' });
    } catch (err) {
      setError('Lỗi kết nối DB');
      setSnackbar({ open: true, message: 'Không tải được', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // CẬP NHẬT THỐNG KÊ
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

  // CHECK-IN 1 HỌC SINH
  const handleCheckIn = async (studentId, checked) => {
    const newStatus = checked ? 'picked_up' : 'pending';

    try {
      const response = await studentAPI.update(studentId, { status: newStatus });

      if (response.data.message !== "Student updated successfully") {
        throw new Error('Backend không xác nhận');
      }

      const updated = students.map(s =>
        s._id === studentId ? { ...s, status: newStatus } : s
      );
      setStudents(updated);
      updateStats(updated);
    } catch (err) {
      console.error('Lỗi check-in:', err.response?.data);
      setSnackbar({ open: true, message: 'Không lưu được', severity: 'error' });
    }
  };

  // HOÀN TẤT TẤT CẢ – CẬP NHẬT DB + UI
  const handleCompleteAll = async () => {
    if (stats.pickedUp + stats.droppedOff === stats.all) {
      setSnackbar({ open: true, message: 'Đã hoàn tất tất cả!', severity: 'info' });
      return;
    }

    setLoading(true);
    try {
      const pendingStudents = students.filter(s => s.status === 'pending');

      // GỌI API CHO TỪNG HỌC SINH
      const responses = await Promise.all(
        pendingStudents.map(s =>
          studentAPI.update(s._id, { status: 'picked_up' })
        )
      );

      // KIỂM TRA TỪNG RESPONSE
      responses.forEach((res, index) => {
        if (res.data.message !== "Student updated successfully") {
          throw new Error(`Học sinh ${pendingStudents[index].name} không cập nhật`);
        }
      });

      // CẬP NHẬT LOCAL STATE
      const updated = students.map(s =>
        s.status === 'pending' ? { ...s, status: 'picked_up' } : s
      );
      setStudents(updated);
      updateStats(updated);

      setSnackbar({ open: true, message: 'Đã hoàn tất tất cả học sinh!', severity: 'success' });
    } catch (err) {
      console.error('Hoàn tất lỗi:', err);
      setSnackbar({ open: true, message: 'Lỗi khi hoàn tất', severity: 'error' });
    } finally {
      setLoading(false);
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

  if (loading && students.length === 0) {
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
                variant="contained"
                color="success"
                size="small"
                startIcon={<CheckCircle />}
                onClick={handleCompleteAll}
                disabled={loading || stats.pickedUp + stats.droppedOff === stats.all}
                sx={{ textTransform: 'none', fontWeight: 500, borderRadius: 1 }}
              >
                Hoàn tất tất cả
              </Button>
              <Button
                variant="outlined"
                size="small"
                startIcon={<Refresh />}
                onClick={fetchStudents}
                disabled={loading}
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

        {/* Loading */}
        {loading && students.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <LinearProgress />
          </Box>
        )}

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
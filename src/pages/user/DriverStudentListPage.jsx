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

const DriverStudentListPage = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [stats, setStats] = useState({ all: 0, pending: 0, pickedUp: 0, droppedOff: 0 });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/students/today?driverId=xxx');
      // const data = await response.json();
      
      // Mock data matching Student Schema
      const mockStudents = [
        {
          _id: 'student1',
          fullName: 'Nguyễn Văn A',
          age: 10,
          class: 'Lớp 5A',
          parent: {
            _id: 'parent1',
            user: {
              _id: 'user1',
              username: 'Nguyễn Thị B',
              phone: '0901234567',
            },
          },
          route: 'route1',
          pickupPoint: '123 Nguyễn Huệ, Quận 1',
          dropoffPoint: '123 Nguyễn Huệ, Quận 1',
          status: 'pending',
        },
        {
          _id: 'student2',
          fullName: 'Trần Thị C',
          age: 11,
          class: 'Lớp 5B',
          parent: {
            _id: 'parent2',
            user: {
              _id: 'user2',
              username: 'Trần Văn D',
              phone: '0907654321',
            },
          },
          route: 'route1',
          pickupPoint: '456 Lê Lợi, Quận 1',
          dropoffPoint: '456 Lê Lợi, Quận 1',
          status: 'picked_up',
        },
        {
          _id: 'student3',
          fullName: 'Lê Văn E',
          age: 10,
          class: 'Lớp 5A',
          parent: {
            _id: 'parent3',
            user: {
              _id: 'user3',
              username: 'Lê Thị F',
              phone: '0909876543',
            },
          },
          route: 'route1',
          pickupPoint: '789 Trần Hưng Đạo, Quận 5',
          dropoffPoint: '789 Trần Hưng Đạo, Quận 5',
          status: 'pending',
        },
        {
          _id: 'student4',
          fullName: 'Phạm Thị G',
          age: 11,
          class: 'Lớp 5C',
          parent: {
            _id: 'parent4',
            user: {
              _id: 'user4',
              username: 'Phạm Văn H',
              phone: '0903456789',
            },
          },
          route: 'route1',
          pickupPoint: '321 Điện Biên Phủ, Quận 3',
          dropoffPoint: '321 Điện Biên Phủ, Quận 3',
          status: 'picked_up',
        },
      ];
      
      setStudents(mockStudents);
      updateStats(mockStudents);
    } catch (error) {
      console.error('Error fetching students:', error);
      setSnackbar({
        open: true,
        message: 'Không thể tải danh sách học sinh',
        severity: 'error'
      });
    }
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

    if (activeTab !== 'all') {
      filtered = filtered.filter(s => s.status === activeTab);
    }

    if (searchTerm) {
      filtered = filtered.filter(s => 
        s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.class.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredStudents(filtered);
  }, [students, activeTab, searchTerm]);

  const handleCheckIn = async (studentId, checked) => {
    try {
      // TODO: API call to update student status
      // await fetch(`/api/students/${studentId}`, {
      //   method: 'PATCH',
      //   body: JSON.stringify({ status: checked ? 'picked_up' : 'pending' })
      // });

      setStudents(prevStudents => 
        prevStudents.map(student => 
          student._id === studentId 
            ? { ...student, status: checked ? 'picked_up' : 'pending' }
            : student
        )
      );
      
      const student = students.find(s => s._id === studentId);
      setSnackbar({
        open: true,
        message: checked 
          ? `Đã đánh dấu đón ${student.fullName}`
          : `Đã bỏ đánh dấu ${student.fullName}`,
        severity: 'success'
      });

      updateStats(students);
    } catch (error) {
      console.error('Error updating student status:', error);
      setSnackbar({
        open: true,
        message: 'Không thể cập nhật trạng thái',
        severity: 'error'
      });
    }
  };

  const handleCallParent = (phoneNumber) => {
    if (phoneNumber) {
      window.location.href = `tel:${phoneNumber}`;
    }
  };

  const handleRefresh = () => {
    setSnackbar({
      open: true,
      message: 'Đang làm mới danh sách...',
      severity: 'info'
    });
    fetchStudents();
  };

  const handleMarkAllPickedUp = async () => {
    try {
      // TODO: API call to update all students
      setStudents(prevStudents => 
        prevStudents.map(s => ({ ...s, status: 'picked_up' }))
      );
      
      setSnackbar({
        open: true,
        message: 'Đã đánh dấu tất cả học sinh đã đón',
        severity: 'success'
      });
      
      updateStats(students);
    } catch (error) {
      console.error('Error marking all:', error);
      setSnackbar({
        open: true,
        message: 'Không thể cập nhật',
        severity: 'error'
      });
    }
  };

  const progress = (stats.pickedUp / stats.all) * 100 || 0;

  return (
    <Box sx={{ bgcolor: '#fafafa', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" sx={{ fontWeight: 600, color: '#212121', mb: 0.5 }}>
            Danh sách học sinh
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Quản lý và cập nhật trạng thái học sinh
          </Typography>
        </Box>

        {/* Progress Card */}
        <Paper sx={{ p: 3, mb: 3, borderRadius: 1, border: '1px solid #e0e0e0' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box>
              <Typography variant="body1" sx={{ fontWeight: 600, color: '#212121', mb: 0.5 }}>
                Tiến độ đón học sinh
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {stats.pickedUp}/{stats.all} học sinh
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                size="small"
                startIcon={<Refresh sx={{ fontSize: 18 }} />}
                onClick={handleRefresh}
                variant="outlined"
                sx={{ 
                  textTransform: 'none',
                  borderColor: '#e0e0e0',
                  color: '#757575',
                  '&:hover': {
                    borderColor: '#1976d2',
                    bgcolor: '#f5f5f5',
                  },
                }}
              >
                Làm mới
              </Button>
              <Button
                size="small"
                startIcon={<CheckCircle sx={{ fontSize: 18 }} />}
                onClick={handleMarkAllPickedUp}
                variant="contained"
                sx={{ 
                  textTransform: 'none',
                  bgcolor: '#4caf50',
                  '&:hover': { bgcolor: '#388e3c' },
                }}
              >
                Đánh dấu tất cả
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
                onCallParent={handleCallParent}
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
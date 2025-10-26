// src/pages/user/DriverSchedule.jsx
import React, { useState, useEffect } from 'react';
import { Box, Container, Grid, Typography, Alert, Snackbar } from '@mui/material';
import ScheduleCalendar from '../../components/user/driver/ScheduleCalendar';
import TodayScheduleCard from '../../components/user/driver/TodayScheduleCard';
import TimelineView from '../../components/user/driver/TimelineView';

const DriverSchedulePage = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [todaySchedule, setTodaySchedule] = useState(null);
  const [monthSchedules, setMonthSchedules] = useState([]);
  const [timelineStops, setTimelineStops] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Mock data - Thay bằng API call thực tế
  useEffect(() => {
    fetchMonthSchedules();
    fetchTodaySchedule();
  }, []);

  const fetchMonthSchedules = () => {
    // Mock data - Lịch tháng
    const mockSchedules = [
      {
        date: new Date(2025, 9, 27), // 27/10/2025
        shifts: ['morning', 'afternoon']
      },
      {
        date: new Date(2025, 9, 28),
        shifts: ['morning']
      },
      {
        date: new Date(2025, 9, 29),
        shifts: ['afternoon']
      },
      {
        date: new Date(2025, 9, 30),
        shifts: ['morning', 'afternoon']
      },
    ];
    setMonthSchedules(mockSchedules);
  };

  const fetchTodaySchedule = () => {
    // Mock data - Lịch hôm nay
    const mockTodaySchedule = {
      shift: 'morning',
      startTime: '06:00',
      endTime: '08:00',
      routeName: 'Tuyến A1 - Quận 1 → Trường DEF',
      busNumber: '51A-12345',
      totalStudents: 12,
    };
    setTodaySchedule(mockTodaySchedule);

    // Mock timeline stops
    const mockStops = [
      {
        type: 'start',
        time: '06:00',
        name: 'Xuất phát',
        address: 'Bến xe Miền Đông',
        status: 'completed',
        students: 0,
      },
      {
        type: 'stop',
        time: '06:15',
        name: 'Điểm đón 1',
        address: '123 Nguyễn Huệ, Quận 1',
        status: 'completed',
        students: 3,
      },
      {
        type: 'stop',
        time: '06:30',
        name: 'Điểm đón 2',
        address: '456 Lê Lợi, Quận 1',
        status: 'current',
        students: 5,
        distance: '2.5km',
        estimatedTime: '8 phút',
      },
      {
        type: 'stop',
        time: '06:45',
        name: 'Điểm đón 3',
        address: '789 Trần Hưng Đạo, Quận 5',
        status: 'pending',
        students: 4,
        distance: '5km',
        estimatedTime: '15 phút',
      },
      {
        type: 'school',
        time: '07:45',
        name: 'Trường DEF',
        address: 'Số 1 Võ Văn Ngân, Thủ Đức',
        status: 'pending',
        students: 0,
      },
    ];
    setTimelineStops(mockStops);
  };

  const handleDateSelect = (date, schedule) => {
    setSelectedDate(date);
    console.log('Selected date:', date, 'Schedule:', schedule);
    setSnackbar({
      open: true,
      message: schedule 
        ? `Bạn có lịch làm việc ngày ${date.toLocaleDateString('vi-VN')}`
        : `Không có lịch làm việc ngày ${date.toLocaleDateString('vi-VN')}`,
      severity: schedule ? 'info' : 'warning'
    });
  };

  const handleStartTrip = () => {
    console.log('Start trip clicked');
    setSnackbar({
      open: true,
      message: '🚌 Đã bắt đầu chuyến đi!',
      severity: 'success'
    });
    // TODO: Navigate to tracking page or start GPS tracking
  };

  const handleViewDetails = () => {
    console.log('View details clicked');
    setSnackbar({
      open: true,
      message: 'Đang tải chi tiết tuyến đường...',
      severity: 'info'
    });
    // TODO: Show detailed route info
  };

  return (
    <Box sx={{ bgcolor: '#f8f9fa', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="xl">
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#2c3e50', mb: 1 }}>
            📅 Lịch làm việc hàng ngày
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Quản lý lịch trình và tuyến đường của bạn
          </Typography>
        </Box>

        {/* Main Content */}
        <Grid container spacing={3}>
          {/* Left Column - Calendar */}
          <Grid item xs={12} lg={7}>
            <ScheduleCalendar 
              schedules={monthSchedules}
              onDateSelect={handleDateSelect}
            />
          </Grid>

          {/* Right Column - Today's Schedule & Timeline */}
          <Grid item xs={12} lg={5}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <TodayScheduleCard 
                schedule={todaySchedule}
                onStartTrip={handleStartTrip}
                onViewDetails={handleViewDetails}
              />
              <TimelineView stops={timelineStops} />
            </Box>
          </Grid>
        </Grid>

        {/* Snackbar for notifications */}
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

export default DriverSchedulePage;
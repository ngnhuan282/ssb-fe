// src/pages/user/DriverSchedule.jsx
import React, { useState, useEffect } from 'react';
import { Box, Container, Grid, Typography, Snackbar, Alert } from '@mui/material';
import ScheduleCalendar from '../../components/user/driver/ScheduleCalendar';
import TodayScheduleCard from '../../components/user/driver/TodayScheduleCard';
import RouteStopsList from '../../components/user/driver/RouteStopsList';

const DriverSchedule = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [todaySchedule, setTodaySchedule] = useState(null);
  const [monthSchedules, setMonthSchedules] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    fetchMonthSchedules();
    fetchTodaySchedule();
  }, []);

  const fetchMonthSchedules = async () => {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/schedules/month?driverId=xxx&month=10&year=2025');
      // const data = await response.json();
      
      // Mock data matching your Schema
      const mockSchedules = [
        {
          _id: '1',
          date: new Date(2025, 9, 27),
          status: 'scheduled',
        },
        {
          _id: '2',
          date: new Date(2025, 9, 28),
          status: 'in_progress',
        },
        {
          _id: '3',
          date: new Date(2025, 9, 29),
          status: 'completed',
        },
      ];
      
      setMonthSchedules(mockSchedules);
    } catch (error) {
      console.error('Error fetching month schedules:', error);
      setSnackbar({
        open: true,
        message: 'Không thể tải lịch tháng',
        severity: 'error'
      });
    }
  };

  const fetchTodaySchedule = async () => {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/schedules/today?driverId=xxx');
      // const data = await response.json();
      
      // Mock data matching your Schedule Schema
      const mockSchedule = {
        _id: '1',
        bus: {
          _id: 'bus1',
          licensePlate: '51A-12345',
          capacity: 45,
        },
        route: {
          _id: 'route1',
          name: 'Tuyến A1 - Quận 1 → Trường DEF',
          stops: [
            {
              location: 'Bến xe Miền Đông',
              time: new Date(2025, 9, 27, 6, 0),
            },
            {
              location: '123 Nguyễn Huệ, Quận 1',
              time: new Date(2025, 9, 27, 6, 15),
            },
            {
              location: '456 Lê Lợi, Quận 1',
              time: new Date(2025, 9, 27, 6, 30),
            },
            {
              location: '789 Trần Hưng Đạo, Quận 5',
              time: new Date(2025, 9, 27, 6, 45),
            },
            {
              location: 'Trường DEF - Số 1 Võ Văn Ngân, Thủ Đức',
              time: new Date(2025, 9, 27, 7, 45),
            },
          ],
          distance: 15.5,
          estimatedTime: 105,
        },
        driver: {
          _id: 'driver1',
          user: 'user1',
        },
        date: new Date(2025, 9, 27),
        starttime: new Date(2025, 9, 27, 6, 0),
        endtime: new Date(2025, 9, 27, 8, 0),
        numstudent: 12,
        students: [], // Array of Student IDs
        status: 'scheduled', // scheduled | in_progress | completed | delayed
        frequency: 'daily',
      };
      
      setTodaySchedule(mockSchedule);
    } catch (error) {
      console.error('Error fetching today schedule:', error);
      setSnackbar({
        open: true,
        message: 'Không thể tải lịch hôm nay',
        severity: 'error'
      });
    }
  };

  const handleDateSelect = (date, schedule) => {
    setSelectedDate(date);
    if (schedule) {
      setSnackbar({
        open: true,
        message: `Bạn có lịch làm việc ngày ${date.toLocaleDateString('vi-VN')}`,
        severity: 'info'
      });
    } else {
      setSnackbar({
        open: true,
        message: `Không có lịch làm việc ngày ${date.toLocaleDateString('vi-VN')}`,
        severity: 'warning'
      });
    }
  };

  const handleStartTrip = async () => {
    try {
      // TODO: API call to update schedule status
      // await fetch(`/api/schedules/${todaySchedule._id}`, {
      //   method: 'PATCH',
      //   body: JSON.stringify({ status: 'in_progress' })
      // });

      setTodaySchedule(prev => ({ ...prev, status: 'in_progress' }));
      
      setSnackbar({
        open: true,
        message: 'Đã bắt đầu chuyến đi',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error starting trip:', error);
      setSnackbar({
        open: true,
        message: 'Không thể bắt đầu chuyến đi',
        severity: 'error'
      });
    }
  };

  return (
    <Box sx={{ bgcolor: '#fafafa', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="xl">
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" sx={{ fontWeight: 600, color: '#212121', mb: 0.5 }}>
            Lịch làm việc
          </Typography>
          <Typography variant="body2" color="textSecondary">
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

          {/* Right Column - Today's Schedule & Route */}
          <Grid item xs={12} lg={5}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <TodayScheduleCard 
                schedule={todaySchedule}
                onStartTrip={handleStartTrip}
              />
              
              {todaySchedule?.route && (
                <RouteStopsList 
                  route={todaySchedule.route}
                  currentStopIndex={0} // TODO: Track current stop from backend
                />
              )}
            </Box>
          </Grid>
        </Grid>

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

export default DriverSchedule;
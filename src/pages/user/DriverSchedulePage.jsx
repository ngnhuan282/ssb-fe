// src/pages/user/DriverSchedulePage.jsx
import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Snackbar,
  Alert,
  ToggleButtonGroup,
  ToggleButton,
  CircularProgress,
  Paper,
} from '@mui/material';
import { CalendarMonth, ViewWeek, DirectionsBus } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

// Components
import ScheduleCalendar from '../../components/user/driver/ScheduleCalendar';
import WeeklyScheduleView from '../../components/user/driver/WeeklyScheduleView';
import TodayScheduleCard from '../../components/user/driver/TodayScheduleCard';
import RouteStopsList from '../../components/user/driver/RouteStopsList';

// APIs
import { scheduleAPI, driverAPI, locationAPI } from '../../services/api.js';

// Auth
import { useAuth } from '../../context/AuthContext';

const DriverSchedulePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // States
  const [viewMode, setViewMode] = useState('month');
  const [todaySchedule, setTodaySchedule] = useState(null);
  const [monthSchedules, setMonthSchedules] = useState([]);
  const [weekSchedules, setWeekSchedules] = useState([]);
  const [currentWeekStart, setCurrentWeekStart] = useState(getMonday(new Date()));
  const [liveLocation, setLiveLocation] = useState(null);
  const [studentsPerStop, setStudentsPerStop] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [driver, setDriver] = useState(null);
  const [loadingSchedules, setLoadingSchedules] = useState(false);
  const locationIntervalRef = useRef(null);

  // Helpers
  function getMonday(d) {
    const date = new Date(d);
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(date.setDate(diff));
  }

  const showSnackbar = (msg, sev = 'info') => {
    setSnackbar({ open: true, message: msg, severity: sev });
  };

  // Redirect nếu chưa login
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  // Fetch driver
  const fetchDriver = async () => {
    if (!user) return;
    try {
      console.log('🔍 Fetching driver for user._id:', user._id);
      const { data: { data: drivers } } = await driverAPI.getAll();
      const myDriver = drivers.find(d => d.user?._id === user._id);
      console.log('✅ Found driver:', myDriver?._id, myDriver);
      setDriver(myDriver);
    } catch (err) {
      console.error('❌ Fetch driver error:', err);
      showSnackbar('Lỗi tải thông tin tài xế', 'error');
    }
  };

  useEffect(() => {
    fetchDriver();
  }, [user]);

  // Fetch all schedules by driver (month + today + week)
  const fetchSchedulesByDriver = async () => {
    if (!driver) return;

    setLoadingSchedules(true);
    try {
      const { data: { data: allSchedules } } = await scheduleAPI.getByDriver(driver._id);
      console.log('📅 All schedules for driver:', allSchedules.length);

      // Month: tất cả
      setMonthSchedules(allSchedules);

      // Today
      const today = new Date(); today.setHours(0, 0, 0, 0);
      const todaySch = allSchedules.find(s => {
        const d = new Date(s.date); d.setHours(0, 0, 0, 0);
        return d.getTime() === today.getTime();
      });
      setTodaySchedule(todaySch || null);

      // Week
      const weekStart = getMonday(new Date());
      const weekEnd = new Date(weekStart); weekEnd.setDate(weekStart.getDate() + 6);
      weekEnd.setHours(23, 59, 59, 999);
      const weekSch = allSchedules.filter(s => {
        const d = new Date(s.date);
        return d >= weekStart && d <= weekEnd;
      });
      setWeekSchedules(weekSch);

      showSnackbar(`Tải ${allSchedules.length} lịch thành công`);
    } catch (err) {
      console.error('❌ Fetch schedules error:', err);
      showSnackbar('Lỗi tải lịch trình', 'error');
    } finally {
      setLoadingSchedules(false);
    }
  };

  useEffect(() => {
    if (driver) {
      fetchSchedulesByDriver();
    }
  }, [driver]);

  // Refetch week khi đổi tuần
  useEffect(() => {
    if (driver && monthSchedules.length > 0) {
      const weekStart = currentWeekStart;
      const weekEnd = new Date(weekStart); weekEnd.setDate(weekStart.getDate() + 6);
      weekEnd.setHours(23, 59, 59, 999);
      const weekSch = monthSchedules.filter(s => {
        const d = new Date(s.date);
        return d >= weekStart && d <= weekEnd;
      });
      setWeekSchedules(weekSch);
    }
  }, [currentWeekStart, driver, monthSchedules]);

  // Location tracking
  useEffect(() => {
    if (todaySchedule?.status === 'in_progress') {
      startLocationTracking();
    } else {
      stopLocationTracking();
    }
    return stopLocationTracking;
  }, [todaySchedule?.status]);

  const startLocationTracking = () => {
    fetchLatestLocation();
    locationIntervalRef.current = setInterval(fetchLatestLocation, 5000);
  };

  const stopLocationTracking = () => {
    if (locationIntervalRef.current) {
      clearInterval(locationIntervalRef.current);
      locationIntervalRef.current = null;
    }
    setLiveLocation(null);
  };

  const fetchLatestLocation = async () => {
    // Giữ nguyên logic cũ nếu có
    // Ví dụ: gọi locationAPI.getLatest() hoặc mock
  };

  const handleWeekChange = (direction) => {
    const newStart = new Date(currentWeekStart);
    newStart.setDate(currentWeekStart.getDate() + direction * 7);
    setCurrentWeekStart(getMonday(newStart));
  };

  const handleDateSelect = (date, schedule) => {
    console.log('Selected date:', date, schedule);
    // Xử lý chọn ngày nếu cần
  };

  const handleStartTrip = () => {
    console.log('Start trip');
    // Logic bắt đầu chuyến
  };

  if (!user) return null;

  return (
    <Box sx={{ bgcolor: '#f5f7fa', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="xl">
        {/* Loading Schedules */}
        {loadingSchedules && (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', p: 4 }}>
            <CircularProgress size={28} />
            <Typography ml={2}>Đang tải lịch trình...</Typography>
          </Box>
        )}

        {/* Header */}
        <Box mb={4} display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h5" fontWeight={700} color="#1a1a1a">
              Lịch làm việc
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Quản lý lịch trình và tuyến đường hàng ngày
            </Typography>
          </Box>

          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={(_, m) => m && setViewMode(m)}
            size="small"
            sx={{ bgcolor: 'white', borderRadius: 2 }}
          >
            <ToggleButton value="month">
              <CalendarMonth sx={{ fontSize: 18, mr: 0.5 }} /> Tháng
            </ToggleButton>
            <ToggleButton value="week">
              <ViewWeek sx={{ fontSize: 18, mr: 0.5 }} /> Tuần
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        {/* Main Content */}
        <Grid container spacing={3}>
          {/* Left: Calendar / Week View */}
          <Grid item xs={12} lg={7}>
            {viewMode === 'month' ? (
              <ScheduleCalendar 
                schedules={monthSchedules} 
                onDateSelect={handleDateSelect}
              />
            ) : (
              <WeeklyScheduleView
                weekSchedules={weekSchedules}
                currentWeekStart={currentWeekStart}
                onWeekChange={handleWeekChange}
              />
            )}
          </Grid>

          {/* Right: Today + Route */}
          <Grid item xs={12} lg={5}>
            <Box display="flex" flexDirection="column" gap={3}>
              {/* Today Card */}
              <TodayScheduleCard
                schedule={todaySchedule}
                onStartTrip={handleStartTrip}
                liveLocation={liveLocation}
              />

              {/* Route Stops */}
              {todaySchedule?.route ? (
                <RouteStopsList
                  route={todaySchedule.route}
                  currentStopIndex={2} // Có thể dynamic sau
                  studentsPerStop={studentsPerStop}
                />
              ) : (
                <Paper sx={{ p: 3, textAlign: 'center', bgcolor: '#fff' }}>
                  <DirectionsBus sx={{ fontSize: 48, color: '#ccc', mb: 1 }} />
                  <Typography color="textSecondary">
                    Không có lịch hôm nay
                  </Typography>
                </Paper>
              )}
            </Box>
          </Grid>
        </Grid>

        {/* Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert severity={snackbar.severity} variant="filled">
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default DriverSchedulePage;
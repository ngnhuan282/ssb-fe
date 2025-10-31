import React, { useState, useEffect } from 'react';
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
import { scheduleAPI, driverAPI } from '../../services/api.js';

// Auth
import { useAuth } from '../../context/AuthContext';

const DriverSchedulePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // States
  const [viewMode, setViewMode] = useState('month');
  const [selectedSchedule, setSelectedSchedule] = useState(null); // Đổi từ todaySchedule
  const [monthSchedules, setMonthSchedules] = useState([]);
  const [weekSchedules, setWeekSchedules] = useState([]);
  const [currentWeekStart, setCurrentWeekStart] = useState(() => getMonday(new Date()));
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [driver, setDriver] = useState(null);
  const [loadingSchedules, setLoadingSchedules] = useState(false);

  // Helpers
  function getMonday(d) {
    const date = new Date(d);
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(date.setDate(diff));
    monday.setHours(0, 0, 0, 0);
    return monday;
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
      const { data: { data: drivers } } = await driverAPI.getAll();
      
      const myDriver = drivers.find(d => {
        const driverUserId = d.user?._id?.toString() || d.user?.toString();
        const currentUserId = user._id?.toString();
        return driverUserId === currentUserId;
      });
      
      setDriver(myDriver);
    } catch (err) {
      console.error('Fetch driver error:', err);
      showSnackbar('Lỗi tải thông tin tài xế', 'error');
    }
  };

  useEffect(() => {
    fetchDriver();
  }, [user]);

  // Fetch all schedules by driver
  const fetchSchedulesByDriver = async () => {
    if (!driver || !user) return;

    setLoadingSchedules(true);
    try {
      const userId = user._id;
      const { data: { data: allSchedules } } = await scheduleAPI.getByDriver(userId);

      if (allSchedules.length === 0) {
        showSnackbar('Không có lịch trình nào cho tài xế này', 'info');
        setLoadingSchedules(false);
        return;
      }

      allSchedules.sort((a, b) => new Date(b.date) - new Date(a.date));
      setMonthSchedules(allSchedules);

      // Tự động chọn lịch hôm nay (nếu có)
      const today = new Date(); 
      today.setHours(0, 0, 0, 0);
      
      const todaySch = allSchedules.find(s => {
        const d = new Date(s.date); 
        d.setHours(0, 0, 0, 0);
        return d.getTime() === today.getTime();
      });
      
      // Nếu có lịch hôm nay thì hiển thị, không thì hiển thị lịch đầu tiên
      setSelectedSchedule(todaySch || allSchedules[0]);

      // Week schedules
      const weekStart = currentWeekStart.getTime();
      const weekEnd = new Date(currentWeekStart);
      weekEnd.setDate(weekEnd.getDate() + 7);
      
      const weekSch = allSchedules.filter(s => {
        const d = new Date(s.date).getTime();
        return d >= weekStart && d < weekEnd.getTime();
      });
      
      setWeekSchedules(weekSch.length > 0 ? weekSch : allSchedules.slice(0, 7));

    } catch (err) {
      console.error('Fetch schedules error:', err);
      showSnackbar('Lỗi tải lịch trình', 'error');
    } finally {
      setLoadingSchedules(false);
    }
  };

  useEffect(() => {
    fetchSchedulesByDriver();
  }, [driver, currentWeekStart, user]);

  const handleWeekChange = (direction) => {
    if (!currentWeekStart) return;
    const newStart = new Date(currentWeekStart);
    newStart.setDate(newStart.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentWeekStart(newStart);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // ✨ Handler khi click vào lịch trong calendar
  const handleScheduleSelect = (date, schedule) => {
    if (schedule) {
      setSelectedSchedule(schedule);
    }
  };

  return (
    <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="xl">
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            📅 Lịch làm việc
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Xem lịch trình được phân công
          </Typography>
        </Box>

        {/* View Mode Toggle */}
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={(e, newMode) => newMode && setViewMode(newMode)}
            sx={{ bgcolor: 'white', boxShadow: 1 }}
          >
            <ToggleButton value="month">
              <CalendarMonth sx={{ mr: 1 }} />
              Tháng
            </ToggleButton>
            <ToggleButton value="week">
              <ViewWeek sx={{ mr: 1 }} />
              Tuần
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        {/* Loading State */}
        {loadingSchedules && (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', p: 4 }}>
            <CircularProgress size={28} />
            <Typography ml={2}>Đang tải lịch trình...</Typography>
          </Box>
        )}

        {/* Empty State */}
        {!loadingSchedules && monthSchedules.length === 0 && (
          <Paper sx={{ p: 3, textAlign: 'center', bgcolor: '#fff', mb: 3 }}>
            <DirectionsBus sx={{ fontSize: 48, color: '#ccc', mb: 1 }} />
            <Typography color="textSecondary">
              Không có lịch trình nào. Hãy liên hệ admin để tạo lịch.
            </Typography>
          </Paper>
        )}

        {/* Main Content */}
        {!loadingSchedules && monthSchedules.length > 0 && (
          <Grid container spacing={3}>
            {/* Left Column - Calendar/Week View */}
            <Grid item xs={12} lg={8}>
              {viewMode === 'month' ? (
                <ScheduleCalendar
                  schedules={monthSchedules}
                  onDateSelect={handleScheduleSelect}
                />
              ) : currentWeekStart ? (
                <WeeklyScheduleView
                  weekSchedules={weekSchedules}
                  weekStart={currentWeekStart}
                  onWeekChange={handleWeekChange}
                  onScheduleClick={(schedule) => setSelectedSchedule(schedule)}
                />
              ) : (
                <Paper sx={{ p: 4, textAlign: 'center' }}>
                  <CircularProgress size={24} />
                  <Typography mt={2}>Đang tải tuần...</Typography>
                </Paper>
              )}
            </Grid>

            {/* Right Column - Selected Schedule Details */}
            <Grid item xs={12} lg={4}>
              <Box sx={{ position: 'sticky', top: 24 }}>
                {selectedSchedule && (
                  <>
                    <TodayScheduleCard
                      schedule={selectedSchedule}
                      onStartTrip={null} 
                      liveLocation={null} 
                    />
                    <Box sx={{ mt: 2 }}>
                      <RouteStopsList
                        route={selectedSchedule.route}
                        currentStopIndex={-1} 
                        studentsPerStop={{}} 
                      />
                    </Box>
                  </>
                )}
              </Box>
            </Grid>
          </Grid>
        )}

        {/* Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default DriverSchedulePage;
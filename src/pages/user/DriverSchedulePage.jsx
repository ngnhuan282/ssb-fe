// src/pages/user/DriverSchedulePage.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
  Paper,
  CircularProgress,
} from '@mui/material';
import { CalendarMonth, ViewWeek, EventBusy } from '@mui/icons-material'; // Thêm icon EventBusy
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
// Components
import ScheduleCalendar from '../../components/user/schedule/ScheduleCalendar.jsx';
import WeeklyScheduleView from '../../components/user/schedule/WeeklyScheduleView.jsx'; 
import TodayScheduleCard from '../../components/user/schedule/TodayScheduleCard.jsx';
import RouteStopsList from '../../components/user/schedule/RouteStopsList.jsx'; 

// APIs
import { scheduleAPI } from '../../services/api.js';
import { useAuth } from '../../context/AuthContext';

const DriverSchedulePage = () => {
  const navigate = useNavigate();
  const { user, driverId } = useAuth();
  const { t, i18n } = useTranslation();
  
  const [viewMode, setViewMode] = useState('month');
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  
  // 1. Thêm state để theo dõi ngày đang chọn (Mặc định là hôm nay)
  const [selectedDate, setSelectedDate] = useState(new Date()); 

  const [monthSchedules, setMonthSchedules] = useState([]);
  const [weekSchedules, setWeekSchedules] = useState([]);
  const [currentWeekStart, setCurrentWeekStart] = useState(() => getMonday(new Date()));
  const [loadingSchedules, setLoadingSchedules] = useState(false);

  function getMonday(d) {
    const date = new Date(d);
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(date.setDate(diff));
    monday.setHours(0, 0, 0, 0);
    return monday;
  }

  useEffect(() => {
    if (!user) navigate('/login');
  }, [user, navigate]);

  const fetchSchedulesByDriver = async () => {
    if (!driverId) return;
    
    setLoadingSchedules(true);
    try {
      const { data: { data: allSchedules } } = await scheduleAPI.getByDriver(driverId);
      
      allSchedules.sort((a, b) => new Date(b.date) - new Date(a.date));
      setMonthSchedules(allSchedules);

      // Logic chọn lịch trình mặc định (Hôm nay)
      const today = new Date(); 
      today.setHours(0, 0, 0, 0);
      
      const todaySch = allSchedules.find(s => {
        const d = new Date(s.date); 
        d.setHours(0, 0, 0, 0);
        return d.getTime() === today.getTime();
      });
      
      // Nếu load lần đầu, ưu tiên chọn lịch hôm nay
      if (!selectedSchedule) {
          setSelectedSchedule(todaySch || null); 
          // Lưu ý: Nếu hôm nay không có lịch, selectedSchedule sẽ là null,
          // nhưng selectedDate mặc định đã là new Date() nên UI sẽ hiển thị đúng.
      }

      // Lọc lịch cho view tuần
      const weekStart = currentWeekStart.getTime();
      const weekEnd = new Date(currentWeekStart); 
      weekEnd.setDate(weekEnd.getDate() + 7);
      
      const weekSch = allSchedules.filter(s => {
        const d = new Date(s.date).getTime();
        return d >= weekStart && d < weekEnd.getTime();
      });
      setWeekSchedules(weekSch);

    } catch (err) {
      console.error('Fetch schedules error:', err);
    } finally {
      setLoadingSchedules(false);
    }
  };

  useEffect(() => {
    fetchSchedulesByDriver();
  }, [driverId, currentWeekStart]);

  const handleWeekChange = (direction) => {
    const newStart = new Date(currentWeekStart);
    newStart.setDate(newStart.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentWeekStart(newStart);
  };

  // 2. Cập nhật hàm xử lý khi chọn ngày
  const handleScheduleSelect = (date, schedule) => {
    setSelectedDate(date); // Luôn cập nhật ngày được chọn
    setSelectedSchedule(schedule || null); // Cập nhật lịch trình (có thể null)
  };

  const formatSelectedDate = (date) => {
    if (!date) return '';
    const locale = i18n.language === 'vi' ? 'vi-VN' : 'en-US';
    return new Intl.DateTimeFormat(locale, {
      weekday: 'long',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };

  return (
    <Box sx={{ bgcolor: '#f8fafc', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="xl">
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b' }}>
            {t("schedule.title")}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {t("schedule.subtitle")}
          </Typography>
        </Box>

        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center' }}>
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={(e, v) => v && setViewMode(v)}
            sx={{ bgcolor: 'white', border: '1px solid #e2e8f0', borderRadius: 2 }}
          >
            <ToggleButton value="month" sx={{ px: 3, py: 1.5, textTransform: 'none' }}>
              <CalendarMonth sx={{ mr: 1, fontSize: 18 }} /> {t("schedule.views.month")}
            </ToggleButton>
            <ToggleButton value="week" sx={{ px: 3, py: 1.5, textTransform: 'none' }}>
              <ViewWeek sx={{ mr: 1, fontSize: 18 }} /> {t("schedule.views.week")}
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        {loadingSchedules ? (
          <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 3 }}>
            <CircularProgress size={32} />
            <Typography mt={2} color="text.secondary">{t("schedule.loading")}</Typography>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {/* Left: Calendar / Week */}
            <Grid item xs={12} lg={8}>
              {viewMode === 'month' ? (
                <ScheduleCalendar
                  schedules={monthSchedules}
                  onDateSelect={handleScheduleSelect}
                  selectedSchedule={selectedSchedule}
                />
              ) : (
                <WeeklyScheduleView
                  weekSchedules={weekSchedules}
                  weekStart={currentWeekStart}
                  onWeekChange={handleWeekChange}
                  onScheduleClick={(sch) => handleScheduleSelect(new Date(sch.date), sch)}
                />
              )}
            </Grid>

            {/* Right: Schedule Details */}
            <Grid item xs={12} lg={4}>
              <Box sx={{ position: 'sticky', top: 24 }}>
                {/* 3. Luôn hiển thị ngày đang chọn ở Header */}
                <Typography variant="h5" sx={{ fontWeight: 600, color: '#1e293b', mb: 2 }}>
                  {formatSelectedDate(selectedDate)}
                </Typography>

                {/* 4. Điều kiện hiển thị nội dung */}
                {selectedSchedule ? (
                  <>
                    <TodayScheduleCard schedule={selectedSchedule} />
                    <Box sx={{ mt: 3 }}>
                      <RouteStopsList route={selectedSchedule.route} />
                    </Box>
                  </>
                ) : (
                  // UI khi không có lịch trình
                  <Paper 
                    sx={{ 
                      p: 4, 
                      textAlign: 'center', 
                      borderRadius: 3, 
                      bgcolor: '#fff',
                      border: '1px dashed #cbd5e1'
                    }}
                  >
                    <EventBusy sx={{ fontSize: 48, color: '#94a3b8', mb: 1 }} />
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                      Không có lịch làm việc
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Bạn không có lịch trình phân công nào trong ngày này.
                    </Typography>
                  </Paper>
                )}
              </Box>
            </Grid>
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default DriverSchedulePage;
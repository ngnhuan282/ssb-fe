// src/components/user/driver/WeeklyScheduleView.jsx
import React, { useMemo } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  CircularProgress,
} from '@mui/material';
import {
  ChevronLeft,
  ChevronRight,
  Circle,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

const WeeklyScheduleView = ({ weekSchedules = [], weekStart, onWeekChange, onScheduleClick }) => {
  const { t, i18n } = useTranslation();
  const locale = i18n.language === 'vi' ? 'vi-VN' : 'en-US';

  if (!weekStart) {
    return (
      <Card sx={{ p: 4, textAlign: 'center' }}>
        <CircularProgress size={24} />
        <Typography mt={2}>{t("schedule.loading")}</Typography>
      </Card>
    );
  }

  const getWeekDays = (startDate) => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      days.push(date);
    }
    return days;
  };

  const weekDays = useMemo(() => getWeekDays(weekStart), [weekStart]);
  
  // Lấy tên ngày từ file dịch
  const dayNames = t("calendar.days", { returnObjects: true });

  const getScheduleForDate = (date) => {
    return weekSchedules.filter(schedule => {
      const scheduleDate = new Date(schedule.date);
      return scheduleDate.toDateString() === date.toDateString();
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return { bg: '#e8f5e9', text: '#2e7d32' };
      case 'in_progress': return { bg: '#fff3e0', text: '#e65100' };
      case 'delayed': return { bg: '#ffebee', text: '#c62828' };
      default: return { bg: '#e3f2fd', text: '#1565c0' };
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' });
  };

  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  return (
    <Card sx={{ boxShadow: 1, borderRadius: 1, border: '1px solid #e0e0e0' }}>
      <CardContent sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#212121' }}>
            {t("weeklySchedule.title")}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton size="small" onClick={() => onWeekChange('prev')} sx={{ color: '#424242' }}>
              <ChevronLeft />
            </IconButton>
            <Typography variant="body2" sx={{ color: '#757575', minWidth: 180, textAlign: 'center' }}>
              {weekDays[0].toLocaleDateString(locale)} - {weekDays[6].toLocaleDateString(locale)}
            </Typography>
            <IconButton size="small" onClick={() => onWeekChange('next')} sx={{ color: '#424242' }}>
              <ChevronRight />
            </IconButton>
          </Box>
        </Box>

        {/* Table */}
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, color: '#424242', width: 120 }}>{t("schedule.table.date")}</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#424242' }}>{t("schedule.table.morning")}</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#424242' }}>{t("schedule.table.afternoon")}</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#424242', width: 100 }}>{t("schedule.table.status")}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {weekDays.map((day, index) => {
                const schedules = getScheduleForDate(day);
                const morningSchedule = schedules.find(s => {
                  const hour = new Date(s.starttime).getHours();
                  return hour < 12;
                });
                const afternoonSchedule = schedules.find(s => {
                  const hour = new Date(s.starttime).getHours();
                  return hour >= 12;
                });
                const todayRow = isToday(day);
                const hasSchedule = morningSchedule || afternoonSchedule;

                return (
                  <TableRow 
                    key={index}
                    onClick={() => {
                      if (hasSchedule && onScheduleClick) {
                        onScheduleClick(morningSchedule || afternoonSchedule);
                      }
                    }}
                    sx={{ 
                      bgcolor: todayRow ? '#e3f2fd' : 'transparent',
                      cursor: hasSchedule ? 'pointer' : 'default',
                      '&:hover': { 
                        bgcolor: hasSchedule ? '#f5f5f5' : (todayRow ? '#e3f2fd' : 'transparent')
                      },
                    }}
                  >
                    <TableCell>
                      <Box>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            fontWeight: todayRow ? 600 : 500,
                            color: todayRow ? '#1565c0' : '#424242',
                          }}
                        >
                          {dayNames[day.getDay()]}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#757575' }}>
                          {day.getDate()}/{day.getMonth() + 1}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      {morningSchedule ? (
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 500, color: '#424242', mb: 0.5 }}>
                            {formatTime(morningSchedule.starttime)} - {formatTime(morningSchedule.endtime)}
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#757575' }}>
                            {morningSchedule.route?.name || 'N/A'}
                          </Typography>
                        </Box>
                      ) : (
                        <Typography variant="body2" sx={{ color: '#bdbdbd' }}>-</Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      {afternoonSchedule ? (
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 500, color: '#424242', mb: 0.5 }}>
                            {formatTime(afternoonSchedule.starttime)} - {formatTime(afternoonSchedule.endtime)}
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#757575' }}>
                            {afternoonSchedule.route?.name || 'N/A'}
                          </Typography>
                        </Box>
                      ) : (
                        <Typography variant="body2" sx={{ color: '#bdbdbd' }}>-</Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      {(morningSchedule || afternoonSchedule) && (
                        <Chip
                          label={t(`weeklySchedule.status.${morningSchedule?.status || afternoonSchedule?.status || 'scheduled'}`)}
                          size="small"
                          sx={{
                            ...getStatusColor(morningSchedule?.status || afternoonSchedule?.status || 'scheduled'),
                            fontSize: '0.7rem',
                            height: 22,
                            fontWeight: 500,
                          }}
                        />
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Legend */}
        <Box sx={{ display: 'flex', gap: 2, mt: 3, justifyContent: 'center', flexWrap: 'wrap' }}>
          {['scheduled', 'in_progress', 'completed', 'delayed'].map(status => (
            <Box key={status} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Circle sx={{ 
                fontSize: 8, 
                color: status === 'completed' ? '#2e7d32' : status === 'in_progress' ? '#e65100' : status === 'delayed' ? '#c62828' : '#1565c0' 
              }} />
              <Typography variant="caption" sx={{ color: '#757575' }}>
                {t(`weeklySchedule.status.${status}`)}
              </Typography>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

export default WeeklyScheduleView;
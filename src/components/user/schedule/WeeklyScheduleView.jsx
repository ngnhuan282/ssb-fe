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

const WeeklyScheduleView = ({ weekSchedules = [], weekStart, onWeekChange }) => {
  // Sửa: Kiểm tra weekStart trước khi xử lý
  if (!weekStart) {
    return (
      <Card sx={{ p: 4, textAlign: 'center' }}>
        <CircularProgress size={24} />
        <Typography mt={2}>Đang tải lịch tuần...</Typography>
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

  // Sửa: Dùng useMemo để tránh tính lại không cần thiết
  const weekDays = useMemo(() => getWeekDays(weekStart), [weekStart]);
  
  const dayNames = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'];

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
    return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
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
            Lịch tuần
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton size="small" onClick={() => onWeekChange('prev')} sx={{ color: '#424242' }}>
              <ChevronLeft />
            </IconButton>
            <Typography variant="body2" sx={{ color: '#757575', minWidth: 180, textAlign: 'center' }}>
              {weekDays[0].toLocaleDateString('vi-VN')} - {weekDays[6].toLocaleDateString('vi-VN')}
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
                <TableCell sx={{ fontWeight: 600, color: '#424242', width: 120 }}>Ngày</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#424242' }}>Ca sáng</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#424242' }}>Ca chiều</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#424242', width: 100 }}>Trạng thái</TableCell>
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

                return (
                  <TableRow 
                    key={index}
                    sx={{ 
                      bgcolor: todayRow ? '#e3f2fd' : 'transparent',
                      '&:hover': { bgcolor: '#f5f5f5' },
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
                          label={
                            morningSchedule?.status === 'completed' || afternoonSchedule?.status === 'completed' 
                              ? 'Hoàn thành'
                              : morningSchedule?.status === 'in_progress' || afternoonSchedule?.status === 'in_progress'
                              ? 'Đang thực hiện'
                              : morningSchedule?.status === 'delayed' || afternoonSchedule?.status === 'delayed'
                              ? 'Trễ'
                              : 'Đã lên lịch'
                          }
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
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Circle sx={{ fontSize: 8, color: '#1565c0' }} />
            <Typography variant="caption" sx={{ color: '#757575' }}>Đã lên lịch</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Circle sx={{ fontSize: 8, color: '#e65100' }} />
            <Typography variant="caption" sx={{ color: '#757575' }}>Đang thực hiện</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Circle sx={{ fontSize: 8, color: '#2e7d32' }} />
            <Typography variant="caption" sx={{ color: '#757575' }}>Hoàn thành</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Circle sx={{ fontSize: 8, color: '#c62828' }} />
            <Typography variant="caption" sx={{ color: '#757575' }}>Trễ</Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default WeeklyScheduleView;
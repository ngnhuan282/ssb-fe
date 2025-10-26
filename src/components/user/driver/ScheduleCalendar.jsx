// src/components/user/driver/ScheduleCalendar.jsx
import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Chip,
  Grid,
} from '@mui/material';
import {
  ChevronLeft,
  ChevronRight,
  WbSunny,
  Brightness3,
} from '@mui/icons-material';

const ScheduleCalendar = ({ schedules = [], onDateSelect }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Lấy danh sách ngày trong tháng
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Thêm các ngày trống đầu tháng
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Thêm các ngày trong tháng
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };

  // Kiểm tra có lịch làm việc không
  const hasSchedule = (date) => {
    if (!date) return null;
    return schedules.find(schedule => {
      const scheduleDate = new Date(schedule.date);
      return scheduleDate.toDateString() === date.toDateString();
    });
  };

  // Chuyển tháng
  const changeMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() + direction);
      return newDate;
    });
  };

  const monthNames = [
    'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
    'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
  ];
  
  const dayNames = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

  const days = getDaysInMonth(currentDate);
  const today = new Date();

  return (
    <Card sx={{ boxShadow: 3, borderRadius: 3 }}>
      <CardContent>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#2c3e50' }}>
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </Typography>
          <Box>
            <IconButton onClick={() => changeMonth(-1)} size="small">
              <ChevronLeft />
            </IconButton>
            <IconButton onClick={() => changeMonth(1)} size="small">
              <ChevronRight />
            </IconButton>
          </Box>
        </Box>

        {/* Day Names */}
        <Grid container spacing={1} sx={{ mb: 1 }}>
          {dayNames.map((day) => (
            <Grid item xs={12/7} key={day}>
              <Box sx={{ textAlign: 'center', py: 1 }}>
                <Typography variant="caption" sx={{ fontWeight: 600, color: '#7f8c8d' }}>
                  {day}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>

        {/* Calendar Days */}
        <Grid container spacing={1}>
          {days.map((date, index) => {
            const schedule = hasSchedule(date);
            const isToday = date && date.toDateString() === today.toDateString();
            
            return (
              <Grid item xs={12/7} key={index}>
                <Box
                  onClick={() => date && onDateSelect && onDateSelect(date, schedule)}
                  sx={{
                    height: 70,
                    border: '1px solid',
                    borderColor: isToday ? '#667eea' : '#ecf0f1',
                    borderRadius: 2,
                    cursor: date ? 'pointer' : 'default',
                    bgcolor: date ? (isToday ? '#e8eaf6' : '#fff') : '#f8f9fa',
                    transition: 'all 0.2s',
                    '&:hover': {
                      bgcolor: date ? '#f5f6fa' : '#f8f9fa',
                      transform: date ? 'scale(1.05)' : 'none',
                    },
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    p: 0.5,
                  }}
                >
                  {date && (
                    <>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: isToday ? 700 : 500,
                          color: isToday ? '#667eea' : '#2c3e50',
                        }}
                      >
                        {date.getDate()}
                      </Typography>
                      
                      {schedule && (
                        <Box sx={{ display: 'flex', gap: 0.3, justifyContent: 'center', flexWrap: 'wrap' }}>
                          {schedule.shifts.includes('morning') && (
                            <WbSunny sx={{ fontSize: 14, color: '#f39c12' }} />
                          )}
                          {schedule.shifts.includes('afternoon') && (
                            <Brightness3 sx={{ fontSize: 14, color: '#3498db' }} />
                          )}
                        </Box>
                      )}
                    </>
                  )}
                </Box>
              </Grid>
            );
          })}
        </Grid>

        {/* Legend */}
        <Box sx={{ display: 'flex', gap: 2, mt: 3, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Chip
            icon={<WbSunny />}
            label="Ca sáng"
            size="small"
            sx={{ bgcolor: '#fff3cd', color: '#856404' }}
          />
          <Chip
            icon={<Brightness3 />}
            label="Ca chiều"
            size="small"
            sx={{ bgcolor: '#cfe2ff', color: '#084298' }}
          />
        </Box>
      </CardContent>
    </Card>
  );
};

export default ScheduleCalendar;
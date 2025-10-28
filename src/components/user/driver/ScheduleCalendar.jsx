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
  Circle,
} from '@mui/icons-material';

const ScheduleCalendar = ({ schedules = [], onDateSelect }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };

  const hasSchedule = (date) => {
    if (!date) return null;
    return schedules.find(schedule => {
      const scheduleDate = new Date(schedule.date);
      return scheduleDate.toDateString() === date.toDateString();
    });
  };

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
    <Card sx={{ boxShadow: 1, borderRadius: 1, border: '1px solid #e0e0e0' }}>
      <CardContent sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#212121' }}>
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </Typography>
          <Box>
            <IconButton onClick={() => changeMonth(-1)} size="small" sx={{ color: '#424242' }}>
              <ChevronLeft />
            </IconButton>
            <IconButton onClick={() => changeMonth(1)} size="small" sx={{ color: '#424242' }}>
              <ChevronRight />
            </IconButton>
          </Box>
        </Box>

        {/* Day Names */}
        <Grid container spacing={0.5} sx={{ mb: 1 }}>
          {dayNames.map((day) => (
            <Grid item xs={12/7} key={day}>
              <Box sx={{ textAlign: 'center', py: 1 }}>
                <Typography variant="caption" sx={{ fontWeight: 600, color: '#757575', fontSize: '0.75rem' }}>
                  {day}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>

        {/* Calendar Days */}
        <Grid container spacing={0.5}>
          {days.map((date, index) => {
            const schedule = hasSchedule(date);
            const isToday = date && date.toDateString() === today.toDateString();
            
            return (
              <Grid item xs={12/7} key={index}>
                <Box
                  onClick={() => date && onDateSelect && onDateSelect(date, schedule)}
                  sx={{
                    height: 60,
                    border: '1px solid',
                    borderColor: isToday ? '#1976d2' : '#e0e0e0',
                    borderRadius: 0.5,
                    cursor: date ? 'pointer' : 'default',
                    bgcolor: date ? (isToday ? '#e3f2fd' : schedule ? '#f5f5f5' : '#fff') : '#fafafa',
                    transition: 'all 0.2s',
                    '&:hover': {
                      bgcolor: date && !isToday ? (schedule ? '#eeeeee' : '#fafafa') : undefined,
                      borderColor: date ? '#1976d2' : '#e0e0e0',
                    },
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    p: 0.5,
                  }}
                >
                  {date && (
                    <>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: isToday ? 600 : 400,
                          color: isToday ? '#1976d2' : '#424242',
                          fontSize: '0.875rem',
                        }}
                      >
                        {date.getDate()}
                      </Typography>
                      
                      {schedule && (
                        <Circle 
                          sx={{ 
                            fontSize: 6, 
                            color: schedule.status === 'completed' ? '#4caf50' : 
                                   schedule.status === 'in_progress' ? '#ff9800' : '#1976d2',
                            mt: 0.5 
                          }} 
                        />
                      )}
                    </>
                  )}
                </Box>
              </Grid>
            );
          })}
        </Grid>

        {/* Legend */}
        <Box sx={{ display: 'flex', gap: 2, mt: 3, justifyContent: 'center', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Circle sx={{ fontSize: 8, color: '#1976d2' }} />
            <Typography variant="caption" sx={{ color: '#757575' }}>
              Đã lên lịch
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Circle sx={{ fontSize: 8, color: '#ff9800' }} />
            <Typography variant="caption" sx={{ color: '#757575' }}>
              Đang thực hiện
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Circle sx={{ fontSize: 8, color: '#4caf50' }} />
            <Typography variant="caption" sx={{ color: '#757575' }}>
              Hoàn thành
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ScheduleCalendar;
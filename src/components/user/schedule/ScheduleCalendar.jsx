// src/components/user/schedule/ScheduleCalendar.jsx
import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Grid,
} from '@mui/material';
import { ChevronLeft, ChevronRight, Circle } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
const ScheduleCalendar = ({ schedules = [], onDateSelect, selectedSchedule }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const { t } = useTranslation();
  // Tạo 42 ô (6 hàng x 7 cột) để luôn hiển thị 6 hàng
  const getCalendarGrid = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay(); // 0 = CN
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days = [];

    // Ô trống trước ngày 1
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Các ngày trong tháng
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }

    // Điền đủ 42 ô (6x7)
    const remaining = 42 - days.length;
    for (let i = 0; i < remaining; i++) {
      days.push(null);
    }

    return days;
  };

  const hasSchedule = (date) => {
    if (!date) return null;
    return schedules.find(s => new Date(s.date).toDateString() === date.toDateString());
  };

  const changeMonth = (dir) => {
    setCurrentDate(prev => {
      const d = new Date(prev);
      d.setMonth(d.getMonth() + dir);
      return d;
    });
  };

  const monthNames = t("calendar.months", { returnObjects: true });
  const dayNames = t("calendar.days", { returnObjects: true });
  const days = getCalendarGrid(currentDate);
  const today = new Date();

  return (
    <Card sx={{ borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.05)', border: '1px solid #e0e0e0' }}>
      <CardContent sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b' }}>
            {monthNames[currentDate.getMonth()]}, {currentDate.getFullYear()}
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

        {/* Day Headers */}
        {/* *** THÊM columns={7} VÀO ĐÂY *** */}
        <Grid container spacing={0.5} sx={{ mb: 1 }} columns={7}>
          {dayNames.map(day => (
            // *** ĐỔI xs={12/7} THÀNH xs={1} ***
            <Grid item xs={1} key={day}>
              <Typography variant="caption" sx={{ fontWeight: 600, color: '#64748b', fontSize: '0.75rem', textAlign: 'center', display: 'block' }}>
                {day}
              </Typography>
            </Grid>
          ))}
        </Grid>

        {/* Calendar Grid - Luôn 6 hàng */}
        {/* *** THÊM columns={7} VÀO ĐÂY *** */}
        <Grid container spacing={0.5} columns={7}>
          {days.map((date, i) => {
            const schedule = hasSchedule(date);
            const isToday = date && date.toDateString() === today.toDateString();
            const isSelected = selectedSchedule && date && 
              new Date(selectedSchedule.date).toDateString() === date.toDateString();

            return (
              // *** ĐỔI xs={12/7} THÀNH xs={1} ***
              <Grid item xs={1} key={i}>
                <Box
                  onClick={() => date && onDateSelect(date, schedule)}
                  sx={{
                    minHeight: 48,
                    borderRadius: 2,
                    border: isSelected ? '2px solid #3b82f6' : '1px solid #e2e8f0',
                    bgcolor: isSelected ? '#dbeafe' : isToday ? '#eff6ff' : schedule ? '#f8fafc' : '#fff',
                    cursor: date ? 'pointer' : 'default',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s',
                    '&:hover': {
                      bgcolor: date && !isSelected ? '#f1f5f9' : undefined,
                      borderColor: date ? '#94a3b8' : '#e2e8f0' // Sửa: chỉ hiện border hover khi có date
                    },
                    p: 0.5
                  }}
                >
                  {date && (
                    <>
                      <Typography
                        sx={{
                          fontSize: '0.875rem',
                          fontWeight: isToday || isSelected ? 600 : 400,
                          color: isSelected ? '#1d4ed8' : isToday ? '#1d4ed8' : '#1e293b'
                        }}
                      >
                        {date.getDate()}
                      </Typography>
                      {schedule && (
                        <Circle sx={{
                          fontSize: 6,
                          color: schedule.status === 'completed' ? '#10b981' :
                                 schedule.status === 'in_progress' ? '#f59e0b' : '#3b82f6',
                          mt: 0.5
                        }} />
                      )}
                    </>
                  )}
                </Box>
              </Grid>
            );
          })}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default ScheduleCalendar;
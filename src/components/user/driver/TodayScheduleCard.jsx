// src/components/user/driver/TodayScheduleCard.jsx
import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Button,
  Divider,
  Grid,
} from '@mui/material';
import {
  AccessTime,
  DirectionsBus,
  Place,
  People,
  PlayArrow,
  MyLocation,
  Repeat,
} from '@mui/icons-material';

const TodayScheduleCard = ({ schedule, onStartTrip, liveLocation = null }) => {
  if (!schedule) {
    return (
      <Card sx={{ boxShadow: 1, borderRadius: 1, border: '1px solid #e0e0e0' }}>
        <CardContent sx={{ textAlign: 'center', py: 6 }}>
          <AccessTime sx={{ fontSize: 48, color: '#bdbdbd', mb: 2 }} />
          <Typography variant="body1" color="textSecondary">
            Không có lịch làm việc hôm nay
          </Typography>
        </CardContent>
      </Card>
    );
  }

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  };

  const getFrequencyLabel = (frequency) => {
    switch (frequency) {
      case 'daily': return 'Hàng ngày';
      case 'weekly': return 'Hàng tuần';
      case 'monthly': return 'Hàng tháng';
      default: return '';
    }
  };

  // THÊM: Định dạng ngày hôm nay
  const scheduleDate = new Date(schedule.date);
  const dayNames = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'];
  const formattedDate = `${dayNames[scheduleDate.getDay()]}, ${scheduleDate.getDate()}/${scheduleDate.getMonth() + 1}`;

  return (
    <Card sx={{ boxShadow: 1, borderRadius: 1, border: '1px solid #e0e0e0' }}>
      <CardContent sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#212121', mb: 0.5 }}>
              Lịch trình hôm nay
            </Typography>
            {/* THÊM: Hiển thị ngày ngay dưới */}
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
              {formattedDate}
            </Typography>
            {schedule.frequency && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                <Repeat sx={{ fontSize: 14, color: '#757575' }} />
                <Typography variant="caption" sx={{ color: '#757575' }}>
                  {getFrequencyLabel(schedule.frequency)}
                </Typography>
              </Box>
            )}
          </Box>
          <Chip
            label={
              schedule.status === 'scheduled' ? 'Chưa bắt đầu' : 
              schedule.status === 'in_progress' ? 'Đang thực hiện' :
              schedule.status === 'completed' ? 'Hoàn thành' : 
              schedule.status === 'delayed' ? 'Trễ' : 'Đã lên lịch'
            }
            size="small"
            sx={{
              bgcolor: schedule.status === 'scheduled' ? '#e3f2fd' :
                       schedule.status === 'in_progress' ? '#fff3e0' :
                       schedule.status === 'completed' ? '#e8f5e9' : 
                       schedule.status === 'delayed' ? '#ffebee' : '#f5f5f5',
              color: schedule.status === 'scheduled' ? '#1565c0' :
                     schedule.status === 'in_progress' ? '#e65100' :
                     schedule.status === 'completed' ? '#2e7d32' : 
                     schedule.status === 'delayed' ? '#c62828' : '#757575',
              fontWeight: 500,
              fontSize: '0.75rem',
            }}
          />
        </Box>

        <Divider sx={{ mb: 2 }} />

        {/* Schedule Details */}
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <AccessTime sx={{ fontSize: 20, color: '#757575' }} />
              <Box>
                <Typography variant="caption" color="textSecondary" sx={{ display: 'block' }}>
                  Thời gian
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 500, color: '#424242' }}>
                  {formatTime(schedule.starttime)} - {formatTime(schedule.endtime)}
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Place sx={{ fontSize: 20, color: '#757575' }} />
              <Box>
                <Typography variant="caption" color="textSecondary" sx={{ display: 'block' }}>
                  Tuyến đường
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 500, color: '#424242' }}>
                  {schedule.route?.name || 'Chưa có thông tin'}
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <DirectionsBus sx={{ fontSize: 20, color: '#757575' }} />
              <Box>
                <Typography variant="caption" color="textSecondary" sx={{ display: 'block' }}>
                  Xe buýt
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 500, color: '#424242' }}>
                  {schedule.bus?.licensePlate || 'N/A'}
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <People sx={{ fontSize: 20, color: '#757575' }} />
              <Box>
                <Typography variant="caption" color="textSecondary" sx={{ display: 'block' }}>
                  Học sinh
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 500, color: '#424242' }}>
                  {schedule.numstudent || schedule.students?.length || 0} người
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        {/* Live Location (when in progress) */}
        {schedule.status === 'in_progress' && liveLocation && (
          <Box sx={{ bgcolor: '#e3f2fd', p: 2, borderRadius: 1, mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
              <MyLocation sx={{ fontSize: 16, color: '#1565c0' }} />
              <Typography variant="caption" sx={{ color: '#1565c0', fontWeight: 600 }}>
                VỊ TRÍ HIỆN TẠI
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: '#424242', fontWeight: 500 }}>
              {liveLocation.address || 'Đang cập nhật...'}
            </Typography>
            <Typography variant="caption" sx={{ color: '#757575' }}>
              Cập nhật: {liveLocation.lastUpdate || 'Vừa xong'}
            </Typography>
          </Box>
        )}

        {/* Action Button */}
        {schedule.status === 'scheduled' && (
          <Button
            fullWidth
            variant="contained"
            startIcon={<PlayArrow />}
            onClick={onStartTrip}
            sx={{
              bgcolor: '#1976d2',
              color: '#fff',
              textTransform: 'none',
              fontWeight: 500,
              py: 1.2,
              '&:hover': {
                bgcolor: '#1565c0',
              },
            }}
          >
            Bắt đầu chuyến đi
          </Button>
        )}

        {schedule.status === 'in_progress' && (
          <Box sx={{ bgcolor: '#fff3e0', p: 2, borderRadius: 1, textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: '#e65100', fontWeight: 500 }}>
              Chuyến đi đang diễn ra
            </Typography>
          </Box>
        )}

        {schedule.status === 'completed' && (
          <Box sx={{ bgcolor: '#e8f5e9', p: 2, borderRadius: 1, textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: '#2e7d32', fontWeight: 500 }}>
              Chuyến đi đã hoàn thành
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default TodayScheduleCard;
import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Divider,
  Grid,
} from '@mui/material';
import {
  AccessTime,
  DirectionsBus,
  Place,
  People,
  Repeat,
  CalendarToday,
} from '@mui/icons-material';

const TodayScheduleCard = ({ schedule }) => {
  if (!schedule) {
    return (
      <Card sx={{ boxShadow: 1, borderRadius: 1, border: '1px solid #e0e0e0' }}>
        <CardContent sx={{ textAlign: 'center', py: 6 }}>
          <AccessTime sx={{ fontSize: 48, color: '#bdbdbd', mb: 2 }} />
          <Typography variant="body1" color="textSecondary">
            Chọn một ngày để xem chi tiết lịch trình
          </Typography>
        </CardContent>
      </Card>
    );
  }

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const dayNames = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'];
    return `${dayNames[date.getDay()]}, ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  const getFrequencyLabel = (frequency) => {
    switch (frequency) {
      case 'daily': return 'Hàng ngày';
      case 'weekly': return 'Hàng tuần';
      case 'monthly': return 'Hàng tháng';
      default: return '';
    }
  };

  // ✅ Giữ lại status nhưng chỉ hiển thị, không có action
  const getStatusConfig = (status) => {
    switch (status) {
      case 'scheduled':
        return { label: 'Đã lên lịch', color: '#e3f2fd', textColor: '#1565c0' };
      case 'in_progress':
        return { label: 'Đang thực hiện', color: '#fff3e0', textColor: '#e65100' };
      case 'completed':
        return { label: 'Hoàn thành', color: '#e8f5e9', textColor: '#2e7d32' };
      case 'delayed':
        return { label: 'Trễ', color: '#ffebee', textColor: '#c62828' };
      default:
        return { label: 'Đã lên lịch', color: '#f5f5f5', textColor: '#757575' };
    }
  };

  const statusConfig = getStatusConfig(schedule.status);

  return (
    <Card sx={{ boxShadow: 1, borderRadius: 1, border: '1px solid #e0e0e0' }}>
      <CardContent sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#212121', mb: 0.5 }}>
              Chi tiết lịch trình
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
              <CalendarToday sx={{ fontSize: 14, color: '#757575' }} />
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                {formatDate(schedule.date)}
              </Typography>
            </Box>
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
            label={statusConfig.label}
            size="small"
            sx={{
              bgcolor: statusConfig.color,
              color: statusConfig.textColor,
              fontWeight: 500,
              fontSize: '0.75rem',
            }}
          />
        </Box>

        <Divider sx={{ mb: 2 }} />

        {/* Schedule Details */}
        <Grid container spacing={2}>
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

      </CardContent>
    </Card>
  );
};

export default TodayScheduleCard;
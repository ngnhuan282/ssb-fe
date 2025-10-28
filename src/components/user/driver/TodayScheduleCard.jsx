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
} from '@mui/icons-material';

const TodayScheduleCard = ({ schedule, onStartTrip }) => {
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

  // Format time từ Date object
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Card sx={{ boxShadow: 1, borderRadius: 1, border: '1px solid #e0e0e0' }}>
      <CardContent sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#212121' }}>
            Lịch trình hôm nay
          </Typography>
          <Chip
            label={schedule.status === 'scheduled' ? 'Chưa bắt đầu' : 
                   schedule.status === 'in_progress' ? 'Đang thực hiện' :
                   schedule.status === 'completed' ? 'Hoàn thành' : 'Trễ'}
            size="small"
            sx={{
              bgcolor: schedule.status === 'scheduled' ? '#e3f2fd' :
                       schedule.status === 'in_progress' ? '#fff3e0' :
                       schedule.status === 'completed' ? '#e8f5e9' : '#ffebee',
              color: schedule.status === 'scheduled' ? '#1565c0' :
                     schedule.status === 'in_progress' ? '#e65100' :
                     schedule.status === 'completed' ? '#2e7d32' : '#c62828',
              fontWeight: 500,
              fontSize: '0.75rem',
            }}
          />
        </Box>

        <Divider sx={{ mb: 2 }} />

        {/* Schedule Details */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
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
      </CardContent>
    </Card>
  );
};

export default TodayScheduleCard;
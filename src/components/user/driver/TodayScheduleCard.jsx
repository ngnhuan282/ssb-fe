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
} from '@mui/material';
import {
  DirectionsBus,
  Schedule,
  Route,
  People,
  PlayArrow,
  Visibility,
} from '@mui/icons-material';

const TodayScheduleCard = ({ schedule, onStartTrip, onViewDetails }) => {
  if (!schedule) {
    return (
      <Card sx={{ boxShadow: 3, borderRadius: 3 }}>
        <CardContent sx={{ textAlign: 'center', py: 6 }}>
          <Schedule sx={{ fontSize: 60, color: '#bdc3c7', mb: 2 }} />
          <Typography variant="h6" color="textSecondary">
            Không có lịch làm việc hôm nay
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      sx={{
        boxShadow: 3,
        borderRadius: 3,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: '#fff',
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Lịch Hôm Nay
          </Typography>
          <Chip
            label={schedule.shift === 'morning' ? 'Ca sáng' : 'Ca chiều'}
            sx={{
              bgcolor: 'rgba(255,255,255,0.3)',
              color: '#fff',
              fontWeight: 600,
            }}
          />
        </Box>

        <Divider sx={{ bgcolor: 'rgba(255,255,255,0.3)', mb: 2 }} />

        {/* Time */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <Schedule />
          <Typography variant="body1">
            {schedule.startTime} - {schedule.endTime}
          </Typography>
        </Box>

        {/* Route */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <Route />
          <Typography variant="body1">
            {schedule.routeName}
          </Typography>
        </Box>

        {/* Bus */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <DirectionsBus />
          <Typography variant="body1">
            BKS: {schedule.busNumber}
          </Typography>
        </Box>

        {/* Students */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
          <People />
          <Typography variant="body1">
            {schedule.totalStudents} học sinh
          </Typography>
        </Box>

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            fullWidth
            variant="contained"
            startIcon={<PlayArrow />}
            onClick={onStartTrip}
            sx={{
              bgcolor: '#fff',
              color: '#667eea',
              fontWeight: 600,
              '&:hover': {
                bgcolor: '#f8f9fa',
              },
            }}
          >
            Bắt đầu chuyến đi
          </Button>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<Visibility />}
            onClick={onViewDetails}
            sx={{
              borderColor: '#fff',
              color: '#fff',
              '&:hover': {
                borderColor: '#fff',
                bgcolor: 'rgba(255,255,255,0.1)',
              },
            }}
          >
            Chi tiết
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default TodayScheduleCard;
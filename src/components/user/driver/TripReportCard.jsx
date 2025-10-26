// src/components/user/driver/TripReportCard.jsx
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Box,
  Typography,
  Chip,
  Divider,
  LinearProgress,
  Collapse,
  IconButton,
  Grid,
  Button,
} from '@mui/material';
import {
  Schedule,
  DirectionsBus,
  People,
  CheckCircle,
  Cancel,
  Route as RouteIcon,
  Speed,
  ExpandMore,
  ExpandLess,
  Warning,
  PersonOff,
  AccessTime,
  CalendarToday,
  LocationOn,
  Description,
} from '@mui/icons-material';

const TripReportCard = ({ trip }) => {
  const [expanded, setExpanded] = useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return { bg: '#d4edda', text: '#155724', icon: '#27ae60' };
      case 'in_progress': return { bg: '#fff3cd', text: '#856404', icon: '#f39c12' };
      case 'delayed': return { bg: '#f8d7da', text: '#721c24', icon: '#e74c3c' };
      default: return { bg: '#e7f3ff', text: '#004085', icon: '#3498db' };
    }
  };

  const statusColor = getStatusColor(trip.status);
  const progress = trip.totalStudents > 0 ? (trip.studentsPickedUp / trip.totalStudents) * 100 : 0;
  const stopsProgress = trip.totalStops > 0 ? (trip.stopsCompleted / trip.totalStops) * 100 : 0;

  const getStatusLabel = (status) => {
    switch (status) {
      case 'completed': return 'Hoàn thành';
      case 'in_progress': return 'Đang diễn ra';
      case 'delayed': return 'Trễ giờ';
      default: return 'Đã lên lịch';
    }
  };

  return (
    <Card
      sx={{
        boxShadow: 3,
        borderRadius: 2,
        mb: 2,
        border: trip.status === 'in_progress' ? '2px solid #f39c12' : '1px solid #ecf0f1',
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: 6,
          transform: 'translateY(-2px)',
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <DirectionsBus sx={{ color: '#667eea', fontSize: 24 }} />
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#2c3e50' }}>
                {trip.shift === 'morning' ? '🌅 Ca sáng' : '🌆 Ca chiều'} - {trip.date}
              </Typography>
            </Box>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
              {trip.routeName}
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Chip
                label={getStatusLabel(trip.status)}
                size="small"
                sx={{
                  bgcolor: statusColor.bg,
                  color: statusColor.text,
                  fontWeight: 600,
                }}
              />
              <Chip
                label={trip.busNumber}
                size="small"
                icon={<DirectionsBus sx={{ fontSize: 16 }} />}
                variant="outlined"
              />
            </Box>
          </Box>

          <IconButton
            onClick={() => setExpanded(!expanded)}
            sx={{
              bgcolor: '#f8f9fa',
              '&:hover': { bgcolor: '#e9ecef' },
            }}
          >
            {expanded ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        </Box>

        <Divider sx={{ mb: 2 }} />

        {/* Quick Stats Grid */}
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={6} sm={3}>
            <Box sx={{ textAlign: 'center', p: 1.5, bgcolor: '#f8f9fa', borderRadius: 1 }}>
              <AccessTime sx={{ color: '#667eea', fontSize: 20, mb: 0.5 }} />
              <Typography variant="body2" color="textSecondary" sx={{ fontSize: 11 }}>
                Thời gian
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 600, fontSize: 14 }}>
                {trip.startTime} - {trip.endTime}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={6} sm={3}>
            <Box sx={{ textAlign: 'center', p: 1.5, bgcolor: '#f8f9fa', borderRadius: 1 }}>
              <People sx={{ color: '#27ae60', fontSize: 20, mb: 0.5 }} />
              <Typography variant="body2" color="textSecondary" sx={{ fontSize: 11 }}>
                Học sinh
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 600, fontSize: 14 }}>
                {trip.studentsPickedUp}/{trip.totalStudents}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={6} sm={3}>
            <Box sx={{ textAlign: 'center', p: 1.5, bgcolor: '#f8f9fa', borderRadius: 1 }}>
              <LocationOn sx={{ color: '#667eea', fontSize: 20, mb: 0.5 }} />
              <Typography variant="body2" color="textSecondary" sx={{ fontSize: 11 }}>
                Điểm dừng
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 600, fontSize: 14 }}>
                {trip.stopsCompleted}/{trip.totalStops}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={6} sm={3}>
            <Box sx={{ textAlign: 'center', p: 1.5, bgcolor: '#f8f9fa', borderRadius: 1 }}>
              <Speed sx={{ color: '#3498db', fontSize: 20, mb: 0.5 }} />
              <Typography variant="body2" color="textSecondary" sx={{ fontSize: 11 }}>
                Quãng đường
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 600, fontSize: 14 }}>
                {trip.distance || 'N/A'}
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {/* Warning/Alert Section */}
        {(trip.delayed || trip.studentsAbsent > 0) && (
          <Box sx={{ mb: 2 }}>
            {trip.delayed && (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  p: 1.5,
                  bgcolor: '#fff3cd',
                  borderRadius: 1,
                  mb: 1,
                }}
              >
                <Warning sx={{ color: '#f39c12', fontSize: 20 }} />
                <Typography variant="body2" sx={{ color: '#856404', fontWeight: 500 }}>
                  Chuyến đi trễ {trip.delayMinutes} phút
                </Typography>
              </Box>
            )}
            
            {trip.studentsAbsent > 0 && (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  p: 1.5,
                  bgcolor: '#f8d7da',
                  borderRadius: 1,
                }}
              >
                <PersonOff sx={{ color: '#e74c3c', fontSize: 20 }} />
                <Typography variant="body2" sx={{ color: '#721c24', fontWeight: 500 }}>
                  {trip.studentsAbsent} học sinh vắng mặt
                </Typography>
              </Box>
            )}
          </Box>
        )}

        {/* Student Progress */}
        <Box sx={{ bgcolor: '#f8f9fa', p: 2, borderRadius: 1, mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <People sx={{ fontSize: 20, color: '#3498db' }} />
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                Tiến độ đón học sinh
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#27ae60' }}>
              {progress.toFixed(0)}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 8,
              borderRadius: 1,
              bgcolor: '#ecf0f1',
              '& .MuiLinearProgress-bar': {
                bgcolor: '#27ae60',
                borderRadius: 1,
              }
            }}
          />
          <Typography variant="caption" color="textSecondary" sx={{ mt: 0.5, display: 'block' }}>
            {trip.studentsPickedUp}/{trip.totalStudents} học sinh
          </Typography>
        </Box>

        {/* Stops Progress */}
        <Box sx={{ bgcolor: '#f8f9fa', p: 2, borderRadius: 1, mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <LocationOn sx={{ fontSize: 20, color: '#667eea' }} />
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                Tiến độ điểm dừng
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#667eea' }}>
              {stopsProgress.toFixed(0)}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={stopsProgress}
            sx={{
              height: 8,
              borderRadius: 1,
              bgcolor: '#ecf0f1',
              '& .MuiLinearProgress-bar': {
                bgcolor: '#667eea',
                borderRadius: 1,
              }
            }}
          />
          <Typography variant="caption" color="textSecondary" sx={{ mt: 0.5, display: 'block' }}>
            {trip.stopsCompleted}/{trip.totalStops} điểm dừng
          </Typography>
        </Box>

        {/* Stats Chips */}
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Chip
            icon={<CheckCircle sx={{ fontSize: 16 }} />}
            label={`${trip.stopsCompleted}/${trip.totalStops} điểm`}
            size="small"
            sx={{ bgcolor: '#d4edda', color: '#155724', fontWeight: 500 }}
          />
          {trip.studentsAbsent > 0 && (
            <Chip
              icon={<Cancel sx={{ fontSize: 16 }} />}
              label={`${trip.studentsAbsent} vắng`}
              size="small"
              sx={{ bgcolor: '#f8d7da', color: '#721c24', fontWeight: 500 }}
            />
          )}
          {trip.delayed && (
            <Chip
              icon={<Warning sx={{ fontSize: 16 }} />}
              label={`Trễ ${trip.delayMinutes} phút`}
              size="small"
              sx={{ bgcolor: '#fff3cd', color: '#856404', fontWeight: 500 }}
            />
          )}
        </Box>

        {/* Expandable Details */}
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <Divider sx={{ my: 2 }} />
          
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: '#2c3e50' }}>
            📋 Chi tiết chuyến đi
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Route Details */}
            <Box sx={{ display: 'flex', gap: 1 }}>
              <RouteIcon sx={{ fontSize: 20, color: '#95a5a6', mt: 0.2 }} />
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                  Thông tin tuyến đường
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {trip.routeName}
                </Typography>
              </Box>
            </Box>

            {/* Distance */}
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Speed sx={{ fontSize: 20, color: '#95a5a6', mt: 0.2 }} />
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                  Quãng đường
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {trip.distance || 'Chưa có dữ liệu'}
                </Typography>
              </Box>
            </Box>

            {/* Bus Number */}
            <Box sx={{ display: 'flex', gap: 1 }}>
              <DirectionsBus sx={{ fontSize: 20, color: '#95a5a6', mt: 0.2 }} />
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                  Số xe
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {trip.busNumber}
                </Typography>
              </Box>
            </Box>

            {/* Notes Section */}
            {trip.notes && (
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Description sx={{ fontSize: 20, color: '#95a5a6', mt: 0.2 }} />
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                    Ghi chú
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {trip.notes}
                  </Typography>
                </Box>
              </Box>
            )}

            {/* Summary Stats */}
            <Box 
              sx={{ 
                mt: 1,
                p: 2, 
                bgcolor: '#f8f9fa', 
                borderRadius: 1,
                border: '1px solid #e9ecef'
              }}
            >
              <Typography variant="caption" sx={{ fontWeight: 600, color: '#2c3e50', display: 'block', mb: 1 }}>
                Tổng kết
              </Typography>
              <Grid container spacing={1}>
                <Grid item xs={6}>
                  <Typography variant="caption" color="textSecondary">
                    Tổng học sinh: <strong>{trip.totalStudents}</strong>
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="textSecondary">
                    Đã đón: <strong style={{ color: '#27ae60' }}>{trip.studentsPickedUp}</strong>
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="textSecondary">
                    Vắng mặt: <strong style={{ color: '#e74c3c' }}>{trip.studentsAbsent}</strong>
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="textSecondary">
                    Điểm dừng: <strong>{trip.stopsCompleted}/{trip.totalStops}</strong>
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Collapse>
      </CardContent>
    </Card>
  );
};

export default TripReportCard;
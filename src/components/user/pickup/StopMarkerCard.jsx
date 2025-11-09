// src/components/user/driver/StopMarkerCard.jsx
import React from 'react';
import {
  Box, Card, CardContent, Typography, Chip, Button, Divider, Avatar
} from '@mui/material';
import {
  LocationOn, Schedule, Warning, DirectionsWalk, AccessTime, CheckCircle, SkipNext, Navigation, People, Visibility
} from '@mui/icons-material';

const StopMarkerCard = ({ stop, onNavigate, onComplete, onSkip, onViewStudents }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return { bg: '#d4edda', text: '#155724', icon: <CheckCircle /> };
      case 'current': return { bg: '#fff3cd', text: '#856404', icon: <Schedule /> };
      case 'skipped': return { bg: '#f8d7da', text: '#721c24', icon: <Warning /> };
      case 'pending': return { bg: '#e7f3ff', text: '#004085', icon: <LocationOn /> };
      default: return { bg: '#f8f9fa', text: '#6c757d', icon: <LocationOn /> };
    }
  };

  const statusColor = getStatusColor(stop.status);
  const boardedCount = stop.students?.filter(s => s.status === 'boarded').length || 0;

  return (
    <Card sx={{
      boxShadow: stop.status === 'current' ? 4 : 2,
      borderRadius: 2, mb: 2,
      border: stop.status === 'current' ? '2px solid #f39c12' : '1px solid #ecf0f1',
      transition: 'all 0.3s',
      '&:hover': { transform: 'translateY(-2px)', boxShadow: 6 },
    }}>
      <CardContent>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Avatar sx={{
              bgcolor: stop.status === 'completed' ? '#27ae60' :
                       stop.status === 'current' ? '#f39c12' :
                       stop.status === 'skipped' ? '#e74c3c' : '#3498db',
              width: 32, height: 32, fontSize: 16, fontWeight: 600
            }}>
              {stop.order}
            </Avatar>
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#2c3e50' }}>{stop.name}</Typography>
              <Typography variant="caption" color="textSecondary">{stop.address}</Typography>
            </Box>
          </Box>
          <Chip
            icon={statusColor.icon}
            label={stop.status === 'completed' ? 'Hoàn thành' :
                   stop.status === 'current' ? 'Hiện tại' :
                   stop.status === 'skipped' ? 'Bỏ qua' : 'Chờ'}
            sx={{
              height: 28,
              bgcolor: statusColor.bg,
              color: statusColor.text,
              '& .MuiChip-icon': { color: 'inherit', fontSize: 18 }
            }}
          />
        </Box>

        <Divider sx={{ mb: 2 }} />

        {/* Info */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <People sx={{ fontSize: 18, color: '#95a5a6' }} />
            <Typography variant="caption" sx={{ fontWeight: 600, color: '#7f8c8d' }}>{boardedCount}/{stop.students?.length || 0}</Typography>
            <Button size="small" startIcon={<Visibility />} onClick={() => onViewStudents(stop)} sx={{ minWidth: 'auto', p: 0.5, color: '#3498db' }} />
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <DirectionsWalk sx={{ fontSize: 18, color: '#95a5a6' }} />
            <Typography variant="caption" sx={{ fontWeight: 600, color: '#7f8c8d' }}>{stop.distance || 'N/A'}</Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <AccessTime sx={{ fontSize: 18, color: '#95a5a6' }} />
            <Typography variant="caption" sx={{ fontWeight: 600, color: '#7f8c8d' }}>~{stop.estimatedTime || 'N/A'}</Typography>
          </Box>
        </Box>

        {stop.status === 'completed' && stop.completedAt && (
          <Box sx={{ bgcolor: '#d4edda', p: 1, borderRadius: 1, mb: 2 }}>
            <Typography variant="caption" sx={{ color: '#155724' }}>Hoàn thành lúc: {stop.completedAt}</Typography>
          </Box>
        )}

        {/* Actions */}
        {stop.status === 'current' && (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button fullWidth variant="contained" startIcon={<Navigation />} onClick={() => onNavigate(stop)} sx={{ bgcolor: '#3498db', '&:hover': { bgcolor: '#2980b9' }, textTransform: 'none', fontWeight: 600 }}>Dẫn đường</Button>
            <Button fullWidth variant="contained" startIcon={<CheckCircle />} onClick={() => onComplete(stop)} sx={{ bgcolor: '#27ae60', '&:hover': { bgcolor: '#229954' }, textTransform: 'none', fontWeight: 600 }}>Hoàn thành</Button>
            <Button variant="outlined" onClick={() => onSkip(stop)} sx={{ minWidth: 'auto', px: 1, borderColor: '#e74c3c', color: '#e74c3c', '&:hover': { borderColor: '#c0392b', bgcolor: 'rgba(231,76,60,0.08)' } }}><SkipNext /></Button>
          </Box>
        )}

        {stop.status === 'pending' && (
          <Button fullWidth variant="outlined" startIcon={<Navigation />} onClick={() => onNavigate(stop)} sx={{ textTransform: 'none', borderColor: '#667eea', color: '#667eea', '&:hover': { borderColor: '#5568d3', bgcolor: 'rgba(102,126,234,0.08)' } }}>Xem đường đi</Button>
        )}
      </CardContent>
    </Card>
  );
};

export default StopMarkerCard;
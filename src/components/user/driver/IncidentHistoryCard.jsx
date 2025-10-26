// src/components/user/driver/IncidentHistoryCard.jsx
import React from 'react';
import {
  Card,
  CardContent,
  Box,
  Typography,
  Chip,
  Avatar,
  Divider,
} from '@mui/material';
import {
  Warning,
  LocalHospital,
  DirectionsCar,
  Traffic,
  LocalGasStation,
  Report,
  CheckCircle,
  HourglassEmpty,
  LocationOn,
  Schedule,
} from '@mui/icons-material';

const IncidentHistoryCard = ({ incident }) => {
  const getIncidentIcon = (type) => {
    const icons = {
      breakdown: <DirectionsCar />,
      traffic: <Traffic />,
      fuel: <LocalGasStation />,
      medical: <LocalHospital />,
      emergency: <Warning />,
      other: <Report />,
    };
    return icons[type] || <Report />;
  };

  const getIncidentColor = (type) => {
    const colors = {
      breakdown: '#e74c3c',
      traffic: '#f39c12',
      fuel: '#e67e22',
      medical: '#c0392b',
      emergency: '#8e44ad',
      other: '#95a5a6',
    };
    return colors[type] || '#95a5a6';
  };

  const getSeverityColor = (severity) => {
    const colors = {
      low: { bg: '#d4edda', text: '#155724' },
      medium: { bg: '#fff3cd', text: '#856404' },
      high: { bg: '#f8d7da', text: '#721c24' },
    };
    return colors[severity] || { bg: '#e7f3ff', text: '#004085' };
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: { bg: '#fff3cd', text: '#856404', icon: <HourglassEmpty /> },
      resolved: { bg: '#d4edda', text: '#155724', icon: <CheckCircle /> },
    };
    return colors[status] || { bg: '#e7f3ff', text: '#004085', icon: <Report /> };
  };

  const incidentColor = getIncidentColor(incident.type);
  const severityColor = getSeverityColor(incident.severity);
  const statusColor = getStatusColor(incident.status);

  return (
    <Card
      sx={{
        boxShadow: 2,
        borderRadius: 2,
        mb: 2,
        border: `1px solid ${incidentColor}20`,
        transition: 'all 0.3s',
        '&:hover': {
          boxShadow: 4,
        },
      }}
    >
      <CardContent>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
          <Avatar
            sx={{
              bgcolor: incidentColor,
              width: 48,
              height: 48,
            }}
          >
            {getIncidentIcon(incident.type)}
          </Avatar>

          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#2c3e50' }}>
                {incident.title}
              </Typography>
              <Chip
                icon={statusColor.icon}
                label={incident.status === 'resolved' ? 'Đã giải quyết' : 'Đang xử lý'}
                size="small"
                sx={{
                  bgcolor: statusColor.bg,
                  color: statusColor.text,
                  fontWeight: 600,
                }}
              />
            </Box>

            <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
              <Chip
                label={
                  incident.severity === 'high' ? 'Khẩn cấp' :
                  incident.severity === 'medium' ? 'Trung bình' : 'Nhẹ'
                }
                size="small"
                sx={{
                  bgcolor: severityColor.bg,
                  color: severityColor.text,
                  fontWeight: 600,
                  fontSize: 11,
                }}
              />
            </Box>
          </Box>
        </Box>

        <Divider sx={{ mb: 2 }} />

        {/* Description */}
        <Typography variant="body2" sx={{ color: '#34495e', mb: 2 }}>
          {incident.description}
        </Typography>

        {/* Location & Time */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LocationOn sx={{ fontSize: 18, color: '#95a5a6' }} />
            <Typography variant="body2" color="textSecondary">
              {incident.location}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Schedule sx={{ fontSize: 18, color: '#95a5a6' }} />
            <Typography variant="body2" color="textSecondary">
              {incident.reportedAt}
            </Typography>
          </Box>
        </Box>

        {/* Resolution (if resolved) */}
        {incident.status === 'resolved' && incident.resolvedAt && (
          <Box sx={{ bgcolor: '#d4edda', p: 1.5, borderRadius: 1 }}>
            <Typography variant="caption" sx={{ color: '#155724', fontWeight: 600, display: 'block', mb: 0.5 }}>
              ✓ Đã giải quyết lúc: {incident.resolvedAt}
            </Typography>
            {incident.resolution && (
              <Typography variant="caption" sx={{ color: '#155724' }}>
                {incident.resolution}
              </Typography>
            )}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default IncidentHistoryCard;
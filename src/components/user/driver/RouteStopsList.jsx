// src/components/user/driver/RouteStopsList.jsx
import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  Chip,
} from '@mui/material';
import {
  Circle,
  CheckCircle,
  RadioButtonUnchecked,
} from '@mui/icons-material';

const RouteStopsList = ({ route, currentStopIndex = 0 }) => {
  if (!route || !route.stops || route.stops.length === 0) {
    return (
      <Card sx={{ boxShadow: 1, borderRadius: 1, border: '1px solid #e0e0e0' }}>
        <CardContent sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="body2" color="textSecondary">
            Không có thông tin điểm dừng
          </Typography>
        </CardContent>
      </Card>
    );
  }

  const formatTime = (timeString) => {
    if (!timeString) return '';
    const date = new Date(timeString);
    return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Card sx={{ boxShadow: 1, borderRadius: 1, border: '1px solid #e0e0e0' }}>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#212121' }}>
          Danh sách điểm dừng
        </Typography>

        <List sx={{ p: 0 }}>
          {route.stops.map((stop, index) => {
            const isCompleted = index < currentStopIndex;
            const isCurrent = index === currentStopIndex;
            const isPending = index > currentStopIndex;

            return (
              <ListItem
                key={index}
                sx={{
                  px: 0,
                  py: 2,
                  borderBottom: index < route.stops.length - 1 ? '1px solid #f5f5f5' : 'none',
                  position: 'relative',
                  '&:before': index < route.stops.length - 1 ? {
                    content: '""',
                    position: 'absolute',
                    left: 11,
                    top: 40,
                    bottom: -16,
                    width: 2,
                    bgcolor: isCompleted || isCurrent ? '#1976d2' : '#e0e0e0',
                  } : {},
                }}
              >
                <Box sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>
                  {isCompleted ? (
                    <CheckCircle sx={{ fontSize: 24, color: '#4caf50' }} />
                  ) : isCurrent ? (
                    <RadioButtonUnchecked sx={{ fontSize: 24, color: '#ff9800' }} />
                  ) : (
                    <Circle sx={{ fontSize: 24, color: '#e0e0e0' }} />
                  )}
                </Box>

                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                      <Typography
                        variant="body1"
                        sx={{
                          fontWeight: isCurrent ? 600 : 500,
                          color: isCompleted ? '#757575' : isCurrent ? '#212121' : '#9e9e9e',
                        }}
                      >
                        {stop.location}
                      </Typography>
                      {isCurrent && (
                        <Chip
                          label="Hiện tại"
                          size="small"
                          sx={{
                            height: 20,
                            fontSize: '0.7rem',
                            bgcolor: '#fff3e0',
                            color: '#e65100',
                          }}
                        />
                      )}
                    </Box>
                  }
                  secondary={
                    <Typography variant="caption" sx={{ color: '#9e9e9e' }}>
                      {formatTime(stop.time) || 'Chưa có giờ'}
                    </Typography>
                  }
                />
              </ListItem>
            );
          })}
        </List>

        {/* Distance & Estimated Time */}
        {route.distance && (
          <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #f5f5f5' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="caption" color="textSecondary">
                Tổng quãng đường
              </Typography>
              <Typography variant="caption" sx={{ fontWeight: 500, color: '#424242' }}>
                {route.distance} km
              </Typography>
            </Box>
            {route.estimatedTime && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="caption" color="textSecondary">
                  Thời gian ước tính
                </Typography>
                <Typography variant="caption" sx={{ fontWeight: 500, color: '#424242' }}>
                  {route.estimatedTime} phút
                </Typography>
              </Box>
            )}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default RouteStopsList;
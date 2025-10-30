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
  Badge,
} from '@mui/material';
import {
  Circle,
  CheckCircle,
  RadioButtonUnchecked,
  People,
  ArrowUpward,
  ArrowDownward,
} from '@mui/icons-material';

const RouteStopsList = ({ route, currentStopIndex = 0, studentsPerStop = {} }) => {
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
            
            // ✅ FIX: Dùng stop.name thay vì stop.location
            const stopName = stop.name || stop.location || 'Điểm dừng không tên';
            const stopType = stop.type || 'unknown';
            
            // Lấy số học sinh tại điểm dừng này
            const studentCount = studentsPerStop[stopName] || 
                                 studentsPerStop[stop.location] ||
                                 studentsPerStop[index] || 
                                 (stop.studentCount || 0);

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
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5, flexWrap: 'wrap' }}>
                      <Typography
                        variant="body1"
                        sx={{
                          fontWeight: isCurrent ? 600 : 500,
                          color: isCompleted ? '#757575' : isCurrent ? '#212121' : '#9e9e9e',
                        }}
                      >
                        {stopName}
                      </Typography>
                      
                      {/* Chip loại điểm dừng */}
                      {stopType === 'pickup' && (
                        <Chip
                          icon={<ArrowUpward sx={{ fontSize: 12 }} />}
                          label="Đón"
                          size="small"
                          sx={{
                            height: 18,
                            fontSize: '0.65rem',
                            bgcolor: '#e8f5e9',
                            color: '#2e7d32',
                            fontWeight: 500,
                            '& .MuiChip-icon': { color: '#2e7d32' },
                          }}
                        />
                      )}
                      {stopType === 'dropoff' && (
                        <Chip
                          icon={<ArrowDownward sx={{ fontSize: 12 }} />}
                          label="Trả"
                          size="small"
                          sx={{
                            height: 18,
                            fontSize: '0.65rem',
                            bgcolor: '#fff3e0',
                            color: '#e65100',
                            fontWeight: 500,
                            '& .MuiChip-icon': { color: '#e65100' },
                          }}
                        />
                      )}
                      
                      {isCurrent && (
                        <Chip
                          label="Hiện tại"
                          size="small"
                          sx={{
                            height: 18,
                            fontSize: '0.65rem',
                            bgcolor: '#fff3e0',
                            color: '#e65100',
                            fontWeight: 500,
                          }}
                        />
                      )}
                      
                      {studentCount > 0 && (
                        <Chip
                          icon={<People sx={{ fontSize: 14 }} />}
                          label={`${studentCount} học sinh`}
                          size="small"
                          sx={{
                            height: 18,
                            fontSize: '0.65rem',
                            bgcolor: '#e3f2fd',
                            color: '#1565c0',
                            fontWeight: 500,
                            '& .MuiChip-icon': {
                              color: '#1565c0',
                            },
                          }}
                        />
                      )}
                    </Box>
                  }
                  secondary={
                    <Typography variant="caption" sx={{ color: '#9e9e9e' }}>
                      {formatTime(stop.time) || 'Chưa có giờ'}
                      {stop.lat && stop.lng && (
                        <span style={{ marginLeft: 8, color: '#bdbdbd' }}>
                          • {stop.lat.toFixed(4)}, {stop.lng.toFixed(4)}
                        </span>
                      )}
                    </Typography>
                  }
                />
              </ListItem>
            );
          })}
        </List>

        {/* Distance & Estimated Time */}
        {(route.distance || route.estimatedTime) && (
          <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #f5f5f5' }}>
            <Typography variant="caption" sx={{ color: '#757575', fontWeight: 600, display: 'block', mb: 1 }}>
              THÔNG TIN TUYẾN ĐƯỜNG
            </Typography>
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
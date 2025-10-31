// src/components/user/driver/RouteStopsList.jsx - READ-ONLY VERSION
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
  People,
  ArrowUpward,
  ArrowDownward,
} from '@mui/icons-material';

const RouteStopsList = ({ route }) => {
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

  // ✨ Hàm đếm số học sinh tại mỗi điểm dừng (optional - nếu có data)
  const getStudentCountAtStop = (stop) => {
    // Có thể lấy từ stop.studentCount hoặc tính từ students array
    return stop.studentCount || 0;
  };

  return (
    <Card sx={{ boxShadow: 1, borderRadius: 1, border: '1px solid #e0e0e0' }}>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#212121' }}>
          Danh sách điểm dừng
        </Typography>

        <List sx={{ p: 0 }}>
          {route.stops.map((stop, index) => {
            const stopName = stop.name || stop.location || 'Điểm dừng không tên';
            const stopType = stop.type || 'unknown';
            const studentCount = getStudentCountAtStop(stop);

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
                    bgcolor: '#e0e0e0', // ✅ Tất cả điểm đều màu xám (không phân biệt trạng thái)
                  } : {},
                }}
              >
                {/* Icon - Tất cả đều giống nhau */}
                <Box sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>
                  <Circle sx={{ fontSize: 24, color: '#1976d2' }} />
                </Box>

                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5, flexWrap: 'wrap' }}>
                      <Typography
                        variant="body1"
                        sx={{
                          fontWeight: 500,
                          color: '#424242',
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
                      
                      {/* ❌ XÓA: Không hiển thị "Hiện tại" */}
                      
                      {/* Số học sinh (nếu có) */}
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
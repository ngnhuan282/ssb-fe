// src/pages/admin/AdminTrackingPage.jsx
import React, { useState } from 'react';
import { Box, Typography, List, ListItem, ListItemText, ListItemAvatar, Avatar, Divider, IconButton, Paper } from '@mui/material';
import { DirectionsBus, MyLocation } from '@mui/icons-material';
import AdminMap from '../../components/admin/tracking/AdminMap';

const AdminTrackingPage = () => {
  const [activeBuses, setActiveBuses] = useState([]);
  const [selectedBusLocation, setSelectedBusLocation] = useState(null);
  const handleBusUpdate = (busesList) => {
    setActiveBuses(busesList);
  };
  const handleBusClick = (bus) => {
    // Lấy tọa độ (ưu tiên lấy từ location object, nếu không có thì lấy lat/lng thẳng)
    const location = bus.location || { lat: bus.lat, lng: bus.lng };
    
    if (location && location.lat && location.lng) {
      setSelectedBusLocation(location);
    }
  };

  return (
    // Sử dụng margin âm (mx: -3, my: -3) để bù lại padding của Layout cha (nếu có p={3})
    // height: 'calc(100vh - 70px)' để trừ đi chiều cao Header (thường là 64px hoặc 70px)
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'row', 
      height: 'calc(100vh - 70px)', 
      width: 'calc(100% + 48px)', // Bù lại chiều rộng do margin âm (24px * 2)
      mx: -3, 
      my: -3,
      overflow: 'hidden' 
    }}>
      
      {/* Sidebar: Danh sách xe (Fixed Width) */}
      <Paper 
        elevation={2} 
        sx={{ 
          width: 320, // Chiều rộng cố định cho sidebar
          flexShrink: 0,
          display: 'flex', 
          flexDirection: 'column',
          borderRadius: 0,
          zIndex: 2 // Đảm bảo sidebar nằm trên map nếu màn hình nhỏ
        }}
      >
        <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0', bgcolor: '#f8fafc' }}>
          <Typography variant="h6" fontWeight="bold" sx={{ color: '#1e293b' }}>
            Giám sát trực tuyến
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {activeBuses.length > 0 ? `${activeBuses.length} xe đang hoạt động` : 'Đang chờ tín hiệu...'}
          </Typography>
        </Box>

        <List sx={{ flex: 1, overflowY: 'auto', p: 0 }}>
          {activeBuses.length === 0 ? (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <Typography color="textSecondary" variant="body2">Chưa có xe nào hoạt động.</Typography>
            </Box>
          ) : (
            activeBuses.map((bus) => (
              <React.Fragment key={bus.busId}>
                <ListItem 
                  alignItems="flex-start"
                  secondaryAction={
                    <IconButton edge="end" aria-label="track" size="small">
                      <MyLocation color="primary" fontSize="small" />
                    </IconButton>
                  }
                  sx={{ 
                    '&:hover': { bgcolor: '#f1f5f9', cursor: 'pointer' },
                    transition: 'background-color 0.2s'
                  }}
                >
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: bus.status === 'delayed' ? '#ef4444' : '#10b981', width: 36, height: 36 }}>
                      <DirectionsBus sx={{ fontSize: 20 }} />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography variant="subtitle2" fontWeight="600" color="#334155">
                        {bus.licensePlate || 'Xe buýt'}
                      </Typography>
                    }
                    secondary={
                      <Box component="span" sx={{ display: 'block', mt: 0.5 }}>
                        <Typography component="span" variant="caption" display="block" color="text.primary" sx={{ lineHeight: 1.2 }}>
                          {bus.routeName || 'Chưa có tuyến'}
                        </Typography>
                        <Typography component="span" variant="caption" color="text.secondary">
                          {bus.speed ? `${bus.speed} km/h` : '0 km/h'} • {new Date(bus.lastUpdate).toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'})}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
                <Divider component="li" variant="inset" />
              </React.Fragment>
            ))
          )}
        </List>
      </Paper>

      {/* Main Content: Bản đồ (Flex Grow) */}
      <Box sx={{ flex: 1, position: 'relative', height: '100%' }}>
        <AdminMap onBusUpdate={handleBusUpdate} />
      </Box>
    </Box>
  );
};

export default AdminTrackingPage;
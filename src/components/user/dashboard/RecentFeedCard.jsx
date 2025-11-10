// src/components/user/dashboard/RecentFeedCard.jsx
import React from 'react';
import {
  Paper,
  Box,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
} from '@mui/material';
import { Notifications, Schedule, SystemUpdate } from '@mui/icons-material';

const feedItems = [
  {
    icon: <Notifications />,
    bgColor: '#dbeafe',
    color: '#3b82f6',
    title: 'Bảo trì hệ thống theo lịch trình',
    time: 'Hôm nay, 9:00 AM',
  },
  {
    icon: <Schedule />,
    bgColor: '#fef3c7',
    color: '#f59e0b',
    title: 'Tuyến 5 bị chậm 15 phút',
    time: 'Hôm qua, 4:30 PM',
  },
  {
    icon: <SystemUpdate />,
    bgColor: '#dcfce7',
    color: '#22c55e',
    title: 'Cập nhật ứng dụng mới đã có',
    time: '2 ngày trước',
  },
];

const RecentFeedCard = () => {
  return (
    <Paper
      sx={{
        p: 3,
        borderRadius: 3,
        border: '1px solid #e2e8f0',
        bgcolor: '#ffffff',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        height: '100%',
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b', mb: 2.5 }}>
        Thông báo gần đây
      </Typography>
      <List sx={{ p: 0 }}>
        {feedItems.map((item, index) => (
          <ListItem
            key={index}
            sx={{
              p: 0,
              mb: index === feedItems.length - 1 ? 0 : 2.5,
              alignItems: 'flex-start',
            }}
          >
            <ListItemAvatar sx={{ minWidth: 48, mt: 0.5 }}>
              <Avatar sx={{ bgcolor: item.bgColor, color: item.color, width: 40, height: 40 }}>
                {item.icon}
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={
                <Typography variant="body2" sx={{ fontWeight: 500, color: '#374151' }}>
                  {item.title}
                </Typography>
              }
              secondary={
                <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                  {item.time}
                </Typography>
              }
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default RecentFeedCard;
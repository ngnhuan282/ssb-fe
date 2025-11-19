// src/components/driver/pickup/StudentItem.jsx
import React from 'react';
import {
  Box,
  Typography,
  Avatar,
  Button,
} from '@mui/material';

// Hàm helper lấy chữ cái đầu
const getInitials = (name) => {
  if (!name) return '?';
  return name
    .trim()
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

const StudentItem = ({ student, onStatusChange }) => {
  const { name, status } = student;

  const handleStatusClick = (newStatus) => {
    onStatusChange(student.id, newStatus);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        mb: 2,
        pl: 2, // Thụt vào so với tiêu đề điểm đón
      }}
    >
      <Avatar
        sx={{
          width: 36,
          height: 36,
          bgcolor: '#e0e7ff',
          color: '#4f46e5',
          fontSize: '0.875rem',
        }}
      >
        {getInitials(name)}
      </Avatar>
      <Typography
        variant="body2"
        sx={{ fontWeight: 500, color: '#374151', flex: 1 }}
      >
        {name}
      </Typography>
      
      {/* Nút hành động */}
      <Button
        variant={status === 'picked_up' ? 'contained' : 'outlined'}
        onClick={() => handleStatusClick('picked_up')}
        size="small"
        sx={{
          textTransform: 'none',
          fontSize: '0.75rem',
          borderRadius: 1.5,
          fontWeight: 600,
        }}
      >
        Đã đón
      </Button>
      <Button
        variant={status === 'absent' ? 'contained' : 'outlined'}
        onClick={() => handleStatusClick('absent')}
        size="small"
        sx={{
          textTransform: 'none',
          fontSize: '0.75rem',
          borderRadius: 1.5,
          fontWeight: 600,
          color: status === 'absent' ? '#fff' : '#6b7280',
          borderColor: '#e5e7eb',
          bgcolor: status === 'absent' ? '#6b7280' : 'transparent',
          '&:hover': {
            borderColor: '#d1d5db',
            bgcolor: status === 'absent' ? '#4b5563' : '#f9fafb',
          },
        }}
      >
        Vắng mặt
      </Button>
    </Box>
  );
};

export default StudentItem;
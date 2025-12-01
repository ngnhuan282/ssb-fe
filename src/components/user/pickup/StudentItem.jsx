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

const StudentItem = ({ student, onStatusChange, onStudentClick}) => {
  const { name, status, type} = student;

  const handleStatusClick = (newStatus) => {
    onStatusChange(newStatus);
  };


  if (type === 'pickup') {
    const isBoarded = status === 'boarded';
    const isAbsent = status === 'absent';
    const isWaiting = status === 'waiting';
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        mb: 2,
        pl: 2, // Thụt vào so với tiêu đề điểm đón
      }}
    >
      <Avatar
        sx={{
          width: 36,
          height: 36,
          bgcolor: isBoarded ? '#dbeafe' : (isAbsent ? '#f3f4f6' : '#e0e7ff'),
          color: isBoarded ? '#2563eb' : (isAbsent ? '#9ca3af' : '#4f46e5'),
          fontSize: '0.875rem',
        }}
      >
        {getInitials(name)}
      </Avatar>
      <Box 
        sx={{ flex: 1, cursor: 'pointer' }} 
        onClick={() => onStudentClick(student)}
      >
        <Typography
          variant="body2"
          sx={{ fontWeight: 500, color: isWaiting ? '#374151' : '#9ca3af', flex: 1 }}
        > 
          {name}
        </Typography>
      </Box>
      {/* Nút hành động */}
      <Button
        variant={isBoarded ? 'contained' : 'outlined'}
        onClick={() => handleStatusClick('boarded')}
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
        variant={isAbsent ? 'contained' : 'outlined'}
        onClick={() => handleStatusClick('absent')}
        size="small"
        color="inherit"
        sx={{
          textTransform: 'none',
          fontSize: '0.75rem',
          borderRadius: 1.5,
          fontWeight: 600,
          color: isAbsent ? '#fff' : '#6b7280',
          borderColor: '#e5e7eb',
          bgcolor: isAbsent ? '#6b7280' : 'transparent',
          '&:hover': {
            borderColor: '#d1d5db',
            bgcolor: isAbsent ? '#4b5563' : '#f9fafb',
          },
        }}
      >
        Vắng mặt
      </Button>
    </Box>
    );
  };

  if (type === 'dropoff') {
    const isDroppedOff = status === 'dropped_off';
    const isWaiting = status === 'waiting'; // Trạng thái 'chờ trả'

    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          mb: 2,
          pl: 2,
        }}
      >
        <Avatar
          sx={{
            width: 36,
            height: 36,
            bgcolor: isDroppedOff ? '#d1fae5' : '#dcfce7', // Màu xanh lá nhạt
            color: isDroppedOff ? '#065f46' : '#16a34a',
            fontSize: '0.875rem',
          }}
        >
         {getInitials(name)}
        </Avatar>
        <Typography
          variant="body2"
          sx={{ 
            fontWeight: 500, 
            color: isWaiting ? '#374151' : '#9ca3af', // Mờ đi nếu đã xử lý
            flex: 1 
          }}
        >
          {name}
        </Typography>
        
        <Button
          variant={isDroppedOff ? 'contained' : 'outlined'}
          onClick={() => handleStatusClick('dropped_off')}
          disabled={!isWaiting} // Vô hiệu hóa nếu không phải 'waiting'
          size="small"
          color="success" // Dùng màu success của MUI
          sx={{
            textTransform: 'none',
            fontSize: '0.75rem',
            borderRadius: 1.5,
            fontWeight: 600,
          }}
        >
          Đã Trả
        </Button>
      </Box>
    );
  }

  return null;
};

export default StudentItem;
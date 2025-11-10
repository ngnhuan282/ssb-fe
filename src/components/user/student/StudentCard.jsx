// src/components/user/driver/StudentCard.jsx
import React from 'react';
import {
  Card,
  Box,
  Typography,
  Avatar,
  Chip,
  Button,
} from '@mui/material';

const StudentCard = ({ student, onCallParent }) => {
  const displayName = student.fullName || 'Chưa có tên';

  const getInitials = (name) => {
    if (!name || name === 'Chưa có tên') return '?';
    return name
      .trim()
      .split(' ')
      .filter(word => word.length > 0)
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Cập nhật màu sắc và viền cho giống thiết kế
  const getStatusProps = (status) => {
    switch (status) {
      case 'picked_up':
        return {
          label: 'Đã đón',
          sx: { bgcolor: '#dcfce7', color: '#16a34a', fontWeight: 600 },
          borderColor: '#22c55e', // Xanh lá
        };
      case 'dropped_off':
        return {
          label: 'Đã trả',
          sx: { bgcolor: '#f3f4f6', color: '#4b5563', fontWeight: 600 },
          borderColor: '#9ca3af', // Xám
        };
      default: // 'pending'
        return {
          label: 'Chưa đón',
          sx: { bgcolor: '#fef3c7', color: '#a16207', fontWeight: 600 }, // Vàng
          borderColor: '#f59e0b', // Vàng
        };
    }
  };

  const statusProps = getStatusProps(student.status);

  return (
    <Card
      sx={{
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        borderRadius: 2,
        border: '1px solid #e5e7eb',
        bgcolor: '#ffffff',
        // Thêm viền màu bên trái
        borderLeft: `5px solid ${statusProps.borderColor}`,
        mb: 1.5,
      }}
    >
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
        {/* 1. Avatar */}
        <Avatar
          sx={{
            width: 44,
            height: 44,
            bgcolor: '#dbeafe', // Màu xanh nhạt
            color: '#3b82f6', // Màu xanh đậm
            fontSize: '1rem',
            fontWeight: 600,
          }}
        >
          {getInitials(displayName)}
        </Avatar>

        {/* 2. Thông tin (Tên, Lớp, Địa chỉ) */}
        <Box sx={{ flex: 1 }}>
          <Typography variant="body1" sx={{ fontWeight: 600, color: '#111827' }}>
            {displayName}
          </Typography>
          <Typography variant="body2" sx={{ color: '#6b7280', fontSize: '0.875rem' }}>
            {student.class || 'Chưa có lớp'}
          </Typography>
          <Typography variant="body2" sx={{ color: '#6b7280', fontSize: '0.875rem' }}>
            {student.pickupPoint || 'Chưa có điểm đón'}
          </Typography>
        </Box>

        {/* 3. Hành động (Chip và Nút Gọi) */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, ml: 'auto' }}>
          {/* Chip trạng thái (chỉ xem) */}
          <Chip
            label={statusProps.label}
            size="small"
            sx={{
              ...statusProps.sx,
              borderRadius: '16px', // Bo tròn
              height: 24,
              fontSize: '0.75rem',
            }}
          />
          {/* Nút gọi (đổi thành text) */}
          <Button
            variant="text"
            size="small"
            onClick={() => onCallParent && onCallParent(student.parent?.user?.phone)}
            sx={{
              textTransform: 'none',
              fontSize: '0.875rem',
              color: '#3b82f6', // Màu xanh
              fontWeight: 600,
              p: '4px 8px',
              '&:hover': { bgcolor: '#eff6ff' },
            }}
          >
            Gọi
          </Button>
        </Box>
      </Box>
      {/* Không còn Collapse */}
    </Card>
  );
};

export default StudentCard;
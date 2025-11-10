// src/components/user/dashboard/StatCard.jsx
import React from 'react';
import { Paper, Box, Typography, Avatar } from '@mui/material';

const StatCard = ({ title, value, icon }) => {
  return (
    <Paper
      sx={{
        p: 3,
        display: 'flex',
        alignItems: 'center',
        gap: 2.5,
        borderRadius: 3,
        border: '1px solid #e2e8f0',
        bgcolor: '#ffffff',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        height: '100%', // Quan trọng: cùng chiều cao
        transition: 'all 0.2s',
        '&:hover': {
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          transform: 'translateY(-2px)',
        },
      }}
    >
      <Avatar
        sx={{
          bgcolor: '#dbeafe',
          color: '#3b82f6',
          width: 56,
          height: 56,
          fontSize: '1.5rem',
        }}
      >
        {icon}
      </Avatar>
      <Box>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            color: '#1e293b',
            lineHeight: 1,
          }}
        >
          {value}
        </Typography>
        <Typography variant="body2" sx={{ color: '#64748b', mt: 0.5 }}>
          {title}
        </Typography>
      </Box>
    </Paper>
  );
};

export default StatCard;
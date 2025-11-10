// src/components/dashboard/LiveMapCard.jsx
import React from 'react';
import { Paper, Box, Typography } from '@mui/material';

const LiveMapCard = () => {
  return (
    <Paper
      sx={{
        p: 2.5,
        borderRadius: 3,
        border: '1px solid #e5e7eb',
        bgcolor: '#ffffff',
        boxShadow: 'none',
        height: '100%', // Để lấp đầy chiều cao
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: 600, color: '#111827', mb: 2 }}>
        Bản đồ trực tiếp
      </Typography>
      <Box
        sx={{
          height: { xs: 300, md: 450 }, // Chiều cao bản đồ
          borderRadius: 2,
          bgcolor: '#f3f4f6',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#9ca3af',
        }}
      >
        {/* TODO: Tích hợp Google Maps hoặc Mapbox vào đây */}
        <Typography variant="body1">Map Placeholder</Typography>
      </Box>
    </Paper>
  );
};

export default LiveMapCard;
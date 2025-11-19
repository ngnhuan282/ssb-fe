// src/components/driver/pickup/PickupSidebar.jsx
import React from 'react';
import { Box, Typography, Paper, Divider } from '@mui/material';
import PickupPointItem from './PickupPointItem';

const PickupSidebar = ({ points, onStudentStatusChange, onPickupAll }) => {
  return (
    <Paper
      elevation={0}
      sx={{
        width: 400,
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        borderLeft: '1px solid #e5e7eb',
        bgcolor: '#f9fafb', // Nền xám nhạt
      }}
    >
      <Box sx={{ p: 2, pt: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, color: '#111827' }}>
          Danh sách điểm đón
        </Typography>
      </Box>
      <Divider />

      {/* Danh sách cuộn */}
      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          p: 2,
        }}
      >
        {points.map((point) => (
          <PickupPointItem
            key={point.id}
            point={point}
            onStudentStatusChange={onStudentStatusChange}
            onPickupAll={onPickupAll}
          />
        ))}
      </Box>
    </Paper>
  );
};

export default PickupSidebar;
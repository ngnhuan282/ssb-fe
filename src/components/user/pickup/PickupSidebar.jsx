// src/components/driver/pickup/PickupSidebar.jsx
import React from 'react';
import { Box, Typography, Paper, Divider } from '@mui/material';
import PickupPointItem from './PickupPointItem';

const PickupSidebar = ({ points, onStudentStatusChange, onPickupAll, onDropoffAll,isStillPickingUp, onNavigate, onStudentClick }) => {
  return (
    <Paper
      elevation={0}
      sx={{
        width: 400,
        ml: 1,
        height: 'calc(100vh - 100px)',
        display: 'flex',
        flexDirection: 'column',
        borderLeft: '1px solid #e5e7eb',
        bgcolor: '#f9fafb', // Nền xám nhạt
      }}
    >
      <Box sx={{ p: 2, pt: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, color: '#111827' }}>
          Danh Sách Điểm Dừng
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
            onDropoffAll={onDropoffAll}
            onPickupAll={onPickupAll}
            isStillPickingUp={isStillPickingUp}
            onNavigate={onNavigate}
            onStudentClick={onStudentClick}
          />
        ))}
      </Box>
    </Paper>
  );
};

export default PickupSidebar;
// src/components/user/dashboard/WeeklyActivityChart.jsx
import React from 'react';
import { Paper, Box, Typography } from '@mui/material';

const activityData = [
  { day: 'T2', value: 60 },
  { day: 'T3', value: 90 },
  { day: 'T4', value: 40 },
  { day: 'T5', value: 75 },
  { day: 'T6', value: 50 },
  { day: 'T7', value: 20 },
  { day: 'CN', value: 30 },
];

const WeeklyActivityChart = () => {
  return (
    <Paper
      sx={{
        p: 3,
        borderRadius: 3,
        border: '1px solid #e2e8f0',
        bgcolor: '#ffffff',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b', mb: 3 }}>
        Hoạt động trong tuần
      </Typography>
      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'flex-end',
          minHeight: 180,
        }}
      >
        {activityData.map((item) => (
          <Box key={item.day} sx={{ textAlign: 'center', width: 32 }}>
            <Box
              sx={{
                width: '100%',
                height: `${item.value}%`,
                bgcolor: '#3b82f6',
                borderRadius: '6px 6px 0 0',
                mb: 1,
                transition: 'all 0.3s ease',
                '&:hover': {
                  bgcolor: '#2563eb',
                  height: `${item.value + 8}%`,
                },
              }}
            />
            <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 500 }}>
              {item.day}
            </Typography>
          </Box>
        ))}
      </Box>
    </Paper>
  );
};

export default WeeklyActivityChart;
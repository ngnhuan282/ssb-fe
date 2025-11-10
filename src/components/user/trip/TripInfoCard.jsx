// src/components/trips/TripInfoCard.jsx
import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Divider,
} from '@mui/material';

// Component con cho 1 dòng
const InfoRow = ({ title, value, isLast }) => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'space-between',
      py: 2,
      borderBottom: isLast ? 'none' : '1px solid #f3f4f6',
    }}
  >
    <Typography variant="body2" sx={{ color: '#6b7280' }}>
      {title}
    </Typography>
    <Typography variant="body2" sx={{ fontWeight: 600, color: '#111827' }}>
      {value}
    </Typography>
  </Box>
);

const TripInfoCard = ({ info }) => {
  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2, md: 3 },
        borderRadius: 3,
        border: '1px solid #e5e7eb',
        bgcolor: '#ffffff',
        mb: 4,
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: 600, color: '#111827', mb: 1 }}>
        Thông tin chuyến đi
      </Typography>
      <Box>
        {info.map((item, index) => (
          <InfoRow
            key={index}
            title={item.title}
            value={item.value}
            isLast={index === info.length - 1}
          />
        ))}
      </Box>
    </Paper>
  );
};

export default TripInfoCard;